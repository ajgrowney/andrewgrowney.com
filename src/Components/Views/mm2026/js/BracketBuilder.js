import React, { useMemo, useState } from 'react';
import MM2026Shell from './Shell';
import { useMM2026Data } from '../../../../Data/mm2026/dataClient';
const slotWidth = 240;
const slotHeight = 150;
const treeRoundGap = 58;
const treeSlotGap = 52;
const stackSlotGap = 76;

const formatProbability = (value) => `${(value * 100).toFixed(1)}%`;
const average = (values) => values.reduce((sum, value) => sum + value, 0) / values.length;

const getSourceSlotIds = (slot) => [slot.team_1, slot.team_2]
  .filter((teamRef) => teamRef.source === 'winner')
  .map((teamRef) => teamRef.source_slot);

const compareSlotIds = (slotIdA, slotIdB) => slotIdA.localeCompare(slotIdB, undefined, { numeric: true });

const isPlayInSlot = (slot) => slot.round === 1 || slot.label === 'Play In';

const FIRST_ROUND_MATCHUP_ORDER = {
  '1-16': 0,
  '8-9': 1,
  '5-12': 2,
  '4-13': 3,
  '6-11': 4,
  '3-14': 5,
  '7-10': 6,
  '2-15': 7
};

const PLAY_IN_SEED_PATTERN = /^[A-Z]+(\d{1,2})$/;

const buildSlotDisplayOrderLookup = (slots) => {
  const slotLookup = slots.reduce((acc, slot) => {
    acc[slot.slot] = slot;
    return acc;
  }, {});
  const displayOrderCache = new Map();

  const getTeamRefSeed = (teamRef) => {
    if (!teamRef) {
      return null;
    }

    if (Number.isFinite(teamRef.seed)) {
      return Number(teamRef.seed);
    }

    if (teamRef.source === 'winner' && teamRef.source_slot) {
      const sourceSlot = slotLookup[teamRef.source_slot];
      if (!sourceSlot) {
        const playInSeedMatch = String(teamRef.source_slot).match(PLAY_IN_SEED_PATTERN);
        return playInSeedMatch ? Number(playInSeedMatch[1]) : null;
      }

      const sourceSeeds = [getTeamRefSeed(sourceSlot.team_1), getTeamRefSeed(sourceSlot.team_2)]
        .filter(Number.isFinite);

      if (!sourceSeeds.length) {
        return null;
      }

      return Math.min(...sourceSeeds);
    }

    return null;
  };

  const getTeamRefDisplayOrder = (teamRef) => {
    if (!teamRef) {
      return Number.MAX_SAFE_INTEGER;
    }

    if (teamRef.source === 'winner' && teamRef.source_slot) {
      return getSlotDisplayOrder(teamRef.source_slot);
    }

    if (Number.isFinite(teamRef.seed)) {
      return Number(teamRef.seed);
    }

    return Number.MAX_SAFE_INTEGER;
  };

  const getSlotDisplayOrder = (slotId) => {
    if (displayOrderCache.has(slotId)) {
      return displayOrderCache.get(slotId);
    }

    const slot = slotLookup[slotId];
    if (!slot) {
      const playInSeedMatch = String(slotId).match(PLAY_IN_SEED_PATTERN);
      const fallbackValue = playInSeedMatch ? Number(playInSeedMatch[1]) : Number.MAX_SAFE_INTEGER;
      displayOrderCache.set(slotId, fallbackValue);
      return fallbackValue;
    }

    const hasSeedSources = slot.team_1?.source === 'seed' && slot.team_2?.source === 'seed';
    const matchupSeeds = [getTeamRefSeed(slot.team_1), getTeamRefSeed(slot.team_2)]
      .filter(Number.isFinite)
      .sort((a, b) => a - b);

    if (matchupSeeds.length === 2) {
      const matchupOrder = FIRST_ROUND_MATCHUP_ORDER[`${matchupSeeds[0]}-${matchupSeeds[1]}`];
      if (Number.isFinite(matchupOrder)) {
        displayOrderCache.set(slotId, matchupOrder);
        return matchupOrder;
      }
    }

    if (hasSeedSources) {
      const seeds = [slot.team_1.seed, slot.team_2.seed]
        .map(Number)
        .filter(Number.isFinite)
        .sort((a, b) => a - b);

      if (seeds.length === 2) {
        const matchupOrder = FIRST_ROUND_MATCHUP_ORDER[`${seeds[0]}-${seeds[1]}`];
        if (Number.isFinite(matchupOrder)) {
          displayOrderCache.set(slotId, matchupOrder);
          return matchupOrder;
        }
      }
    }

    const fallbackValue = Math.min(getTeamRefDisplayOrder(slot.team_1), getTeamRefDisplayOrder(slot.team_2));
    displayOrderCache.set(slotId, fallbackValue);
    return fallbackValue;
  };

  return Object.keys(slotLookup).reduce((acc, slotId) => {
    acc[slotId] = getSlotDisplayOrder(slotId);
    return acc;
  }, {});
};

const getOrderedTeamRefs = (slot, slotDisplayOrderLookup) => {
  if (!slot) {
    return [null, null];
  }

  const teamRefs = [slot.team_1, slot.team_2];
  const resolveDisplayOrder = (teamRef) => {
    if (!teamRef) {
      return Number.MAX_SAFE_INTEGER;
    }

    if (teamRef.source === 'winner' && teamRef.source_slot) {
      return slotDisplayOrderLookup[teamRef.source_slot] ?? Number.MAX_SAFE_INTEGER;
    }

    if (Number.isFinite(teamRef.seed)) {
      return Number(teamRef.seed);
    }

    return Number.MAX_SAFE_INTEGER;
  };

  return [...teamRefs].sort((teamRefA, teamRefB) => {
    const orderA = resolveDisplayOrder(teamRefA);
    const orderB = resolveDisplayOrder(teamRefB);

    if (orderA !== orderB) {
      return orderA - orderB;
    }

    return 0;
  });
};

const getDisplaySlotParticipants = (slot, picks, slotDisplayOrderLookup) => {
  const [topTeamRef, bottomTeamRef] = getOrderedTeamRefs(slot, slotDisplayOrderLookup);
  const resolveTeamId = (teamRef) => {
    if (!teamRef) {
      return null;
    }

    if (teamRef.source === 'seed') {
      return teamRef.team_id ?? null;
    }

    if (teamRef.source === 'winner') {
      return picks[teamRef.source_slot] || null;
    }

    return null;
  };

  return {
    team1Id: resolveTeamId(topTeamRef),
    team2Id: resolveTeamId(bottomTeamRef)
  };
};

const buildSectionLayout = (slots, direction = 'ltr') => {
  const slotLookup = slots.reduce((acc, slot) => {
    acc[slot.slot] = slot;
    return acc;
  }, {});
  const rounds = [...new Set(slots.map((slot) => slot.round))].sort((a, b) => a - b);
  const baseRound = rounds[0];
  const topRound = rounds[rounds.length - 1];
  const xByRound = {};
  const yBySlot = {};

  const descendantCache = new Map();
  const getTeamRefSeed = (teamRef) => {
    if (!teamRef) {
      return null;
    }

    if (Number.isFinite(teamRef.seed)) {
      return Number(teamRef.seed);
    }

    if (teamRef.source === 'winner' && teamRef.source_slot) {
      const sourceSlot = slotLookup[teamRef.source_slot];
      if (!sourceSlot) {
        const playInSeedMatch = String(teamRef.source_slot).match(/^[A-Z]+(\d{1,2})$/);
        return playInSeedMatch ? Number(playInSeedMatch[1]) : null;
      }

      const sourceSeeds = [getTeamRefSeed(sourceSlot.team_1), getTeamRefSeed(sourceSlot.team_2)]
        .filter(Number.isFinite);

      if (!sourceSeeds.length) {
        return null;
      }

      return Math.min(...sourceSeeds);
    }

    return null;
  };

  const getFirstRoundMatchupOrder = (slot) => {
    const seeds = [getTeamRefSeed(slot.team_1), getTeamRefSeed(slot.team_2)]
      .filter(Number.isFinite)
      .sort((a, b) => a - b);

    if (seeds.length !== 2) {
      return Number.MAX_SAFE_INTEGER;
    }

    return FIRST_ROUND_MATCHUP_ORDER[`${seeds[0]}-${seeds[1]}`] ?? Number.MAX_SAFE_INTEGER;
  };

  const getBaseDescendants = (slotId) => {
    if (descendantCache.has(slotId)) {
      return descendantCache.get(slotId);
    }

    const slot = slotLookup[slotId];
    if (!slot) {
      descendantCache.set(slotId, []);
      return [];
    }

    const sourceSlotIds = getSourceSlotIds(slot);
    const descendants = slot.round === baseRound || sourceSlotIds.length === 0
      ? [slotId]
      : sourceSlotIds.flatMap((sourceSlotId) => getBaseDescendants(sourceSlotId));

    descendantCache.set(slotId, descendants);
    return descendants;
  };

  const rootSlots = slots
    .filter((slot) => slot.round === topRound)
    .sort((slotA, slotB) => compareSlotIds(slotA.slot, slotB.slot));

  const baseOrder = rootSlots.flatMap((slot) => getBaseDescendants(slot.slot));
  const baseOrderIndex = baseOrder.reduce((acc, slotId, index) => {
    if (acc[slotId] === undefined) {
      acc[slotId] = index;
    }
    return acc;
  }, {});

  const sortSlotsForRound = (round) => {
    const roundSlots = slots.filter((slot) => slot.round === round);
    return [...roundSlots].sort((slotA, slotB) => {
      if (round === baseRound) {
        const firstRoundOrderA = getFirstRoundMatchupOrder(slotA);
        const firstRoundOrderB = getFirstRoundMatchupOrder(slotB);

        if (firstRoundOrderA !== firstRoundOrderB) {
          return firstRoundOrderA - firstRoundOrderB;
        }
      }

      const orderA = Math.min(...getBaseDescendants(slotA.slot).map((slotId) => baseOrderIndex[slotId] ?? Number.MAX_SAFE_INTEGER));
      const orderB = Math.min(...getBaseDescendants(slotB.slot).map((slotId) => baseOrderIndex[slotId] ?? Number.MAX_SAFE_INTEGER));

      if (orderA !== orderB) {
        return orderA - orderB;
      }

      return compareSlotIds(slotA.slot, slotB.slot);
    });
  };

  rounds.forEach((round, roundIndex) => {
    const offset = roundIndex * (slotWidth + treeRoundGap);
    xByRound[round] = direction === 'rtl'
      ? (rounds.length - roundIndex - 1) * (slotWidth + treeRoundGap)
      : offset;
    const roundSlots = sortSlotsForRound(round);

    roundSlots.forEach((slot, slotIndex) => {
      if (round === baseRound) {
        yBySlot[slot.slot] = slotIndex * (slotHeight + treeSlotGap);
        return;
      }

      const sourcePositions = getSourceSlotIds(slot).map((sourceSlotId) => yBySlot[sourceSlotId] + slotHeight / 2);
      yBySlot[slot.slot] = average(sourcePositions) - slotHeight / 2;
    });
  });

  const connectors = slots.flatMap((slot) => getSourceSlotIds(slot).map((sourceSlotId) => {
    const sourceSlot = slotLookup[sourceSlotId];
    if (!sourceSlot) {
      return null;
    }
    const sourceRound = sourceSlot.round;
    const targetRound = slot.round;
    const isRightToLeft = direction === 'rtl';
    const x1 = isRightToLeft ? xByRound[sourceRound] : xByRound[sourceRound] + slotWidth;
    const y1 = yBySlot[sourceSlotId] + slotHeight / 2;
    const x2 = isRightToLeft ? xByRound[targetRound] + slotWidth : xByRound[targetRound];
    const y2 = yBySlot[slot.slot] + slotHeight / 2;
    const midX = x2 >= x1 ? x1 + treeRoundGap / 2 : x1 - treeRoundGap / 2;

    return {
      key: `${sourceSlotId}-${slot.slot}`,
      path: `M ${x1} ${y1} L ${midX} ${y1} L ${midX} ${y2} L ${x2} ${y2}`
    };
  })).filter(Boolean);

  const width = rounds.length * slotWidth + (rounds.length - 1) * treeRoundGap + 12;
  const height = Math.max(...slots.map((slot) => yBySlot[slot.slot] + slotHeight)) + 12;

  return { connectors, direction, height, width, xByRound, yBySlot };
};

const buildSingleColumnLayout = (slots, customSpacing = stackSlotGap * 1.6) => {
  const yBySlot = {};
  slots.forEach((slot, index) => {
    yBySlot[slot.slot] = index * (slotHeight + customSpacing);
  });

  return {
    connectors: [],
    height: Math.max(...slots.map((slot) => yBySlot[slot.slot] + slotHeight)) + 12,
    width: slotWidth + 12,
    xByRound: slots.reduce((acc, slot) => {
      acc[slot.round] = 0;
      return acc;
    }, {}),
    yBySlot
  };
};

const buildAlignedPlayInLayout = (slots, anchorLayout, anchorSlotIdByPlayInSlot = {}, customSpacing = stackSlotGap * 0.9) => {
  if (!slots.length) {
    return buildSingleColumnLayout(slots);
  }

  const yBySlot = {};
  const sortedSlots = [...slots].sort((slotA, slotB) => {
    const anchorA = anchorSlotIdByPlayInSlot[slotA.slot];
    const anchorB = anchorSlotIdByPlayInSlot[slotB.slot];
    const anchorAY = anchorA ? anchorLayout?.yBySlot?.[anchorA] : null;
    const anchorBY = anchorB ? anchorLayout?.yBySlot?.[anchorB] : null;

    if (Number.isFinite(anchorAY) && Number.isFinite(anchorBY) && anchorAY !== anchorBY) {
      return anchorAY - anchorBY;
    }

    return slotA.slot.localeCompare(slotB.slot, undefined, { numeric: true });
  });

  let previousBottom = Number.NEGATIVE_INFINITY;

  sortedSlots.forEach((slot, index) => {
    const anchorSlotId = anchorSlotIdByPlayInSlot[slot.slot] || null;
    const anchorY = anchorSlotId ? anchorLayout?.yBySlot?.[anchorSlotId] : null;
    const fallbackY = index * (slotHeight + customSpacing);
    const baseY = Number.isFinite(anchorY) ? anchorY : fallbackY;
    const resolvedY = Math.max(baseY, previousBottom === Number.NEGATIVE_INFINITY ? baseY : previousBottom + customSpacing);

    yBySlot[slot.slot] = resolvedY;
    previousBottom = resolvedY + slotHeight;
  });

  const ownHeight = Math.max(...sortedSlots.map((slot) => yBySlot[slot.slot] + slotHeight)) + 12;

  return {
    connectors: [],
    height: Math.max(anchorLayout?.height || 0, ownHeight),
    width: slotWidth + 12,
    xByRound: sortedSlots.reduce((acc, slot) => {
      acc[slot.round] = 0;
      return acc;
    }, {}),
    yBySlot
  };
};

const BracketSlotCard = ({
  slot,
  slotDisplayOrderLookup,
  selectedSlotId,
  selectedModelId,
  picks,
  pickSources,
  setSelectedSlotId,
  pickWinner,
  getPickSourceLabel,
  getSlotParticipants,
  getTeamEntry,
  predictMatchup
}) => {
  const { team1Id, team2Id } = getDisplaySlotParticipants(slot, picks, slotDisplayOrderLookup);
  const team1 = team1Id ? getTeamEntry(team1Id) : null;
  const team2 = team2Id ? getTeamEntry(team2Id) : null;
  const localPrediction = team1Id && team2Id ? predictMatchup(team1Id, team2Id, selectedModelId) : null;
  const pickedWinner = picks[slot.slot] ? getTeamEntry(picks[slot.slot]) : null;
  const pickSource = pickSources[slot.slot] || null;
  const pickSourceLabel = getPickSourceLabel(pickSource);
  const modelDisagrees = Boolean(pickedWinner && localPrediction && pickedWinner.team_id !== localPrediction.winnerId);

  const handlePickClick = (event, teamId) => {
    event.stopPropagation();
    pickWinner(slot.slot, teamId);
  };

  const handleInfoClick = (event) => {
    event.stopPropagation();
    setSelectedSlotId(slot.slot);
  };

  return (
    <div
      className={`mm26-slot mm26-bracket-slot-card${selectedSlotId === slot.slot ? ' is-selected' : ''}${modelDisagrees ? ' is-dirty' : ''}`}
    >
      <div className="mm26-slot-header">
        <span className="mm26-label">{slot.label}</span>
        <button
          type="button"
          className="mm26-slot-info-button"
          onClick={handleInfoClick}
          aria-label={`Open details for ${slot.label}`}
          title={`Open details for ${slot.label}`}
        >
          Info
          {/* <CiCircleInfo aria-hidden="true" /> */}
        </button>
      </div>
      {team1 ? (
        <button
          type="button"
          className={`mm26-team-line mm26-team-line--compact mm26-team-choice${pickedWinner?.team_id === team1.team_id ? ' is-picked' : ''}`}
          onClick={(event) => handlePickClick(event, team1.team_id)}
        >
          <span>{`(${team1.seed}) ${team1.short_name}`}</span>
          <strong>{localPrediction ? formatProbability(localPrediction.teamAProbability) : '--'}</strong>
        </button>
      ) : (
        <div className="mm26-team-line mm26-team-line--compact">
          <span>TBD</span>
          <strong>--</strong>
        </div>
      )}
      {team2 ? (
        <button
          type="button"
          className={`mm26-team-line mm26-team-line--compact mm26-team-choice${pickedWinner?.team_id === team2.team_id ? ' is-picked' : ''}`}
          onClick={(event) => handlePickClick(event, team2.team_id)}
        >
          <span>{`(${team2.seed}) ${team2.short_name}`}</span>
          <strong>{localPrediction ? formatProbability(localPrediction.teamBProbability) : '--'}</strong>
        </button>
      ) : (
        <div className="mm26-team-line mm26-team-line--compact">
          <span>TBD</span>
          <strong>--</strong>
        </div>
      )}
      <div className="mm26-pick-meta">
        {pickedWinner && pickSourceLabel ? <span className="mm26-pick-pill">{pickSourceLabel}</span> : null}
        {pickedWinner && modelDisagrees ? <span className="mm26-pick-pill mm26-pick-pill--dirty">Model differs</span> : null}
      </div>
    </div>
  );
};

const BracketSection = ({
  title,
  subtitle,
  slots,
  slotDisplayOrderLookup,
  selectedSlotId,
  selectedModelId,
  picks,
  pickSources,
  setSelectedSlotId,
  pickWinner,
  getPickSourceLabel,
  getSlotParticipants,
  getTeamEntry,
  predictMatchup,
  layoutMode = 'tree',
  layout = null,
  direction = 'ltr',
  className = ''
}) => {
  const resolvedLayout = useMemo(
    () => layout || (layoutMode === 'stack' ? buildSingleColumnLayout(slots) : buildSectionLayout(slots, direction)),
    [direction, layout, layoutMode, slots]
  );

  return (
    <section className={`mm26-bracket-section${className ? ` ${className}` : ''}`}>
      <div className="mm26-region-header">
        <h3>{title}</h3>
        <span className="mm26-label">{subtitle}</span>
      </div>
      <div className="mm26-bracket-canvas" style={{ width: resolvedLayout.width, height: resolvedLayout.height }}>
        <svg className="mm26-bracket-lines" width={resolvedLayout.width} height={resolvedLayout.height} viewBox={`0 0 ${resolvedLayout.width} ${resolvedLayout.height}`} aria-hidden="true">
          {resolvedLayout.connectors.map((connector) => (
            <path key={connector.key} d={connector.path} className="mm26-bracket-path" />
          ))}
        </svg>
        {slots.map((slot) => (
          <div
            key={slot.slot}
            className="mm26-bracket-slot-wrap"
            style={{ left: resolvedLayout.xByRound[slot.round], top: resolvedLayout.yBySlot[slot.slot], width: slotWidth, height: slotHeight }}
          >
            <BracketSlotCard
              slot={slot}
              slotDisplayOrderLookup={slotDisplayOrderLookup}
              selectedSlotId={selectedSlotId}
              selectedModelId={selectedModelId}
              picks={picks}
              pickSources={pickSources}
              setSelectedSlotId={setSelectedSlotId}
              pickWinner={pickWinner}
              getPickSourceLabel={getPickSourceLabel}
              getSlotParticipants={getSlotParticipants}
              getTeamEntry={getTeamEntry}
              predictMatchup={predictMatchup}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

const BracketBuilder = () => {
  const {
    activeModelId = null,
    bracketDefinition = null,
    error,
    featureDefinitions = [],
    fillSlotThrough = (slotId, picks = {}) => picks,
    getFeatureRankingsForTeams = () => [],
    getRegionLabel = (region) => region,
    getSlot = () => null,
    getSlotProbabilityBreakdown = () => ({ participantProbabilities: [], winnerProbabilities: [] }),
    getSlotParticipants = () => ({ team1Id: null, team2Id: null }),
    getTeamEntry = () => null,
    loading,
    modelsManifest = { default_model_id: 'seed-only', models: [] },
    predictMatchup = () => null,
    setActiveModelId = () => null
  } = useMM2026Data();
  const [selectedFeatureKey, setSelectedFeatureKey] = useState('AdjOE_mean');
  const [picks, setPicks] = useState({});
  const [pickSources, setPickSources] = useState({});
  const [selectedSlotId, setSelectedSlotId] = useState(null);

  const modelOptions = modelsManifest.models || [];
  const modelIds = useMemo(() => new Set(modelOptions.map((model) => model.id)), [modelOptions]);
  const selectedModelId = useMemo(() => {
    if (activeModelId && modelIds.has(activeModelId)) {
      return activeModelId;
    }

    if (modelIds.has(modelsManifest.default_model_id)) {
      return modelsManifest.default_model_id;
    }

    return modelOptions[0]?.id || 'seed-only';
  }, [activeModelId, modelIds, modelOptions, modelsManifest.default_model_id]);
  const modelNameById = useMemo(
    () => modelOptions.reduce((acc, model) => {
      acc[model.id] = model.name;
      return acc;
    }, {}),
    [modelOptions]
  );
  const regionOrder = useMemo(
    () => (bracketDefinition?.regions || []).filter((region) => !['Final Four', 'Championship'].includes(region)),
    [bracketDefinition]
  );

  const downstreamSlotMap = useMemo(() => {
    if (!bracketDefinition) {
      return {};
    }

    return bracketDefinition.slots.reduce((acc, slot) => {
      getSourceSlotIds(slot).forEach((sourceSlotId) => {
        acc[sourceSlotId] = acc[sourceSlotId] || [];
        acc[sourceSlotId].push(slot.slot);
      });
      return acc;
    }, {});
  }, [bracketDefinition]);

  const slotDisplayOrderLookup = useMemo(() => {
    if (!bracketDefinition) {
      return {};
    }

    return buildSlotDisplayOrderLookup(bracketDefinition.slots);
  }, [bracketDefinition]);

  const regionSections = useMemo(
    () => regionOrder.map((region) => {
      const allRegionSlots = bracketDefinition.slots
        .filter((slot) => slot.region === region)
        .sort((slotA, slotB) => slotA.round - slotB.round || slotA.slot.localeCompare(slotB.slot));

      const slots = allRegionSlots.filter((slot) => !isPlayInSlot(slot));

      const firstRoundCount = slots.filter((slot) => slot.label === 'First Round').length;
      const playInCount = allRegionSlots.filter((slot) => isPlayInSlot(slot)).length;

      return {
        key: region,
        title: getRegionLabel(region),
        subtitle: playInCount ? `${firstRoundCount} first-round games + ${playInCount} play-in` : `${firstRoundCount} first-round games`,
        slots
      };
    }),
    [bracketDefinition, getRegionLabel, regionOrder]
  );

  const playInSlots = useMemo(() => {
    if (!bracketDefinition) {
      return [];
    }

    return bracketDefinition.slots
      .filter((slot) => isPlayInSlot(slot))
      .sort((slotA, slotB) => slotA.slot.localeCompare(slotB.slot));
  }, [bracketDefinition]);

  const regionDirectionByKey = useMemo(() => ({
    W: 'ltr',
    X: 'ltr',
    Y: 'rtl',
    Z: 'rtl'
  }), []);

  const regionSectionsByKey = useMemo(
    () => regionSections.reduce((acc, section) => {
      acc[section.key] = section;
      return acc;
    }, {}),
    [regionSections]
  );

  const playInSlotsByRegion = useMemo(
    () => playInSlots.reduce((acc, slot) => {
      acc[slot.region] = acc[slot.region] || [];
      acc[slot.region].push(slot);
      return acc;
    }, {}),
    [playInSlots]
  );

  const quadrantRows = useMemo(() => {
    const buildQuadrantRow = (regionKey) => {
      const regionSection = regionSectionsByKey[regionKey];
      if (!regionSection) {
        return null;
      }

      const direction = regionDirectionByKey[regionKey] || 'ltr';
      const regionLayout = buildSectionLayout(regionSection.slots, direction);
      const regionPlayInSlots = [...(playInSlotsByRegion[regionKey] || [])].sort((slotA, slotB) => slotA.slot.localeCompare(slotB.slot));
      const playInAnchorSlotIdBySlot = regionPlayInSlots.reduce((acc, slot) => {
        const downstreamSlotId = (downstreamSlotMap[slot.slot] || []).find((targetSlotId) => {
          const targetSlot = getSlot(targetSlotId);
          return targetSlot && !isPlayInSlot(targetSlot);
        }) || (downstreamSlotMap[slot.slot] || [])[0] || null;

        acc[slot.slot] = downstreamSlotId;
        return acc;
      }, {});
      const playInLayout = regionPlayInSlots.length
        ? buildAlignedPlayInLayout(regionPlayInSlots, regionLayout, playInAnchorSlotIdBySlot)
        : null;

      return {
        direction,
        playInLayout,
        playInSlots: regionPlayInSlots,
        regionLayout,
        regionSection,
        side: direction === 'rtl' ? 'right' : 'left'
      };
    };

    return {
      left: ['W', 'X'].map((regionKey) => buildQuadrantRow(regionKey)).filter(Boolean),
      right: ['Z', 'Y'].map((regionKey) => buildQuadrantRow(regionKey)).filter(Boolean)
    };
  }, [downstreamSlotMap, getSlot, playInSlotsByRegion, regionDirectionByKey, regionSectionsByKey]);

  const leftSemifinalSlot = useMemo(() => {
    if (!bracketDefinition?.final_slots?.left_semifinal) {
      return [];
    }

    return [getSlot(bracketDefinition.final_slots.left_semifinal)].filter(Boolean);
  }, [bracketDefinition, getSlot]);

  const rightSemifinalSlot = useMemo(() => {
    if (!bracketDefinition?.final_slots?.right_semifinal) {
      return [];
    }

    return [getSlot(bracketDefinition.final_slots.right_semifinal)].filter(Boolean);
  }, [bracketDefinition, getSlot]);

  const championshipSlot = useMemo(() => {
    if (!bracketDefinition?.final_slots?.championship) {
      return [];
    }
    return [getSlot(bracketDefinition.final_slots.championship)].filter(Boolean);
  }, [bracketDefinition, getSlot]);

  const semifinalLabels = useMemo(() => ({
    left: `${getRegionLabel('W')} vs ${getRegionLabel('X')}`,
    right: `${getRegionLabel('Y')} vs ${getRegionLabel('Z')}`
  }), [getRegionLabel]);

  const selectedSlot = useMemo(() => (selectedSlotId ? getSlot(selectedSlotId) : null), [selectedSlotId]);

  const selectedParticipants = useMemo(() => {
    if (!selectedSlotId) {
      return { team1Id: null, team2Id: null };
    }

    const slot = getSlot(selectedSlotId);
    if (!slot) {
      return { team1Id: null, team2Id: null };
    }

    return getDisplaySlotParticipants(slot, picks, slotDisplayOrderLookup);
  }, [getSlot, picks, selectedSlotId, slotDisplayOrderLookup]);
  const selectedTeamA = selectedParticipants.team1Id ? getTeamEntry(selectedParticipants.team1Id) : null;
  const selectedTeamB = selectedParticipants.team2Id ? getTeamEntry(selectedParticipants.team2Id) : null;
  const selectedSlotModelInsights = useMemo(() => {
    if (!selectedParticipants.team1Id || !selectedParticipants.team2Id) {
      return [];
    }

    return modelOptions
      .map((model) => {
        const prediction = predictMatchup(selectedParticipants.team1Id, selectedParticipants.team2Id, model.id);
        if (!prediction) {
          return null;
        }

        return {
          model,
          prediction,
          isActive: model.id === selectedModelId,
          isDefault: model.id === modelsManifest.default_model_id
        };
      })
      .filter(Boolean);
  }, [modelOptions, modelsManifest.default_model_id, predictMatchup, selectedModelId, selectedParticipants.team1Id, selectedParticipants.team2Id]);

  const selectedPrediction = useMemo(() => (
    selectedSlotModelInsights.find((entry) => entry.isActive)?.prediction || null
  ), [selectedSlotModelInsights]);

  const selectedSlotProbabilities = useMemo(() => {
    if (!selectedSlotId) {
      return {
        participantProbabilities: [],
        winnerProbabilities: []
      };
    }

    return getSlotProbabilityBreakdown(selectedSlotId, picks, selectedModelId);
  }, [getSlotProbabilityBreakdown, picks, selectedModelId, selectedSlotId]);

  const selectedSlotProbabilityRows = useMemo(() => {
    return selectedSlotProbabilities.winnerProbabilities;
  }, [selectedSlotProbabilities]);

  const selectedFeatureDefinition = useMemo(
    () => featureDefinitions.find((feature) => feature.key === selectedFeatureKey) || featureDefinitions[0],
    [featureDefinitions, selectedFeatureKey]
  );

  const selectedFeatureRankRows = useMemo(() => {
    const participantLookup = selectedSlotProbabilities.participantProbabilities.reduce((acc, entry) => {
      acc[entry.teamId] = entry.probability;
      return acc;
    }, {});
    const winnerLookup = selectedSlotProbabilities.winnerProbabilities.reduce((acc, entry) => {
      acc[entry.teamId] = entry.probability;
      return acc;
    }, {});

    return getFeatureRankingsForTeams(
      selectedSlotProbabilities.participantProbabilities.map((entry) => entry.teamId),
      selectedFeatureDefinition.key
    ).map((entry) => ({
      ...entry,
      reachProbability: participantLookup[entry.teamId] ?? 0,
      advanceProbability: winnerLookup[entry.teamId] ?? 0
    }));
  }, [getFeatureRankingsForTeams, selectedFeatureDefinition, selectedSlotProbabilities]);

  const championshipSlotId = bracketDefinition?.final_slots?.championship;
  const bracketProgress = useMemo(() => {
    const allSlots = bracketDefinition?.slots || [];
    const totalSlots = allSlots.length;

    if (!totalSlots) {
      return {
        filledSlots: 0,
        percentLabel: '0%',
        ratio: 0,
        totalSlots: 0
      };
    }

    const filledSlots = allSlots.reduce((count, slot) => (picks[slot.slot] ? count + 1 : count), 0);
    const ratio = filledSlots / totalSlots;

    return {
      filledSlots,
      percentLabel: `${Math.round(ratio * 100)}%`,
      ratio,
      totalSlots
    };
  }, [bracketDefinition, picks]);
  const isDrawerOpen = Boolean(selectedSlotId);
  const canAutofillSelectedSlot = Boolean(selectedSlotId);
  const selectedPickedWinner = selectedSlotId && picks[selectedSlotId] ? getTeamEntry(picks[selectedSlotId]) : null;
  const selectedPickSource = selectedSlotId ? pickSources[selectedSlotId] || null : null;
  const selectedPickSourceLabel = selectedPickSource?.type === 'manual'
    ? 'Manual'
    : selectedPickSource?.modelId
      ? modelNameById[selectedPickSource.modelId] || 'Model'
      : null;
  const selectedPickedModelId = selectedPickSource?.type === 'model' ? selectedPickSource.modelId : null;
  const selectedModelDisagrees = Boolean(selectedPickedWinner && selectedPrediction && selectedPickedWinner.team_id !== selectedPrediction.winnerId);

  const getPickSourceLabel = (source) => {
    if (!source) {
      return null;
    }

    if (source.type === 'manual') {
      return 'Manual';
    }

    if (source.modelId) {
      return modelNameById[source.modelId] || 'Model';
    }

    return 'Model';
  };

  const getDescendantSlotIds = (slotId) => {
    const visited = new Set();
    const result = [];
    const queue = [...(downstreamSlotMap[slotId] || [])];

    while (queue.length) {
      const currentSlotId = queue.shift();
      if (visited.has(currentSlotId)) {
        continue;
      }
      visited.add(currentSlotId);
      result.push(currentSlotId);
      queue.push(...(downstreamSlotMap[currentSlotId] || []));
    }

    return result;
  };

  const fillSlot = (slotId, options = {}) => {
    if (!slotId) {
      return;
    }

    const { preserveSelection = false } = options;
    const nextPicks = fillSlotThrough(slotId, picks, selectedModelId);
    const nextPickSources = { ...pickSources };
    Object.entries(nextPicks).forEach(([filledSlotId, teamId]) => {
      if (picks[filledSlotId] !== teamId || !nextPickSources[filledSlotId]) {
        nextPickSources[filledSlotId] = {
          type: 'model',
          modelId: selectedModelId
        };
      }
    });
    setPicks(nextPicks);
    setPickSources(nextPickSources);

    if (preserveSelection) {
      setSelectedSlotId(slotId);
    }
  };

  const pickWinner = (slotId, teamId, options = {}) => {
    if (!slotId || !teamId) {
      return;
    }

    const {
      preserveSelection = false,
      source = { type: 'manual' }
    } = options;

    const descendantSlotIds = getDescendantSlotIds(slotId);
    const nextPicks = { ...picks, [slotId]: Number(teamId) };
    const nextPickSources = {
      ...pickSources,
      [slotId]: source
    };

    descendantSlotIds.forEach((descendantSlotId) => {
      delete nextPicks[descendantSlotId];
      delete nextPickSources[descendantSlotId];
    });

    setPicks(nextPicks);
    setPickSources(nextPickSources);

    if (preserveSelection) {
      setSelectedSlotId(slotId);
    }
  };

  const pickWinnerFromModel = (slotId, modelId, options = {}) => {
    if (!slotId || !modelId) {
      return;
    }

    const slot = getSlot(slotId);
    if (!slot) {
      return;
    }

    const { team1Id, team2Id } = getDisplaySlotParticipants(slot, picks, slotDisplayOrderLookup);
    if (!team1Id || !team2Id) {
      return;
    }

    const prediction = predictMatchup(team1Id, team2Id, modelId);
    if (!prediction?.winnerId) {
      return;
    }

    pickWinner(slotId, prediction.winnerId, {
      ...options,
      source: {
        type: 'model',
        modelId
      }
    });
  };

  const resetBracket = () => {
    setPicks({});
    setPickSources({});
  };
  const closeDrawer = () => setSelectedSlotId(null);

  const comparisonRows = selectedPrediction && selectedTeamA && selectedTeamB
    ? [
        ['Seed', selectedTeamA.seed, selectedTeamB.seed],
        ['AdjOE', selectedTeamA.features.AdjOE_mean.toFixed(1), selectedTeamB.features.AdjOE_mean.toFixed(1)],
        ['AdjDE', selectedTeamA.features.AdjDE_mean.toFixed(1), selectedTeamB.features.AdjDE_mean.toFixed(1)],
        ['SOS', selectedTeamA.features.SOS.toFixed(3), selectedTeamB.features.SOS.toFixed(3)],
        ['FT%', selectedTeamA.features['FT%_mean'].toFixed(3), selectedTeamB.features['FT%_mean'].toFixed(3)]
      ]
    : [];

  if (loading || !bracketDefinition) {
    return (
      <MM2026Shell>
        <section className="mm26-panel mm26-panel--bracket-main">
          <p className="mm26-note">Loading live bracket, team index, and feature store...</p>
        </section>
      </MM2026Shell>
    );
  }

  if (error) {
    return (
      <MM2026Shell>
        <section className="mm26-panel mm26-panel--bracket-main">
          <p className="mm26-note">Could not load the live bracket artifacts: {error.message}</p>
        </section>
      </MM2026Shell>
    );
  }

  return (
    <MM2026Shell>
      <section className="mm26-panel mm26-panel--bracket-main">
        <div className="mm26-bracket-toolbar">
          <select className="mm26-select" value={selectedModelId} onChange={(event) => setActiveModelId(event.target.value)}>
            {modelOptions.map((model) => (
              <option key={model.id} value={model.id}>{model.name}</option>
            ))}
          </select>
          <button type="button" className="mm26-button" onClick={() => fillSlot(championshipSlotId)}>Auto-fill to champion</button>
          <button type="button" className="mm26-button-secondary" onClick={resetBracket}>Reset picks</button>
        </div>

        <div className="mm26-bracket-scroll-shell">
          <div className="mm26-bracket-scroll" role="region" aria-label="Scrollable bracket canvas">
            <div className="mm26-bracket-board mm26-bracket-board--quad">
              <div className="mm26-bracket-half mm26-bracket-half--left">
                {quadrantRows.left.map((row) => (
                  <div key={row.regionSection.key} className="mm26-bracket-quadrant-row mm26-bracket-quadrant-row--left">
                    <div className="mm26-bracket-playin-column">
                      {row.playInSlots.length ? (
                        <BracketSection
                          key={`${row.regionSection.key}-playins`}
                          title="Play-In"
                          subtitle={row.regionSection.title}
                          slots={row.playInSlots}
                          slotDisplayOrderLookup={slotDisplayOrderLookup}
                          selectedSlotId={selectedSlotId}
                          selectedModelId={selectedModelId}
                          picks={picks}
                          pickSources={pickSources}
                          setSelectedSlotId={setSelectedSlotId}
                          pickWinner={pickWinner}
                          getPickSourceLabel={getPickSourceLabel}
                          getSlotParticipants={getSlotParticipants}
                          getTeamEntry={getTeamEntry}
                          predictMatchup={predictMatchup}
                          layout={row.playInLayout}
                          className="mm26-bracket-section--playin"
                        />
                      ) : <div className="mm26-bracket-playin-spacer" aria-hidden="true" />}
                    </div>

                    <div className="mm26-bracket-region-column">
                      <BracketSection
                        key={row.regionSection.key}
                        title={row.regionSection.title}
                        subtitle={row.regionSection.subtitle}
                        slots={row.regionSection.slots}
                        slotDisplayOrderLookup={slotDisplayOrderLookup}
                        selectedSlotId={selectedSlotId}
                        selectedModelId={selectedModelId}
                        picks={picks}
                        pickSources={pickSources}
                        setSelectedSlotId={setSelectedSlotId}
                        pickWinner={pickWinner}
                        getPickSourceLabel={getPickSourceLabel}
                        getSlotParticipants={getSlotParticipants}
                        getTeamEntry={getTeamEntry}
                        predictMatchup={predictMatchup}
                        layout={row.regionLayout}
                        direction={row.direction}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mm26-bracket-center">
                <div className="mm26-bracket-stage mm26-bracket-stage--final-four-top">
                  <BracketSection
                    key="left-semifinal"
                    title="Final Four"
                    subtitle={semifinalLabels.left}
                    slots={leftSemifinalSlot}
                    slotDisplayOrderLookup={slotDisplayOrderLookup}
                    selectedSlotId={selectedSlotId}
                    selectedModelId={selectedModelId}
                    picks={picks}
                    pickSources={pickSources}
                    setSelectedSlotId={setSelectedSlotId}
                    pickWinner={pickWinner}
                    getPickSourceLabel={getPickSourceLabel}
                    getSlotParticipants={getSlotParticipants}
                    getTeamEntry={getTeamEntry}
                    predictMatchup={predictMatchup}
                    layoutMode="stack"
                  />
                </div>

                <div className="mm26-bracket-stage mm26-bracket-stage--championship">
                  <BracketSection
                    key="championship"
                    title="Championship"
                    subtitle="Title game"
                    slots={championshipSlot}
                    slotDisplayOrderLookup={slotDisplayOrderLookup}
                    selectedSlotId={selectedSlotId}
                    selectedModelId={selectedModelId}
                    picks={picks}
                    pickSources={pickSources}
                    setSelectedSlotId={setSelectedSlotId}
                    pickWinner={pickWinner}
                    getPickSourceLabel={getPickSourceLabel}
                    getSlotParticipants={getSlotParticipants}
                    getTeamEntry={getTeamEntry}
                    predictMatchup={predictMatchup}
                    layoutMode="stack"
                  />
                </div>

                <div className="mm26-bracket-stage mm26-bracket-stage--final-four-bottom">
                  <BracketSection
                    key="right-semifinal"
                    title="Final Four"
                    subtitle={semifinalLabels.right}
                    slots={rightSemifinalSlot}
                    slotDisplayOrderLookup={slotDisplayOrderLookup}
                    selectedSlotId={selectedSlotId}
                    selectedModelId={selectedModelId}
                    picks={picks}
                    pickSources={pickSources}
                    setSelectedSlotId={setSelectedSlotId}
                    pickWinner={pickWinner}
                    getPickSourceLabel={getPickSourceLabel}
                    getSlotParticipants={getSlotParticipants}
                    getTeamEntry={getTeamEntry}
                    predictMatchup={predictMatchup}
                    layoutMode="stack"
                  />
                </div>
              </div>

              <div className="mm26-bracket-half mm26-bracket-half--right">
                {quadrantRows.right.map((row) => (
                  <div key={row.regionSection.key} className="mm26-bracket-quadrant-row mm26-bracket-quadrant-row--right">
                    <div className="mm26-bracket-region-column">
                      <BracketSection
                        key={row.regionSection.key}
                        title={row.regionSection.title}
                        subtitle={row.regionSection.subtitle}
                        slots={row.regionSection.slots}
                        slotDisplayOrderLookup={slotDisplayOrderLookup}
                        selectedSlotId={selectedSlotId}
                        selectedModelId={selectedModelId}
                        picks={picks}
                        pickSources={pickSources}
                        setSelectedSlotId={setSelectedSlotId}
                        pickWinner={pickWinner}
                        getPickSourceLabel={getPickSourceLabel}
                        getSlotParticipants={getSlotParticipants}
                        getTeamEntry={getTeamEntry}
                        predictMatchup={predictMatchup}
                        layout={row.regionLayout}
                        direction={row.direction}
                        className="mm26-bracket-section--rtl"
                      />
                    </div>

                    <div className="mm26-bracket-playin-column">
                      {row.playInSlots.length ? (
                        <BracketSection
                          key={`${row.regionSection.key}-playins`}
                          title="Play-In"
                          subtitle={row.regionSection.title}
                          slots={row.playInSlots}
                          slotDisplayOrderLookup={slotDisplayOrderLookup}
                          selectedSlotId={selectedSlotId}
                          selectedModelId={selectedModelId}
                          picks={picks}
                          pickSources={pickSources}
                          setSelectedSlotId={setSelectedSlotId}
                          pickWinner={pickWinner}
                          getPickSourceLabel={getPickSourceLabel}
                          getSlotParticipants={getSlotParticipants}
                          getTeamEntry={getTeamEntry}
                          predictMatchup={predictMatchup}
                          layout={row.playInLayout}
                          className="mm26-bracket-section--playin"
                        />
                      ) : <div className="mm26-bracket-playin-spacer" aria-hidden="true" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div
        className={`mm26-overlay${isDrawerOpen ? ' is-open' : ''}`}
        onClick={closeDrawer}
        role="presentation"
      >
        <aside
          className={`mm26-overlay-drawer${isDrawerOpen ? ' is-open' : ''}`}
          onClick={(event) => event.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="mm26-selected-matchup-title"
        >
          <div className="mm26-overlay-header">
            <div>
              <div className="mm26-kicker">Selected Matchup</div>
              <h2 id="mm26-selected-matchup-title">{selectedSlot?.label || 'Bracket detail'}</h2>
            </div>
            <button type="button" className="mm26-overlay-close" onClick={closeDrawer}>Close</button>
          </div>

          {canAutofillSelectedSlot ? (
            <div className="mm26-detail-actions" style={{ marginBottom: '1rem' }}>
              <button type="button" className="mm26-button" onClick={() => fillSlot(selectedSlotId, { preserveSelection: true })}>Autofill through this slot</button>
            </div>
          ) : null}

          {selectedPickedWinner ? (
            <div className="mm26-model-card" style={{ marginBottom: '1rem' }}>
              <div className="mm26-kicker">Current Pick</div>
              <h3>{selectedPickedWinner.short_name}</h3>
              <div className="mm26-pick-meta">
                {selectedPickSourceLabel ? <span className="mm26-pick-pill">{selectedPickSourceLabel}</span> : null}
                {selectedModelDisagrees ? <span className="mm26-pick-pill mm26-pick-pill--dirty">Model differs</span> : null}
              </div>
            </div>
          ) : null}

          {selectedPrediction && selectedTeamA && selectedTeamB ? (
            <>
              <div className="mm26-matchup-header">
                <div className="mm26-matchup-team">
                  <h3>{selectedTeamA.short_name}</h3>
                  <p>{formatProbability(selectedPrediction.teamAProbability)}</p>
                  <button type="button" className="mm26-mini-button" onClick={() => pickWinner(selectedSlotId, selectedTeamA.team_id, { preserveSelection: true })}>Pick</button>
                </div>
                <div className="mm26-matchup-team">
                  <h3>{selectedTeamB.short_name}</h3>
                  <p>{formatProbability(selectedPrediction.teamBProbability)}</p>
                  <button type="button" className="mm26-mini-button" onClick={() => pickWinner(selectedSlotId, selectedTeamB.team_id, { preserveSelection: true })}>Pick</button>
                </div>
              </div>
              <div className="mm26-probability-track">
                <div className="mm26-probability-fill" style={{ width: `${selectedPrediction.teamAProbability * 100}%` }} />
              </div>
              <p>{selectedPrediction.explanation}</p>
              {selectedSlotModelInsights.length ? (
                <div className="mm26-team-model-insight-list mm26-slot-model-insight-list">
                  {selectedSlotModelInsights.map(({ model, prediction, isActive, isDefault }) => (
                    <article key={model.id} className={`mm26-team-model-insight-card${isDefault ? ' is-default' : ''}`.trim()}>
                      <div className="mm26-team-model-insight-header mm26-slot-model-insight-header">
                        <strong>{`${model.name}: ${selectedTeamA.short_name} ${formatProbability(prediction.teamAProbability)}`}</strong>
                        <label className="mm26-slot-model-radio">
                          <input
                            type="radio"
                            name={`slot-model-pick-${selectedSlotId}`}
                            checked={selectedPickedModelId === model.id}
                            onChange={() => pickWinnerFromModel(selectedSlotId, model.id, { preserveSelection: true })}
                          />
                          <span>Use model</span>
                        </label>
                      </div>
                      <div className="mm26-probability-track">
                        <div className="mm26-probability-fill" style={{ width: `${prediction.teamAProbability * 100}%` }} />
                      </div>
                      {(isDefault || isActive) ? (
                        <div className="mm26-team-model-insight-badges">
                          {isDefault ? <span className="mm26-team-model-insight-badge">Default</span> : null}
                          {isActive ? <span className="mm26-team-model-insight-badge is-active">Active</span> : null}
                        </div>
                      ) : null}
                    </article>
                  ))}
                </div>
              ) : null}
              <div className="mm26-compare-list">
                {comparisonRows.map(([label, valueA, valueB]) => (
                  <div key={label} className="mm26-compare-row">
                    <span>{label}</span>
                    <strong>{valueA}</strong>
                    <strong>{valueB}</strong>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="mm26-empty">Both sides of this matchup are not locked in yet, but you can still autofill the path through this slot.</p>
          )}

          {selectedSlotProbabilityRows.length ? (
            <div className="mm26-model-card" style={{ marginTop: '1rem' }}>
              <div className="mm26-kicker">Potential Teams</div>
              <h3>Probability to advance</h3>
              <div className="mm26-compare-list">
                <div className="mm26-compare-row">
                  <span>Team</span>
                  <strong>Advance</strong>
                </div>
                {selectedSlotProbabilityRows.map((entry) => (
                  <div key={entry.teamId} className="mm26-compare-row">
                    <span>{entry.team.short_name}</span>
                    <strong>{formatProbability(entry.probability)}</strong>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {selectedFeatureRankRows.length ? (
            <div className="mm26-model-card" style={{ marginTop: '1rem' }}>
              <div className="mm26-kicker">Rank Comparison</div>
              <h3>{selectedFeatureDefinition.label}</h3>
              <div className="mm26-detail-actions" style={{ marginBottom: '0.9rem' }}>
                <select className="mm26-select" value={selectedFeatureDefinition.key} onChange={(event) => setSelectedFeatureKey(event.target.value)}>
                  {featureDefinitions.map((feature) => (
                    <option key={feature.key} value={feature.key}>{feature.label}</option>
                  ))}
                </select>
              </div>
              <div className="mm26-compare-list">
                <div className="mm26-compare-row">
                  <span>Team</span>
                  <strong>Rank</strong>
                  <strong>Value</strong>
                </div>
                {selectedFeatureRankRows.map((entry) => (
                  <div key={entry.teamId} className="mm26-compare-row">
                    <span>{entry.team.short_name}</span>
                    <strong>{entry.rank}</strong>
                    <strong>{entry.formattedValue}</strong>
                  </div>
                ))}
              </div>
              <p>Ranks are computed from the live feature store for the selected season and update independently of the matchup model.</p>
            </div>
          ) : null}

          <div className="mm26-model-card" style={{ marginTop: '1rem' }}>
            <div className="mm26-kicker">Bracket state</div>
            <div className="mm26-progress-header">
              <h3>{bracketProgress.percentLabel} filled</h3>
              <span className="mm26-label">{bracketProgress.filledSlots} / {bracketProgress.totalSlots}</span>
            </div>
            <div
              className="mm26-probability-track mm26-progress-track"
              role="progressbar"
              aria-label="Bracket completion"
              aria-valuemin={0}
              aria-valuemax={bracketProgress.totalSlots}
              aria-valuenow={bracketProgress.filledSlots}
              aria-valuetext={`${bracketProgress.percentLabel} of bracket slots filled`}
            >
              <div className="mm26-probability-fill" style={{ width: `${bracketProgress.ratio * 100}%` }} />
            </div>
            <p className="mm26-progress-caption">{bracketProgress.filledSlots} of {bracketProgress.totalSlots} matchup slots picked.</p>
          </div>
        </aside>
      </div>
    </MM2026Shell>
  );
};

export default BracketBuilder;