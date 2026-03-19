import { useEffect, useMemo, useState } from 'react';

const SEASON = 2026;
const DATA_BASE_URL = 'https://raw.githubusercontent.com/ajgrowney/march-madness-ml/master';

const artifactUrls = {
  teamIndex: `${DATA_BASE_URL}/data/web/index/${SEASON}/teams.json`,
  featureStore: `${DATA_BASE_URL}/data/web/features/${SEASON}/base.json`,
  bracketDefinition: `${DATA_BASE_URL}/data/web/brackets/${SEASON}.json`,
  trainingManifest: `${DATA_BASE_URL}/data/web/training/manifest.json`,
  modelsManifest: `${DATA_BASE_URL}/data/web/models/manifest.json`
};

const statExplorerArtifactUrls = {
  explorer: `${DATA_BASE_URL}/data/web/stats/${SEASON}/stat_explorer_v1.json`,
  featureStore: `${DATA_BASE_URL}/data/web/features/${SEASON}/stat_explorer_v1.json`
};

const modelsManifest = {
  default_model_id: 'seed-only',
  models: [
    {
      id: 'coin-flip',
      name: 'Coin Flip',
      type: 'heuristic',
      seasons: [SEASON],
      feature_set: null,
      prediction_format: 'runtime',
      description: 'Rule #1 baseline that gives every matchup 50/50 odds.'
    },
    {
      id: 'seed-only',
      name: 'Seed Only',
      type: 'heuristic',
      seasons: [SEASON],
      feature_set: '2026_initial',
      prediction_format: 'runtime',
      description: 'Pure seed-based picker that always favors the better seed.'
    }
  ]
};

let publishedModelsManifestCache = null;
let publishedModelsManifestPromise = null;

const featureDefinitions = [
  { key: 'Seed', label: 'Seed', category: 'Resume', higherIsBetter: false, formatter: (value) => Number(value).toFixed(0) },
  { key: 'WinPct', label: 'Win %', category: 'Resume', higherIsBetter: true, formatter: (value) => value.toFixed(3) },
  { key: 'SOS', label: 'Strength of Schedule', category: 'Resume', higherIsBetter: true, formatter: (value) => value.toFixed(3) },
  { key: 'SOV', label: 'Strength of Victory', category: 'Resume', higherIsBetter: true, formatter: (value) => value.toFixed(3) },
  { key: 'NET_last', label: 'NET Rank', category: 'Ordinals', higherIsBetter: false, formatter: (value) => Number(value).toFixed(0) },
  { key: 'selection_ordinal_last', label: 'Selection Ordinal', category: 'Ordinals', higherIsBetter: false, formatter: (value) => Number(value).toFixed(0) },
  { key: 'AdjOE_mean', label: 'AdjOE', category: 'Efficiency', higherIsBetter: true, formatter: (value) => value.toFixed(1) },
  { key: 'AdjDE_mean', label: 'AdjDE', category: 'Efficiency', higherIsBetter: false, formatter: (value) => value.toFixed(1) },
  { key: 'AdjNE_mean', label: 'AdjNE', category: 'Efficiency', higherIsBetter: true, formatter: (value) => value.toFixed(1) },
  { key: 'FG%_mean', label: 'FG%', category: 'Shooting', higherIsBetter: true, formatter: (value) => value.toFixed(3) },
  { key: 'FG3%_mean', label: '3PT%', category: 'Shooting', higherIsBetter: true, formatter: (value) => value.toFixed(3) },
  { key: 'FT%_mean', label: 'FT%', category: 'Shooting', higherIsBetter: true, formatter: (value) => value.toFixed(3) }
];

const statExplorerFriendlyLabels = {
  Q1_WinPct: 'Quad 1 Win %',
  Q2_WinPct: 'Quad 2 Win %',
  Q3_WinPct: 'Quad 3 Win %',
  Q4_WinPct: 'Quad 4 Win %',
  SOS: 'Strength of Schedule',
  SOV: 'Strength of Victory',
  Poss_mean: 'Pace',
  Fouls_mean: 'Fouls',
  AdjOE_mean: 'Adjusted Offensive Efficiency',
  AdjNE_mean: 'Adjusted Net Efficiency',
  'EFG%_mean': 'Effective FG %',
  'FG3%_mean': '3-Point %',
  'FT%_mean': 'Free Throw %',
  FTA_mean: 'Free Throws Attempted',
  TO_mean: 'Turnovers',
  Ast_mean: 'Assists',
  OR_mean: 'Offensive Rebounds',
  FGA3_mean: '3PA',
  AdjDE_mean: 'Adjusted Defensive Efficiency',
  Stl_mean: 'Steals',
  Blk_mean: 'Blocks',
  OppTO_mean: 'Opponent Turnovers Forced',
  DR_mean: 'Defensive Rebounds',
  OppFGA3_mean: 'Opponent 3PA'
};

const statExplorerHigherIsBetter = {
  Q1_WinPct: true,
  Q2_WinPct: true,
  Q3_WinPct: true,
  Q4_WinPct: true,
  SOS: true,
  SOV: true,
  Poss_mean: true,
  Fouls_mean: false,
  AdjOE_mean: true,
  AdjNE_mean: true,
  'EFG%_mean': true,
  'FG3%_mean': true,
  'FT%_mean': true,
  FTA_mean: true,
  TO_mean: false,
  Ast_mean: true,
  OR_mean: true,
  FGA3_mean: true,
  AdjDE_mean: false,
  Stl_mean: true,
  Blk_mean: true,
  OppTO_mean: true,
  DR_mean: true,
  OppFGA3_mean: false
};

let baseDataCache = null;
let baseDataPromise = null;
let trainingManifestCache = null;
let trainingManifestPromise = null;
let statExplorerCache = null;
let statExplorerPromise = null;
const teamPageCache = new Map();
const teamPagePromiseCache = new Map();
const trainingSeasonCache = new Map();
const trainingSeasonPromiseCache = new Map();
const precomputedPredictionsCache = new Map();
const precomputedPredictionsPromiseCache = new Map();
const CUSTOM_RUNTIME_MODELS_STORAGE_KEY = 'mm26-custom-runtime-models';
const ACTIVE_MODEL_ID_STORAGE_KEY = 'mm26-active-model-id';
const precomputedPredictionWarningCache = new Set();
const precomputedCoverageWarningCache = new Set();
const unsupportedModelWarningCache = new Set();

const fetchJson = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load ${url}: ${response.status}`);
  }
  return response.json();
};

const resolveArtifactUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return null;
  }

  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  return `${DATA_BASE_URL}/${url.replace(/^\/+/, '')}`;
};

const isBrowser = () => typeof window !== 'undefined';

const normalizePublishedModelEntry = (model) => ({
  ...model,
  seasons: Array.isArray(model?.seasons) ? model.seasons.map(Number).filter(Number.isFinite) : [SEASON],
  config_url: resolveArtifactUrl(model?.config_url),
  predictions_url: resolveArtifactUrl(model?.predictions_url),
  feature_importance_url: resolveArtifactUrl(model?.feature_importance_url)
});

const normalizePublishedModelsManifest = (manifest) => ({
  ...manifest,
  default_model_id: manifest?.default_model_id || modelsManifest.default_model_id,
  models: Array.isArray(manifest?.models) ? manifest.models.map(normalizePublishedModelEntry) : []
});

const normalizeStoredRuntimeModel = (runtimeModel) => {
  if (!runtimeModel?.id || !runtimeModel?.name) {
    return null;
  }

  return {
    ...runtimeModel,
    type: runtimeModel.type || 'runtime-config',
    method: runtimeModel.method || 'manual-logistic',
    feature_set: runtimeModel.feature_set || '2026_initial',
    selectedFeatures: Array.isArray(runtimeModel.selectedFeatures) ? runtimeModel.selectedFeatures : [],
    weights: runtimeModel.weights || {},
    bias: Number(runtimeModel.bias || 0),
    sharpness: Number(runtimeModel.sharpness || 1),
    notes: runtimeModel.notes || 'Saved from Model Builder.',
    created_at: runtimeModel.created_at || new Date().toISOString()
  };
};

const loadStoredCustomRuntimeModels = () => {
  if (!isBrowser()) {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(CUSTOM_RUNTIME_MODELS_STORAGE_KEY);
    if (!rawValue) {
      return [];
    }

    const parsed = JSON.parse(rawValue);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map(normalizeStoredRuntimeModel)
      .filter(Boolean)
      .sort((left, right) => new Date(right.created_at).getTime() - new Date(left.created_at).getTime());
  } catch (error) {
    return [];
  }
};

const writeStoredCustomRuntimeModels = (runtimeModels) => {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(CUSTOM_RUNTIME_MODELS_STORAGE_KEY, JSON.stringify(runtimeModels));
};

const getStoredActiveModelId = () => {
  if (!isBrowser()) {
    return null;
  }

  return window.localStorage.getItem(ACTIVE_MODEL_ID_STORAGE_KEY);
};

const setStoredActiveModelId = (modelId) => {
  if (!isBrowser()) {
    return;
  }

  if (!modelId) {
    window.localStorage.removeItem(ACTIVE_MODEL_ID_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(ACTIVE_MODEL_ID_STORAGE_KEY, modelId);
};

const normalizePrecomputedPredictionsPayload = (payload) => {
  const predictions = Object.entries(payload?.predictions || {}).reduce((acc, [matchupKey, predictionTuple]) => {
    if (!Array.isArray(predictionTuple) || predictionTuple.length < 2) {
      return acc;
    }

    const [teamAIdRaw, teamBIdRaw] = matchupKey.split(':');
    const teamAId = Number(teamAIdRaw);
    const teamBId = Number(teamBIdRaw);
    const winnerId = Number(predictionTuple[0]);
    const winnerProbability = Number(predictionTuple[1]);

    if (!teamAId || !teamBId || !winnerId || !Number.isFinite(winnerProbability)) {
      return acc;
    }

    const teamAProbability = winnerId === teamAId
      ? winnerProbability
      : winnerId === teamBId
        ? 1 - winnerProbability
        : null;

    if (!Number.isFinite(teamAProbability)) {
      return acc;
    }

    acc[matchupKey] = {
      winnerId,
      winnerProbability,
      teamAId,
      teamBId,
      teamAProbability,
      teamBProbability: 1 - teamAProbability
    };
    return acc;
  }, {});

  return {
    ...payload,
    predictions,
    prediction_format: payload?.prediction_format || 'pairwise-winner-probability'
  };
};

const loadPrecomputedPredictionsArtifact = async (modelId, predictionsUrl) => {
  const cacheKey = String(modelId);
  if (precomputedPredictionsCache.has(cacheKey)) {
    return precomputedPredictionsCache.get(cacheKey);
  }

  if (!precomputedPredictionsPromiseCache.has(cacheKey)) {
    precomputedPredictionsPromiseCache.set(cacheKey, fetchJson(resolveArtifactUrl(predictionsUrl)).then((payload) => {
      const normalizedPayload = normalizePrecomputedPredictionsPayload(payload);
      precomputedPredictionsCache.set(cacheKey, normalizedPayload);
      return normalizedPayload;
    }));
  }

  return precomputedPredictionsPromiseCache.get(cacheKey);
};

const persistCustomRuntimeModel = (runtimeModel) => {
  const normalizedModel = normalizeStoredRuntimeModel(runtimeModel);
  if (!normalizedModel) {
    return null;
  }

  const currentModels = loadStoredCustomRuntimeModels();
  const nextModels = [
    normalizedModel,
    ...currentModels.filter((model) => model.id !== normalizedModel.id)
  ];

  writeStoredCustomRuntimeModels(nextModels);
  setStoredActiveModelId(normalizedModel.id);
  return normalizedModel;
};

const toCustomModelManifestEntry = (runtimeModel) => ({
  id: runtimeModel.id,
  name: runtimeModel.name,
  type: runtimeModel.type || 'runtime-config',
  seasons: [SEASON],
  feature_set: runtimeModel.feature_set || '2026_initial',
  prediction_format: 'runtime',
  description: runtimeModel.notes || 'Saved from Model Builder.',
  is_custom: true
});

const featureToStats = (features = {}) => ({
  AdjOE: features.AdjOE_mean ?? null,
  AdjDE: features.AdjDE_mean ?? null,
  AdjNE: features.AdjNE_mean ?? null,
  'FG%': features['FG%_mean'] ?? null,
  'FG3%': features['FG3%_mean'] ?? null,
  'FT%': features['FT%_mean'] ?? null
});

const normalizeFeatureRecord = (features = {}) => {
  const normalized = { ...features };
  const ordinalValue = normalized.selection_ordinal_last ?? normalized.NET_last ?? null;

  if (ordinalValue !== null && ordinalValue !== undefined) {
    normalized.selection_ordinal_last = ordinalValue;
    normalized.NET_last = ordinalValue;
  }

  return normalized;
};

const normalizeFeatureStorePayload = (featureStore) => ({
  ...featureStore,
  teams: Object.entries(featureStore?.teams || {}).reduce((acc, [teamId, features]) => {
    acc[teamId] = normalizeFeatureRecord(features);
    return acc;
  }, {})
});

const normalizeTrainingManifest = (manifest) => ({
  ...manifest,
  seasons: (manifest?.seasons || []).map(Number).sort((left, right) => left - right)
});

const normalizeRecordValues = (record = {}) => Object.entries(record).reduce((acc, [key, value]) => {
  acc[key] = value === null || value === undefined ? null : Number(value);
  return acc;
}, {});

const normalizeStatExplorerFeatureStorePayload = (featureStore) => ({
  ...featureStore,
  season: Number(featureStore?.season),
  feature_order: Array.isArray(featureStore?.feature_order) ? featureStore.feature_order : [],
  teams: Object.entries(featureStore?.teams || {}).reduce((acc, [teamId, features]) => {
    acc[String(teamId)] = normalizeRecordValues(features);
    return acc;
  }, {})
});

const normalizeCurrentFieldTeam = (team) => ({
  ...team,
  team_id: Number(team?.team_id),
  seed: team?.seed === null || team?.seed === undefined ? null : Number(team.seed),
  stats: normalizeRecordValues(team?.stats || {})
});

const normalizeHistoricalDistributionRow = (row) => ({
  ...row,
  season: Number(row?.season),
  team_id: Number(row?.team_id),
  seed: row?.seed === null || row?.seed === undefined ? null : Number(row.seed),
  value: Number(row?.value)
});

const normalizeHistoricalBucketSummary = (summary) => ({
  count: Number(summary?.count || 0),
  min: Number(summary?.min),
  p10: Number(summary?.p10),
  q1: Number(summary?.q1),
  median: Number(summary?.median),
  q3: Number(summary?.q3),
  p90: Number(summary?.p90),
  max: Number(summary?.max),
  mean: Number(summary?.mean),
  std: Number(summary?.std)
});

const normalizeStatExplorerPayload = (payload) => ({
  ...payload,
  season: Number(payload?.season),
  historical_range: Array.isArray(payload?.historical_range) ? payload.historical_range.map(Number) : [SEASON, SEASON],
  feature_order: Array.isArray(payload?.feature_order) ? payload.feature_order : [],
  filters: {
    ...payload?.filters,
    regions: Array.isArray(payload?.filters?.regions) ? payload.filters.regions : [],
    historical_range_default: Array.isArray(payload?.filters?.historical_range_default)
      ? payload.filters.historical_range_default.map(Number)
      : [SEASON, SEASON],
    historical_range_allowed: Array.isArray(payload?.filters?.historical_range_allowed)
      ? payload.filters.historical_range_allowed.map(Number)
      : [SEASON, SEASON]
  },
  current_field: {
    ...payload?.current_field,
    teams: Array.isArray(payload?.current_field?.teams) ? payload.current_field.teams.map(normalizeCurrentFieldTeam) : []
  },
  historical_distributions: Object.entries(payload?.historical_distributions || {}).reduce((acc, [featureKey, rows]) => {
    acc[featureKey] = Array.isArray(rows) ? rows.map(normalizeHistoricalDistributionRow) : [];
    return acc;
  }, {}),
  historical_summary: Object.entries(payload?.historical_summary || {}).reduce((acc, [featureKey, bucketSummary]) => {
    acc[featureKey] = Object.entries(bucketSummary || {}).reduce((bucketAcc, [bucketKey, summary]) => {
      bucketAcc[bucketKey] = normalizeHistoricalBucketSummary(summary);
      return bucketAcc;
    }, {});
    return acc;
  }, {}),
  default_percentiles: payload?.default_percentiles || {}
});

const buildStatExplorerFeatureDefinitions = (explorerPayload) => {
  const categoryByFeature = Object.entries(explorerPayload?.feature_groups || {}).reduce((acc, [category, featureKeys]) => {
    (featureKeys || []).forEach((featureKey) => {
      acc[featureKey] = category;
    });
    return acc;
  }, {});

  return (explorerPayload?.feature_order || []).map((featureKey) => ({
    key: featureKey,
    label: statExplorerFriendlyLabels[featureKey] || featureKey,
    category: categoryByFeature[featureKey] || 'Additional',
    higherIsBetter: statExplorerHigherIsBetter[featureKey] !== false,
    formatter: (value) => {
      const numericValue = Number(value);
      if (!Number.isFinite(numericValue)) {
        return '--';
      }

      if (/_WinPct$/.test(featureKey) || ['SOS', 'SOV', 'EFG%_mean', 'FG3%_mean', 'FT%_mean'].includes(featureKey)) {
        return `${(numericValue * 100).toFixed(1)}%`;
      }

      if (featureKey.startsWith('Adj')) {
        return numericValue.toFixed(1);
      }

      return numericValue.toFixed(1);
    }
  }));
};

const loadPublishedModelsManifest = async () => {
  if (publishedModelsManifestCache) {
    return publishedModelsManifestCache;
  }

  if (!publishedModelsManifestPromise) {
    publishedModelsManifestPromise = fetchJson(artifactUrls.modelsManifest).then((manifest) => {
      publishedModelsManifestCache = normalizePublishedModelsManifest(manifest);
      return publishedModelsManifestCache;
    });
  }

  return publishedModelsManifestPromise;
};

const loadStatExplorerArtifacts = async () => {
  if (statExplorerCache) {
    return statExplorerCache;
  }

  if (!statExplorerPromise) {
    statExplorerPromise = Promise.all([
      fetchJson(statExplorerArtifactUrls.explorer),
      fetchJson(statExplorerArtifactUrls.featureStore),
      loadPublishedModelsManifest()
    ]).then(([explorerPayload, featureStorePayload, modelsManifestPayload]) => {
      const explorer = normalizeStatExplorerPayload(explorerPayload);
      const featureStore = normalizeStatExplorerFeatureStorePayload(featureStorePayload);
      statExplorerCache = {
        explorer,
        featureStore,
        modelsManifest: modelsManifestPayload,
        featureDefinitions: buildStatExplorerFeatureDefinitions(explorer)
      };
      return statExplorerCache;
    });
  }

  return statExplorerPromise;
};

const normalizeTrainingSeasonPayload = (payload) => ({
  ...payload,
  season: Number(payload.season),
  examples: (payload.examples || []).map((example) => ({
    ...example,
    season: Number(example.season ?? payload.season),
    team_1_id: Number(example.team_1_id),
    team_2_id: Number(example.team_2_id),
    day_num: Number(example.day_num),
    x: Array.isArray(example.x) ? example.x.map(Number) : [],
    y: Number(example.y)
  }))
});

const buildRegionLabelLookup = (bracketDefinition) => {
  const rawRegionInfo = bracketDefinition?.region_details || bracketDefinition?.region_info;
  if (!rawRegionInfo) {
    return {};
  }

  if (Array.isArray(rawRegionInfo)) {
    return rawRegionInfo.reduce((acc, entry) => {
      const code = entry?.code || entry?.id || entry?.key || entry?.region;
      const label = entry?.friendly_name || entry?.display_name || entry?.name || entry?.label || code;
      if (code) {
        acc[code] = label;
      }
      return acc;
    }, {});
  }

  return Object.entries(rawRegionInfo).reduce((acc, [code, entry]) => {
    if (typeof entry === 'string') {
      acc[code] = entry;
      return acc;
    }

    const label = entry?.friendly_name || entry?.display_name || entry?.name || entry?.label || code;
    acc[code] = label;
    return acc;
  }, {});
};

const normalizeTeamEntry = (entry, featureStore, regionLabelLookup) => {
  const features = featureStore.teams[String(entry.team_id)] || featureStore.teams[entry.team_id] || {};
  return {
    ...entry,
    features,
    stats: featureToStats(features),
    region_label: entry.region ? regionLabelLookup[entry.region] || entry.region : null,
    ordinal_data: {
      NET: features.selection_ordinal_last ?? features.NET_last ?? null
    }
  };
};

const buildBaseData = (teamIndex, featureStore, bracketDefinition) => {
  const regionLabelLookup = buildRegionLabelLookup(bracketDefinition);
  const teamMap = teamIndex.teams.reduce((acc, entry) => {
    acc[entry.team_id] = normalizeTeamEntry(entry, featureStore, regionLabelLookup);
    return acc;
  }, {});

  const slotMap = bracketDefinition.slots.reduce((acc, slot) => {
    acc[slot.slot] = slot;
    return acc;
  }, {});

  return {
    teamIndex,
    featureStore,
    bracketDefinition,
    regionLabelLookup,
    teamMap,
    slotMap
  };
};

const loadBaseData = async () => {
  if (baseDataCache) {
    return baseDataCache;
  }
  if (!baseDataPromise) {
    baseDataPromise = Promise.all([
      fetchJson(artifactUrls.teamIndex),
      fetchJson(artifactUrls.featureStore),
      fetchJson(artifactUrls.bracketDefinition)
    ]).then(([teamIndex, featureStore, bracketDefinition]) => {
      baseDataCache = buildBaseData(teamIndex, normalizeFeatureStorePayload(featureStore), bracketDefinition);
      return baseDataCache;
    });
  }
  return baseDataPromise;
};

const loadTrainingManifest = async () => {
  if (trainingManifestCache) {
    return trainingManifestCache;
  }

  if (!trainingManifestPromise) {
    trainingManifestPromise = fetchJson(artifactUrls.trainingManifest).then((manifest) => {
      trainingManifestCache = normalizeTrainingManifest(manifest);
      return trainingManifestCache;
    });
  }

  return trainingManifestPromise;
};

const loadTrainingSeason = async (season, manifest) => {
  const seasonKey = String(season);

  if (trainingSeasonCache.has(seasonKey)) {
    return trainingSeasonCache.get(seasonKey);
  }

  if (!trainingSeasonPromiseCache.has(seasonKey)) {
    const resolvedManifest = manifest || await loadTrainingManifest();
    const seasonPath = resolvedManifest?.training_files?.[seasonKey] || resolvedManifest?.training_files?.[season];

    if (!seasonPath) {
      throw new Error(`No training dataset path found for season ${season}`);
    }

    trainingSeasonPromiseCache.set(seasonKey, fetchJson(`${DATA_BASE_URL}/${seasonPath}`).then((payload) => {
      const normalizedPayload = normalizeTrainingSeasonPayload(payload);
      trainingSeasonCache.set(seasonKey, normalizedPayload);
      return normalizedPayload;
    }));
  }

  return trainingSeasonPromiseCache.get(seasonKey);
};

const loadTeamPage = async (teamId, teamPagePath) => {
  const cacheKey = String(teamId);
  if (teamPageCache.has(cacheKey)) {
    return teamPageCache.get(cacheKey);
  }
  if (!teamPagePromiseCache.has(cacheKey)) {
    const url = `${DATA_BASE_URL}/${teamPagePath}`;
    teamPagePromiseCache.set(cacheKey, fetchJson(url).then((teamPage) => {
      teamPageCache.set(cacheKey, teamPage);
      return teamPage;
    }));
  }
  return teamPagePromiseCache.get(cacheKey);
};

const logistic = (value) => 1 / (1 + Math.exp(-value));
const deterministicCoin = (teamAId, teamBId) => ((teamAId * 31 + teamBId * 17 + SEASON) % 1000) / 1000;

const scaleMap = {
  Seed: 16,
  WinPct: 1,
  SOS: 1,
  SOV: 1,
  NET_last: 365,
  selection_ordinal_last: 365,
  AdjOE_mean: 40,
  AdjDE_mean: 40,
  AdjNE_mean: 55,
  'FG%_mean': 0.2,
  'FG3%_mean': 0.2,
  'FT%_mean': 0.2
};

const normalizeFeatureDifference = (featureKey, rawDifference) => {
  const definition = featureDefinitions.find((feature) => feature.key === featureKey);
  const orientation = definition?.higherIsBetter === false ? -1 : 1;
  const scale = scaleMap[featureKey] || 1;
  return (rawDifference / scale) * orientation;
};

const normalizeDifference = (featureKey, teamAValue, teamBValue) => {
  return normalizeFeatureDifference(featureKey, teamAValue - teamBValue);
};

const buildRuntimeModel = ({
  id = null,
  name = 'Browser Weighted Model',
  method = 'weighted-score',
  selectedFeatures = ['Seed', 'AdjOE_mean', 'AdjDE_mean', 'AdjNE_mean', 'WinPct'],
  weights = {},
  featureSet = '2026_initial',
  bias = 0,
  sharpness = 1.5,
  labelDefinition = null,
  trainingManifest = null,
  trainingFilters = null,
  fitSummary = null,
  preprocessor = null,
  notes = 'Temporary browser-native model config.'
} = {}) => {
  const resolvedWeights = {};
  selectedFeatures.forEach((featureKey) => {
    resolvedWeights[featureKey] = weights[featureKey] ?? 0;
  });

  return {
    id: id || `custom-${Date.now()}`,
    name,
    type: 'runtime-config',
    method,
    feature_set: featureSet,
    selectedFeatures,
    weights: resolvedWeights,
    bias,
    sharpness,
    label_definition: labelDefinition,
    training_manifest: trainingManifest,
    training_filters: trainingFilters,
    fit_summary: fitSummary,
    preprocessor,
    notes,
    created_at: new Date().toISOString()
  };
};

const createHelpers = (baseData, teamPagesById, options = {}) => {
  const { bracketDefinition, featureStore, regionLabelLookup, slotMap, teamMap } = baseData;
  const {
    customRuntimeModelsById = {},
    modelManifestById = {},
    precomputedPredictionsByModelId = {},
    defaultModelId = modelsManifest.default_model_id
  } = options;

  const featureRankings = featureDefinitions.reduce((acc, definition) => {
    const rankedTeams = Object.entries(featureStore.teams)
      .map(([teamId, features]) => ({
        teamId: Number(teamId),
        value: features[definition.key]
      }))
      .filter((entry) => Number.isFinite(entry.value))
      .sort((entryA, entryB) => {
        if (definition.higherIsBetter === false) {
          return entryA.value - entryB.value || entryA.teamId - entryB.teamId;
        }

        return entryB.value - entryA.value || entryA.teamId - entryB.teamId;
      });

    acc[definition.key] = rankedTeams.reduce((rankingMap, entry, index) => {
      rankingMap[entry.teamId] = {
        rank: index + 1,
        value: entry.value
      };
      return rankingMap;
    }, {});

    return acc;
  }, {});
  const bracketSeedTeamIds = new Set(
    bracketDefinition.slots.flatMap((slot) => [slot.team_1, slot.team_2])
      .filter((teamRef) => teamRef?.source === 'seed' && teamRef?.team_id)
      .map((teamRef) => Number(teamRef.team_id))
  );
  const slotParentMap = bracketDefinition.slots.reduce((acc, slot) => {
    [slot.team_1, slot.team_2].forEach((teamRef) => {
      if (teamRef?.source === 'winner' && teamRef?.source_slot) {
        acc[teamRef.source_slot] = slot.slot;
      }
    });
    return acc;
  }, {});
  const roundLabelLookup = {
    1: 'First Four',
    2: 'Round 1',
    3: 'Round of 32',
    4: 'Sweet 16',
    5: 'Elite 8',
    6: 'Final Four',
    7: 'Championship',
    8: 'Champion'
  };

  const getTeamEntry = (teamId) => teamMap[Number(teamId)] || null;
  const getTeamPage = (teamId) => teamPagesById[String(teamId)] || null;
  const getSlot = (slotId) => slotMap[slotId] || null;
  const getRegionLabel = (regionCode) => regionLabelLookup[regionCode] || regionCode;
  const getFeatureRankingsForTeams = (teamIds, featureKey) => {
    const definition = featureDefinitions.find((feature) => feature.key === featureKey);
    const rankingMap = featureRankings[featureKey] || {};

    return [...new Set(teamIds.map((teamId) => Number(teamId)).filter(Boolean))]
      .map((teamId) => {
        const rankEntry = rankingMap[teamId];
        const team = getTeamEntry(teamId);

        if (!rankEntry || !team) {
          return null;
        }

        return {
          teamId,
          team,
          rank: rankEntry.rank,
          value: rankEntry.value,
          formattedValue: definition?.formatter ? definition.formatter(rankEntry.value) : String(rankEntry.value)
        };
      })
      .filter(Boolean)
      .sort((entryA, entryB) => entryA.rank - entryB.rank || entryA.team.short_name.localeCompare(entryB.team.short_name));
  };

  const getSlotParticipants = (slotId, picks = {}) => {
    const slot = getSlot(slotId);
    if (!slot) {
      return { team1Id: null, team2Id: null };
    }

    const resolveSide = (teamRef) => {
      if (teamRef.source === 'seed') {
        return teamRef.team_id ?? null;
      }
      if (teamRef.source === 'winner') {
        return picks[teamRef.source_slot] || null;
      }
      return null;
    };

    return {
      team1Id: resolveSide(slot.team_1),
      team2Id: resolveSide(slot.team_2)
    };
  };

  const buildDistributionResolver = (picks = {}, modelId = defaultModelId) => {
    const distributionCache = new Map();

    const addProbability = (distribution, teamId, probability) => {
      if (!teamId || !Number.isFinite(probability) || probability <= 0) {
        return;
      }
      distribution[teamId] = (distribution[teamId] || 0) + probability;
    };

    const getWinnerDistribution = (targetSlotId) => {
      const cacheKey = `${targetSlotId}|${modelId}|${picks[targetSlotId] || ''}`;
      if (distributionCache.has(cacheKey)) {
        return distributionCache.get(cacheKey);
      }

      const slot = getSlot(targetSlotId);
      if (!slot) {
        const emptyResult = {};
        distributionCache.set(cacheKey, emptyResult);
        return emptyResult;
      }

      if (picks[targetSlotId]) {
        const pickedResult = { [picks[targetSlotId]]: 1 };
        distributionCache.set(cacheKey, pickedResult);
        return pickedResult;
      }

      const leftDistribution = resolveTeamReferenceDistribution(slot.team_1);
      const rightDistribution = resolveTeamReferenceDistribution(slot.team_2);
      const winnerDistribution = {};

      Object.entries(leftDistribution).forEach(([teamAId, teamAReachProbability]) => {
        Object.entries(rightDistribution).forEach(([teamBId, teamBReachProbability]) => {
          const matchupProbability = teamAReachProbability * teamBReachProbability;
          const prediction = predictMatchup(teamAId, teamBId, modelId);

          if (!prediction || matchupProbability <= 0) {
            return;
          }

          addProbability(winnerDistribution, teamAId, matchupProbability * prediction.teamAProbability);
          addProbability(winnerDistribution, teamBId, matchupProbability * prediction.teamBProbability);
        });
      });

      distributionCache.set(cacheKey, winnerDistribution);
      return winnerDistribution;
    };

    const resolveTeamReferenceDistribution = (teamRef) => {
      if (!teamRef) {
        return {};
      }

      if (teamRef.source === 'seed') {
        return teamRef.team_id ? { [teamRef.team_id]: 1 } : {};
      }

      if (teamRef.source === 'winner') {
        if (picks[teamRef.source_slot]) {
          return { [picks[teamRef.source_slot]]: 1 };
        }
        return getWinnerDistribution(teamRef.source_slot);
      }

      return {};
    };

    return {
      addProbability,
      getWinnerDistribution,
      resolveTeamReferenceDistribution
    };
  };

  const warnOnceAboutMissingPrecomputedPrediction = (modelId, predictionKey, reversePredictionKey, precomputedArtifact) => {
    const warningKey = `${modelId}:${predictionKey}`;
    if (precomputedPredictionWarningCache.has(warningKey) || !isBrowser()) {
      return;
    }

    precomputedPredictionWarningCache.add(warningKey);

    const predictionCount = Object.keys(precomputedArtifact?.predictions || {}).length;
    const coveredTeamCount = Array.isArray(precomputedArtifact?.team_ids) ? precomputedArtifact.team_ids.length : 0;
    console.warn(
      `[MM2026] Missing precomputed prediction for ${predictionKey} (checked ${reversePredictionKey}) in model ${modelId}.`,
      {
        modelId,
        predictionKey,
        reversePredictionKey,
        predictionCount,
        coveredTeamCount,
        artifactSeason: precomputedArtifact?.season,
        artifactModel: precomputedArtifact?.model?.id || null
      }
    );
  };

  const warnOnceAboutPrecomputedCoverageMismatch = (modelId, precomputedArtifact) => {
    if (precomputedCoverageWarningCache.has(modelId) || !isBrowser()) {
      return;
    }

    const artifactTeamIds = new Set((precomputedArtifact?.team_ids || []).map(Number).filter(Boolean));
    const missingTeamIds = [...bracketSeedTeamIds].filter((teamId) => !artifactTeamIds.has(teamId));
    const extraTeamIds = [...artifactTeamIds].filter((teamId) => !bracketSeedTeamIds.has(teamId));

    if (!missingTeamIds.length && !extraTeamIds.length) {
      return;
    }

    precomputedCoverageWarningCache.add(modelId);

    console.warn(
      `[MM2026] Precomputed model ${modelId} team coverage does not match the published bracket field.`,
      {
        modelId,
        bracketTeamCount: bracketSeedTeamIds.size,
        artifactTeamCount: artifactTeamIds.size,
        missingTeamIds,
        extraTeamIds,
        missingTeams: missingTeamIds.map((teamId) => teamMap[teamId]?.short_name || teamId),
        extraTeams: extraTeamIds.map((teamId) => teamMap[teamId]?.short_name || teamId)
      }
    );
  };

  const warnOnceAboutUnsupportedModel = (modelId, manifestEntry) => {
    if (unsupportedModelWarningCache.has(modelId) || !isBrowser()) {
      return;
    }

    unsupportedModelWarningCache.add(modelId);

    console.warn(`[MM2026] Model ${modelId} is present in the manifest but has no supported runtime in the website client.`, {
      modelId,
      predictionFormat: manifestEntry?.prediction_format || null,
      modelType: manifestEntry?.type || null,
      configUrl: manifestEntry?.config_url || null,
      predictionsUrl: manifestEntry?.predictions_url || null
    });
  };

  const predictCustomMatchup = (teamAId, teamBId, runtimeModel) => {
    const teamA = featureStore.teams[String(teamAId)] || featureStore.teams[teamAId];
    const teamB = featureStore.teams[String(teamBId)] || featureStore.teams[teamBId];
    if (!teamA || !teamB || !runtimeModel) {
      return null;
    }

    const contributions = runtimeModel.selectedFeatures.map((featureKey) => {
      const teamAValue = teamA[featureKey];
      const teamBValue = teamB[featureKey];
      const diff = normalizeDifference(featureKey, teamAValue, teamBValue);
      const weight = runtimeModel.weights[featureKey] ?? 0;
      return {
        featureKey,
        weight,
        diff,
        contribution: weight * diff,
        teamAValue,
        teamBValue
      };
    });

    const rawScore = contributions.reduce((sum, entry) => sum + entry.contribution, runtimeModel.bias ?? 0);
    const sharpness = runtimeModel.sharpness ?? 1;
    const probabilityA = runtimeModel.method === 'weighted-score'
      ? logistic(rawScore * sharpness * 0.72)
      : logistic(rawScore * sharpness);
    const winnerId = probabilityA >= 0.5 ? Number(teamAId) : Number(teamBId);

    return {
      winnerId,
      teamAProbability: probabilityA,
      teamBProbability: 1 - probabilityA,
      explanation: runtimeModel?.name
        ? `${runtimeModel.name} using the live 2026 feature export.`
        : 'Browser-native weighted model using the live 2026 feature export.',
      rawScore,
      contributions
    };
  };

  const predictMatchup = (teamAId, teamBId, modelId = defaultModelId) => {
    const teamA = featureStore.teams[String(teamAId)] || featureStore.teams[teamAId];
    const teamB = featureStore.teams[String(teamBId)] || featureStore.teams[teamBId];
    if (!teamA || !teamB) {
      return null;
    }

    const customRuntimeModel = customRuntimeModelsById[modelId] || null;
    if (customRuntimeModel) {
      return predictCustomMatchup(teamAId, teamBId, customRuntimeModel);
    }

    const manifestEntry = modelManifestById[modelId] || null;
    const precomputedArtifact = precomputedPredictionsByModelId[modelId] || null;
    if (manifestEntry?.prediction_format === 'precomputed' && precomputedArtifact) {
      warnOnceAboutPrecomputedCoverageMismatch(modelId, precomputedArtifact);

      const predictionKey = `${Number(teamAId)}:${Number(teamBId)}`;
      const reversePredictionKey = `${Number(teamBId)}:${Number(teamAId)}`;
      const prediction = precomputedArtifact.predictions?.[predictionKey]
        || precomputedArtifact.predictions?.[reversePredictionKey]
        || null;

      if (!prediction) {
        warnOnceAboutMissingPrecomputedPrediction(modelId, predictionKey, reversePredictionKey, precomputedArtifact);
        return null;
      }

      return {
        winnerId: prediction.winnerId,
        teamAProbability: prediction.teamAProbability,
        teamBProbability: prediction.teamBProbability,
        explanation: manifestEntry.description || `${manifestEntry.name} precomputed lookup.`
      };
    }

    if (modelId === 'coin-flip') {
      const coinValue = deterministicCoin(Number(teamAId), Number(teamBId));
      const winnerId = coinValue >= 0.5 ? Number(teamAId) : Number(teamBId);
      return {
        winnerId,
        teamAProbability: 0.5,
        teamBProbability: 0.5,
        explanation: 'True 50/50 baseline used to mirror Rule #1 from the YDKYK article.'
      };
    }

    if (modelId === 'seed-only') {
      const seedA = teamA.Seed;
      const seedB = teamB.Seed;

      if (!Number.isFinite(seedA) || !Number.isFinite(seedB)) {
        return null;
      }

      if (seedA === seedB) {
        const coinValue = deterministicCoin(Number(teamAId), Number(teamBId));
        const winnerId = coinValue >= 0.5 ? Number(teamAId) : Number(teamBId);

        return {
          winnerId,
          teamAProbability: 0.5,
          teamBProbability: 0.5,
          explanation: 'Pure seed model with a 50/50 tiebreak when teams share the same seed.'
        };
      }

      const teamAIsBetterSeed = seedA < seedB;
      return {
        winnerId: teamAIsBetterSeed ? Number(teamAId) : Number(teamBId),
        teamAProbability: teamAIsBetterSeed ? 1 : 0,
        teamBProbability: teamAIsBetterSeed ? 0 : 1,
        explanation: 'Pure seed model that always advances the better seed.'
      };
    }

    warnOnceAboutUnsupportedModel(modelId, manifestEntry);
    return null;
  };

  const getSlotProbabilityBreakdown = (slotId, picks = {}, modelId = defaultModelId) => {
    const { addProbability, getWinnerDistribution, resolveTeamReferenceDistribution } = buildDistributionResolver(picks, modelId);

    const toSortedEntries = (distribution) => Object.entries(distribution)
      .map(([teamId, probability]) => {
        const entry = getTeamEntry(teamId);
        return {
          teamId: Number(teamId),
          probability,
          team: entry
        };
      })
      .filter((entry) => entry.team)
      .sort((entryA, entryB) => entryB.probability - entryA.probability || entryA.team.short_name.localeCompare(entryB.team.short_name));

    const slot = getSlot(slotId);
    if (!slot) {
      return {
        participantProbabilities: [],
        winnerProbabilities: []
      };
    }

    const participantDistribution = {};
    const leftParticipants = resolveTeamReferenceDistribution(slot.team_1);
    const rightParticipants = resolveTeamReferenceDistribution(slot.team_2);

    Object.entries(leftParticipants).forEach(([teamId, probability]) => addProbability(participantDistribution, teamId, probability));
    Object.entries(rightParticipants).forEach(([teamId, probability]) => addProbability(participantDistribution, teamId, probability));

    return {
      participantProbabilities: toSortedEntries(participantDistribution),
      winnerProbabilities: toSortedEntries(getWinnerDistribution(slotId))
    };
  };

  const getPotentialMatchupsByRound = (teamId, modelId = defaultModelId, picks = {}) => {
    const normalizedTeamId = Number(teamId);
    if (!normalizedTeamId) {
      return [];
    }

    const openingSlot = findTeamOpeningSlot(normalizedTeamId);
    if (!openingSlot) {
      return [];
    }

    const { resolveTeamReferenceDistribution } = buildDistributionResolver(picks, modelId);
    const matchupGroups = [];
    let currentSlot = openingSlot;

    while (slotParentMap[currentSlot.slot]) {
      const nextSlot = getSlot(slotParentMap[currentSlot.slot]);
      if (!nextSlot) {
        break;
      }

      const currentFeedsLeft = nextSlot.team_1?.source === 'winner' && nextSlot.team_1?.source_slot === currentSlot.slot;
      const opponentReference = currentFeedsLeft ? nextSlot.team_2 : nextSlot.team_1;
      const opponentDistribution = resolveTeamReferenceDistribution(opponentReference);
      const opponents = Object.entries(opponentDistribution)
        .map(([opponentId, reachProbability]) => {
          const normalizedOpponentId = Number(opponentId);
          const opponent = getTeamEntry(normalizedOpponentId);
          const prediction = predictMatchup(normalizedTeamId, normalizedOpponentId, modelId);

          if (!opponent || !prediction || normalizedOpponentId === normalizedTeamId) {
            return null;
          }

          return {
            teamId: normalizedOpponentId,
            team: opponent,
            reachProbability,
            winProbability: prediction.teamAProbability,
            loseProbability: prediction.teamBProbability,
            explanation: prediction.explanation
          };
        })
        .filter(Boolean)
        .sort((entryA, entryB) => (
          entryB.reachProbability - entryA.reachProbability
          || entryB.winProbability - entryA.winProbability
          || entryA.team.short_name.localeCompare(entryB.team.short_name)
        ));

      matchupGroups.push({
        slotId: nextSlot.slot,
        round: nextSlot.round,
        roundLabel: roundLabelLookup[nextSlot.round] || `Round ${nextSlot.round}`,
        opponents
      });

      currentSlot = nextSlot;
    }

    return matchupGroups;
  };

  const fillSlotThrough = (slotId, picks = {}, modelId = defaultModelId) => {
    const nextPicks = { ...picks };
    const slot = getSlot(slotId);
    if (!slot) {
      return nextPicks;
    }

    [slot.team_1, slot.team_2].forEach((teamRef) => {
      if (teamRef.source === 'winner' && !nextPicks[teamRef.source_slot]) {
        Object.assign(nextPicks, fillSlotThrough(teamRef.source_slot, nextPicks, modelId));
      }
    });

    const { team1Id, team2Id } = getSlotParticipants(slotId, nextPicks);
    if (!team1Id || !team2Id) {
      return nextPicks;
    }

    const prediction = predictMatchup(team1Id, team2Id, modelId);
    if (!prediction) {
      if (isBrowser()) {
        console.warn(`[MM2026] Could not autofill slot ${slotId} for model ${modelId}.`, {
          slotId,
          modelId,
          team1Id,
          team2Id
        });
      }
      return nextPicks;
    }

    nextPicks[slotId] = prediction.winnerId;
    return nextPicks;
  };

  const fillSlotThroughCustom = (slotId, picks = {}, runtimeModel) => {
    const nextPicks = { ...picks };
    const slot = getSlot(slotId);
    if (!slot) {
      return nextPicks;
    }

    [slot.team_1, slot.team_2].forEach((teamRef) => {
      if (teamRef.source === 'winner' && !nextPicks[teamRef.source_slot]) {
        Object.assign(nextPicks, fillSlotThroughCustom(teamRef.source_slot, nextPicks, runtimeModel));
      }
    });

    const { team1Id, team2Id } = getSlotParticipants(slotId, nextPicks);
    if (!team1Id || !team2Id) {
      return nextPicks;
    }

    const prediction = predictCustomMatchup(team1Id, team2Id, runtimeModel);
    if (prediction) {
      nextPicks[slotId] = prediction.winnerId;
    }
    return nextPicks;
  };

  const findTeamOpeningSlot = (teamId) => bracketDefinition.slots
    .filter((slot) => [slot.team_1.team_id, slot.team_2.team_id].includes(Number(teamId)))
    .sort((slotA, slotB) => slotA.round - slotB.round)[0] || null;

  return {
    bracketDefinition,
    featureStore,
    getSlot,
    getSlotParticipants,
    getTeamEntry,
    getTeamPage,
    getRegionLabel,
    fillSlotThrough,
    fillSlotThroughCustom,
    findTeamOpeningSlot,
    getFeatureRankingsForTeams,
    getPotentialMatchupsByRound,
    getSlotProbabilityBreakdown,
    predictCustomMatchup,
    predictMatchup,
    teamIndex: baseData.teamIndex
  };
};

const useMM2026Data = () => {
  const [baseData, setBaseData] = useState(baseDataCache);
  const [teamPagesById, setTeamPagesById] = useState(() => Object.fromEntries(teamPageCache.entries()));
  const [customRuntimeModels, setCustomRuntimeModels] = useState([]);
  const [publishedModelsManifest, setPublishedModelsManifest] = useState(publishedModelsManifestCache);
  const [precomputedPredictionsByModelId, setPrecomputedPredictionsByModelId] = useState(() => Object.fromEntries(precomputedPredictionsCache.entries()));
  const [activeModelId, setActiveModelIdState] = useState(modelsManifest.default_model_id);
  const [activeModelReady, setActiveModelReady] = useState(!isBrowser());
  const [loading, setLoading] = useState(!baseDataCache);
  const [error, setError] = useState(null);

  useEffect(() => {
    const nextCustomModels = loadStoredCustomRuntimeModels();
    setCustomRuntimeModels(nextCustomModels);

    const storedActiveModelId = getStoredActiveModelId();
    if (storedActiveModelId) {
      setActiveModelIdState(storedActiveModelId);
    }

    setActiveModelReady(true);
  }, []);

  useEffect(() => {
    let cancelled = false;

    if (baseData) {
      setLoading(false);
      return undefined;
    }

    loadBaseData()
      .then((nextBaseData) => {
        if (!cancelled) {
          setBaseData(nextBaseData);
          setLoading(false);
        }
      })
      .catch((nextError) => {
        if (!cancelled) {
          setError(nextError);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [baseData]);

  useEffect(() => {
    let cancelled = false;

    if (publishedModelsManifest) {
      return undefined;
    }

    loadPublishedModelsManifest()
      .then((nextManifest) => {
        if (!cancelled) {
          setPublishedModelsManifest(nextManifest);
        }
      })
      .catch((nextError) => {
        if (!cancelled) {
          setError(nextError);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [publishedModelsManifest]);

  const customRuntimeModelsById = useMemo(() => customRuntimeModels.reduce((acc, model) => {
    acc[model.id] = model;
    return acc;
  }, {}), [customRuntimeModels]);

  const mergedModelsManifest = useMemo(() => {
    const publishedModels = publishedModelsManifest?.models || [];
    const publishedModelIds = new Set(publishedModels.map((model) => model.id));
    const builtInModels = [
      ...modelsManifest.models.filter((model) => !publishedModelIds.has(model.id)),
      ...publishedModels
    ];
    const builtInModelIds = new Set(builtInModels.map((model) => model.id));
    const customModels = customRuntimeModels
      .filter((model) => !builtInModelIds.has(model.id))
      .map(toCustomModelManifestEntry);
    const allModels = [...builtInModels, ...customModels];
    const allModelIds = new Set(allModels.map((model) => model.id));
    const publishedDefaultModelId = publishedModelsManifest?.default_model_id;
    const fallbackDefaultModelId = allModelIds.has(modelsManifest.default_model_id)
      ? modelsManifest.default_model_id
      : allModels[0]?.id || modelsManifest.default_model_id;
    const manifestDefaultModelId = publishedDefaultModelId && allModelIds.has(publishedDefaultModelId)
      ? publishedDefaultModelId
      : fallbackDefaultModelId;
    return {
      ...(publishedModelsManifest || modelsManifest),
      default_model_id: manifestDefaultModelId,
      models: allModels
    };
  }, [activeModelId, customRuntimeModels, publishedModelsManifest]);

  const modelManifestById = useMemo(() => (mergedModelsManifest.models || []).reduce((acc, model) => {
    acc[model.id] = model;
    return acc;
  }, {}), [mergedModelsManifest.models]);

  const setActiveModelId = (modelId) => {
    setActiveModelIdState(modelId || modelsManifest.default_model_id);
    setStoredActiveModelId(modelId || modelsManifest.default_model_id);
  };

  const saveRuntimeModelToLibrary = (runtimeModel) => {
    const savedModel = persistCustomRuntimeModel(runtimeModel);
    if (!savedModel) {
      return null;
    }

    setCustomRuntimeModels((current) => [
      savedModel,
      ...current.filter((model) => model.id !== savedModel.id)
    ]);
    setActiveModelIdState(savedModel.id);
    return savedModel;
  };

  useEffect(() => {
    const precomputedModels = (mergedModelsManifest.models || []).filter((model) => model.prediction_format === 'precomputed' && model.predictions_url);
    if (!precomputedModels.length) {
      return undefined;
    }

    let cancelled = false;

    Promise.all(precomputedModels.map(async (model) => {
      const payload = await loadPrecomputedPredictionsArtifact(model.id, model.predictions_url);
      return [model.id, payload];
    }))
      .then((entries) => {
        if (cancelled) {
          return;
        }

        setPrecomputedPredictionsByModelId((current) => {
          const nextState = { ...current };
          let hasChanges = false;

          entries.forEach(([modelId, payload]) => {
            if (nextState[modelId] !== payload) {
              nextState[modelId] = payload;
              hasChanges = true;
            }
          });

          return hasChanges ? nextState : current;
        });
      })
      .catch((nextError) => {
        if (!cancelled) {
          setError(nextError);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [mergedModelsManifest.models]);

  const helpers = useMemo(() => {
    if (!baseData) {
      return null;
    }
    return createHelpers(baseData, teamPagesById, {
      customRuntimeModelsById,
      modelManifestById,
      precomputedPredictionsByModelId,
      defaultModelId: modelManifestById[activeModelId]
        ? activeModelId
        : mergedModelsManifest.default_model_id
    });
  }, [activeModelId, baseData, customRuntimeModelsById, mergedModelsManifest.default_model_id, modelManifestById, precomputedPredictionsByModelId, teamPagesById]);

  const ensureTeamPage = async (teamId) => {
    if (!baseData) {
      return null;
    }

    const entry = baseData.teamMap[Number(teamId)];
    if (!entry?.team_page_path) {
      return null;
    }

    try {
      const teamPage = await loadTeamPage(teamId, entry.team_page_path);
      setTeamPagesById((current) => {
        if (current[String(teamId)] === teamPage) {
          return current;
        }
        return {
          ...current,
          [String(teamId)]: teamPage
        };
      });
      return teamPage;
    } catch (nextError) {
      setError(nextError);
      return null;
    }
  };

  return {
    SEASON,
    loading,
    error,
    activeModelId,
    activeModelReady,
    ensureTeamPage,
    modelsManifest: mergedModelsManifest,
    featureDefinitions,
    buildRuntimeModel,
    saveRuntimeModelToLibrary,
    setActiveModelId,
    ...(helpers || {})
  };
};

const useMM2026TrainingData = () => {
  const [trainingManifest, setTrainingManifest] = useState(trainingManifestCache);
  const [trainingSeasonsByYear, setTrainingSeasonsByYear] = useState(() => Object.fromEntries(trainingSeasonCache.entries()));
  const [loading, setLoading] = useState(!trainingManifestCache);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    if (trainingManifest) {
      setLoading(false);
      return undefined;
    }

    loadTrainingManifest()
      .then((nextManifest) => {
        if (!cancelled) {
          setTrainingManifest(nextManifest);
          setLoading(false);
        }
      })
      .catch((nextError) => {
        if (!cancelled) {
          setError(nextError);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [trainingManifest]);

  const ensureTrainingSeason = async (season) => {
    const seasonKey = String(season);
    if (trainingSeasonsByYear[seasonKey]) {
      return trainingSeasonsByYear[seasonKey];
    }

    try {
      const payload = await loadTrainingSeason(season, trainingManifest);
      setTrainingSeasonsByYear((current) => {
        if (current[seasonKey] === payload) {
          return current;
        }
        return {
          ...current,
          [seasonKey]: payload
        };
      });
      return payload;
    } catch (nextError) {
      setError(nextError);
      return null;
    }
  };

  return {
    loading,
    error,
    trainingManifest,
    trainingSeasonsByYear,
    ensureTrainingSeason
  };
};

const useMM2026StatExplorer = () => {
  const [payload, setPayload] = useState(statExplorerCache);
  const [loading, setLoading] = useState(!statExplorerCache);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    if (payload) {
      setLoading(false);
      return undefined;
    }

    loadStatExplorerArtifacts()
      .then((nextPayload) => {
        if (!cancelled) {
          setPayload(nextPayload);
          setLoading(false);
        }
      })
      .catch((nextError) => {
        if (!cancelled) {
          setError(nextError);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [payload]);

  return {
    loading,
    error,
    explorer: payload?.explorer || null,
    featureStore: payload?.featureStore || null,
    modelsManifest: payload?.modelsManifest || null,
    featureDefinitions: payload?.featureDefinitions || []
  };
};

export {
  SEASON,
  buildRuntimeModel,
  DATA_BASE_URL,
  featureDefinitions,
  modelsManifest,
  normalizeDifference,
  normalizeFeatureDifference,
  useMM2026Data,
  useMM2026StatExplorer,
  useMM2026TrainingData
};