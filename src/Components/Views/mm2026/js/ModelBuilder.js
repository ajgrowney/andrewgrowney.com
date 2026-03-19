import React, { useEffect, useMemo, useRef, useState } from 'react';
import { forceCollide, forceSimulation, forceX, forceY } from 'd3-force';
import { navigate } from 'gatsby';
import MM2026Shell from './Shell';
import {
  normalizeDifference,
  normalizeFeatureDifference,
  useMM2026Data,
  useMM2026TrainingData
} from '../../../../Data/mm2026/dataClient';

const builderTabs = [
  { id: 'features', label: '1. Select Stats' },
  { id: 'dataset',  label: '2. Stats to Matchups' },
  { id: 'preview',  label: '3. Build & Train' }
];

const defaultWeights = {
  Seed: 0.95,
  WinPct: 0.8,
  SOS: 0.55,
  SOV: 0.45,
  NET_last: 0.72,
  selection_ordinal_last: 0.72,
  AdjOE_mean: 0.9,
  AdjDE_mean: 1.05,
  AdjNE_mean: 0.85,
  'FG%_mean': 0.25,
  'FG3%_mean': 0.18,
  'FT%_mean': 0.12
};

const statExplorerFriendly = {
  AdjOE_mean: 'Adjusted Offensive Efficiency',
  AdjDE_mean: 'Adjusted Defensive Efficiency',
  AdjNE_mean: 'Adjusted Net Efficiency',
  'FG%_mean': 'Field Goal %',
  'FG3%_mean': '3-Point %',
  'FT%_mean': 'Free Throw %',
  NET_last: 'NET Ranking',
  selection_ordinal_last: 'Selection Committee Rank',
  SOS: 'Strength of Schedule',
  SOV: 'Strength of Victory',
  WinPct: 'Win %',
  Seed: 'Tournament Seed'
};

const generatedModelNamePrefixes = [
  'answer key',
  'never wrong',
  'always right',
  'bracket whisperer',
  'upset detector'
];

const trainingManifestPath = 'data/web/training/manifest.json';
const featurePlotWidth = 760;
const featurePlotHeight = 440;
const featurePlotPadding = { top: 20, right: 28, bottom: 34, left: 18 };
const featurePlotInnerWidth = featurePlotWidth - featurePlotPadding.left - featurePlotPadding.right;
const featurePlotPointRadius = 5.5;
const featurePlotMissedTourneyRadiusScale = 0.5;
const featurePlotAnnotatedRadiusBoost = 1;
const featurePlotZoomInFactor = 0.8;
const featurePlotZoomOutFactor = 1.25;
const featurePlotMinZoomSpanRatio = 0.08;
const defaultFitParameters = {
  epochCount: 28,
  learningRate: 0.36,
  regularization: 0.0015
};

const normalizeEpochCount = (value) => Math.max(1, Math.round(Number(value) || defaultFitParameters.epochCount));
const normalizeLearningRate = (value) => Math.max(0.001, Number(value) || defaultFitParameters.learningRate);
const normalizeRegularization = (value) => Math.max(0, Number(value) || defaultFitParameters.regularization);

const formatPercent = (value) => `${(value * 100).toFixed(1)}%`;
const formatSignedNumber = (value, digits = 3) => `${Number(value) >= 0 ? '+' : ''}${Number(value).toFixed(digits)}`;
const logistic = (value) => 1 / (1 + Math.exp(-value));
const clampProbability = (value) => Math.min(Math.max(value, 1e-6), 1 - 1e-6);

const getStatExplorerLabel = (featureDefinition) => {
  if (!featureDefinition) {
    return 'Choose a feature to inspect';
  }

  return statExplorerFriendly[featureDefinition.key] || featureDefinition.label || featureDefinition.key;
};

const getInitialTrainingYears = (seasons = []) => seasons;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const buildGeneratedModelName = () => {
  const prefix = generatedModelNamePrefixes[Math.floor(Math.random() * generatedModelNamePrefixes.length)] || 'answer key';
  const suffix = 100 + Math.floor(Math.random() * 900);
  return `${prefix} ${suffix}`;
};

const buildFeaturePlotDomain = (min, max) => ({
  min,
  max,
  span: Math.max(max - min, 1e-9)
});

const normalizeFeaturePlotDomain = (domain, extent) => {
  if (!extent || !Number.isFinite(extent.min) || !Number.isFinite(extent.max)) {
    return buildFeaturePlotDomain(0, 1);
  }

  const fullDomain = buildFeaturePlotDomain(extent.min, extent.max);
  if (!domain || !Number.isFinite(domain.min) || !Number.isFinite(domain.max) || fullDomain.span <= 1e-9) {
    return fullDomain;
  }

  const minSpan = Math.max(fullDomain.span * featurePlotMinZoomSpanRatio, 1e-9);
  const requestedSpan = Math.max(domain.max - domain.min, 1e-9);
  const nextSpan = clamp(requestedSpan, minSpan, fullDomain.span);
  const requestedCenter = (domain.min + domain.max) / 2;
  const boundedCenter = clamp(requestedCenter, fullDomain.min + (nextSpan / 2), fullDomain.max - (nextSpan / 2));

  return buildFeaturePlotDomain(boundedCenter - (nextSpan / 2), boundedCenter + (nextSpan / 2));
};

const getFeaturePlotX = (value, domain) => {
  const valueRatio = domain.span ? ((value - domain.min) / domain.span) : 0.5;
  return featurePlotPadding.left + (clamp(valueRatio, 0, 1) * featurePlotInnerWidth);
};

const zoomFeaturePlotDomain = (domain, extent, factor, focusRatio = 0.5) => {
  const fullDomain = normalizeFeaturePlotDomain(extent, extent);
  const currentDomain = normalizeFeaturePlotDomain(domain, extent);
  if (fullDomain.span <= 1e-9) {
    return fullDomain;
  }

  const clampedFocusRatio = clamp(focusRatio, 0, 1);
  const focusValue = currentDomain.min + (clampedFocusRatio * currentDomain.span);
  const nextSpan = currentDomain.span * factor;
  const nextMin = focusValue - (clampedFocusRatio * nextSpan);
  return normalizeFeaturePlotDomain({ min: nextMin, max: nextMin + nextSpan }, extent);
};

const buildGameSplitKey = (example) => {
  const leftTeamId = Number(example.team_1_id);
  const rightTeamId = Number(example.team_2_id);
  const lowTeamId = Math.min(leftTeamId, rightTeamId);
  const highTeamId = Math.max(leftTeamId, rightTeamId);
  return [example.season, example.source, example.day_num, lowTeamId, highTeamId].join(':');
};

const hashString = (value) => {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = ((hash << 5) - hash) + value.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
};

const createSeededRandom = (seed) => {
  let state = (seed >>> 0) || 1;
  return () => {
    state = ((1664525 * state) + 1013904223) >>> 0;
    return state / 4294967296;
  };
};

const buildMetricPath = (values, width = 260, height = 96, invert = false) => {
  if (!values.length) {
    return '';
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = Math.max(max - min, 1e-9);

  return values.map((value, index) => {
    const x = values.length === 1 ? width / 2 : (index / (values.length - 1)) * width;
    const normalized = (value - min) / span;
    const y = invert ? (normalized * height) : ((1 - normalized) * height);
    return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(' ');
};

const buildLinearTicks = (min, max, tickCount = 5) => {
  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    return [];
  }

  if (Math.abs(max - min) < 1e-9) {
    return [min];
  }

  return Array.from({ length: tickCount }, (_, index) => min + (((max - min) * index) / (tickCount - 1)));
};

const buildBeeswarmNodes = ({ entries, min, max }) => {
  if (!entries.length) {
    return [];
  }

  const centerY = (featurePlotHeight - featurePlotPadding.bottom + featurePlotPadding.top) / 2;
  const span = Math.max(max - min, 1e-9);

  const nodes = entries.map((entry) => {
    const valueRatio = (entry.value - min) / span;
    const radius = Number.isFinite(entry.radius) ? entry.radius : featurePlotPointRadius;
    return {
      ...entry,
      radius,
      targetX: featurePlotPadding.left + (valueRatio * featurePlotInnerWidth),
      x: featurePlotPadding.left + (valueRatio * featurePlotInnerWidth),
      y: centerY
    };
  });

  const simulation = forceSimulation(nodes)
    .force('x', forceX((node) => node.targetX).strength(1))
    .force('y', forceY(centerY).strength(0.08))
    .force('collide', forceCollide((node) => node.radius + 1.5).iterations(2))
    .stop();

  for (let tick = 0; tick < 160; tick += 1) {
    simulation.tick();
  }

  return nodes.map((node) => ({
    ...node,
    x: Math.min(Math.max(node.x, featurePlotPadding.left + node.radius), featurePlotWidth - featurePlotPadding.right - node.radius),
    y: Math.min(Math.max(node.y, featurePlotPadding.top + node.radius), featurePlotHeight - featurePlotPadding.bottom - node.radius)
  }));
};

const renderFeatureAnnotation = (payload) => {
  if (!payload) {
    return null;
  }

  const { x, y } = payload;

  const placeAbove = payload.annotationLane === 'above';
  const textAnchor = payload.alignRight ? 'end' : 'start';
  const labelX = payload.alignRight ? x - 10 : x + 10;
  const labelY = placeAbove ? y - 12 : y + 18;
  const lineY = placeAbove ? y - 4 : y + 4;

  return (
    <g>
      <line x1={x} y1={y} x2={x} y2={lineY} className="mm26-feature-annotation-line" />
      <text x={labelX} y={labelY} textAnchor={textAnchor} className="mm26-feature-annotation-label">
        {payload.annotationLabel}
      </text>
    </g>
  );
};

const FeaturePlotTooltip = ({ point, featureKey, formatFeatureValue }) => {
  if (!point) {
    return null;
  }

  const tooltipWidth = 158;
  const tooltipHeight = 62;
  const x = Math.min(Math.max(point.x + 12, 8), featurePlotWidth - tooltipWidth - 8);
  const y = Math.max(point.y - tooltipHeight - 10, 8);

  return (
    <g transform={`translate(${x}, ${y})`} className="mm26-chart-tooltip-svg">
      <rect width={tooltipWidth} height={tooltipHeight} rx="12" className="mm26-chart-tooltip-box" />
      <text x="12" y="22" className="mm26-chart-tooltip-title">{point.shortName}</text>
      <text x="12" y="40" className="mm26-chart-tooltip-copy">{formatFeatureValue(featureKey, point.value)}</text>
      <text x="12" y="56" className="mm26-chart-tooltip-copy">{point.seed ? `${point.seed} seed` : 'Missed Tourney'}</text>
    </g>
  );
};

const evaluateLogisticRows = (rows, weights, bias) => {
  if (!rows.length) {
    return { loss: null, accuracy: null, predictions: 0 };
  }

  let correct = 0;
  let loss = 0;

  rows.forEach((row) => {
    const score = row.values.reduce((sum, value, index) => sum + (value * weights[index]), bias);
    const probability = clampProbability(logistic(score));
    const prediction = probability >= 0.5 ? 1 : 0;
    if (prediction === row.target) {
      correct += 1;
    }
    loss += -((row.target * Math.log(probability)) + ((1 - row.target) * Math.log(1 - probability)));
  });

  return {
    loss: loss / rows.length,
    accuracy: correct / rows.length,
    predictions: rows.length
  };
};

const fitBrowserLogisticModel = ({
  examples,
  featureOrder,
  selectedFeatures,
  labelDefinition,
  runId = 1,
  trainSplit = 0.8,
  epochCount = defaultFitParameters.epochCount,
  learningRate = defaultFitParameters.learningRate,
  regularization = defaultFitParameters.regularization
}) => {
  if (!selectedFeatures.length || !examples.length || !featureOrder.length) {
    return null;
  }

  const featureIndexes = selectedFeatures.map((featureKey) => featureOrder.indexOf(featureKey));
  if (featureIndexes.some((index) => index < 0)) {
    return null;
  }

  const team1WinLabel = Number(Object.entries(labelDefinition || {}).find(([, label]) => label === 'team_1_win')?.[0] ?? 0);
  const preparedRows = examples.map((example) => ({
    key: buildGameSplitKey(example),
    target: Number(example.y) === team1WinLabel ? 1 : 0,
    values: featureIndexes.map((featureIndex, selectedIndex) => {
      const featureKey = selectedFeatures[selectedIndex];
      return normalizeFeatureDifference(featureKey, Number(example.x[featureIndex] ?? 0));
    })
  }));

  const trainRows = [];
  const validationRows = [];
  const threshold = Math.max(1, Math.min(99, Math.round(trainSplit * 100)));
  preparedRows.forEach((row) => {
    if ((hashString(row.key) % 100) < threshold) {
      trainRows.push(row);
      return;
    }
    validationRows.push(row);
  });

  const fittingRows = trainRows.length ? trainRows : preparedRows;
  const holdoutRows = validationRows.length ? validationRows : fittingRows;
  const random = createSeededRandom(runId + fittingRows.length + selectedFeatures.length);
  const weights = new Array(selectedFeatures.length).fill(0).map(() => ((random() - 0.5) * 0.04));
  let bias = (random() - 0.5) * 0.02;
  const history = [];

  for (let epoch = 0; epoch < epochCount; epoch += 1) {
    const gradients = new Array(selectedFeatures.length).fill(0);
    let biasGradient = 0;

    fittingRows.forEach((row) => {
      const score = row.values.reduce((sum, value, index) => sum + (value * weights[index]), bias);
      const probability = logistic(score);
      const error = probability - row.target;

      row.values.forEach((value, index) => {
        gradients[index] += error * value;
      });
      biasGradient += error;
    });

    const step = learningRate / fittingRows.length;
    weights.forEach((weight, index) => {
      weights[index] = weight - (step * ((gradients[index] + (regularization * weight))));
    });
    bias -= step * biasGradient;

    const trainSnapshot = evaluateLogisticRows(fittingRows, weights, bias);
    const validationSnapshot = evaluateLogisticRows(holdoutRows, weights, bias);
    history.push({
      epoch: epoch + 1,
      train_loss: trainSnapshot.loss,
      train_accuracy: trainSnapshot.accuracy,
      validation_loss: validationSnapshot.loss,
      validation_accuracy: validationSnapshot.accuracy
    });
  }

  const trainMetrics = evaluateLogisticRows(fittingRows, weights, bias);
  const validationMetrics = evaluateLogisticRows(holdoutRows, weights, bias);
  const weightsByFeature = selectedFeatures.reduce((acc, featureKey, index) => {
    acc[featureKey] = Number(weights[index].toFixed(6));
    return acc;
  }, {});

  return {
    weights: weightsByFeature,
    bias: Number(bias.toFixed(6)),
    sharpness: 1,
    hyperparameters: {
      epochCount,
      learningRate,
      regularization
    },
    trainMetrics,
    validationMetrics,
    history,
    rowsUsed: fittingRows.length,
    holdoutRows: holdoutRows.length,
    topFeatures: selectedFeatures
      .map((featureKey) => ({ featureKey, weight: weightsByFeature[featureKey] }))
      .sort((left, right) => Math.abs(right.weight) - Math.abs(left.weight))
  };
};

const downloadModelConfig = (runtimeModel) => {
  const blob = new Blob([JSON.stringify(runtimeModel, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${runtimeModel.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
};

const BuilderStageCard = ({ kicker, title, description, showDescription = true, children, className = '' }) => (
  <section className={`mm26-model-card mm26-stage-card ${className}`.trim()}>
    {kicker ? <div className="mm26-kicker">{kicker}</div> : null}
    {title ? <h3>{title}</h3> : null}
    {description && showDescription ? <p>{description}</p> : null}
    {children}
  </section>
);

const InputSelectionPanel = ({
  title,
  kicker,
  description,
  features,
  activeFeatureKey,
  onInspectFeature,
  onCommitFeature,
  actionLabel,
  emptyMessage,
  showDescriptions,
  readOnly = false
}) => (
  <BuilderStageCard kicker={kicker} title={title} description={description} showDescription={showDescriptions}>
    <div className="mm26-model-inputs-card" style={{ marginTop: '1rem' }}>
      <div className="mm26-model-inputs-list">
        {features.length ? features.map((feature) => (
          <div
            key={feature.key}
            className={`mm26-model-input-row ${feature.key === activeFeatureKey ? 'is-active' : ''}`}
            role="button"
            tabIndex={0}
            onClick={() => onInspectFeature(feature.key)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onInspectFeature(feature.key);
              }
            }}
          >
            <div>
              <strong>{feature.label}</strong>
              <span>{feature.category}</span>
            </div>
            {!readOnly ? (
              <button
                type="button"
                className="mm26-inline-action"
                onClick={(event) => {
                  event.stopPropagation();
                  onCommitFeature(feature.key);
                }}
              >
                {actionLabel}
              </button>
            ) : null}
          </div>
        )) : <p className="mm26-empty">{emptyMessage}</p>}
      </div>
    </div>
  </BuilderStageCard>
);

const SelectedInputsSummary = ({ selectedFeatureDefinitions, title, kicker, description, showDescriptions }) => (
  <BuilderStageCard kicker={kicker} title={title} description={description} showDescription={showDescriptions} className="mm26-stage-card--readonly">
    <div className="mm26-input-summary-list" style={{ marginTop: '1rem' }}>
      {selectedFeatureDefinitions.length ? selectedFeatureDefinitions.map((feature) => (
        <div key={feature.key} className="mm26-input-summary-row">
          <strong>{feature.label}</strong>
          <span>{feature.category}</span>
        </div>
      )) : <p className="mm26-empty">No inputs selected yet.</p>}
    </div>
  </BuilderStageCard>
);

const StatExplorerPanel = ({
  activeFeatureDefinition,
  selectedFeatureCount,
  featurePlotWidthValue,
  featurePlotHeightValue,
  featurePlotPaddingValue,
  featurePlotTicks,
  featurePlotDomain,
  featurePlotData,
  annotatedFeaturePlotData,
  hoveredFeaturePoint,
  setHoveredFeatureTeamId,
  handleFeaturePlotWheel,
  handleFeaturePlotPointerDown,
  handleFeaturePlotPointerMove,
  handleFeaturePlotPointerUp,
  handleFeaturePlotReset,
  handleFeaturePlotZoomIn,
  handleFeaturePlotZoomOut,
  isFeaturePlotZoomed,
  isPanningFeaturePlot,
  formatFeatureValue,
  showDescriptions
}) => (
  <BuilderStageCard
    kicker="Stat explorer"
    title={getStatExplorerLabel(activeFeatureDefinition)}
    description={activeFeatureDefinition
      ? 'Inspect the field-wide distribution for the active stat before it enters matchup vector construction.'
      : 'Click any selected or unselected feature to inspect its 2026 field distribution.'}
    showDescription={showDescriptions}
    className="mm26-stage-card--main"
  >
    {activeFeatureDefinition ? (
      <>
        <div className="mm26-feature-plot">
          <div className="mm26-feature-plot-toolbar">
            <span className="mm26-feature-plot-note">Scroll to zoom, drag to pan horizontally.</span>
            <div className="mm26-feature-plot-controls">
              <button type="button" className="mm26-feature-plot-button" onClick={handleFeaturePlotZoomIn}>Zoom in</button>
              <button type="button" className="mm26-feature-plot-button" onClick={handleFeaturePlotZoomOut}>Zoom out</button>
              <button type="button" className="mm26-feature-plot-button" onClick={handleFeaturePlotReset} disabled={!isFeaturePlotZoomed}>Reset</button>
            </div>
          </div>
          <svg
            viewBox={`0 0 ${featurePlotWidthValue} ${featurePlotHeightValue}`}
            className={`mm26-feature-plot-svg ${isFeaturePlotZoomed ? 'is-zoomed' : ''} ${isPanningFeaturePlot ? 'is-panning' : ''}`.trim()}
            role="img"
            aria-label={`${getStatExplorerLabel(activeFeatureDefinition)} beeswarm distribution`}
            onWheel={handleFeaturePlotWheel}
            onPointerDown={handleFeaturePlotPointerDown}
            onPointerMove={handleFeaturePlotPointerMove}
            onPointerUp={handleFeaturePlotPointerUp}
            onPointerCancel={handleFeaturePlotPointerUp}
            onPointerLeave={handleFeaturePlotPointerUp}
          >
            <line
              x1={featurePlotPaddingValue.left}
              y1={featurePlotHeightValue - featurePlotPaddingValue.bottom}
              x2={featurePlotWidthValue - featurePlotPaddingValue.right}
              y2={featurePlotHeightValue - featurePlotPaddingValue.bottom}
              className="mm26-feature-axis"
            />
            <line
              x1={featurePlotPaddingValue.left}
              y1={(featurePlotHeightValue - featurePlotPaddingValue.bottom + featurePlotPaddingValue.top) / 2}
              x2={featurePlotWidthValue - featurePlotPaddingValue.right}
              y2={(featurePlotHeightValue - featurePlotPaddingValue.bottom + featurePlotPaddingValue.top) / 2}
              className="mm26-feature-axis mm26-feature-axis--midline"
            />
            {featurePlotTicks.map((tickValue) => {
              const xRatio = featurePlotDomain.span ? ((tickValue - featurePlotDomain.min) / featurePlotDomain.span) : 0.5;
              const x = featurePlotPaddingValue.left + (xRatio * (featurePlotWidthValue - featurePlotPaddingValue.left - featurePlotPaddingValue.right));
              return (
                <g key={tickValue} transform={`translate(${x}, 0)`}>
                  <line
                    y1={featurePlotHeightValue - featurePlotPaddingValue.bottom}
                    y2={featurePlotHeightValue - featurePlotPaddingValue.bottom + 7}
                    className="mm26-feature-axis-tick"
                  />
                  <text y={featurePlotHeightValue - 10} textAnchor="middle" className="mm26-feature-axis-label">
                    {formatFeatureValue(activeFeatureDefinition.key, tickValue)}
                  </text>
                </g>
              );
            })}
            {featurePlotData.map((entry) => (
              <circle
                key={entry.teamId}
                cx={entry.x}
                cy={entry.y}
                r={entry.radius}
                className={`mm26-feature-point ${entry.isAnnotated ? 'is-selected' : ''}`}
                onMouseEnter={() => setHoveredFeatureTeamId(entry.teamId)}
                onMouseLeave={() => setHoveredFeatureTeamId(null)}
              />
            ))}
            {annotatedFeaturePlotData.map((entry) => (
              <g key={`annotation-${entry.teamId}`}>
                {renderFeatureAnnotation(entry)}
              </g>
            ))}
            <FeaturePlotTooltip point={hoveredFeaturePoint} featureKey={activeFeatureDefinition.key} formatFeatureValue={formatFeatureValue} />
          </svg>
        </div>
      </>
    ) : (
      <div className="mm26-stage-empty">
        <p className="mm26-empty">The explorer stays empty until you click a feature.</p>
      </div>
    )}
  </BuilderStageCard>
);

const ReadOnlyWorkflowSummary = ({
  title,
  kicker,
  description,
  selectedFeatureDefinitions,
  selectedTrainingYears,
  trainingScopeLabel,
  selectedTrainingRowCount,
  representationLabel,
  scalingLabel,
  showDescriptions
}) => (
  <BuilderStageCard kicker={kicker} title={title} description={description} showDescription={showDescriptions} className="mm26-stage-card--readonly">
    <div className="mm26-input-summary-list" style={{ marginTop: '1rem' }}>
      <div className="mm26-input-summary-row">
        <strong>Inputs</strong>
        <span>{selectedFeatureDefinitions.length ? selectedFeatureDefinitions.map((feature) => feature.label).join(', ') : 'No inputs selected'}</span>
      </div>
      <div className="mm26-input-summary-row">
        <strong>Training years</strong>
        <span>{selectedTrainingYears.length ? selectedTrainingYears.join(', ') : 'None selected'}</span>
      </div>
      <div className="mm26-input-summary-row">
        <strong>Matchup sources</strong>
        <span>{trainingScopeLabel}</span>
      </div>
      <div className="mm26-input-summary-row">
        <strong>Loaded rows</strong>
        <span>{selectedTrainingRowCount.toLocaleString()}</span>
      </div>
      <div className="mm26-input-summary-row">
        <strong>Vector representation</strong>
        <span>{representationLabel}</span>
      </div>
      <div className="mm26-input-summary-row">
        <strong>Scaling path</strong>
        <span>{scalingLabel}</span>
      </div>
    </div>
  </BuilderStageCard>
);

const ModelBuilder = () => {
  const {
    bracketDefinition = null,
    buildRuntimeModel,
    error,
    featureDefinitions = [],
    featureStore = null,
    fillSlotThroughCustom = () => ({}),
    getSlot = () => null,
    getSlotParticipants = () => ({}),
    getTeamEntry = () => null,
    loading,
    predictCustomMatchup = () => null,
    saveRuntimeModelToLibrary = () => null,
    teamIndex = null
  } = useMM2026Data();
  const {
    loading: trainingLoading,
    error: trainingError,
    trainingManifest = null,
    trainingSeasonsByYear = {},
    ensureTrainingSeason = async () => null
  } = useMM2026TrainingData();

  const [activeTab, setActiveTab] = useState(builderTabs[0].id);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [activeFeatureKey, setActiveFeatureKey] = useState(null);
  const [draftTrainingYearRange, setDraftTrainingYearRange] = useState({ minIndex: 0, maxIndex: 0 });
  const [appliedTrainingYearRange, setAppliedTrainingYearRange] = useState({ minIndex: 0, maxIndex: 0 });
  const [hasInitializedTrainingYears, setHasInitializedTrainingYears] = useState(false);
  const [hasInitializedFeatures, setHasInitializedFeatures] = useState(false);
  const [includeRegularSeason, setIncludeRegularSeason] = useState(true);
  const [includeTournament, setIncludeTournament] = useState(true);
  const [teamAId, setTeamAId] = useState(null);
  const [teamBId, setTeamBId] = useState(null);
  const [fitRunId, setFitRunId] = useState(1);
  const [hoveredFeatureTeamId, setHoveredFeatureTeamId] = useState(null);
  const [featurePlotViewDomain, setFeaturePlotViewDomain] = useState(null);
  const [isPanningFeaturePlot, setIsPanningFeaturePlot] = useState(false);
  const [draftTrainSplit, setDraftTrainSplit] = useState(0.8);
  const [appliedTrainSplit, setAppliedTrainSplit] = useState(0.8);
  const [appliedFitParameters, setAppliedFitParameters] = useState(defaultFitParameters);
  const [draftFitParameters, setDraftFitParameters] = useState(defaultFitParameters);
  const [fittedModel, setFittedModel] = useState(null);
  const [isTrainingModel, setIsTrainingModel] = useState(false);
  const [modelPanelMode, setModelPanelMode] = useState('insights');
  const [savedModelId, setSavedModelId] = useState(null);
  const [modelNameDraft, setModelNameDraft] = useState('');
  const [showDescriptions, setShowDescriptions] = useState(false);
  const featurePlotPanStateRef = useRef(null);

  const method = 'manual-logistic';
  const featureByKey = useMemo(() => featureDefinitions.reduce((acc, feature) => {
    acc[feature.key] = feature;
    return acc;
  }, {}), [featureDefinitions]);
  const manifestFeatureOrder = trainingManifest?.feature_order || [];
  const availableTrainingYears = trainingManifest?.seasons || [];
  const normalizeTrainingYearRange = (range) => {
    if (!availableTrainingYears.length) {
      return { minIndex: 0, maxIndex: 0 };
    }

    const maxIndex = availableTrainingYears.length - 1;
    const boundedMinIndex = clamp(range.minIndex, 0, maxIndex);
    const boundedMaxIndex = clamp(range.maxIndex, boundedMinIndex, maxIndex);
    return {
      minIndex: boundedMinIndex,
      maxIndex: boundedMaxIndex
    };
  };
  const selectedTrainingYears = useMemo(() => {
    if (!availableTrainingYears.length) {
      return [];
    }

    const { minIndex, maxIndex } = normalizeTrainingYearRange(appliedTrainingYearRange);
    const boundedMinIndex = minIndex;
    const boundedMaxIndex = maxIndex;
    return availableTrainingYears.slice(boundedMinIndex, boundedMaxIndex + 1);
  }, [appliedTrainingYearRange, availableTrainingYears]);
  const draftTrainingYears = useMemo(() => {
    if (!availableTrainingYears.length) {
      return [];
    }

    const { minIndex, maxIndex } = normalizeTrainingYearRange(draftTrainingYearRange);
    return availableTrainingYears.slice(minIndex, maxIndex + 1);
  }, [availableTrainingYears, draftTrainingYearRange]);
  const selectedMinYear = draftTrainingYears[0] ?? null;
  const selectedMaxYear = draftTrainingYears[draftTrainingYears.length - 1] ?? null;
  const hasPendingTrainingYearRange = useMemo(() => (
    draftTrainingYearRange.minIndex !== appliedTrainingYearRange.minIndex
    || draftTrainingYearRange.maxIndex !== appliedTrainingYearRange.maxIndex
  ), [appliedTrainingYearRange, draftTrainingYearRange]);
  const trainingYearRangeFill = useMemo(() => {
    if (availableTrainingYears.length <= 1) {
      return { left: '0%', width: '100%' };
    }

    const maxIndex = availableTrainingYears.length - 1;
    const normalizedRange = normalizeTrainingYearRange(draftTrainingYearRange);
    const left = (normalizedRange.minIndex / maxIndex) * 100;
    const right = (normalizedRange.maxIndex / maxIndex) * 100;
    return {
      left: `${left}%`,
      width: `${Math.max(right - left, 0)}%`
    };
  }, [availableTrainingYears.length, draftTrainingYearRange]);

  useEffect(() => {
    if (teamIndex?.teams?.length && !teamAId && !teamBId) {
      setTeamAId(teamIndex.teams[0].team_id);
      setTeamBId(teamIndex.teams[1].team_id);
    }
  }, [teamAId, teamBId, teamIndex]);

  useEffect(() => {
    if (!trainingManifest || hasInitializedTrainingYears) {
      return;
    }

    const initialYears = getInitialTrainingYears(trainingManifest.seasons);
    const firstIndex = trainingManifest.seasons.findIndex((season) => season === (initialYears[0] ?? trainingManifest.seasons[0]));
    const lastIndex = trainingManifest.seasons.findIndex((season) => season === (initialYears[initialYears.length - 1] ?? trainingManifest.seasons[trainingManifest.seasons.length - 1]));

    const nextRange = {
      minIndex: Math.max(firstIndex, 0),
      maxIndex: Math.max(lastIndex, Math.max(firstIndex, 0))
    };
    setDraftTrainingYearRange(nextRange);
    setAppliedTrainingYearRange(nextRange);
    setHasInitializedTrainingYears(true);
  }, [hasInitializedTrainingYears, trainingManifest]);

  useEffect(() => {
    if (!availableTrainingYears.length || !hasInitializedTrainingYears) {
      return;
    }

    const maxIndex = availableTrainingYears.length - 1;
    setDraftTrainingYearRange((current) => {
      const nextMinIndex = clamp(current.minIndex, 0, maxIndex);
      const nextMaxIndex = clamp(current.maxIndex, nextMinIndex, maxIndex);

      if (nextMinIndex === current.minIndex && nextMaxIndex === current.maxIndex) {
        return current;
      }

      return { minIndex: nextMinIndex, maxIndex: nextMaxIndex };
    });
    setAppliedTrainingYearRange((current) => {
      const nextMinIndex = clamp(current.minIndex, 0, maxIndex);
      const nextMaxIndex = clamp(current.maxIndex, nextMinIndex, maxIndex);

      if (nextMinIndex === current.minIndex && nextMaxIndex === current.maxIndex) {
        return current;
      }

      return { minIndex: nextMinIndex, maxIndex: nextMaxIndex };
    });
  }, [availableTrainingYears, hasInitializedTrainingYears]);

  useEffect(() => {
    if (!trainingManifest || hasInitializedFeatures) {
      return;
    }

    setSelectedFeatures([]);
    setActiveFeatureKey(null);
    setHasInitializedFeatures(true);
  }, [hasInitializedFeatures, manifestFeatureOrder, trainingManifest]);

  useEffect(() => {
    if (!trainingManifest || !selectedTrainingYears.length) {
      return;
    }

    selectedTrainingYears.forEach((season) => {
      void ensureTrainingSeason(season);
    });
  }, [ensureTrainingSeason, selectedTrainingYears, trainingManifest]);

  const currentFeatureDefinitions = useMemo(() => manifestFeatureOrder
    .map((featureKey) => featureByKey[featureKey] || {
      key: featureKey,
      label: featureKey,
      category: 'Additional',
      higherIsBetter: true,
      formatter: (value) => Number(value).toFixed(3)
    }), [featureByKey, manifestFeatureOrder]);
  const selectedFeatureDefinitions = useMemo(() => currentFeatureDefinitions.filter((feature) => selectedFeatures.includes(feature.key)), [currentFeatureDefinitions, selectedFeatures]);
  const availableFeatureDefinitions = useMemo(() => currentFeatureDefinitions.filter((feature) => !selectedFeatures.includes(feature.key)), [currentFeatureDefinitions, selectedFeatures]);

  const tournamentTeams = useMemo(() => {
    if (!teamIndex?.teams?.length || !featureStore?.teams) {
      return [];
    }

    return teamIndex.teams
      .map((team) => ({
        ...team,
        features: featureStore.teams[String(team.team_id)] || featureStore.teams[team.team_id] || null
      }))
      .filter((team) => team.features);
  }, [featureStore, teamIndex]);

  const formatFeatureValue = (featureKey, value) => {
    const definition = featureByKey[featureKey];
    return definition?.formatter ? definition.formatter(Number(value)) : value;
  };

  const resolvedWeights = useMemo(() => selectedFeatures.reduce((acc, featureKey) => {
    acc[featureKey] = defaultWeights[featureKey] ?? 0;
    return acc;
  }, {}), [selectedFeatures]);

  const trainingScopeLabel = useMemo(() => {
    if (includeRegularSeason && includeTournament) {
      return 'Regular season + tournament';
    }

    if (includeRegularSeason) {
      return 'Regular season only';
    }

    if (includeTournament) {
      return 'Tournament only';
    }

    return 'No matchup sources selected';
  }, [includeRegularSeason, includeTournament]);

  const championshipSlotId = bracketDefinition?.final_slots?.championship;
  const semifinalSlots = Object.entries(bracketDefinition?.final_slots || {})
    .filter(([key]) => key !== 'championship')
    .map(([, slotId]) => getSlot(slotId))
    .filter(Boolean);

  const activeFeatureDefinition = currentFeatureDefinitions.find((feature) => feature.key === activeFeatureKey) || null;

  const featurePlotEntries = useMemo(() => {
    if (!activeFeatureDefinition) {
      return [];
    }

    return tournamentTeams
      .map((team) => ({
        teamId: team.team_id,
        shortName: team.short_name,
        seed: team.seed,
        radius: team.seed ? featurePlotPointRadius : (featurePlotPointRadius * featurePlotMissedTourneyRadiusScale),
        value: team.features?.[activeFeatureDefinition.key]
      }))
      .filter((entry) => Number.isFinite(entry.value))
      .sort((left, right) => {
        if (activeFeatureDefinition.higherIsBetter === false) {
          return left.value - right.value || left.shortName.localeCompare(right.shortName);
        }

        return right.value - left.value || left.shortName.localeCompare(right.shortName);
      });
  }, [activeFeatureDefinition, tournamentTeams]);

  const featureExtent = useMemo(() => {
    if (!featurePlotEntries.length) {
      return { min: 0, max: 1, span: 1 };
    }

    const values = featurePlotEntries.map((entry) => entry.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    return { min, max, span: Math.max(max - min, 1e-9) };
  }, [featurePlotEntries]);

  const featurePlotViewport = useMemo(() => normalizeFeaturePlotDomain(featurePlotViewDomain, featureExtent), [featureExtent, featurePlotViewDomain]);
  const isFeaturePlotZoomed = featurePlotViewport.span < (featureExtent.span - 1e-9);

  useEffect(() => {
    setFeaturePlotViewDomain(null);
    setHoveredFeatureTeamId(null);
    setIsPanningFeaturePlot(false);
    featurePlotPanStateRef.current = null;
  }, [activeFeatureDefinition?.key, featureExtent.max, featureExtent.min]);

  const annotatedFeaturePlotEntries = useMemo(() => {
    if (!featurePlotEntries.length) {
      return [];
    }

    const headEntries = featurePlotEntries.slice(0, Math.min(3, featurePlotEntries.length)).map((entry) => ({
      ...entry,
      annotationType: activeFeatureDefinition?.higherIsBetter === false ? 'lowest' : 'highest'
    }));
    const tailEntries = featurePlotEntries.slice(-Math.min(3, featurePlotEntries.length)).map((entry) => ({
      ...entry,
      annotationType: activeFeatureDefinition?.higherIsBetter === false ? 'highest' : 'lowest'
    }));
    const seen = new Set();

    return [...headEntries, ...tailEntries].filter((entry) => {
      if (seen.has(entry.teamId)) {
        return false;
      }
      seen.add(entry.teamId);
      return true;
    });
  }, [activeFeatureDefinition, featurePlotEntries]);

  const featurePlotData = useMemo(() => buildBeeswarmNodes({
    entries: featurePlotEntries,
    min: featureExtent.min,
    max: featureExtent.max
  }).map((entry) => {
    const isAnnotated = annotatedFeaturePlotEntries.some((annotatedEntry) => annotatedEntry.teamId === entry.teamId);
    return {
      ...entry,
      isAnnotated,
      radius: entry.radius + (isAnnotated ? featurePlotAnnotatedRadiusBoost : 0)
    };
  }), [annotatedFeaturePlotEntries, featureExtent.max, featureExtent.min, featurePlotEntries]);

  const annotatedFeaturePlotData = useMemo(() => annotatedFeaturePlotEntries.map((entry, index) => {
    const matchingEntry = featurePlotData.find((plotEntry) => plotEntry.teamId === entry.teamId);
    const valueRatio = featureExtent.span ? ((entry.value - featureExtent.min) / featureExtent.span) : 0;
    return {
      ...(matchingEntry || entry),
      alignRight: valueRatio > 0.82,
      annotationLane: index % 2 === 0 ? 'above' : 'below',
      annotationLabel: `${entry.shortName} (${formatFeatureValue(activeFeatureDefinition?.key, entry.value)})`
    };
  }), [activeFeatureDefinition, annotatedFeaturePlotEntries, featureExtent.min, featureExtent.span, featurePlotData]);

  const featurePlotVisibleData = useMemo(() => featurePlotData
    .filter((entry) => entry.value >= featurePlotViewport.min && entry.value <= featurePlotViewport.max)
    .map((entry) => ({
      ...entry,
      x: getFeaturePlotX(entry.value, featurePlotViewport)
    })), [featurePlotData, featurePlotViewport]);

  const annotatedFeaturePlotVisibleData = useMemo(() => annotatedFeaturePlotData
    .filter((entry) => entry.value >= featurePlotViewport.min && entry.value <= featurePlotViewport.max)
    .map((entry) => {
      const x = getFeaturePlotX(entry.value, featurePlotViewport);
      const valueRatio = featurePlotViewport.span ? ((entry.value - featurePlotViewport.min) / featurePlotViewport.span) : 0.5;
      return {
        ...entry,
        x,
        alignRight: valueRatio > 0.82
      };
    }), [annotatedFeaturePlotData, featurePlotViewport]);

  const featurePlotTicks = useMemo(() => buildLinearTicks(featurePlotViewport.min, featurePlotViewport.max, 5), [featurePlotViewport.max, featurePlotViewport.min]);
  const hoveredFeaturePoint = useMemo(() => featurePlotVisibleData.find((entry) => entry.teamId === hoveredFeatureTeamId) || null, [featurePlotVisibleData, hoveredFeatureTeamId]);

  const handleFeaturePlotReset = () => {
    setFeaturePlotViewDomain(null);
    setHoveredFeatureTeamId(null);
  };

  const handleFeaturePlotZoomIn = () => {
    setFeaturePlotViewDomain((current) => zoomFeaturePlotDomain(current, featureExtent, featurePlotZoomInFactor));
  };

  const handleFeaturePlotZoomOut = () => {
    setFeaturePlotViewDomain((current) => zoomFeaturePlotDomain(current, featureExtent, featurePlotZoomOutFactor));
  };

  const handleFeaturePlotWheel = (event) => {
    if (featureExtent.span <= 1e-9) {
      return;
    }

    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    const localX = ((event.clientX - rect.left) / Math.max(rect.width, 1)) * featurePlotWidth;
    const focusRatio = clamp((localX - featurePlotPadding.left) / featurePlotInnerWidth, 0, 1);
    const zoomFactor = event.deltaY < 0 ? featurePlotZoomInFactor : featurePlotZoomOutFactor;

    setFeaturePlotViewDomain((current) => zoomFeaturePlotDomain(current, featureExtent, zoomFactor, focusRatio));
  };

  const endFeaturePlotPan = () => {
    featurePlotPanStateRef.current = null;
    setIsPanningFeaturePlot(false);
  };

  const handleFeaturePlotPointerDown = (event) => {
    if (!isFeaturePlotZoomed) {
      return;
    }

    featurePlotPanStateRef.current = {
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startDomain: featurePlotViewport,
      rectWidth: Math.max(event.currentTarget.getBoundingClientRect().width, 1)
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsPanningFeaturePlot(true);
  };

  const handleFeaturePlotPointerMove = (event) => {
    const panState = featurePlotPanStateRef.current;
    if (!panState || panState.pointerId !== event.pointerId) {
      return;
    }

    const plotDelta = ((event.clientX - panState.startClientX) / panState.rectWidth) * featurePlotWidth;
    const domainDelta = -((plotDelta / featurePlotInnerWidth) * panState.startDomain.span);
    setFeaturePlotViewDomain(normalizeFeaturePlotDomain({
      min: panState.startDomain.min + domainDelta,
      max: panState.startDomain.max + domainDelta
    }, featureExtent));
  };

  const handleFeaturePlotPointerUp = () => {
    endFeaturePlotPan();
  };

  const selectedTrainingDatasets = useMemo(() => selectedTrainingYears
    .map((season) => trainingSeasonsByYear[String(season)])
    .filter(Boolean), [selectedTrainingYears, trainingSeasonsByYear]);

  const filteredTrainingExamples = useMemo(() => selectedTrainingDatasets.flatMap((dataset) => dataset.examples.filter((example) => {
    if (example.source === 'regular_season') {
      return includeRegularSeason;
    }

    if (example.source === 'tournament') {
      return includeTournament;
    }

    return false;
  })), [includeRegularSeason, includeTournament, selectedTrainingDatasets]);

  const pendingTrainingYears = useMemo(() => selectedTrainingYears.filter((season) => !trainingSeasonsByYear[String(season)]), [selectedTrainingYears, trainingSeasonsByYear]);
  const selectedTrainingRowCount = filteredTrainingExamples.length;
  const hasPendingFitParameterChanges = useMemo(() => (
    draftFitParameters.epochCount !== appliedFitParameters.epochCount
    || draftFitParameters.learningRate !== appliedFitParameters.learningRate
    || draftFitParameters.regularization !== appliedFitParameters.regularization
  ), [appliedFitParameters, draftFitParameters]);
  const hasPendingTrainingSettings = useMemo(() => (
    hasPendingFitParameterChanges || draftTrainSplit !== appliedTrainSplit
  ), [appliedTrainSplit, draftTrainSplit, hasPendingFitParameterChanges]);
  const activeWeights = fittedModel?.weights || resolvedWeights;
  const activeBias = fittedModel?.bias ?? 0;
  const activeSharpness = fittedModel?.sharpness ?? 1.5;
  const trainingManifestSummary = trainingManifest ? {
    manifest_path: trainingManifestPath,
    feature_set: trainingManifest.feature_set,
    format: trainingManifest.format,
    seasons_available: trainingManifest.seasons,
    label_definition: trainingManifest.label_definition
  } : null;
  const fitHistory = fittedModel?.history || [];
  const trainLossPath = useMemo(() => buildMetricPath(fitHistory.map((entry) => entry.train_loss || 0), 260, 96, false), [fitHistory]);
  const validationLossPath = useMemo(() => buildMetricPath(fitHistory.map((entry) => entry.validation_loss || 0), 260, 96, false), [fitHistory]);
  const trainAccuracyPath = useMemo(() => buildMetricPath(fitHistory.map((entry) => entry.train_accuracy || 0), 260, 96, false), [fitHistory]);
  const validationAccuracyPath = useMemo(() => buildMetricPath(fitHistory.map((entry) => entry.validation_accuracy || 0), 260, 96, false), [fitHistory]);
  const featureWeightRows = useMemo(() => (fittedModel?.topFeatures || []).map((entry) => ({
    ...entry,
    label: featureByKey[entry.featureKey]?.label || entry.featureKey,
    importance: Math.abs(entry.weight)
  })), [featureByKey, fittedModel]);
  const [generatedModelName] = useState(() => buildGeneratedModelName());
  const resolvedModelName = modelNameDraft.trim() || generatedModelName;

  useEffect(() => {
    if (!selectedFeatures.length || !filteredTrainingExamples.length || !manifestFeatureOrder.length) {
      setFittedModel(null);
      setIsTrainingModel(false);
      return undefined;
    }

    let isCancelled = false;
    setIsTrainingModel(true);

    const timeoutId = setTimeout(() => {
      if (isCancelled) {
        return;
      }

      const nextModel = fitBrowserLogisticModel({
        examples: filteredTrainingExamples,
        featureOrder: manifestFeatureOrder,
        selectedFeatures,
        labelDefinition: trainingManifest?.label_definition,
        runId: fitRunId,
        trainSplit: appliedTrainSplit,
        epochCount: appliedFitParameters.epochCount,
        learningRate: appliedFitParameters.learningRate,
        regularization: appliedFitParameters.regularization
      });

      if (isCancelled) {
        return;
      }

      setFittedModel(nextModel);
      setIsTrainingModel(false);
    }, 0);

    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
    };
  }, [appliedFitParameters, appliedTrainSplit, filteredTrainingExamples, fitRunId, manifestFeatureOrder, selectedFeatures, trainingManifest]);

  const buildMatchupRow = (leftTeamId, rightTeamId) => {
    const leftTeam = getTeamEntry(leftTeamId);
    const rightTeam = getTeamEntry(rightTeamId);
    const leftFeatures = featureStore?.teams?.[String(leftTeamId)] || featureStore?.teams?.[leftTeamId];
    const rightFeatures = featureStore?.teams?.[String(rightTeamId)] || featureStore?.teams?.[rightTeamId];

    if (!leftTeam || !rightTeam || !leftFeatures || !rightFeatures) {
      return null;
    }

    const featureVector = selectedFeatures.map((featureKey) => ({
      featureKey,
      label: featureByKey[featureKey]?.label || featureKey,
      leftValue: leftFeatures[featureKey],
      rightValue: rightFeatures[featureKey],
      rawDiff: Number(leftFeatures[featureKey] ?? 0) - Number(rightFeatures[featureKey] ?? 0),
      scaledDiff: normalizeDifference(featureKey, leftFeatures[featureKey], rightFeatures[featureKey])
    }));

    return {
      leftTeam,
      rightTeam,
      featureVector
    };
  };

  const selectedMatchupRow = useMemo(() => buildMatchupRow(teamAId, teamBId), [featureStore, getTeamEntry, selectedFeatures, teamAId, teamBId]);

  const runtimeModel = useMemo(() => buildRuntimeModel({
    id: savedModelId,
    name: resolvedModelName,
    method,
    selectedFeatures,
    weights: activeWeights,
    featureSet: trainingManifest?.feature_set || 'historical_v1',
    bias: activeBias,
    sharpness: activeSharpness,
    labelDefinition: trainingManifest?.label_definition || null,
    trainingManifest: trainingManifestSummary,
    trainingFilters: {
      seasons: selectedTrainingYears,
      include_regular_season: includeRegularSeason,
      include_tournament: includeTournament,
      source_scope: trainingScopeLabel,
      train_split: appliedTrainSplit,
      fit_hyperparameters: {
        epoch_count: appliedFitParameters.epochCount,
        learning_rate: appliedFitParameters.learningRate,
        regularization: appliedFitParameters.regularization
      }
    },
    fitSummary: fittedModel ? {
      train_loss: fittedModel.trainMetrics.loss,
      train_accuracy: fittedModel.trainMetrics.accuracy,
      validation_loss: fittedModel.validationMetrics.loss,
      validation_accuracy: fittedModel.validationMetrics.accuracy,
      training_rows: fittedModel.rowsUsed,
      validation_rows: fittedModel.holdoutRows,
      train_split: appliedTrainSplit,
      hyperparameters: fittedModel.hyperparameters,
      top_features: fittedModel.topFeatures.slice(0, 5)
    } : null,
    preprocessor: {
      type: 'normalizeDifference',
      strategy: 'feature-domain-scale-map',
      selected_features: selectedFeatures
    },
    notes: fittedModel
      ? `Browser-fit logistic model trained from ${selectedTrainingYears.join(', ')} using ${trainingScopeLabel} with a ${Math.round(appliedTrainSplit * 100)}/${Math.round((1 - appliedTrainSplit) * 100)} split. Inputs are normalized with the shared matchup-difference transform before fitting. Hyperparameters: epochs ${appliedFitParameters.epochCount}, learning rate ${appliedFitParameters.learningRate}, regularization ${appliedFitParameters.regularization}.`
      : `Training data years: ${selectedTrainingYears.join(', ')}. Sources: ${trainingScopeLabel}. Matchup vectors and preprocessing are generated automatically from the published ${trainingManifest?.feature_set || 'historical_v1'} artifacts.`
  }), [activeBias, activeSharpness, activeWeights, appliedFitParameters, appliedTrainSplit, buildRuntimeModel, fittedModel, includeRegularSeason, includeTournament, method, resolvedModelName, savedModelId, selectedFeatures, selectedTrainingYears, trainingManifest, trainingManifestSummary, trainingScopeLabel]);

  const previewPrediction = useMemo(() => {
    if (!teamAId || !teamBId || teamAId === teamBId) {
      return null;
    }

    return predictCustomMatchup(teamAId, teamBId, runtimeModel);
  }, [predictCustomMatchup, runtimeModel, teamAId, teamBId]);

  const previewBracket = useMemo(() => {
    if (!championshipSlotId) {
      return {};
    }

    return fillSlotThroughCustom(championshipSlotId, {}, runtimeModel);
  }, [championshipSlotId, fillSlotThroughCustom, runtimeModel]);

  const champion = previewBracket[championshipSlotId] ? getTeamEntry(previewBracket[championshipSlotId]) : null;

  const activeTabIndex = builderTabs.findIndex((tab) => tab.id === activeTab);

  if (loading || trainingLoading || !teamIndex || !bracketDefinition) {
    return (
      <MM2026Shell>
        <section className="mm26-panel">
          <p className="mm26-note">Loading live feature store, bracket graph, and historical training manifest...</p>
        </section>
      </MM2026Shell>
    );
  }

  if (error || trainingError) {
    return (
      <MM2026Shell>
        <section className="mm26-panel">
          <p className="mm26-note">Could not load the live modeling inputs: {(error || trainingError).message}</p>
        </section>
      </MM2026Shell>
    );
  }

  const removeFeature = (featureKey) => {
    setSelectedFeatures((current) => {
      const nextFeatures = current.filter((key) => key !== featureKey);
      if (activeFeatureKey === featureKey) {
        setActiveFeatureKey(null);
      }
      return nextFeatures;
    });
  };

  const addFeature = (featureKey) => {
    setSelectedFeatures((current) => {
      if (current.includes(featureKey)) {
        return current;
      }
      return [...current, featureKey];
    });
    setActiveFeatureKey(featureKey);
  };

  const commitTrainingYearRange = () => {
    setAppliedTrainingYearRange((current) => {
      const normalizedDraftRange = normalizeTrainingYearRange(draftTrainingYearRange);

      if (
        current.minIndex === normalizedDraftRange.minIndex
        && current.maxIndex === normalizedDraftRange.maxIndex
      ) {
        return current;
      }

      return normalizedDraftRange;
    });
  };

  const updateTrainingYearMinIndex = (nextIndex) => {
    setDraftTrainingYearRange((current) => ({
      minIndex: Math.min(nextIndex, current.maxIndex),
      maxIndex: Math.max(current.maxIndex, nextIndex)
    }));
  };

  const updateTrainingYearMaxIndex = (nextIndex) => {
    setDraftTrainingYearRange((current) => ({
      minIndex: Math.min(current.minIndex, nextIndex),
      maxIndex: Math.max(nextIndex, current.minIndex)
    }));
  };

  const stepTo = (nextTabId) => setActiveTab(nextTabId);

  const goToNextTab = () => {
    const nextTab = builderTabs[activeTabIndex + 1];
    if (nextTab) {
      setActiveTab(nextTab.id);
    }
  };

  const goToPreviousTab = () => {
    const previousTab = builderTabs[activeTabIndex - 1];
    if (previousTab) {
      setActiveTab(previousTab.id);
    }
  };

  const triggerRefit = () => {
    const nextFitParameters = {
      epochCount: normalizeEpochCount(draftFitParameters.epochCount),
      learningRate: normalizeLearningRate(draftFitParameters.learningRate),
      regularization: normalizeRegularization(draftFitParameters.regularization)
    };

    setDraftFitParameters(nextFitParameters);
    setAppliedFitParameters(nextFitParameters);
    setAppliedTrainSplit(draftTrainSplit);
    setFitRunId((current) => current + 1);
  };

  const handleBuildBracket = () => {
    const savedModel = saveRuntimeModelToLibrary(runtimeModel);
    if (!savedModel?.id) {
      return;
    }

    setSavedModelId(savedModel.id);
    navigate('/mm/bracket');
  };

  const currentTab = builderTabs[activeTabIndex] || builderTabs[0];
  const previousTab = builderTabs[activeTabIndex - 1] || null;
  const nextTab = builderTabs[activeTabIndex + 1] || null;
  const trainSplitLabel = `${Math.round(appliedTrainSplit * 100)} / ${Math.round((1 - appliedTrainSplit) * 100)}`;
  const draftTrainSplitLabel = `${Math.round(draftTrainSplit * 100)} / ${Math.round((1 - draftTrainSplit) * 100)}`;

  return (
    <MM2026Shell>
      <section className="mm26-panel">
        <div className="mm26-kicker">Model Builder</div>
        <h1 style={{ margin: '0.35rem 0 0' }}>Build your Own Prediction Model</h1>
      </section>

      <section className="mm26-panel" style={{ marginTop: '1rem' }}>
        <div className="mm26-stage-nav" aria-label="Model builder navigation">
          <div className="mm26-stage-nav-copy">
            <div className="mm26-kicker">Step {activeTabIndex + 1} of {builderTabs.length}</div>
            <h2>{currentTab?.label || 'Model Builder'}</h2>
            <p>
              {nextTab
                ? `Next up: ${nextTab.label}.`
                : 'You are on the final build and training step.'}
            </p>
          </div>
          <div className="mm26-stage-nav-actions">
            <button
              type="button"
              className="mm26-button-secondary"
              onClick={goToPreviousTab}
              disabled={!previousTab}
            >
              Back
            </button>
            {activeTab !== 'preview' ? (
              <button
                type="button"
                className="mm26-button-secondary"
                onClick={() => stepTo('preview')}
              >
                Jump to Build & Train
              </button>
            ) : null}
            <button
              type="button"
              className="mm26-button"
              onClick={nextTab ? goToNextTab : handleBuildBracket}
            >
              {nextTab ? `Next: ${nextTab.label}` : 'Build Bracket'}
            </button>
          </div>
        </div>

        {activeTab === 'features' ? (
          <div className="mm26-tab-panel">
            <div className="mm26-stage-grid" style={{ marginTop: '1rem' }}>
              <InputSelectionPanel
                kicker="Add inputs"
                title="Available features"
                description="All stats start unselected. Click a row to inspect it, then add it when you want it to become a model input."
                features={availableFeatureDefinitions}
                activeFeatureKey={activeFeatureKey}
                onInspectFeature={setActiveFeatureKey}
                onCommitFeature={addFeature}
                actionLabel="Add"
                showDescriptions={showDescriptions}
                emptyMessage="All published inputs are selected."
              />
              <StatExplorerPanel
                activeFeatureDefinition={activeFeatureDefinition}
                selectedFeatureCount={selectedFeatures.length}
                featurePlotWidthValue={featurePlotWidth}
                featurePlotHeightValue={featurePlotHeight}
                featurePlotPaddingValue={featurePlotPadding}
                featurePlotTicks={featurePlotTicks}
                featurePlotDomain={featurePlotViewport}
                featurePlotData={featurePlotVisibleData}
                annotatedFeaturePlotData={annotatedFeaturePlotVisibleData}
                hoveredFeaturePoint={hoveredFeaturePoint}
                setHoveredFeatureTeamId={setHoveredFeatureTeamId}
                handleFeaturePlotWheel={handleFeaturePlotWheel}
                handleFeaturePlotPointerDown={handleFeaturePlotPointerDown}
                handleFeaturePlotPointerMove={handleFeaturePlotPointerMove}
                handleFeaturePlotPointerUp={handleFeaturePlotPointerUp}
                handleFeaturePlotReset={handleFeaturePlotReset}
                handleFeaturePlotZoomIn={handleFeaturePlotZoomIn}
                handleFeaturePlotZoomOut={handleFeaturePlotZoomOut}
                isFeaturePlotZoomed={isFeaturePlotZoomed}
                isPanningFeaturePlot={isPanningFeaturePlot}
                formatFeatureValue={formatFeatureValue}
                showDescriptions={showDescriptions}
              />
              <InputSelectionPanel
                kicker="Selected"
                title="Model inputs"
                description="These are the feature dimensions that will be carried into matchup construction and browser fitting."
                features={selectedFeatureDefinitions}
                activeFeatureKey={activeFeatureKey}
                onInspectFeature={setActiveFeatureKey}
                onCommitFeature={removeFeature}
                actionLabel="Remove"
                showDescriptions={showDescriptions}
                emptyMessage="Select one or more stats to start building the model."
              />
            </div>
          </div>
        ) : null}

        {activeTab === 'dataset' ? (
          <div className="mm26-tab-panel">
            <div className="mm26-stage-grid mm26-modelbuilder-grid mm26-modelbuilder-grid--dataset" style={{ marginTop: '1rem' }}>
              <SelectedInputsSummary
                kicker="Inputs"
                title="Selected inputs"
                description="This panel is read-only here. Adjust the actual input set on the feature-selection tab."
                selectedFeatureDefinitions={selectedFeatureDefinitions}
                showDescriptions={showDescriptions}
              />

              <BuilderStageCard
                kicker="Matchup data"
                title="Filter matchups"
                description="Curate the matchup data you want to include in the train and test sets."
                showDescription={showDescriptions}
                className="mm26-stage-card--main"
              >
                <div className="mm26-model-card mm26-stage-subcard" style={{ marginTop: '1rem' }}>
                  <div className="mm26-kicker">Training years</div>
                  <div className="mm26-range-slider-shell" style={{ marginTop: '0.9rem' }}>
                    <div className="mm26-range-slider-values">
                      <span>{selectedMinYear ?? 'n/a'}</span>
                      <span>{selectedMaxYear ?? 'n/a'}</span>
                    </div>
                    <div className="mm26-range-slider-track-wrap">
                      <div className="mm26-range-slider-track" />
                      <div className="mm26-range-slider-fill" style={trainingYearRangeFill} />
                      <input
                        type="range"
                        min="0"
                        max={Math.max(availableTrainingYears.length - 1, 0)}
                        step="1"
                        value={draftTrainingYearRange.minIndex}
                        className="mm26-range-input"
                        onChange={(event) => updateTrainingYearMinIndex(Number(event.target.value))}
                        onMouseUp={commitTrainingYearRange}
                        onTouchEnd={commitTrainingYearRange}
                        onBlur={commitTrainingYearRange}
                        aria-label="Minimum training year"
                      />
                      <input
                        type="range"
                        min="0"
                        max={Math.max(availableTrainingYears.length - 1, 0)}
                        step="1"
                        value={draftTrainingYearRange.maxIndex}
                        className="mm26-range-input"
                        onChange={(event) => updateTrainingYearMaxIndex(Number(event.target.value))}
                        onMouseUp={commitTrainingYearRange}
                        onTouchEnd={commitTrainingYearRange}
                        onBlur={commitTrainingYearRange}
                        aria-label="Maximum training year"
                      />
                    </div>
                    <div className="mm26-range-slider-endpoints">
                      <span>{availableTrainingYears[0] ?? 'n/a'}</span>
                      <span>{availableTrainingYears[availableTrainingYears.length - 1] ?? 'n/a'}</span>
                    </div>
                  </div>
                </div>

                <div className="mm26-builder-grid" style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column' }}>
                  <div className="mm26-model-card mm26-stage-subcard">
                    <div className="mm26-kicker">Matchup sources</div>
                    <div className="mm26-feature-list" style={{ marginTop: '0.9rem' }}>
                      <label className="mm26-feature-toggle">
                        <input type="checkbox" checked={includeRegularSeason} onChange={() => setIncludeRegularSeason((current) => !current)} />
                        <span>Regular season games</span>
                      </label>
                      <label className="mm26-feature-toggle">
                        <input type="checkbox" checked={includeTournament} onChange={() => setIncludeTournament((current) => !current)} />
                        <span>Tournament games</span>
                      </label>
                    </div>
                  </div>

                  <div className="mm26-model-card mm26-stage-subcard">
                    <div className="mm26-kicker">Matchup representation</div>
                    <div className="mm26-model-list" style={{ marginTop: '0.9rem' }}>
                      <div className="mm26-model-row">
                        <span>1</span>
                        <strong>t1, t2, t1 - t2, scaled</strong>
                        <span>Each selected stat becomes a raw row plus a normalized matchup feature</span>
                      </div>
                      <div className="mm26-model-row">
                        <span>2</span>
                        <strong>normalizeDifference(feature, t1, t2)</strong>
                        <span>Shared scaling path used by browser fitting and 2026 runtime inference</span>
                      </div>
                    </div>
                  </div>
                </div>
              </BuilderStageCard>

              <BuilderStageCard
                kicker="Matchup sample"
                title={selectedMatchupRow ? `${selectedMatchupRow.leftTeam.short_name} vs ${selectedMatchupRow.rightTeam.short_name}` : 'Choose a focus matchup'}
                description="Select a matchup to preview how the model turns team stats into the training vector."
                showDescription={showDescriptions}
                className="mm26-stage-card--readonly"
              >
                <div className="mm26-builder-grid" style={{ marginTop: '1rem' }}>
                  <label className="mm26-builder-field">
                    <span>Team 1</span>
                    <select className="mm26-select" value={teamAId || ''} onChange={(event) => setTeamAId(Number(event.target.value))}>
                      {teamIndex.teams.map((team) => <option key={team.team_id} value={team.team_id}>{team.name}</option>)}
                    </select>
                  </label>
                  <label className="mm26-builder-field">
                    <span>Team 2</span>
                    <select className="mm26-select" value={teamBId || ''} onChange={(event) => setTeamBId(Number(event.target.value))}>
                      {teamIndex.teams.map((team) => <option key={team.team_id} value={team.team_id}>{team.name}</option>)}
                    </select>
                  </label>
                </div>
                {selectedMatchupRow ? (
                  <div className="mm26-vector-table-shell" style={{ marginTop: '1rem' }}>
                    <div className="mm26-kicker">Focused matchup</div>
                    <div className="mm26-vector-table">
                      <div className="mm26-vector-table-row is-header">
                        <span>Stat</span>
                        <span>{selectedMatchupRow.leftTeam.short_name}</span>
                        <span>{selectedMatchupRow.rightTeam.short_name}</span>
                        <span>t1 - t2</span>
                        <span>Scaled</span>
                      </div>
                      {selectedMatchupRow.featureVector.map((entry) => (
                        <div key={entry.featureKey} className="mm26-vector-table-row">
                          <span>{entry.label}</span>
                          <span>{formatFeatureValue(entry.featureKey, entry.leftValue)}</span>
                          <span>{formatFeatureValue(entry.featureKey, entry.rightValue)}</span>
                          <span>{formatSignedNumber(entry.rawDiff)}</span>
                          <strong>{formatSignedNumber(entry.scaledDiff)}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="mm26-empty">Pick two teams to see the derived logistic-regression row.</p>
                )}
              </BuilderStageCard>
            </div>
          </div>
        ) : null}

        {activeTab === 'preview' ? (
          <div className="mm26-tab-panel">
            <div className="mm26-stage-grid" style={{ marginTop: '1rem' }}>
              <ReadOnlyWorkflowSummary
                kicker="Dataset"
                title="Dataset"
                description="Review the exact inputs, matchup filters, and vector construction that feed the current model fit."
                selectedFeatureDefinitions={selectedFeatureDefinitions}
                selectedTrainingYears={selectedTrainingYears}
                trainingScopeLabel={trainingScopeLabel}
                selectedTrainingRowCount={selectedTrainingRowCount}
                representationLabel="Columns are team 1, team 2, raw difference, and scaled matchup value for every selected stat."
                scalingLabel="normalizeDifference(featureKey, team_1_value, team_2_value)"
                showDescriptions={showDescriptions}
              />

              <BuilderStageCard
                kicker="Model"
                title="Build and train"
                description="Tune settings, inspect model-specific insights, and re-fit the in-browser logistic regression workflow."
                showDescription={showDescriptions}
                className="mm26-stage-card--main"
              >
                <div className="mm26-model-card mm26-stage-subcard" style={{ marginTop: '1rem' }}>
                  <div className="mm26-model-toolbar">
                    <div className="mm26-model-type-chip">
                      <span>Model type</span>
                      <strong>Logistic Regression</strong>
                    </div>
                    <div className="mm26-model-toolbar-actions">
                      <div className="mm26-pill-toggle">
                        <button
                          type="button"
                          className={`mm26-pill-toggle-button ${modelPanelMode === 'settings' ? 'is-active' : ''}`}
                          onClick={() => setModelPanelMode('settings')}
                          disabled={isTrainingModel}
                        >
                          Settings
                        </button>
                        <button
                          type="button"
                          className={`mm26-pill-toggle-button ${modelPanelMode === 'insights' ? 'is-active' : ''}`}
                          onClick={() => setModelPanelMode('insights')}
                          disabled={isTrainingModel}
                        >
                          Insights
                        </button>
                      </div>
                      <button
                        type="button"
                        className="mm26-button"
                        onClick={triggerRefit}
                        disabled={!selectedTrainingRowCount || !selectedFeatures.length || isTrainingModel}
                        aria-busy={isTrainingModel}
                      >
                        {isTrainingModel ? 'Training' : fittedModel ? 'Retrain' : 'Train'}
                      </button>
                    </div>
                  </div>
                  {modelPanelMode === 'settings' ? (
                    <div className="mm26-settings-panel">
                      <div className="mm26-slider-header">
                        <div>
                          <div className="mm26-kicker">Train / test split</div>
                          <strong className="mm26-train-split-value">{draftTrainSplitLabel}</strong>
                        </div>
                      </div>
                      <input
                        type="range"
                        min="0.6"
                        max="0.9"
                        step="0.05"
                        value={draftTrainSplit}
                        className="mm26-slider"
                        onChange={(event) => setDraftTrainSplit(Number(event.target.value))}
                      />
                      <div className="mm26-fit-controls-inline" style={{ marginTop: '1rem' }}>
                        <label className="mm26-fit-control">
                          <span>Epochs</span>
                          <input
                            type="number"
                            min="1"
                            max="200"
                            step="1"
                            value={draftFitParameters.epochCount}
                            className="mm26-builder-input"
                            onChange={(event) => setDraftFitParameters((current) => ({
                              ...current,
                              epochCount: event.target.value
                            }))}
                          />
                        </label>
                        <label className="mm26-fit-control">
                          <span>LR</span>
                          <input
                            type="number"
                            min="0.001"
                            max="2"
                            step="0.01"
                            value={draftFitParameters.learningRate}
                            className="mm26-builder-input"
                            onChange={(event) => setDraftFitParameters((current) => ({
                              ...current,
                              learningRate: event.target.value
                            }))}
                          />
                        </label>
                        <label className="mm26-fit-control">
                          <span>Reg</span>
                          <input
                            type="number"
                            min="0"
                            max="0.1"
                            step="0.0005"
                            value={draftFitParameters.regularization}
                            className="mm26-builder-input"
                            onChange={(event) => setDraftFitParameters((current) => ({
                              ...current,
                              regularization: event.target.value
                            }))}
                          />
                        </label>
                      </div>
                      <p className="mm26-note" style={{ marginTop: '0.75rem' }}>
                        Applied settings: {trainSplitLabel} split, {appliedFitParameters.epochCount} epochs, LR {appliedFitParameters.learningRate}, reg {appliedFitParameters.regularization}.{hasPendingTrainingSettings ? ` Draft changes are waiting for Re-fit: ${draftTrainSplitLabel} split, ${draftFitParameters.epochCount} epochs, LR ${draftFitParameters.learningRate}, reg ${draftFitParameters.regularization}.` : ''}
                      </p>
                    </div>
                  ) : (
                    <div className="mm26-builder-grid" style={{ marginTop: '1rem' }}>
                      <div className="mm26-model-card mm26-stage-subcard">
                        <div className="mm26-kicker">Model accuracy</div>
                        {fittedModel ? (
                          <div className="mm26-accuracy-panel" style={{ marginTop: '0.85rem' }}>
                            <div className="mm26-accuracy-hero">
                              <span>Validation accuracy</span>
                              <strong>{formatPercent(fittedModel.validationMetrics.accuracy || 0)}</strong>
                              <p>Holdout score from the latest browser training run.</p>
                            </div>
                            <div className="mm26-insight-list">
                              <div className="mm26-insight-row">
                                <span>Validation loss</span>
                                <strong>{fittedModel.validationMetrics.loss?.toFixed(3) ?? 'n/a'}</strong>
                              </div>
                              <div className="mm26-insight-row">
                                <span>Training accuracy</span>
                                <strong>{formatPercent(fittedModel.trainMetrics.accuracy || 0)}</strong>
                              </div>
                              <div className="mm26-insight-row">
                                <span>Rows scored</span>
                                <strong>{fittedModel.holdoutRows?.toLocaleString() || 0}</strong>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <p className="mm26-empty" style={{ marginTop: '0.85rem' }}>Train the model to see holdout accuracy.</p>
                        )}
                      </div>
                      <div className="mm26-model-card mm26-stage-subcard">
                        <div className="mm26-kicker">Feature importance</div>
                        {featureWeightRows.length ? (
                          <div className="mm26-weight-list" style={{ marginTop: '0.85rem' }}>
                            {featureWeightRows.map((entry) => (
                              <div key={entry.featureKey} className="mm26-weight-row">
                                <span>{entry.label}</span>
                                <strong>{entry.weight.toFixed(3)}</strong>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="mm26-empty" style={{ marginTop: '0.85rem' }}>Fit the model to inspect feature weights.</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mm26-builder-grid" style={{ marginTop: '1rem' }}>
                  <div className="mm26-model-card mm26-stage-subcard">
                    <div className="mm26-kicker">Training info</div>
                    {fitHistory.length ? (
                      <>
                        <svg viewBox="0 0 260 96" className="mm26-fit-chart" role="img" aria-label="Training loss history">
                          <path d={trainLossPath} className="mm26-fit-line mm26-fit-line--primary" />
                          <path d={validationLossPath} className="mm26-fit-line mm26-fit-line--secondary" />
                        </svg>
                        <div className="mm26-fit-legend">
                          <span><i className="mm26-fit-swatch mm26-fit-swatch--primary" />Train</span>
                          <span><i className="mm26-fit-swatch mm26-fit-swatch--secondary" />Validation</span>
                        </div>
                        <p className="mm26-note" style={{ marginTop: '0.75rem' }}>
                          Final loss: train {fittedModel?.trainMetrics.loss?.toFixed(3) ?? 'n/a'} · validation {fittedModel?.validationMetrics.loss?.toFixed(3) ?? 'n/a'}
                        </p>
                      </>
                    ) : (
                      <p className="mm26-empty">Fit the model to see epoch-by-epoch loss.</p>
                    )}
                  </div>
                  <div className="mm26-model-card mm26-stage-subcard">
                    <div className="mm26-kicker">Accuracy over epochs</div>
                    {fitHistory.length ? (
                      <>
                        <svg viewBox="0 0 260 96" className="mm26-fit-chart" role="img" aria-label="Training accuracy history">
                          <path d={trainAccuracyPath} className="mm26-fit-line mm26-fit-line--primary" />
                          <path d={validationAccuracyPath} className="mm26-fit-line mm26-fit-line--secondary" />
                        </svg>
                        <div className="mm26-fit-legend">
                          <span><i className="mm26-fit-swatch mm26-fit-swatch--primary" />Train</span>
                          <span><i className="mm26-fit-swatch mm26-fit-swatch--secondary" />Validation</span>
                        </div>
                        <p className="mm26-note" style={{ marginTop: '0.75rem' }}>
                          Final accuracy: train {formatPercent(fittedModel?.trainMetrics.accuracy || 0)} · validation {formatPercent(fittedModel?.validationMetrics.accuracy || 0)}
                        </p>
                      </>
                    ) : (
                      <p className="mm26-empty">Fit the model to see epoch-by-epoch accuracy.</p>
                    )}
                  </div>
                </div>

                <div className="mm26-model-card mm26-stage-subcard" style={{ marginTop: '1rem' }}>
                  <div className="mm26-kicker">Training snapshot</div>
                  <div className="mm26-builder-grid" style={{ marginTop: '0.75rem' }}>
                    <div className="mm26-metric">
                      <span className="mm26-label">Training rows</span>
                      <strong>{fittedModel?.rowsUsed?.toLocaleString() || 0}</strong>
                      <p>Examples assigned to the train split</p>
                    </div>
                    <div className="mm26-metric">
                      <span className="mm26-label">Validation rows</span>
                      <strong>{fittedModel?.holdoutRows?.toLocaleString() || 0}</strong>
                      <p>Examples assigned to holdout evaluation</p>
                    </div>
                    <div className="mm26-metric">
                      <span className="mm26-label">Validation accuracy</span>
                      <strong>{fittedModel ? formatPercent(fittedModel.validationMetrics.accuracy || 0) : 'n/a'}</strong>
                      <p>Current browser-fit holdout score</p>
                    </div>
                    <div className="mm26-metric">
                      <span className="mm26-label">Top weights</span>
                      <strong>{fittedModel ? fittedModel.topFeatures.slice(0, 2).map((entry) => `${featureByKey[entry.featureKey]?.label || entry.featureKey} ${entry.weight.toFixed(2)}`).join(' • ') : 'n/a'}</strong>
                      <p>Largest absolute coefficients</p>
                    </div>
                  </div>
                </div>
              </BuilderStageCard>

              <BuilderStageCard
                kicker="Prediction preview"
                title="Focused matchup and 2026 bracket"
                description="Preview the selected matchup and iteratively fill the 2026 slots with this model to inspect its projected Final Four."
                showDescription={showDescriptions}
                className="mm26-stage-card--readonly"
              >
                <label className="mm26-builder-field" style={{ marginTop: '1rem' }}>
                  <span>Model name</span>
                  <input
                    type="text"
                    className="mm26-builder-input"
                    value={modelNameDraft}
                    onChange={(event) => setModelNameDraft(event.target.value)}
                    placeholder={generatedModelName}
                  />
                </label>

                <div className="mm26-detail-actions" style={{ marginTop: '1rem' }}>
                  <button type="button" className="mm26-button-secondary" onClick={handleBuildBracket}>Build Bracket</button>
                  {/* Disabling Export JSON. Just an admin feature */}
                  {/* <button type="button" className="mm26-button" onClick={() => downloadModelConfig(runtimeModel)}>Export JSON</button> */}
                </div>

                <div className="mm26-kicker" style={{ marginTop: '1rem' }}>Focused matchup</div>
                {previewPrediction && teamAId !== teamBId ? (
                  <>
                    <div className="mm26-matchup-header">
                      <div>
                        <h3>{getTeamEntry(teamAId).short_name}</h3>
                        <p>{formatPercent(previewPrediction.teamAProbability)}</p>
                      </div>
                      <div>
                        <h3>{getTeamEntry(teamBId).short_name}</h3>
                        <p>{formatPercent(previewPrediction.teamBProbability)}</p>
                      </div>
                    </div>
                    <div className="mm26-probability-track">
                      <div className="mm26-probability-fill" style={{ width: `${previewPrediction.teamAProbability * 100}%` }} />
                    </div>
                    <p className="mm26-note" style={{ marginTop: '0.75rem' }}>
                      This preview uses the same applied coefficients and scaling that are exported in the runtime model JSON.
                    </p>
                  </>
                ) : (
                  <p className="mm26-empty">Pick two different teams on the matchup-data tab to preview the classifier output.</p>
                )}

                <div className="mm26-kicker" style={{ marginTop: '1rem' }}>2026 Final Four</div>
                <h3>{champion ? `${champion.short_name} projects as champion` : 'No champion projected yet'}</h3>
                <div className="mm26-model-list">
                  {semifinalSlots.map((slot) => {
                    const { team1Id, team2Id } = getSlotParticipants(slot.slot, previewBracket);
                    const winnerId = previewBracket[slot.slot];
                    return (
                      <div key={slot.slot} className="mm26-model-row">
                        <span>{slot.label}</span>
                        <strong>{team1Id && team2Id ? `${getTeamEntry(team1Id).short_name} vs ${getTeamEntry(team2Id).short_name}` : 'TBD'}</strong>
                        <span>{winnerId ? `Winner: ${getTeamEntry(winnerId).short_name}` : 'Pending'}</span>
                      </div>
                    );
                  })}
                  <div className="mm26-model-row">
                    <span>Championship</span>
                    <strong>{(() => {
                      const { team1Id, team2Id } = getSlotParticipants(championshipSlotId, previewBracket);
                      return team1Id && team2Id ? `${getTeamEntry(team1Id).short_name} vs ${getTeamEntry(team2Id).short_name}` : 'TBD';
                    })()}</strong>
                    <span>{champion ? `Winner: ${champion.short_name}` : 'Pending'}</span>
                  </div>
                </div>
              </BuilderStageCard>
            </div>
          </div>
        ) : null}

        <div className="mm26-detail-actions" style={{ marginTop: '1rem' }}>
          <button type="button" className="mm26-button-secondary" onClick={goToPreviousTab} disabled={activeTabIndex === 0}>Back</button>
          <button type="button" className="mm26-button" onClick={goToNextTab} disabled={activeTabIndex === builderTabs.length - 1}>Next</button>
        </div>
      </section>
    </MM2026Shell>
  );
};

export default ModelBuilder;