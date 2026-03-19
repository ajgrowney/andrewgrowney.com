import React, { useEffect, useMemo, useState } from 'react';
import MM2026Shell from './Shell';
import { useMM2026StatExplorer } from '../../../../Data/mm2026/dataClient';

const ALL_REGIONS_KEY = 'ALL';
const DEFAULT_FEATURE_KEY = 'AdjOE_mean';
const BRACKET_STAGE_HEIGHT = 320;

const BRACKET_STAGE_LAYOUT = {
  round64: { slotCount: 32, slotHeight: 8, columnWidth: 132 },
  round32: { slotCount: 16, slotHeight: 12, columnWidth: 126 },
  sweet16: { slotCount: 8, slotHeight: 18, columnWidth: 116 },
  elite8: { slotCount: 4, slotHeight: 34, columnWidth: 110, slotPositions: [0.05, 0.32, 0.6, 0.87] },
  final4: { slotCount: 2, slotHeight: 38, columnWidth: 104, slotPositions: [0.18, 0.72] },
  championship: { slotCount: 1, slotHeight: 48, columnWidth: 118 },
  champion: { slotCount: 1, slotHeight: 12, columnWidth: 92 }
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const areRangesEqual = (leftRange = [], rightRange = []) => (
  leftRange[0] === rightRange[0] && leftRange[1] === rightRange[1]
);

const quantile = (sortedValues, ratio) => {
  if (!sortedValues.length) {
    return null;
  }

  const boundedRatio = clamp(ratio, 0, 1);
  const position = (sortedValues.length - 1) * boundedRatio;
  const lowerIndex = Math.floor(position);
  const upperIndex = Math.ceil(position);

  if (lowerIndex === upperIndex) {
    return sortedValues[lowerIndex];
  }

  const lowerValue = sortedValues[lowerIndex];
  const upperValue = sortedValues[upperIndex];
  return lowerValue + ((upperValue - lowerValue) * (position - lowerIndex));
};

const summarizeValues = (values) => {
  const sortedValues = values.filter(Number.isFinite).sort((left, right) => left - right);
  if (!sortedValues.length) {
    return null;
  }

  const count = sortedValues.length;
  const mean = sortedValues.reduce((sum, value) => sum + value, 0) / count;
  const variance = sortedValues.reduce((sum, value) => sum + ((value - mean) ** 2), 0) / count;

  return {
    count,
    min: sortedValues[0],
    p10: quantile(sortedValues, 0.1),
    q1: quantile(sortedValues, 0.25),
    median: quantile(sortedValues, 0.5),
    q3: quantile(sortedValues, 0.75),
    p90: quantile(sortedValues, 0.9),
    max: sortedValues[sortedValues.length - 1],
    mean,
    std: Math.sqrt(variance)
  };
};

const summarizeFeatureRows = (rows, roundBuckets, yearRange) => {
  const [minYear, maxYear] = yearRange;
  const bucketRows = rows.reduce((acc, row) => {
    if (!Number.isFinite(row?.value) || row.season < minYear || row.season > maxYear) {
      return acc;
    }

    const bucketKey = row.bucket;
    if (!acc[bucketKey]) {
      acc[bucketKey] = [];
    }
    acc[bucketKey].push(row.value);
    return acc;
  }, {});

  return roundBuckets.reduce((acc, bucket) => {
    const summary = summarizeValues(bucketRows[bucket.key] || []);
    if (summary) {
      acc[bucket.key] = summary;
    }
    return acc;
  }, {});
};

const buildYearOptions = (allowedRange = []) => {
  const [minYear, maxYear] = allowedRange;
  if (!Number.isFinite(minYear) || !Number.isFinite(maxYear) || minYear > maxYear) {
    return [];
  }

  return Array.from({ length: (maxYear - minYear) + 1 }, (_, index) => minYear + index);
};

const formatMetaCount = (value) => Number(value || 0).toLocaleString();

const buildFieldDomain = (teams, featureKey) => {
  const values = teams
    .map((team) => team.stats?.[featureKey])
    .filter(Number.isFinite);

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

const buildBracketSlotLayout = (slotCount, slotHeight, stageHeight = BRACKET_STAGE_HEIGHT, slotPositions = null) => {
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

const buildOverlayOffset = (teamId, maxOffset) => {
  const normalizedTeamId = Number(teamId) || 0;
  const seed = (normalizedTeamId * 2654435761) % 997;
  const ratio = seed / 996;
  return ((ratio * 2) - 1) * maxOffset;
};

const BracketDistributionColumn = ({
  bucket,
  stageIndex,
  summary,
  formatter,
  domain,
  selectedValue,
  overlayEntries,
  focusedTeamId,
  onHoverTeam
}) => {
  const stageLayout = BRACKET_STAGE_LAYOUT[bucket.key] || {
    slotCount: Math.max(1, Math.round(32 / (2 ** stageIndex))),
    slotHeight: 16,
    columnWidth: 100
  };
  const width = stageLayout.columnWidth;
  const height = BRACKET_STAGE_HEIGHT;
  const centerX = width / 2;
  const plotTop = 18;
  const plotBottom = height - 22;
  const plotHeight = plotBottom - plotTop;
  const boxWidth = Math.min(38, Math.max(width - 36, 18));
  const selectedMarkerWidth = Math.min(52, Math.max(width - 28, 24));
  const whiskerCapWidth = Math.min(32, Math.max(width - 44, 14));
  const meanOffsetX = 0;
  const overlayMaxOffset = Math.max((width - boxWidth) / 2, 10);
  const slotLayout = buildBracketSlotLayout(stageLayout.slotCount, stageLayout.slotHeight, height, stageLayout.slotPositions);
  const scaleY = (value) => {
    const ratio = (value - domain.min) / domain.span;
    return plotBottom - (clamp(ratio, 0, 1) * plotHeight);
  };

  return (
    <article
      className={`mm26-explorer-stage mm26-explorer-stage--${bucket.key}`.trim()}
      style={{ '--mm26-stage-width': `${width}px` }}
    >
      <header className="mm26-explorer-stage-header">
        <strong>{bucket.label}</strong>
      </header>
      <div className="mm26-explorer-stage-canvas" style={{ height: `${height}px` }}>
        <div className="mm26-explorer-stage-slots" aria-hidden="true">
          {slotLayout.map((slot, index) => (
            <div
              key={`${bucket.key}-slot-${index}`}
              className="mm26-explorer-stage-slot"
              style={{ top: `${slot.top}px`, height: `${slot.height}px` }}
            />
          ))}
        </div>

        {summary ? (() => {
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
          const focusedOverlayEntry = overlayEntries.find((entry) => entry.teamId === focusedTeamId) || null;
          const focusedOverlayY = focusedOverlayEntry ? scaleY(focusedOverlayEntry.value) : null;

          return (
            <svg viewBox={`0 0 ${width} ${height}`} className="mm26-explorer-stage-plot" role="img" aria-label={`${bucket.label} distribution`}>
              <line x1={centerX} y1={minY} x2={centerX} y2={maxY} className="mm26-explorer-plot-line" />
              <line x1={centerX} y1={p10Y} x2={centerX} y2={p90Y} className="mm26-explorer-plot-line mm26-explorer-plot-line--emphasis" />
              <line x1={centerX - (whiskerCapWidth / 2)} y1={minY} x2={centerX + (whiskerCapWidth / 2)} y2={minY} className="mm26-explorer-plot-line mm26-explorer-plot-line--emphasis" />
              <line x1={centerX - (whiskerCapWidth / 2)} y1={maxY} x2={centerX + (whiskerCapWidth / 2)} y2={maxY} className="mm26-explorer-plot-line mm26-explorer-plot-line--emphasis" />
              <rect x={centerX - (boxWidth / 2)} y={boxTop} width={boxWidth} height={boxHeight} rx="10" className="mm26-explorer-plot-box" />
              <line x1={centerX - (boxWidth / 2)} y1={medianY} x2={centerX + (boxWidth / 2)} y2={medianY} className="mm26-explorer-plot-median" />
              <circle cx={centerX + meanOffsetX} cy={meanY} r="5.5" className="mm26-explorer-plot-mean" />
              {overlayEntries.length ? (
                <g className="mm26-explorer-plot-overlay-group">
                  {overlayEntries.map((entry) => {
                    const isFocused = entry.teamId === focusedTeamId;
                    const overlayY = scaleY(entry.value);
                    const overlayX = centerX + buildOverlayOffset(entry.teamId, overlayMaxOffset);

                    return (
                      <circle
                        key={`${bucket.key}-${entry.teamId}`}
                        cx={overlayX}
                        cy={overlayY}
                        r={isFocused ? 5.25 : 3.25}
                        className={`mm26-explorer-plot-overlay-point${isFocused ? ' is-focused' : ''}`}
                        onMouseEnter={() => onHoverTeam?.(entry.teamId)}
                        onMouseLeave={() => onHoverTeam?.(null)}
                      >
                        <title>{`${entry.team.short_name}: ${formatter(entry.value)}`}</title>
                      </circle>
                    );
                  })}
                </g>
              ) : null}
              {focusedOverlayY !== null ? (
                <>
                  <line x1={centerX - (selectedMarkerWidth / 2)} y1={focusedOverlayY} x2={centerX + (selectedMarkerWidth / 2)} y2={focusedOverlayY} className="mm26-explorer-plot-selected-line" />
                  <circle cx={centerX} cy={focusedOverlayY} r="6" className="mm26-explorer-plot-selected" />
                </>
              ) : null}
              {selectedY !== null ? (
                <>
                  <line x1={centerX - (selectedMarkerWidth / 2)} y1={selectedY} x2={centerX + (selectedMarkerWidth / 2)} y2={selectedY} className="mm26-explorer-plot-selected-line" />
                  <circle cx={centerX} cy={selectedY} r="6" className="mm26-explorer-plot-selected" />
                </>
              ) : null}
            </svg>
          );
        })() : <div className="mm26-explorer-stage-empty">No data</div>}
      </div>
      <div className="mm26-explorer-stage-meta">
        {summary ? (
          <>
            <span>{formatMetaCount(summary.count)} teams</span>
            <span>Median {formatter(summary.median)}</span>
          </>
        ) : <span>No historical rows in range</span>}
      </div>
    </article>
  );
};

const StatExplorer = () => {
  const {
    error,
    explorer,
    featureDefinitions,
    featureStore,
    loading,
    modelsManifest
  } = useMM2026StatExplorer();

  const allTeams = useMemo(() => {
    if (!explorer?.current_field?.teams?.length) {
      return [];
    }

    return explorer.current_field.teams.map((team) => ({
      ...team,
      stats: featureStore?.teams?.[String(team.team_id)] || team.stats || {}
    }));
  }, [explorer, featureStore]);

  const defaultFeature = useMemo(() => {
    if (!featureDefinitions.length) {
      return null;
    }

    return featureDefinitions.find((feature) => feature.key === DEFAULT_FEATURE_KEY) || featureDefinitions[0];
  }, [featureDefinitions]);

  const [selectedFeatureKey, setSelectedFeatureKey] = useState(DEFAULT_FEATURE_KEY);
  const [selectedRegionKey, setSelectedRegionKey] = useState(ALL_REGIONS_KEY);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [hoveredTeamId, setHoveredTeamId] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [historicalRange, setHistoricalRange] = useState([2003, 2025]);

  useEffect(() => {
    if (!defaultFeature) {
      return;
    }

    setSelectedFeatureKey((current) => current || defaultFeature.key);
    setSelectedGroup((current) => current || defaultFeature.category);
  }, [defaultFeature]);

  useEffect(() => {
    if (!explorer?.filters?.historical_range_default?.length) {
      return;
    }

    setHistoricalRange((current) => {
      if (current?.length === 2 && Number.isFinite(current[0]) && Number.isFinite(current[1])) {
        return current;
      }
      return explorer.filters.historical_range_default;
    });
  }, [explorer]);

  const selectedFeatureDefinition = useMemo(() => (
    featureDefinitions.find((feature) => feature.key === selectedFeatureKey) || defaultFeature
  ), [defaultFeature, featureDefinitions, selectedFeatureKey]);

  useEffect(() => {
    if (!selectedFeatureDefinition) {
      return;
    }

    setSelectedFeatureKey(selectedFeatureDefinition.key);
    setSelectedGroup(selectedFeatureDefinition.category);
  }, [selectedFeatureDefinition]);

  const featureGroups = useMemo(() => {
    if (!explorer?.feature_groups) {
      return [];
    }

    return Object.entries(explorer.feature_groups).map(([groupName, featureKeys]) => ({
      name: groupName,
      features: (featureKeys || [])
        .map((featureKey) => featureDefinitions.find((feature) => feature.key === featureKey))
        .filter(Boolean)
    }));
  }, [explorer, featureDefinitions]);

  const selectedGroupEntry = featureGroups.find((group) => group.name === selectedGroup) || featureGroups[0] || null;

  const regionOptions = explorer?.filters?.regions || [];
  const filteredTeams = useMemo(() => {
    if (!allTeams.length) {
      return [];
    }

    return selectedRegionKey === ALL_REGIONS_KEY
      ? allTeams
      : allTeams.filter((team) => team.region_key === selectedRegionKey);
  }, [allTeams, selectedRegionKey]);

  useEffect(() => {
    if (!filteredTeams.length || selectedTeamId === null) {
      return;
    }

    const containsSelectedTeam = filteredTeams.some((team) => team.team_id === selectedTeamId);
    if (!containsSelectedTeam) {
      setSelectedTeamId(null);
    }
  }, [filteredTeams, selectedTeamId]);

  useEffect(() => {
    if (hoveredTeamId === null) {
      return;
    }

    const containsHoveredTeam = filteredTeams.some((team) => team.team_id === hoveredTeamId);
    if (!containsHoveredTeam) {
      setHoveredTeamId(null);
    }
  }, [filteredTeams, hoveredTeamId]);

  const sortedTeams = useMemo(() => {
    const higherIsBetter = selectedFeatureDefinition?.higherIsBetter !== false;

    return [...filteredTeams]
      .filter((team) => Number.isFinite(team.stats?.[selectedFeatureKey]))
      .sort((leftTeam, rightTeam) => {
        const leftValue = leftTeam.stats?.[selectedFeatureKey];
        const rightValue = rightTeam.stats?.[selectedFeatureKey];

        if (higherIsBetter) {
          return rightValue - leftValue || leftTeam.short_name.localeCompare(rightTeam.short_name);
        }

        return leftValue - rightValue || leftTeam.short_name.localeCompare(rightTeam.short_name);
      });
  }, [filteredTeams, selectedFeatureDefinition, selectedFeatureKey]);

  const selectedTeam = useMemo(() => {
    if (!allTeams.length || selectedTeamId === null) {
      return null;
    }

    return allTeams.find((team) => team.team_id === selectedTeamId) || null;
  }, [allTeams, selectedTeamId]);

  const selectedTeamValue = selectedTeam?.stats?.[selectedFeatureKey] ?? null;
  const overlayEntries = useMemo(() => (
    sortedTeams
      .map((team) => ({
        teamId: team.team_id,
        team,
        value: team.stats?.[selectedFeatureKey]
      }))
      .filter((entry) => Number.isFinite(entry.value))
  ), [selectedFeatureKey, sortedTeams]);
  const focusedTeam = useMemo(() => {
    if (hoveredTeamId !== null) {
      return allTeams.find((team) => team.team_id === hoveredTeamId) || null;
    }

    return selectedTeam;
  }, [allTeams, hoveredTeamId, selectedTeam]);
  const focusedTeamValue = focusedTeam?.stats?.[selectedFeatureKey] ?? null;
  const fieldDomain = useMemo(() => buildFieldDomain(sortedTeams, selectedFeatureKey), [selectedFeatureKey, sortedTeams]);
  const allowedYears = useMemo(() => buildYearOptions(explorer?.filters?.historical_range_allowed), [explorer]);
  const activeYearRange = useMemo(() => {
    if (!historicalRange?.length) {
      return explorer?.filters?.historical_range_default || [2003, 2025];
    }
    return historicalRange;
  }, [explorer, historicalRange]);

  const featureRows = explorer?.historical_distributions?.[selectedFeatureKey] || [];
  const isDefaultRange = areRangesEqual(activeYearRange, explorer?.filters?.historical_range_default || []);
  const bucketSummaries = useMemo(() => {
    if (!explorer?.round_buckets?.length) {
      return {};
    }

    if (isDefaultRange) {
      return explorer?.historical_summary?.[selectedFeatureKey] || {};
    }

    return summarizeFeatureRows(featureRows, explorer.round_buckets, activeYearRange);
  }, [activeYearRange, explorer, featureRows, isDefaultRange, selectedFeatureKey]);

  const summaryDomain = useMemo(() => {
    const values = Object.values(bucketSummaries || {}).flatMap((summary) => (
      summary ? [summary.min, summary.max] : []
    ));
    overlayEntries.forEach((entry) => values.push(entry.value));

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
  }, [bucketSummaries, overlayEntries]);

  const compatibleModels = useMemo(() => (
    (modelsManifest?.models || []).filter((model) => model.feature_set === explorer?.feature_set)
  ), [explorer, modelsManifest]);

  const featureFormatter = selectedFeatureDefinition?.formatter || ((value) => String(value));

  if (loading || !explorer || !selectedFeatureDefinition) {
    return (
      <MM2026Shell>
        <section className="mm26-panel">
          <p className="mm26-note">Loading the 2026 stat explorer artifacts...</p>
        </section>
      </MM2026Shell>
    );
  }

  if (error) {
    return (
      <MM2026Shell>
        <section className="mm26-panel">
          <p className="mm26-note">Could not load the published stat explorer artifacts: {error.message}</p>
        </section>
      </MM2026Shell>
    );
  }

  return (
    <MM2026Shell>
      <section className="mm26-panel mm26-explorer-hero">
        <div className="mm26-kicker">Stat Explorer</div>
        <h1 className="mm26-explorer-title">The 2026 Field vs History</h1>
        <p>
          Compare the live 2026 tournament field against published historical cohorts, then recompute the finish distributions in the browser when you tighten the year window.
        </p>
      </section>

      <section className="mm26-panel mm26-explorer-controls">
        <div className="mm26-explorer-toolbar-grid">
          <div className="mm26-explorer-toolbar-block">
            <div className="mm26-kicker">2026 Teams</div>
            <h3>{selectedRegionKey === ALL_REGIONS_KEY ? 'Full field' : regionOptions.find((region) => region.key === selectedRegionKey)?.label || 'Region'}</h3>
            <div className="mm26-chip-group">
              <button
                type="button"
                className={`mm26-chip ${selectedRegionKey === ALL_REGIONS_KEY ? 'is-active' : ''}`.trim()}
                onClick={() => setSelectedRegionKey(ALL_REGIONS_KEY)}
              >
                All
              </button>
              {regionOptions.map((region) => (
                <button
                  key={region.key}
                  type="button"
                  className={`mm26-chip ${selectedRegionKey === region.key ? 'is-active' : ''}`.trim()}
                  onClick={() => setSelectedRegionKey(region.key)}
                >
                  {region.label}
                </button>
              ))}
            </div>
            <select className="mm26-select" value={selectedTeamId || ''} onChange={(event) => setSelectedTeamId(event.target.value ? Number(event.target.value) : null)}>
              <option value="">All visible teams</option>
              {sortedTeams.map((team) => (
                <option key={team.team_id} value={team.team_id}>{team.short_name}</option>
              ))}
            </select>
          </div>

          <div className="mm26-explorer-toolbar-block">
            <div className="mm26-kicker">Stat</div>
            <h3>{selectedFeatureDefinition.label}</h3>
            <div className="mm26-chip-group">
              {featureGroups.map((group) => (
                <button
                  key={group.name}
                  type="button"
                  className={`mm26-chip ${selectedGroupEntry?.name === group.name ? 'is-active' : ''}`.trim()}
                  onClick={() => {
                    setSelectedGroup(group.name);
                    if (group.features[0]) {
                      setSelectedFeatureKey(group.features[0].key);
                    }
                  }}
                >
                  {group.name}
                </button>
              ))}
            </div>
            <select className="mm26-select" value={selectedFeatureKey} onChange={(event) => setSelectedFeatureKey(event.target.value)}>
              {featureDefinitions.map((feature) => (
                <option key={feature.key} value={feature.key}>{feature.label}</option>
              ))}
            </select>
          </div>

          <div className="mm26-explorer-toolbar-block">
            <div className="mm26-kicker">Historical Finishes</div>
            <h3>{activeYearRange[0]} to {activeYearRange[1]}</h3>
            <div className="mm26-explorer-range-row">
              <select
                className="mm26-select"
                value={activeYearRange[0]}
                onChange={(event) => {
                  const nextMinYear = Number(event.target.value);
                  setHistoricalRange(([currentMinYear, currentMaxYear]) => [nextMinYear, Math.max(nextMinYear, currentMaxYear)]);
                }}
              >
                {allowedYears.map((year) => (
                  <option key={`min-${year}`} value={year}>{year}</option>
                ))}
              </select>
              <select
                className="mm26-select"
                value={activeYearRange[1]}
                onChange={(event) => {
                  const nextMaxYear = Number(event.target.value);
                  setHistoricalRange(([currentMinYear]) => [Math.min(currentMinYear, nextMaxYear), nextMaxYear]);
                }}
              >
                {allowedYears.map((year) => (
                  <option key={`max-${year}`} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="mm26-explorer-layout">
        <aside className="mm26-panel mm26-explorer-field-panel">
          <div className="mm26-kicker">Ranks</div>
          <h3>{selectedFeatureDefinition.label}</h3>
          <p>{sortedTeams.length} tournament teams in scope. Leave the selector on All visible teams to overlay the whole group, or click any team to pin it across each finish bucket.</p>
          <div className="mm26-explorer-rank-list">
            {sortedTeams.map((team, index) => {
              const value = team.stats?.[selectedFeatureKey];
              const ratio = (value - fieldDomain.min) / fieldDomain.span;
              const isSelected = team.team_id === selectedTeam?.team_id;
              const isFocused = team.team_id === focusedTeam?.team_id;
              return (
                <button
                  key={team.team_id}
                  type="button"
                  className={`mm26-explorer-rank-row ${isSelected ? 'is-active' : ''} ${isFocused ? 'is-focused' : ''}`.trim()}
                  onClick={() => setSelectedTeamId((current) => (current === team.team_id ? null : team.team_id))}
                  onMouseEnter={() => setHoveredTeamId(team.team_id)}
                  onMouseLeave={() => setHoveredTeamId(null)}
                >
                  <div className="mm26-explorer-rank-copy">
                    <strong>{index + 1}. {team.short_name}</strong>
                    <span>{team.seed ? `${team.seed} seed • ${team.region}` : team.region}</span>
                  </div>
                  <div className="mm26-explorer-rank-meter">
                    <div className="mm26-explorer-rank-track" />
                    <div className="mm26-explorer-rank-dot" style={{ left: `${clamp(ratio, 0, 1) * 100}%` }} />
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="mm26-panel mm26-explorer-results-panel">
          <div className="mm26-explorer-results-header">
            <div className="mm26-explorer-results-callout">
              <span className="mm26-label">{selectedTeam ? 'Selected team' : focusedTeam ? 'Focused team' : 'Visible group'}</span>
              <strong>{selectedTeam?.short_name || focusedTeam?.short_name || `${sortedTeams.length} teams`}</strong>
              <span>
                {Number.isFinite(selectedTeamValue)
                  ? featureFormatter(selectedTeamValue)
                  : Number.isFinite(focusedTeamValue)
                    ? featureFormatter(focusedTeamValue)
                    : 'Overlayed across each bucket'}
              </span>
            </div>
            <div className="mm26-explorer-results-title-block">
              <div className="mm26-kicker">Historical Finishes</div>
              <h3 className="mm26-explorer-results-vs-copy">
                <span>vs</span>
                <strong>{selectedFeatureDefinition.label}</strong>
              </h3>
            </div>
          </div>

          <div className="mm26-explorer-bracket-board">
            <div className="mm26-explorer-bracket-track">
              {explorer.round_buckets.map((bucket, stageIndex) => (
                <BracketDistributionColumn
                key={bucket.key}
                bucket={bucket}
                stageIndex={stageIndex}
                summary={bucketSummaries?.[bucket.key] || null}
                formatter={featureFormatter}
                domain={summaryDomain}
                selectedValue={selectedTeamValue}
                overlayEntries={selectedTeam ? [] : overlayEntries}
                focusedTeamId={!selectedTeam && focusedTeam ? focusedTeam.team_id : null}
                onHoverTeam={selectedTeam ? undefined : setHoveredTeamId}
              />
              ))}
            </div>
          </div>
        </section>
      </section>
    </MM2026Shell>
  );
};

export default StatExplorer;