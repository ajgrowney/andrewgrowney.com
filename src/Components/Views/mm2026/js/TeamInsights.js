import React, { useEffect, useMemo, useState } from 'react';
import MM2026Shell from './Shell';
import { useMM2026Data, useMM2026StatExplorer } from '../../../../Data/mm2026/dataClient';

const DEFAULT_TEAM_INSIGHT_FEATURE = 'AdjOE_mean';
const TEAM_FILTER_ALL = 'all';
const TEAM_FILTER_TOURNAMENT = 'tournament';
const TEAM_REGION_ALL = 'all';
const TEAM_QUARTILE_STAGE_HEIGHT = 220;
const EXIT_ROUND_CHART_HEIGHT = 220;

const EXIT_ROUND_BINS = [
  { key: 'round64', label: 'R64', fullLabel: 'Round of 64', roundNumber: 1 },
  { key: 'round32', label: 'R32', fullLabel: 'Round of 32', roundNumber: 2 },
  { key: 'sweet16', label: 'S16', fullLabel: 'Sweet Sixteen', roundNumber: 3 },
  { key: 'elite8', label: 'E8', fullLabel: 'Elite Eight', roundNumber: 4 },
  { key: 'final4', label: 'F4', fullLabel: 'Final Four', roundNumber: 5 },
  { key: 'championship', label: 'Title', fullLabel: 'Championship', roundNumber: 6 },
  { key: 'champion', label: 'Champ', fullLabel: 'Champion', roundNumber: 7 }
];

const TEAM_QUARTILE_STAGE_LAYOUT = {
  round64: { slotCount: 32, slotHeight: 6, columnWidth: 60 },
  round32: { slotCount: 16, slotHeight: 8, columnWidth: 58 },
  sweet16: { slotCount: 8, slotHeight: 12, columnWidth: 54 },
  elite8: { slotCount: 4, slotHeight: 22, columnWidth: 52, slotPositions: [0.05, 0.32, 0.6, 0.87] },
  final4: { slotCount: 2, slotHeight: 26, columnWidth: 50, slotPositions: [0.18, 0.72] },
  championship: { slotCount: 1, slotHeight: 30, columnWidth: 52 },
  champion: { slotCount: 1, slotHeight: 10, columnWidth: 44 }
};

const formatRecord = (record) => {
  if (!Array.isArray(record) || record.length < 2) {
    return '--';
  }

  return `${record[0]}-${record[1]}`;
};

const formatCoachName = (coach) => {
  if (!coach) {
    return 'Unknown';
  }

  return coach
    .split('_')
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
};

const formatLocation = (locationCode) => {
  if (locationCode === 'H') {
    return 'Home';
  }
  if (locationCode === 'A') {
    return 'Away';
  }
  if (locationCode === 'N') {
    return 'Neutral';
  }
  return 'Unknown site';
};

const formatSimilarityScore = (value) => {
  if (!Number.isFinite(value)) {
    return '--';
  }

  return `${(value * 100).toFixed(1)}%`;
};

const formatExpectedRound = (value) => {
  if (!Number.isFinite(value)) {
    return '--';
  }

  return value.toFixed(2);
};

const flattenQuadResults = (quadResults = {}) => ['1', '2', '3', '4'].flatMap((quad) => (
  (quadResults[quad] || []).map((game) => ({
    ...game,
    quad: Number(quad)
  }))
));

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const buildQuartileDomain = (bucketSummaries, selectedValue) => {
  const values = Object.values(bucketSummaries || {}).flatMap((summary) => (
    summary ? [summary.min, summary.max] : []
  ));

  if (Number.isFinite(selectedValue)) {
    values.push(selectedValue);
  }

  if (!values.length) {
    return { min: 0, max: 1, span: 1 };
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  return {
    min,
    max,
    span: Math.max(max - min, 1e-9)
  };
};

const buildBracketSlotLayout = (slotCount, slotHeight, stageHeight = TEAM_QUARTILE_STAGE_HEIGHT, slotPositions = null) => {
  if (!slotCount) {
    return [];
  }

  if (slotCount === 1) {
    return [{ top: (stageHeight / 2) - (slotHeight / 2), height: slotHeight }];
  }

  const availableHeight = Math.max(stageHeight - slotHeight, 0);

  if (Array.isArray(slotPositions) && slotPositions.length === slotCount) {
    return slotPositions.map((position) => ({
      top: clamp(position, 0, 1) * availableHeight,
      height: slotHeight
    }));
  }

  return Array.from({ length: slotCount }, (_, index) => {
    const ratio = index / Math.max(slotCount - 1, 1);
    return {
      top: ratio * availableHeight,
      height: slotHeight
    };
  });
};

const CompactQuartileStage = ({ bucket, stageIndex, summary, domain, selectedValue, formatter }) => {
  const stageLayout = TEAM_QUARTILE_STAGE_LAYOUT[bucket.key] || {
    slotCount: Math.max(1, Math.round(32 / (2 ** stageIndex))),
    slotHeight: 10,
    columnWidth: 52
  };
  const width = stageLayout.columnWidth;
  const height = TEAM_QUARTILE_STAGE_HEIGHT;
  const centerX = width / 2;
  const plotTop = 14;
  const plotBottom = height - 16;
  const plotHeight = plotBottom - plotTop;
  const boxWidth = Math.min(22, Math.max(width - 18, 12));
  const selectedMarkerWidth = Math.min(30, Math.max(width - 12, 16));
  const whiskerCapWidth = Math.min(22, Math.max(width - 20, 10));
  const slotLayout = buildBracketSlotLayout(stageLayout.slotCount, stageLayout.slotHeight, height, stageLayout.slotPositions);
  const scaleY = (value) => {
    const ratio = (value - domain.min) / domain.span;
    return plotBottom - (clamp(ratio, 0, 1) * plotHeight);
  };

  if (!summary) {
    return (
      <article className={`mm26-team-quartile-stage mm26-team-quartile-stage--${bucket.key}`.trim()} style={{ '--mm26-team-stage-width': `${width}px` }}>
        <header className="mm26-team-quartile-stage-header">
          <strong>{bucket.label}</strong>
        </header>
        <div className="mm26-team-quartile-stage-canvas is-empty" style={{ height: `${height}px` }}>
          <div className="mm26-team-quartile-stage-empty">No data</div>
        </div>
      </article>
    );
  }

  const minY = scaleY(summary.min);
  const maxY = scaleY(summary.max);
  const p10Y = scaleY(summary.p10);
  const p90Y = scaleY(summary.p90);
  const q1Y = scaleY(summary.q1);
  const medianY = scaleY(summary.median);
  const q3Y = scaleY(summary.q3);
  const meanY = scaleY(summary.mean);
  const selectedY = Number.isFinite(selectedValue) ? scaleY(selectedValue) : null;
  const boxTop = Math.min(q3Y, q1Y);
  const boxHeight = Math.max(Math.abs(q1Y - q3Y), 3);

  return (
    <article className={`mm26-team-quartile-stage mm26-team-quartile-stage--${bucket.key}`.trim()} style={{ '--mm26-team-stage-width': `${width}px` }}>
      <header className="mm26-team-quartile-stage-header">
        <strong>{bucket.label}</strong>
      </header>
      <div className="mm26-team-quartile-stage-canvas" style={{ height: `${height}px` }}>
        <div className="mm26-team-quartile-stage-slots" aria-hidden="true">
          {slotLayout.map((slot, index) => (
            <div
              key={`${bucket.key}-slot-${index}`}
              className="mm26-team-quartile-stage-slot"
              style={{ top: `${slot.top}px`, height: `${slot.height}px` }}
            />
          ))}
        </div>

        <svg viewBox={`0 0 ${width} ${height}`} className="mm26-team-quartile-stage-plot" role="img" aria-label={`${bucket.label} historical distribution`}>
          <line x1={centerX} y1={minY} x2={centerX} y2={maxY} className="mm26-explorer-plot-line" />
          <line x1={centerX} y1={p10Y} x2={centerX} y2={p90Y} className="mm26-explorer-plot-line mm26-explorer-plot-line--emphasis" />
          <line x1={centerX - (whiskerCapWidth / 2)} y1={minY} x2={centerX + (whiskerCapWidth / 2)} y2={minY} className="mm26-explorer-plot-line mm26-explorer-plot-line--emphasis" />
          <line x1={centerX - (whiskerCapWidth / 2)} y1={maxY} x2={centerX + (whiskerCapWidth / 2)} y2={maxY} className="mm26-explorer-plot-line mm26-explorer-plot-line--emphasis" />
          <rect x={centerX - (boxWidth / 2)} y={boxTop} width={boxWidth} height={boxHeight} rx="8" className="mm26-explorer-plot-box" />
          <line x1={centerX - (boxWidth / 2)} y1={medianY} x2={centerX + (boxWidth / 2)} y2={medianY} className="mm26-explorer-plot-median" />
          <circle cx={centerX} cy={meanY} r="4" className="mm26-explorer-plot-mean" />
          {selectedY !== null ? (
            <>
              <line x1={centerX - (selectedMarkerWidth / 2)} y1={selectedY} x2={centerX + (selectedMarkerWidth / 2)} y2={selectedY} className="mm26-explorer-plot-selected-line" />
              <circle cx={centerX} cy={selectedY} r="4.5" className="mm26-explorer-plot-selected" />
            </>
          ) : null}
        </svg>
      </div>
      <div className="mm26-team-quartile-stage-meta">
        <span>Median {formatter(summary.median)}</span>
      </div>
    </article>
  );
};

const ExitRoundProbabilityChart = ({ distribution }) => {
  const width = 360;
  const height = EXIT_ROUND_CHART_HEIGHT;
  const margin = { top: 18, right: 18, bottom: 50, left: 38 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const bars = EXIT_ROUND_BINS.map((bin) => ({
    ...bin,
    probability: distribution?.probabilities?.[bin.key] ?? 0
  }));
  const yMax = Math.max(0.1, Math.ceil((Math.max(...bars.map((bar) => bar.probability), 0) + 0.001) * 10) / 10);
  const yTicks = Array.from({ length: 5 }, (_, index) => (yMax / 4) * index);
  const bandWidth = plotWidth / bars.length;
  const barWidth = Math.min(28, bandWidth * 0.58);
  const scaleY = (value) => margin.top + plotHeight - ((value / yMax) * plotHeight);
  const seedExpectation = Number.isFinite(distribution?.seed_expected_round) ? distribution.seed_expected_round : null;
  const seedLineX = seedExpectation !== null
    ? margin.left + ((clamp(seedExpectation, 1, 7) - 0.5) / bars.length) * plotWidth
    : null;

  return (
    <div className="mm26-team-exit-chart-wrap">
      <svg viewBox={`0 0 ${width} ${height}`} className="mm26-team-exit-chart" role="img" aria-label="Exit round distribution bar chart">
        {yTicks.map((tickValue) => {
          const y = scaleY(tickValue);
          return (
            <g key={`tick-${tickValue}`}>
              <line x1={margin.left} y1={y} x2={width - margin.right} y2={y} className="mm26-team-exit-grid-line" />
              <text x={margin.left - 8} y={y + 4} textAnchor="end" className="mm26-team-exit-axis-label">
                {`${Math.round(tickValue * 100)}%`}
              </text>
            </g>
          );
        })}

        {seedLineX !== null ? (
          <g>
            <line x1={seedLineX} y1={margin.top} x2={seedLineX} y2={margin.top + plotHeight} className="mm26-team-exit-seed-line" />
            <text x={seedLineX} y={margin.top - 4} textAnchor="middle" className="mm26-team-exit-seed-label">
              {`Seed exp ${formatExpectedRound(seedExpectation)}`}
            </text>
          </g>
        ) : null}

        {bars.map((bar, index) => {
          const x = margin.left + (bandWidth * index) + ((bandWidth - barWidth) / 2);
          const y = scaleY(bar.probability);
          const barHeight = Math.max((margin.top + plotHeight) - y, 2);
          const probabilityLabelY = margin.top + plotHeight + 16;
          const roundLabelY = height - 16;

          return (
            <g key={bar.key}>
              <rect x={x} y={y} width={barWidth} height={barHeight} rx="8" className="mm26-team-exit-bar" />
              <text x={x + (barWidth / 2)} y={probabilityLabelY} textAnchor="middle" className="mm26-team-exit-bar-value">
                {`${(bar.probability * 100).toFixed(1)}%`}
              </text>
              <text x={x + (barWidth / 2)} y={roundLabelY} textAnchor="middle" className="mm26-team-exit-axis-label">
                {bar.label}
              </text>
              <title>{`${bar.fullLabel}: ${(bar.probability * 100).toFixed(1)}%`}</title>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const TeamInsights = () => {
  const {
    ensureTeamPage,
    error,
    featureStore,
    findTeamOpeningSlot,
    getFeatureRankingsForTeams,
    getPotentialMatchupsByRound,
    getRegionLabel,
    getSlotParticipants,
    getTeamEntry,
    getTeamPage,
    loading,
    modelsManifest,
    predictMatchup,
    teamIndex
  } = useMM2026Data();
  const {
    error: statExplorerError,
    explorer,
    featureDefinitions: explorerFeatureDefinitions,
    featureStore: explorerFeatureStore,
    loading: statExplorerLoading
  } = useMM2026StatExplorer();
  const defaultTeamId = teamIndex?.teams?.[0]?.team_id || null;
  const [selectedTeamId, setSelectedTeamId] = useState(defaultTeamId);
  const [selectedModelId, setSelectedModelId] = useState(null);
  const [hasCustomModelSelection, setHasCustomModelSelection] = useState(false);
  const [selectedExplorerFeatureKey, setSelectedExplorerFeatureKey] = useState(DEFAULT_TEAM_INSIGHT_FEATURE);
  const [selectedMatchupRoundSlotId, setSelectedMatchupRoundSlotId] = useState(null);
  const [selectedTeamFilter, setSelectedTeamFilter] = useState(TEAM_FILTER_TOURNAMENT);
  const [selectedTeamRegionFilter, setSelectedTeamRegionFilter] = useState(TEAM_REGION_ALL);

  useEffect(() => {
    if (defaultTeamId && !selectedTeamId) {
      setSelectedTeamId(defaultTeamId);
    }
  }, [defaultTeamId, selectedTeamId]);

  useEffect(() => {
    if (selectedTeamId) {
      ensureTeamPage(selectedTeamId);
    }
  }, [ensureTeamPage, selectedTeamId]);

  useEffect(() => {
    if (!modelsManifest?.default_model_id) {
      return;
    }

    if (!hasCustomModelSelection || !modelsManifest?.models?.some((model) => model.id === selectedModelId)) {
      setSelectedModelId(modelsManifest.default_model_id);
    }
  }, [hasCustomModelSelection, modelsManifest, selectedModelId]);

  useEffect(() => {
    if (!explorerFeatureDefinitions.length) {
      return;
    }

    setSelectedExplorerFeatureKey((current) => (
      explorerFeatureDefinitions.some((feature) => feature.key === current)
        ? current
        : explorerFeatureDefinitions.find((feature) => feature.key === DEFAULT_TEAM_INSIGHT_FEATURE)?.key || explorerFeatureDefinitions[0].key
    ));
  }, [explorerFeatureDefinitions]);

  const teamRegionOptions = useMemo(() => {
    const regionMap = new Map();

    (teamIndex?.teams || []).forEach((entry) => {
      const regionKey = entry.region_key || entry.region || null;
      if (!regionKey || regionMap.has(regionKey)) {
        return;
      }

      regionMap.set(regionKey, entry.region_label || getRegionLabel(regionKey));
    });

    return [...regionMap.entries()]
      .map(([key, label]) => ({ key, label }))
      .sort((left, right) => left.label.localeCompare(right.label));
  }, [getRegionLabel, teamIndex]);

  const filteredTeamOptions = useMemo(() => (
    (teamIndex?.teams || [])
      .filter((entry) => {
        if (selectedTeamFilter === TEAM_FILTER_TOURNAMENT && !entry.tournament_team) {
          return false;
        }

        if (selectedTeamRegionFilter !== TEAM_REGION_ALL) {
          const regionKey = entry.region_key || entry.region || null;
          return regionKey === selectedTeamRegionFilter;
        }

        return true;
      })
      .sort((left, right) => left.name.localeCompare(right.name))
  ), [selectedTeamFilter, selectedTeamRegionFilter, teamIndex]);

  useEffect(() => {
    if (!filteredTeamOptions.length) {
      return;
    }

    if (!filteredTeamOptions.some((entry) => entry.team_id === selectedTeamId)) {
      setSelectedTeamId(filteredTeamOptions[0].team_id);
    }
  }, [filteredTeamOptions, selectedTeamId]);

  const team = useMemo(() => (selectedTeamId ? getTeamEntry(selectedTeamId) : null), [getTeamEntry, selectedTeamId]);
  const teamPage = useMemo(() => (selectedTeamId ? getTeamPage(selectedTeamId) : null), [getTeamPage, selectedTeamId]);
  const selectedExplorerFeatureDefinition = useMemo(() => (
    explorerFeatureDefinitions.find((feature) => feature.key === selectedExplorerFeatureKey) || explorerFeatureDefinitions[0] || null
  ), [explorerFeatureDefinitions, selectedExplorerFeatureKey]);
  const selectedExplorerTeamValue = useMemo(() => {
    if (!selectedTeamId || !selectedExplorerFeatureKey) {
      return null;
    }

    const teamStats = explorerFeatureStore?.teams?.[String(selectedTeamId)] || explorerFeatureStore?.teams?.[selectedTeamId];
    const nextValue = teamStats?.[selectedExplorerFeatureKey];
    return Number.isFinite(nextValue) ? nextValue : null;
  }, [explorerFeatureStore, selectedExplorerFeatureKey, selectedTeamId]);

  const openingSlot = useMemo(() => (selectedTeamId ? findTeamOpeningSlot(selectedTeamId) : null), [findTeamOpeningSlot, selectedTeamId]);
  const openingParticipants = useMemo(() => (openingSlot ? getSlotParticipants(openingSlot.slot, {}) : null), [getSlotParticipants, openingSlot]);
  const opponentId = openingParticipants
    ? [openingParticipants.team1Id, openingParticipants.team2Id].find((teamId) => teamId !== selectedTeamId)
    : null;
  const opponent = opponentId ? getTeamEntry(opponentId) : null;

  const modelInsight = opponent ? predictMatchup(selectedTeamId, opponentId, selectedModelId) : null;
  const selectedModel = useMemo(() => (
    modelsManifest.models.find((model) => model.id === selectedModelId) || null
  ), [modelsManifest.models, selectedModelId]);
  const round1ModelInsights = useMemo(() => {
    if (!opponent || !selectedTeamId) {
      return [];
    }

    return (modelsManifest.models || [])
      .map((model) => {
        const prediction = predictMatchup(selectedTeamId, opponentId, model.id);
        if (!prediction) {
          return null;
        }

        return {
          model,
          prediction,
          isDefault: model.id === modelsManifest.default_model_id,
          isSelected: model.id === selectedModelId
        };
      })
      .filter(Boolean);
  }, [modelsManifest.default_model_id, modelsManifest.models, opponent, opponentId, predictMatchup, selectedModelId, selectedTeamId]);

  const bestWins = useMemo(() => (
    flattenQuadResults(teamPage?.quad_wins)
      .sort((gameA, gameB) => gameA.quad - gameB.quad || gameB.date_int - gameA.date_int)
      .slice(0, 5)
  ), [teamPage]);

  const toughestLosses = useMemo(() => (
    flattenQuadResults(teamPage?.quad_losses)
      .sort((gameA, gameB) => gameA.quad - gameB.quad || gameB.date_int - gameA.date_int)
      .slice(0, 5)
  ), [teamPage]);
  const matchupPreviewRounds = useMemo(() => (
    selectedTeamId ? getPotentialMatchupsByRound(selectedTeamId, selectedModelId, {}) : []
  ), [getPotentialMatchupsByRound, selectedModelId, selectedTeamId]);
  const selectedModelIndex = useMemo(() => {
    const index = modelsManifest.models.findIndex((model) => model.id === selectedModelId);
    return index >= 0 ? index : 0;
  }, [modelsManifest.models, selectedModelId]);
  const selectedMatchupRound = useMemo(() => {
    if (!matchupPreviewRounds.length) {
      return null;
    }

    return matchupPreviewRounds.find((roundGroup) => roundGroup.slotId === selectedMatchupRoundSlotId) || matchupPreviewRounds[0];
  }, [matchupPreviewRounds, selectedMatchupRoundSlotId]);

  useEffect(() => {
    if (!matchupPreviewRounds.length) {
      if (selectedMatchupRoundSlotId !== null) {
        setSelectedMatchupRoundSlotId(null);
      }
      return;
    }

    if (!matchupPreviewRounds.some((roundGroup) => roundGroup.slotId === selectedMatchupRoundSlotId)) {
      setSelectedMatchupRoundSlotId(matchupPreviewRounds[0].slotId);
    }
  }, [matchupPreviewRounds, selectedMatchupRoundSlotId]);

  const resumeRows = teamPage && team ? [
    { label: 'Overall', value: formatRecord(teamPage.record.overall), note: `${teamPage.win_pct ? `${(teamPage.win_pct * 100).toFixed(1)}%` : '--'} win rate` },
    { label: 'Conference', value: formatRecord(teamPage.record.conf), note: (team.conference || 'Unknown conference').toUpperCase() },
    { label: 'Home / Road', value: `${formatRecord(teamPage.record.home)} / ${formatRecord(teamPage.record.road)}`, note: 'Where they have done the damage' },
    { label: 'Quad 1', value: `${formatRecord(teamPage.record.quad_1)}`, note: 'Top-end resume games' },
    { label: 'Quad 2', value: `${formatRecord(teamPage.record.quad_2)}`, note: 'Secondary quality wins' },
    { label: 'NET / SOS', value: `${teamPage.ordinal_data?.NET ?? '--'} / ${teamPage.sos?.toFixed(3) ?? '--'}`, note: 'Ordinal rank and schedule strength' }
  ] : [];
  const similarTeams = Array.isArray(teamPage?.similar_teams) ? teamPage.similar_teams : [];
  const exitRoundDistribution = teamPage?.exit_round_distribution || null;
  const seedDeltaText = useMemo(() => {
    const seedDelta = exitRoundDistribution?.seed_delta;

    if (!Number.isFinite(seedDelta)) {
      return null;
    }

    if (seedDelta > 0.05) {
      return `Model likes ${team.short_name} more than a typical ${team.seed || teamPage?.tournament?.seed || '--'} seed.`;
    }

    if (seedDelta < -0.05) {
      return `Model is colder on ${team.short_name} than a typical ${team.seed || teamPage?.tournament?.seed || '--'} seed.`;
    }

    return `Model is roughly aligned with the historical expectation for this seed line.`;
  }, [exitRoundDistribution, team, teamPage]);
  const selectedFeatureBucketSummaries = useMemo(() => (
    explorer?.historical_summary?.[selectedExplorerFeatureKey] || {}
  ), [explorer, selectedExplorerFeatureKey]);
  const quartileDomain = useMemo(() => (
    buildQuartileDomain(selectedFeatureBucketSummaries, selectedExplorerTeamValue)
  ), [selectedExplorerTeamValue, selectedFeatureBucketSummaries]);
  const quartileFormatter = selectedExplorerFeatureDefinition?.formatter || ((value) => String(value));

  if (loading || !teamIndex || !selectedTeamId || !team) {
    return (
      <MM2026Shell>
        <section className="mm26-panel">
          <p className="mm26-note">Loading live team index and feature store...</p>
        </section>
      </MM2026Shell>
    );
  }

  if (error && !teamPage) {
    return (
      <MM2026Shell>
        <section className="mm26-panel">
          <p className="mm26-note">Could not load the live team artifacts: {error.message}</p>
        </section>
      </MM2026Shell>
    );
  }

  return (
    <MM2026Shell>
      <section className="mm26-team-toolbar">
        <select className="mm26-select mm26-select--compact" value={selectedTeamFilter} onChange={(event) => setSelectedTeamFilter(event.target.value)}>
          <option value={TEAM_FILTER_ALL}>All teams</option>
          <option value={TEAM_FILTER_TOURNAMENT}>Tournament teams</option>
        </select>
        <select className="mm26-select mm26-select--compact" value={selectedTeamRegionFilter} onChange={(event) => setSelectedTeamRegionFilter(event.target.value)}>
          <option value={TEAM_REGION_ALL}>All regions</option>
          {teamRegionOptions.map((region) => (
            <option key={region.key} value={region.key}>{region.label}</option>
          ))}
        </select>
        <select className="mm26-select mm26-team-toolbar-team-select" value={selectedTeamId} onChange={(event) => setSelectedTeamId(Number(event.target.value))} disabled={!filteredTeamOptions.length}>
          {filteredTeamOptions.map((entry) => (
            <option key={entry.team_id} value={entry.team_id}>{entry.name}</option>
          ))}
        </select>
      </section>

      <section className="mm26-team-header">
        <div className="mm26-panel">
          <div className="mm26-kicker">Team Insights</div>
          <h1 style={{ marginBottom: '0.35rem' }}>{team.name}</h1>
          <div className="mm26-team-seed">{team.tournament_team ? `${team.seed} seed in the ${team.region_label || getRegionLabel(team.region)}` : 'Not currently in the tournament field'}</div>
          <p>
            {teamPage
              ? `${formatRecord(teamPage.record.overall)} overall, ${formatRecord(teamPage.record.conf)} in conference, coached by ${formatCoachName(teamPage.coach)}.`
              : 'Loading full team page...'}
          </p>
          <div className="mm26-team-meta">
            <span className="mm26-pill">{(team.conference || 'unknown').toUpperCase()}</span>
            <span className="mm26-pill">NET {teamPage?.ordinal_data?.NET ?? team.ordinal_data.NET ?? '--'}</span>
            <span className="mm26-pill">SOS {teamPage?.sos?.toFixed(3) ?? '--'}</span>
            <span className="mm26-pill">SOV {teamPage?.sov?.toFixed(3) ?? '--'}</span>
          </div>
          <div className="mm26-metric-grid">
            <div className="mm26-metric">
              <span className="mm26-label">Overall</span>
              <strong>{teamPage ? formatRecord(teamPage.record.overall) : '--'}</strong>
              <p>{teamPage ? `${(teamPage.win_pct * 100).toFixed(1)}% win rate` : 'Loading record'}</p>
            </div>
            <div className="mm26-metric">
              <span className="mm26-label">AdjNE</span>
              <strong>{teamPage ? teamPage.stats.AdjNE.toFixed(1) : '--'}</strong>
              <p>{teamPage ? `${teamPage.stat_rankings.AdjNE}th nationally` : 'Loading ranking'}</p>
            </div>
            <div className="mm26-metric">
              <span className="mm26-label">NET</span>
              <strong>{teamPage?.ordinal_data?.NET ?? team.ordinal_data.NET ?? '--'}</strong>
              <p>Current ordinal snapshot</p>
            </div>
          </div>
        </div>

        {exitRoundDistribution ? (
          <div className="mm26-panel mm26-team-exit-panel">
            <div className="mm26-kicker">Exit Round Outlook</div>
            <h3>{`Expected exit round ${formatExpectedRound(exitRoundDistribution.expected_exit_round)}`}</h3>
            <p>{seedDeltaText || 'Relative to the historical expectation for this seed.'}</p>
            <div className="mm26-team-exit-chip-row">
              <span className="mm26-team-exit-chip">
                Seed Delta {Number.isFinite(exitRoundDistribution.seed_delta) ? `${exitRoundDistribution.seed_delta > 0 ? '+' : ''}${exitRoundDistribution.seed_delta.toFixed(3)}` : '--'}
              </span>
            </div>
            <ExitRoundProbabilityChart distribution={exitRoundDistribution} />
          </div>
        ) : teamPage?.tournament ? (
          <div className="mm26-panel mm26-team-exit-panel">
            <div className="mm26-kicker">Exit Round Outlook</div>
            <h3>Unavailable</h3>
            <p className="mm26-empty">Tournament outlook enrichment is not available for this team yet.</p>
          </div>
        ) : null}

        <div className="mm26-panel mm26-team-quartile-panel">
          <div className="mm26-kicker">Historical Quartiles</div>
          <div className="mm26-team-quartile-heading">
            <div className="mm26-team-quartile-title-control">
              <select
                className="mm26-team-quartile-title-select"
                value={selectedExplorerFeatureKey}
                onChange={(event) => setSelectedExplorerFeatureKey(event.target.value)}
                aria-label="Select historical quartile feature"
              >
                {explorerFeatureDefinitions.map((feature) => (
                  <option key={feature.key} value={feature.key}>{feature.label}</option>
                ))}
              </select>
            </div>
            <div className="mm26-team-quartile-heading-value">
              {Number.isFinite(selectedExplorerTeamValue) ? quartileFormatter(selectedExplorerTeamValue) : '--'}
            </div>
          </div>

          {statExplorerLoading ? <p className="mm26-empty">Loading historical quartiles...</p> : null}
          {!statExplorerLoading && statExplorerError ? <p className="mm26-empty">Could not load published quartile summaries.</p> : null}
          {!statExplorerLoading && !statExplorerError ? (
            <>
              <div className="mm26-team-quartile-board">
                <div className="mm26-team-quartile-track">
                {(explorer?.round_buckets || []).map((bucket, stageIndex) => (
                  <CompactQuartileStage
                    key={bucket.key}
                    bucket={bucket}
                    stageIndex={stageIndex}
                    summary={selectedFeatureBucketSummaries?.[bucket.key] || null}
                    domain={quartileDomain}
                    selectedValue={selectedExplorerTeamValue}
                    formatter={quartileFormatter}
                  />
                ))}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </section>

      <section className="mm26-team-tournament-grid">
        <div className="mm26-panel mm26-team-tournament-card">
          <div className="mm26-kicker">Round 1 context</div>
          {opponent && round1ModelInsights.length ? (
            <>
              <h3>{team.short_name} vs {opponent.short_name}</h3>
              <p className="mm26-round-note">Opening game: {openingSlot?.slot || 'TBD'} in the {team.region_label || getRegionLabel(team.region)} region.</p>
              <div className="mm26-team-model-insight-list">
                {round1ModelInsights.map(({ model, prediction, isDefault, isSelected }) => (
                  <article key={model.id} className={`mm26-team-model-insight-card ${isDefault ? 'is-default' : ''}`.trim()}>
                    <div className="mm26-team-model-insight-header">
                      <strong>{`${model.name}: ${team.short_name} ${(prediction.teamAProbability * 100).toFixed(1)}%`}</strong>
                    </div>
                    <div className="mm26-probability-track">
                      <div className="mm26-probability-fill" style={{ width: `${prediction.teamAProbability * 100}%` }} />
                    </div>
                    {(isDefault || isSelected) ? (
                      <div className="mm26-team-model-insight-badges">
                        {isDefault ? <span className="mm26-team-model-insight-badge">Default</span> : null}
                        {isSelected ? <span className="mm26-team-model-insight-badge is-active">Matchups</span> : null}
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>
            </>
          ) : team.tournament_team ? (
            <p className="mm26-empty">This team is in the field, but the opening matchup could not be resolved from the published bracket yet.</p>
          ) : (
            <p className="mm26-empty">This team is currently outside the published bracket field, so there is no opening-round matchup to simulate.</p>
          )}
        </div>

        <div className="mm26-stat-card mm26-team-tournament-card mm26-team-tournament-card--matchups">
          <div className="mm26-kicker">Field snapshot</div>
          <h3>Potential matchups</h3>
          <p>
            {`Future-round opponents ordered by how likely ${team.short_name} is to see them with win odds shown at right.`}
          </p>
          {modelsManifest.models.length ? (
            <div className="mm26-model-slider" aria-label="Potential matchup model slider">
              <button
                type="button"
                className="mm26-button-secondary mm26-model-slider-button"
                onClick={() => {
                  const previousIndex = (selectedModelIndex - 1 + modelsManifest.models.length) % modelsManifest.models.length;
                  setHasCustomModelSelection(true);
                  setSelectedModelId(modelsManifest.models[previousIndex].id);
                }}
                aria-label="Show previous matchup model"
              >
                Prev
              </button>
              <div className="mm26-model-slider-label">{selectedModel?.name || 'Model'}</div>
              <button
                type="button"
                className="mm26-button-secondary mm26-model-slider-button"
                onClick={() => {
                  const nextIndex = (selectedModelIndex + 1) % modelsManifest.models.length;
                  setHasCustomModelSelection(true);
                  setSelectedModelId(modelsManifest.models[nextIndex].id);
                }}
                aria-label="Show next matchup model"
              >
                Next
              </button>
            </div>
          ) : null}
          {matchupPreviewRounds.length ? (
            <div className="mm26-matchup-tabs" role="tablist" aria-label="Potential matchup rounds">
              {matchupPreviewRounds.map((roundGroup) => {
                const isActive = roundGroup.slotId === selectedMatchupRound?.slotId;
                return (
                  <button
                    key={roundGroup.slotId}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`mm26-matchup-tab${isActive ? ' is-active' : ''}`}
                    onClick={() => setSelectedMatchupRoundSlotId(roundGroup.slotId)}
                  >
                    {roundGroup.roundLabel}
                  </button>
                );
              })}
            </div>
          ) : null}
          <div className="mm26-matchup-scroll">
            <div className="mm26-result-list mm26-matchup-preview-list">
            {selectedMatchupRound ? (
              <section key={selectedMatchupRound.slotId} className="mm26-matchup-round-group">
                <div className="mm26-matchup-round-label">{selectedMatchupRound.roundLabel}</div>
                <div className="mm26-result-list">
                  {selectedMatchupRound.opponents.map((entry) => (
                    <div key={`${selectedMatchupRound.slotId}-${entry.teamId}`} className="mm26-result-row">
                      <div className="mm26-result-main">
                        <strong>{entry.team.short_name}</strong>
                        <span>{entry.team.seed ? `${entry.team.seed} seed` : `NET ${entry.team.ordinal_data?.NET ?? '--'}`}</span>
                      </div>
                      <div className="mm26-result-meta">
                        <strong>Win Prob {(entry.winProbability * 100).toFixed(1)}%</strong>
                        <span>Reach {(entry.reachProbability * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
                  {!selectedMatchupRound.opponents.length ? <p className="mm26-empty">No projected opponents are available for this round yet.</p> : null}
                </div>
              </section>
            ) : null}
            {!team.tournament_team ? <p className="mm26-empty">This team is outside the current projected field, so no tournament path is available yet.</p> : null}
            {team.tournament_team && !matchupPreviewRounds.length ? <p className="mm26-empty">Future-round opponent pools could not be resolved from the current bracket state yet.</p> : null}
            </div>
          </div>
        </div>

        <div className="mm26-detail-card mm26-team-tournament-card mm26-team-tournament-card--similar">
          <div className="mm26-kicker">Similar teams</div>
          <h3>Historical comps</h3>
          {teamPage ? (
            similarTeams.length ? (
              <div className="mm26-similar-teams-scroll">
                <div className="mm26-similar-teams-list">
                  {similarTeams.map((entry) => (
                    <article key={`${entry.id}-${entry.year}`} className="mm26-similar-team-card">
                      <div className="mm26-similar-team-row">
                        <div className="mm26-similar-team-main">
                          <strong>{entry.name} {entry.year}</strong>
                          <span>{entry.seed ? `${entry.seed} seed` : 'Seed --'} • {entry.er || 'Exit unknown'}</span>
                        </div>
                        <div className="mm26-similar-team-score">
                          <span>Avg</span>
                          <strong>{formatSimilarityScore(entry.avg)}</strong>
                        </div>
                      </div>
                      {entry.er == "Champion" ? <p /> : (<p className="mm26-similar-team-outcome">
                        {entry.lost_to && entry.loss_score
                          ? `Lost to ${entry.lost_to}, ${entry.loss_score}`
                          : 'Historical tournament outcome is incomplete for this comp.'}
                      </p>)}
                      <div className="mm26-similar-team-chips">
                        <span className="mm26-similar-team-chip">Res {formatSimilarityScore(entry.res)}</span>
                        <span className="mm26-similar-team-chip">Style {formatSimilarityScore(entry.st)}</span>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ) : teamPage.tournament ? (
              <p className="mm26-empty">Historical similarity comps are not available for this tournament team yet.</p>
            ) : (
              <p className="mm26-empty">This team is outside the tournament field, so there are no seeded historical comps to compare yet.</p>
            )
          ) : <p className="mm26-empty">Loading historical comps...</p>}
        </div>

        <div className="mm26-detail-card mm26-team-tournament-card">
          <div className="mm26-kicker">Resume snapshot</div>
          <h3>Tournament resume</h3>
          {teamPage ? (
            <div className="mm26-compare-list">
              {resumeRows.map((row) => (
                <div key={row.label} className="mm26-compare-row mm26-compare-row--stacked">
                  <div>
                    <span>{row.label}</span>
                    <p>{row.note}</p>
                  </div>
                  <strong>{row.value}</strong>
                </div>
              ))}
            </div>
          ) : <p className="mm26-empty">Loading live resume splits and rankings...</p>}
        </div>

        <div className="mm26-stat-card mm26-team-tournament-card">
          <div className="mm26-kicker">Best wins</div>
          <div className="mm26-result-list">
            {bestWins.map((game) => {
              const opposingTeam = getTeamEntry(game.opp_id);

              return (
                <div key={`win-${game.quad}-${game.opp_id}-${game.date_int}`} className="mm26-result-row">
                  <div className="mm26-result-main">
                    <strong>{opposingTeam?.short_name || `Team ${game.opp_id}`}</strong>
                    <span>Q{game.quad} win</span>
                  </div>
                  <div className="mm26-result-meta">
                    <strong>{game.team_score}-{game.opp_score}</strong>
                    <span>{game.date_str} · {formatLocation(game.team_loc)}</span>
                  </div>
                </div>
              );
            })}
            {teamPage && !bestWins.length ? <p className="mm26-empty">No quad wins are available in the published team page yet.</p> : null}
            {!teamPage ? <p className="mm26-empty">Loading game log...</p> : null}
          </div>
        </div>

        <div className="mm26-stat-card mm26-team-tournament-card">
          <div className="mm26-kicker">Worst losses</div>
          <div className="mm26-result-list">
            {toughestLosses.map((game) => {
              const opposingTeam = getTeamEntry(game.opp_id);

              return (
                <div key={`loss-${game.quad}-${game.opp_id}-${game.date_int}`} className="mm26-result-row">
                  <div className="mm26-result-main">
                    <strong>{opposingTeam?.short_name || `Team ${game.opp_id}`}</strong>
                    <span>Q{game.quad} loss</span>
                  </div>
                  <div className="mm26-result-meta">
                    <strong>{game.team_score}-{game.opp_score}</strong>
                    <span>{game.date_str} · {formatLocation(game.team_loc)}</span>
                  </div>
                </div>
              );
            })}
            {teamPage && !toughestLosses.length ? <p className="mm26-empty">No losses are listed in the published team page yet.</p> : null}
            {!teamPage ? <p className="mm26-empty">Loading game log...</p> : null}
          </div>
        </div>
      </section>
    </MM2026Shell>
  );
};

export default TeamInsights;