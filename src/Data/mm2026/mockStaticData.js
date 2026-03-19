const SEASON = 2026;

// TODO: Replace this file with fetches to the static artifacts exported from
// the march-madness-ml repo once the browser-facing contracts are available.

const teamCatalog = [
  {
    team_id: 1001,
    name: 'Duke',
    short_name: 'Duke',
    conference: 'acc',
    seed: 1,
    region: 'West',
    slot: 'W1',
    tournament_team: true,
    stats: { AdjOE: 124.1, AdjDE: 89.8, AdjNE: 34.3, 'FG%': 0.506, 'FG3%': 0.387, 'FT%': 0.779 },
    rankings: { AdjOE: 2, AdjDE: 5, AdjNE: 1, SOS: 7, SOV: 3, 'FG%': 9, 'FG3%': 14, 'FT%': 28 },
    features: { Seed: 1, WinPct: 0.879, SOS: 0.611, SOV: 0.633, NET_last: 2, AdjOE_mean: 124.1, AdjDE_mean: 89.8, AdjNE_mean: 34.3, 'FG%_mean': 0.506, 'FG3%_mean': 0.387, 'FT%_mean': 0.779 },
    record: { overall: [29, 4], conf: [17, 3], home: [16, 1], road: [9, 2], quad_1: [8, 3], quad_2: [7, 1], quad_3: [8, 0], quad_4: [6, 0] },
    coach: 'jon_scheyer',
    ordinal_data: { NET: 2 },
    similar_teams: [
      { id: 1181, year: 2019, avg: 0.971, res: 0.982, st: 0.96, er: 'Elite Eight' },
      { id: 1314, year: 2015, avg: 0.966, res: 0.973, st: 0.959, er: 'Champion' },
      { id: 1246, year: 2022, avg: 0.962, res: 0.968, st: 0.956, er: 'Final Four' }
    ]
  },
  {
    team_id: 1002,
    name: 'Maryland',
    short_name: 'Maryland',
    conference: 'big_ten',
    seed: 4,
    region: 'West',
    slot: 'W4',
    tournament_team: true,
    stats: { AdjOE: 116.8, AdjDE: 95.4, AdjNE: 21.4, 'FG%': 0.487, 'FG3%': 0.364, 'FT%': 0.752 },
    rankings: { AdjOE: 18, AdjDE: 21, AdjNE: 13, SOS: 18, SOV: 17, 'FG%': 37, 'FG3%': 46, 'FT%': 74 },
    features: { Seed: 4, WinPct: 0.758, SOS: 0.589, SOV: 0.578, NET_last: 15, AdjOE_mean: 116.8, AdjDE_mean: 95.4, AdjNE_mean: 21.4, 'FG%_mean': 0.487, 'FG3%_mean': 0.364, 'FT%_mean': 0.752 },
    record: { overall: [25, 8], conf: [13, 7], home: [15, 2], road: [7, 5], quad_1: [6, 5], quad_2: [6, 2], quad_3: [7, 0], quad_4: [6, 1] },
    coach: 'kevin_willard',
    ordinal_data: { NET: 15 },
    similar_teams: [
      { id: 1277, year: 2024, avg: 0.954, res: 0.949, st: 0.959, er: 'Second Round' },
      { id: 1400, year: 2016, avg: 0.949, res: 0.941, st: 0.957, er: 'Sweet Sixteen' },
      { id: 1211, year: 2021, avg: 0.943, res: 0.936, st: 0.95, er: 'Second Round' }
    ]
  },
  {
    team_id: 1003,
    name: 'Wisconsin',
    short_name: 'Wisconsin',
    conference: 'big_ten',
    seed: 2,
    region: 'West',
    slot: 'W2',
    tournament_team: true,
    stats: { AdjOE: 120.1, AdjDE: 93.8, AdjNE: 26.3, 'FG%': 0.501, 'FG3%': 0.372, 'FT%': 0.807 },
    rankings: { AdjOE: 8, AdjDE: 13, AdjNE: 7, SOS: 11, SOV: 9, 'FG%': 15, 'FG3%': 28, 'FT%': 4 },
    features: { Seed: 2, WinPct: 0.848, SOS: 0.603, SOV: 0.612, NET_last: 8, AdjOE_mean: 120.1, AdjDE_mean: 93.8, AdjNE_mean: 26.3, 'FG%_mean': 0.501, 'FG3%_mean': 0.372, 'FT%_mean': 0.807 },
    record: { overall: [28, 5], conf: [16, 4], home: [16, 1], road: [8, 3], quad_1: [7, 4], quad_2: [8, 1], quad_3: [7, 0], quad_4: [6, 0] },
    coach: 'greg_gard',
    ordinal_data: { NET: 8 },
    similar_teams: [
      { id: 1112, year: 2017, avg: 0.962, res: 0.955, st: 0.969, er: 'Sweet Sixteen' },
      { id: 1437, year: 2020, avg: 0.954, res: 0.948, st: 0.96, er: null },
      { id: 1321, year: 2023, avg: 0.951, res: 0.946, st: 0.956, er: 'Second Round' }
    ]
  },
  {
    team_id: 1004,
    name: 'Creighton',
    short_name: 'Creighton',
    conference: 'big_east',
    seed: 3,
    region: 'West',
    slot: 'W3',
    tournament_team: true,
    stats: { AdjOE: 119.3, AdjDE: 95.0, AdjNE: 24.3, 'FG%': 0.495, 'FG3%': 0.381, 'FT%': 0.764 },
    rankings: { AdjOE: 11, AdjDE: 19, AdjNE: 10, SOS: 20, SOV: 18, 'FG%': 25, 'FG3%': 19, 'FT%': 43 },
    features: { Seed: 3, WinPct: 0.788, SOS: 0.58, SOV: 0.566, NET_last: 12, AdjOE_mean: 119.3, AdjDE_mean: 95.0, AdjNE_mean: 24.3, 'FG%_mean': 0.495, 'FG3%_mean': 0.381, 'FT%_mean': 0.764 },
    record: { overall: [26, 7], conf: [14, 6], home: [14, 2], road: [8, 4], quad_1: [6, 5], quad_2: [7, 1], quad_3: [7, 1], quad_4: [6, 0] },
    coach: 'greg_mcdermott',
    ordinal_data: { NET: 12 },
    similar_teams: [
      { id: 1143, year: 2023, avg: 0.958, res: 0.949, st: 0.967, er: 'Elite Eight' },
      { id: 1179, year: 2018, avg: 0.951, res: 0.941, st: 0.961, er: 'Second Round' },
      { id: 1399, year: 2022, avg: 0.947, res: 0.938, st: 0.956, er: 'First Round' }
    ]
  },
  {
    team_id: 1005,
    name: 'Houston',
    short_name: 'Houston',
    conference: 'big_twelve',
    seed: 1,
    region: 'Midwest',
    slot: 'M1',
    tournament_team: true,
    stats: { AdjOE: 121.7, AdjDE: 87.1, AdjNE: 34.6, 'FG%': 0.493, 'FG3%': 0.369, 'FT%': 0.744 },
    rankings: { AdjOE: 5, AdjDE: 1, AdjNE: 2, SOS: 2, SOV: 1, 'FG%': 29, 'FG3%': 33, 'FT%': 85 },
    features: { Seed: 1, WinPct: 0.909, SOS: 0.648, SOV: 0.652, NET_last: 1, AdjOE_mean: 121.7, AdjDE_mean: 87.1, AdjNE_mean: 34.6, 'FG%_mean': 0.493, 'FG3%_mean': 0.369, 'FT%_mean': 0.744 },
    record: { overall: [30, 3], conf: [18, 2], home: [17, 0], road: [10, 2], quad_1: [10, 2], quad_2: [7, 1], quad_3: [7, 0], quad_4: [6, 0] },
    coach: 'kelvin_sampson',
    ordinal_data: { NET: 1 },
    similar_teams: [
      { id: 1111, year: 2024, avg: 0.978, res: 0.981, st: 0.975, er: 'Sweet Sixteen' },
      { id: 1226, year: 2023, avg: 0.972, res: 0.979, st: 0.965, er: 'Sweet Sixteen' },
      { id: 1186, year: 2018, avg: 0.968, res: 0.973, st: 0.963, er: 'Second Round' }
    ]
  },
  {
    team_id: 1006,
    name: 'Michigan State',
    short_name: 'Michigan St',
    conference: 'big_ten',
    seed: 4,
    region: 'Midwest',
    slot: 'M4',
    tournament_team: true,
    stats: { AdjOE: 115.9, AdjDE: 94.4, AdjNE: 21.5, 'FG%': 0.485, 'FG3%': 0.361, 'FT%': 0.736 },
    rankings: { AdjOE: 22, AdjDE: 16, AdjNE: 14, SOS: 16, SOV: 14, 'FG%': 42, 'FG3%': 52, 'FT%': 111 },
    features: { Seed: 4, WinPct: 0.758, SOS: 0.592, SOV: 0.576, NET_last: 16, AdjOE_mean: 115.9, AdjDE_mean: 94.4, AdjNE_mean: 21.5, 'FG%_mean': 0.485, 'FG3%_mean': 0.361, 'FT%_mean': 0.736 },
    record: { overall: [25, 8], conf: [13, 7], home: [14, 2], road: [8, 5], quad_1: [7, 5], quad_2: [5, 2], quad_3: [7, 0], quad_4: [6, 1] },
    coach: 'tom_izzo',
    ordinal_data: { NET: 16 },
    similar_teams: [
      { id: 1307, year: 2019, avg: 0.956, res: 0.948, st: 0.964, er: 'Final Four' },
      { id: 1128, year: 2022, avg: 0.949, res: 0.94, st: 0.958, er: 'Second Round' },
      { id: 1150, year: 2017, avg: 0.944, res: 0.937, st: 0.951, er: 'Second Round' }
    ]
  },
  {
    team_id: 1007,
    name: 'Tennessee',
    short_name: 'Tennessee',
    conference: 'sec',
    seed: 2,
    region: 'Midwest',
    slot: 'M2',
    tournament_team: true,
    stats: { AdjOE: 118.8, AdjDE: 91.9, AdjNE: 26.9, 'FG%': 0.482, 'FG3%': 0.356, 'FT%': 0.761 },
    rankings: { AdjOE: 13, AdjDE: 9, AdjNE: 6, SOS: 6, SOV: 8, 'FG%': 49, 'FG3%': 61, 'FT%': 46 },
    features: { Seed: 2, WinPct: 0.848, SOS: 0.616, SOV: 0.601, NET_last: 6, AdjOE_mean: 118.8, AdjDE_mean: 91.9, AdjNE_mean: 26.9, 'FG%_mean': 0.482, 'FG3%_mean': 0.356, 'FT%_mean': 0.761 },
    record: { overall: [28, 5], conf: [14, 4], home: [16, 1], road: [8, 3], quad_1: [8, 4], quad_2: [6, 1], quad_3: [8, 0], quad_4: [6, 0] },
    coach: 'rick_barnes',
    ordinal_data: { NET: 6 },
    similar_teams: [
      { id: 1431, year: 2024, avg: 0.962, res: 0.957, st: 0.967, er: 'Elite Eight' },
      { id: 1171, year: 2018, avg: 0.953, res: 0.945, st: 0.961, er: 'Second Round' },
      { id: 1232, year: 2021, avg: 0.947, res: 0.94, st: 0.954, er: 'First Round' }
    ]
  },
  {
    team_id: 1008,
    name: 'Texas Tech',
    short_name: 'Texas Tech',
    conference: 'big_twelve',
    seed: 3,
    region: 'Midwest',
    slot: 'M3',
    tournament_team: true,
    stats: { AdjOE: 117.9, AdjDE: 93.7, AdjNE: 24.2, 'FG%': 0.478, 'FG3%': 0.359, 'FT%': 0.748 },
    rankings: { AdjOE: 16, AdjDE: 12, AdjNE: 11, SOS: 8, SOV: 12, 'FG%': 58, 'FG3%': 56, 'FT%': 79 },
    features: { Seed: 3, WinPct: 0.788, SOS: 0.604, SOV: 0.589, NET_last: 11, AdjOE_mean: 117.9, AdjDE_mean: 93.7, AdjNE_mean: 24.2, 'FG%_mean': 0.478, 'FG3%_mean': 0.359, 'FT%_mean': 0.748 },
    record: { overall: [26, 7], conf: [13, 7], home: [14, 2], road: [8, 4], quad_1: [6, 5], quad_2: [7, 1], quad_3: [7, 1], quad_4: [6, 0] },
    coach: 'grant_mcCasland',
    ordinal_data: { NET: 11 },
    similar_teams: [
      { id: 1120, year: 2019, avg: 0.964, res: 0.967, st: 0.961, er: 'Runner-Up' },
      { id: 1200, year: 2022, avg: 0.955, res: 0.959, st: 0.951, er: 'Sweet Sixteen' },
      { id: 1280, year: 2025, avg: 0.949, res: 0.952, st: 0.946, er: 'Second Round' }
    ]
  },
  {
    team_id: 1009,
    name: 'Auburn',
    short_name: 'Auburn',
    conference: 'sec',
    seed: 1,
    region: 'South',
    slot: 'S1',
    tournament_team: true,
    stats: { AdjOE: 122.3, AdjDE: 90.6, AdjNE: 31.7, 'FG%': 0.497, 'FG3%': 0.374, 'FT%': 0.742 },
    rankings: { AdjOE: 4, AdjDE: 7, AdjNE: 3, SOS: 4, SOV: 4, 'FG%': 21, 'FG3%': 25, 'FT%': 94 },
    features: { Seed: 1, WinPct: 0.879, SOS: 0.623, SOV: 0.624, NET_last: 3, AdjOE_mean: 122.3, AdjDE_mean: 90.6, AdjNE_mean: 31.7, 'FG%_mean': 0.497, 'FG3%_mean': 0.374, 'FT%_mean': 0.742 },
    record: { overall: [29, 4], conf: [15, 3], home: [15, 1], road: [10, 2], quad_1: [9, 3], quad_2: [7, 1], quad_3: [7, 0], quad_4: [6, 0] },
    coach: 'bruce_pearl',
    ordinal_data: { NET: 3 },
    similar_teams: [
      { id: 1190, year: 2019, avg: 0.968, res: 0.966, st: 0.97, er: 'Final Four' },
      { id: 1301, year: 2024, avg: 0.961, res: 0.96, st: 0.962, er: 'First Round' },
      { id: 1188, year: 2022, avg: 0.953, res: 0.95, st: 0.956, er: 'Second Round' }
    ]
  },
  {
    team_id: 1010,
    name: 'Iowa State',
    short_name: 'Iowa State',
    conference: 'big_twelve',
    seed: 4,
    region: 'South',
    slot: 'S4',
    tournament_team: true,
    stats: { AdjOE: 114.9, AdjDE: 92.7, AdjNE: 22.2, 'FG%': 0.472, 'FG3%': 0.347, 'FT%': 0.744 },
    rankings: { AdjOE: 27, AdjDE: 11, AdjNE: 12, SOS: 5, SOV: 11, 'FG%': 76, 'FG3%': 97, 'FT%': 93 },
    features: { Seed: 4, WinPct: 0.758, SOS: 0.607, SOV: 0.586, NET_last: 13, AdjOE_mean: 114.9, AdjDE_mean: 92.7, AdjNE_mean: 22.2, 'FG%_mean': 0.472, 'FG3%_mean': 0.347, 'FT%_mean': 0.744 },
    record: { overall: [25, 8], conf: [12, 8], home: [15, 2], road: [7, 5], quad_1: [6, 6], quad_2: [6, 1], quad_3: [7, 0], quad_4: [6, 1] },
    coach: 'tj_otzelberger',
    ordinal_data: { NET: 13 },
    similar_teams: [
      { id: 1244, year: 2024, avg: 0.955, res: 0.958, st: 0.952, er: 'Sweet Sixteen' },
      { id: 1157, year: 2017, avg: 0.946, res: 0.95, st: 0.942, er: 'Second Round' },
      { id: 1208, year: 2023, avg: 0.941, res: 0.945, st: 0.937, er: 'First Round' }
    ]
  },
  {
    team_id: 1011,
    name: 'Alabama',
    short_name: 'Alabama',
    conference: 'sec',
    seed: 2,
    region: 'South',
    slot: 'S2',
    tournament_team: true,
    stats: { AdjOE: 123.5, AdjDE: 95.5, AdjNE: 28.0, 'FG%': 0.491, 'FG3%': 0.39, 'FT%': 0.719 },
    rankings: { AdjOE: 3, AdjDE: 23, AdjNE: 5, SOS: 10, SOV: 7, 'FG%': 34, 'FG3%': 10, 'FT%': 154 },
    features: { Seed: 2, WinPct: 0.848, SOS: 0.599, SOV: 0.607, NET_last: 5, AdjOE_mean: 123.5, AdjDE_mean: 95.5, AdjNE_mean: 28.0, 'FG%_mean': 0.491, 'FG3%_mean': 0.39, 'FT%_mean': 0.719 },
    record: { overall: [28, 5], conf: [14, 4], home: [16, 1], road: [8, 4], quad_1: [8, 4], quad_2: [6, 1], quad_3: [7, 0], quad_4: [7, 0] },
    coach: 'nate_oats',
    ordinal_data: { NET: 5 },
    similar_teams: [
      { id: 1267, year: 2023, avg: 0.967, res: 0.96, st: 0.974, er: 'Sweet Sixteen' },
      { id: 1275, year: 2024, avg: 0.959, res: 0.953, st: 0.965, er: 'Final Four' },
      { id: 1101, year: 2018, avg: 0.946, res: 0.939, st: 0.953, er: 'Second Round' }
    ]
  },
  {
    team_id: 1012,
    name: "Saint Mary's",
    short_name: 'Saint Mary\'s',
    conference: 'wcc',
    seed: 3,
    region: 'South',
    slot: 'S3',
    tournament_team: true,
    stats: { AdjOE: 116.4, AdjDE: 92.9, AdjNE: 23.5, 'FG%': 0.498, 'FG3%': 0.367, 'FT%': 0.742 },
    rankings: { AdjOE: 20, AdjDE: 10, AdjNE: 9, SOS: 24, SOV: 22, 'FG%': 17, 'FG3%': 35, 'FT%': 95 },
    features: { Seed: 3, WinPct: 0.788, SOS: 0.552, SOV: 0.563, NET_last: 14, AdjOE_mean: 116.4, AdjDE_mean: 92.9, AdjNE_mean: 23.5, 'FG%_mean': 0.498, 'FG3%_mean': 0.367, 'FT%_mean': 0.742 },
    record: { overall: [26, 7], conf: [15, 3], home: [15, 1], road: [7, 4], quad_1: [4, 4], quad_2: [7, 2], quad_3: [8, 1], quad_4: [7, 0] },
    coach: 'randy_bennett',
    ordinal_data: { NET: 14 },
    similar_teams: [
      { id: 1217, year: 2023, avg: 0.953, res: 0.944, st: 0.962, er: 'Second Round' },
      { id: 1440, year: 2017, avg: 0.945, res: 0.938, st: 0.952, er: 'First Round' },
      { id: 1106, year: 2024, avg: 0.941, res: 0.935, st: 0.947, er: 'First Round' }
    ]
  },
  {
    team_id: 1013,
    name: 'Florida',
    short_name: 'Florida',
    conference: 'sec',
    seed: 1,
    region: 'East',
    slot: 'E1',
    tournament_team: true,
    stats: { AdjOE: 121.2, AdjDE: 91.2, AdjNE: 30.0, 'FG%': 0.499, 'FG3%': 0.371, 'FT%': 0.751 },
    rankings: { AdjOE: 6, AdjDE: 8, AdjNE: 4, SOS: 9, SOV: 6, 'FG%': 20, 'FG3%': 30, 'FT%': 71 },
    features: { Seed: 1, WinPct: 0.879, SOS: 0.601, SOV: 0.616, NET_last: 4, AdjOE_mean: 121.2, AdjDE_mean: 91.2, AdjNE_mean: 30.0, 'FG%_mean': 0.499, 'FG3%_mean': 0.371, 'FT%_mean': 0.751 },
    record: { overall: [29, 4], conf: [15, 3], home: [16, 1], road: [9, 2], quad_1: [8, 3], quad_2: [7, 1], quad_3: [7, 0], quad_4: [7, 0] },
    coach: 'todd_golden',
    ordinal_data: { NET: 4 },
    similar_teams: [
      { id: 1178, year: 2014, avg: 0.958, res: 0.959, st: 0.957, er: 'Final Four' },
      { id: 1354, year: 2025, avg: 0.954, res: 0.952, st: 0.956, er: 'Elite Eight' },
      { id: 1262, year: 2013, avg: 0.949, res: 0.947, st: 0.951, er: 'Elite Eight' }
    ]
  },
  {
    team_id: 1014,
    name: 'Arizona',
    short_name: 'Arizona',
    conference: 'big_twelve',
    seed: 4,
    region: 'East',
    slot: 'E4',
    tournament_team: true,
    stats: { AdjOE: 118.1, AdjDE: 96.2, AdjNE: 21.9, 'FG%': 0.489, 'FG3%': 0.359, 'FT%': 0.746 },
    rankings: { AdjOE: 15, AdjDE: 27, AdjNE: 15, SOS: 12, SOV: 15, 'FG%': 30, 'FG3%': 57, 'FT%': 87 },
    features: { Seed: 4, WinPct: 0.758, SOS: 0.594, SOV: 0.584, NET_last: 17, AdjOE_mean: 118.1, AdjDE_mean: 96.2, AdjNE_mean: 21.9, 'FG%_mean': 0.489, 'FG3%_mean': 0.359, 'FT%_mean': 0.746 },
    record: { overall: [25, 8], conf: [13, 7], home: [15, 2], road: [7, 5], quad_1: [6, 5], quad_2: [7, 1], quad_3: [6, 1], quad_4: [6, 1] },
    coach: 'tommy_lloyd',
    ordinal_data: { NET: 17 },
    similar_teams: [
      { id: 1385, year: 2024, avg: 0.955, res: 0.949, st: 0.961, er: 'Sweet Sixteen' },
      { id: 1272, year: 2016, avg: 0.946, res: 0.939, st: 0.953, er: 'First Round' },
      { id: 1306, year: 2023, avg: 0.943, res: 0.937, st: 0.949, er: 'Second Round' }
    ]
  },
  {
    team_id: 1015,
    name: 'Michigan',
    short_name: 'Michigan',
    conference: 'big_ten',
    seed: 2,
    region: 'East',
    slot: 'E2',
    tournament_team: true,
    stats: { AdjOE: 119.0, AdjDE: 94.9, AdjNE: 24.1, 'FG%': 0.494, 'FG3%': 0.363, 'FT%': 0.769 },
    rankings: { AdjOE: 12, AdjDE: 18, AdjNE: 8, SOS: 15, SOV: 13, 'FG%': 27, 'FG3%': 49, 'FT%': 37 },
    features: { Seed: 2, WinPct: 0.848, SOS: 0.59, SOV: 0.598, NET_last: 9, AdjOE_mean: 119.0, AdjDE_mean: 94.9, AdjNE_mean: 24.1, 'FG%_mean': 0.494, 'FG3%_mean': 0.363, 'FT%_mean': 0.769 },
    record: { overall: [28, 5], conf: [15, 5], home: [15, 1], road: [9, 3], quad_1: [7, 4], quad_2: [7, 1], quad_3: [8, 0], quad_4: [6, 0] },
    coach: 'dusty_may',
    ordinal_data: { NET: 9 },
    similar_teams: [
      { id: 1458, year: 2018, avg: 0.957, res: 0.95, st: 0.964, er: 'Runner-Up' },
      { id: 1322, year: 2021, avg: 0.948, res: 0.94, st: 0.956, er: 'Elite Eight' },
      { id: 1132, year: 2017, avg: 0.944, res: 0.937, st: 0.951, er: 'Sweet Sixteen' }
    ]
  },
  {
    team_id: 1016,
    name: 'Texas A&M',
    short_name: 'Texas A&M',
    conference: 'sec',
    seed: 3,
    region: 'East',
    slot: 'E3',
    tournament_team: true,
    stats: { AdjOE: 117.0, AdjDE: 95.6, AdjNE: 21.4, 'FG%': 0.481, 'FG3%': 0.348, 'FT%': 0.734 },
    rankings: { AdjOE: 19, AdjDE: 24, AdjNE: 16, SOS: 13, SOV: 16, 'FG%': 52, 'FG3%': 96, 'FT%': 118 },
    features: { Seed: 3, WinPct: 0.788, SOS: 0.596, SOV: 0.582, NET_last: 10, AdjOE_mean: 117.0, AdjDE_mean: 95.6, AdjNE_mean: 21.4, 'FG%_mean': 0.481, 'FG3%_mean': 0.348, 'FT%_mean': 0.734 },
    record: { overall: [26, 7], conf: [12, 6], home: [15, 1], road: [7, 4], quad_1: [7, 5], quad_2: [6, 1], quad_3: [7, 1], quad_4: [6, 0] },
    coach: 'buzz_williams',
    ordinal_data: { NET: 10 },
    similar_teams: [
      { id: 1213, year: 2024, avg: 0.953, res: 0.947, st: 0.959, er: 'Second Round' },
      { id: 1337, year: 2016, avg: 0.944, res: 0.939, st: 0.949, er: 'Sweet Sixteen' },
      { id: 1250, year: 2022, avg: 0.94, res: 0.934, st: 0.946, er: 'NIT' }
    ]
  }
];

const quadGames = {
  wins: [
    { opp_id: 1007, team_score: 78, opp_score: 72, team_loc: 'N', date_int: 122, date_str: '03/07', conf: false },
    { opp_id: 1011, team_score: 81, opp_score: 75, team_loc: 'H', date_int: 91, date_str: '02/05', conf: false }
  ],
  losses: [
    { opp_id: 1005, team_score: 67, opp_score: 71, team_loc: 'A', date_int: 74, date_str: '01/19', conf: false }
  ]
};

const teamPagePath = (teamId, season = SEASON) => `data/web/ts/${teamId}_${season}.json`;

const toTeamPage = (team) => ({
  id: team.team_id,
  year: SEASON,
  name: team.name,
  record: team.record,
  quad_wins: { 1: quadGames.wins, 2: [], 3: [], 4: [] },
  quad_losses: { 1: quadGames.losses, 2: [], 3: [], 4: [] },
  conf: team.conference,
  stat_rankings: team.rankings,
  stats: team.stats,
  coach: team.coach,
  win_pct: team.features.WinPct,
  sos: team.features.SOS,
  sov: team.features.SOV,
  ordinal_data: team.ordinal_data,
  tournament: { seed: team.seed, games: [], exit_round: null },
  similar_teams: team.similar_teams
});

const teamIndex = {
  season: SEASON,
  updated_at: '2026-03-16T02:30:00Z',
  teams: teamCatalog.map((team) => ({
    team_id: team.team_id,
    name: team.name,
    short_name: team.short_name,
    conference: team.conference,
    seed: team.seed,
    region: team.region,
    slot: team.slot,
    tournament_team: team.tournament_team,
    team_page_path: teamPagePath(team.team_id)
  }))
};

const teamPages = teamCatalog.reduce((acc, team) => {
  acc[`${team.team_id}_${SEASON}`] = toTeamPage(team);
  return acc;
}, {});

const featureStore = {
  season: SEASON,
  feature_set: 'base_2026',
  feature_order: ['Seed', 'WinPct', 'SOS', 'SOV', 'NET_last', 'AdjOE_mean', 'AdjDE_mean', 'AdjNE_mean', 'FG%_mean', 'FG3%_mean', 'FT%_mean'],
  teams: teamCatalog.reduce((acc, team) => {
    acc[team.team_id] = team.features;
    return acc;
  }, {})
};

const bracketDefinition = {
  season: SEASON,
  regions: ['West', 'Midwest', 'South', 'East'],
  slots: [
    { slot: 'R1W1', label: 'Round of 64', region: 'West', round: 1, team_1: { team_id: 1001, seed: 1, source: 'seed' }, team_2: { team_id: 1002, seed: 4, source: 'seed' }, next_slot: 'R2W1' },
    { slot: 'R1W2', label: 'Round of 64', region: 'West', round: 1, team_1: { team_id: 1003, seed: 2, source: 'seed' }, team_2: { team_id: 1004, seed: 3, source: 'seed' }, next_slot: 'R2W1' },
    { slot: 'R1M1', label: 'Round of 64', region: 'Midwest', round: 1, team_1: { team_id: 1005, seed: 1, source: 'seed' }, team_2: { team_id: 1006, seed: 4, source: 'seed' }, next_slot: 'R2M1' },
    { slot: 'R1M2', label: 'Round of 64', region: 'Midwest', round: 1, team_1: { team_id: 1007, seed: 2, source: 'seed' }, team_2: { team_id: 1008, seed: 3, source: 'seed' }, next_slot: 'R2M1' },
    { slot: 'R1S1', label: 'Round of 64', region: 'South', round: 1, team_1: { team_id: 1009, seed: 1, source: 'seed' }, team_2: { team_id: 1010, seed: 4, source: 'seed' }, next_slot: 'R2S1' },
    { slot: 'R1S2', label: 'Round of 64', region: 'South', round: 1, team_1: { team_id: 1011, seed: 2, source: 'seed' }, team_2: { team_id: 1012, seed: 3, source: 'seed' }, next_slot: 'R2S1' },
    { slot: 'R1E1', label: 'Round of 64', region: 'East', round: 1, team_1: { team_id: 1013, seed: 1, source: 'seed' }, team_2: { team_id: 1014, seed: 4, source: 'seed' }, next_slot: 'R2E1' },
    { slot: 'R1E2', label: 'Round of 64', region: 'East', round: 1, team_1: { team_id: 1015, seed: 2, source: 'seed' }, team_2: { team_id: 1016, seed: 3, source: 'seed' }, next_slot: 'R2E1' },
    { slot: 'R2W1', label: 'Regional Final', region: 'West', round: 2, team_1: { source_slot: 'R1W1', source: 'winner' }, team_2: { source_slot: 'R1W2', source: 'winner' }, next_slot: 'R3WM' },
    { slot: 'R2M1', label: 'Regional Final', region: 'Midwest', round: 2, team_1: { source_slot: 'R1M1', source: 'winner' }, team_2: { source_slot: 'R1M2', source: 'winner' }, next_slot: 'R3WM' },
    { slot: 'R2S1', label: 'Regional Final', region: 'South', round: 2, team_1: { source_slot: 'R1S1', source: 'winner' }, team_2: { source_slot: 'R1S2', source: 'winner' }, next_slot: 'R3SE' },
    { slot: 'R2E1', label: 'Regional Final', region: 'East', round: 2, team_1: { source_slot: 'R1E1', source: 'winner' }, team_2: { source_slot: 'R1E2', source: 'winner' }, next_slot: 'R3SE' },
    { slot: 'R3WM', label: 'Final Four', region: 'Final Four', round: 3, team_1: { source_slot: 'R2W1', source: 'winner' }, team_2: { source_slot: 'R2M1', source: 'winner' }, next_slot: 'R4CH' },
    { slot: 'R3SE', label: 'Final Four', region: 'Final Four', round: 3, team_1: { source_slot: 'R2S1', source: 'winner' }, team_2: { source_slot: 'R2E1', source: 'winner' }, next_slot: 'R4CH' },
    { slot: 'R4CH', label: 'Championship', region: 'Championship', round: 4, team_1: { source_slot: 'R3WM', source: 'winner' }, team_2: { source_slot: 'R3SE', source: 'winner' }, next_slot: null }
  ],
  final_slots: {
    west_midwest: 'R3WM',
    south_east: 'R3SE',
    championship: 'R4CH'
  }
};

const modelsManifest = {
  default_model_id: 'seed-only',
  models: [
    { id: 'coin-flip', name: 'Coin Flip', type: 'heuristic', seasons: [SEASON], feature_set: null, prediction_format: 'runtime', description: 'Rule #1 baseline that ignores the inputs.' },
    { id: 'seed-only', name: 'Seed Only', type: 'heuristic', seasons: [SEASON], feature_set: 'base_2026', prediction_format: 'runtime', description: 'Rule #2 baseline that mostly trusts committee seeding.' }
  ]
};

const featureDefinitions = [
  { key: 'Seed', label: 'Seed', category: 'Resume', higherIsBetter: false, formatter: (value) => Number(value).toFixed(0) },
  { key: 'WinPct', label: 'Win %', category: 'Resume', higherIsBetter: true, formatter: (value) => value.toFixed(3) },
  { key: 'SOS', label: 'Strength of Schedule', category: 'Resume', higherIsBetter: true, formatter: (value) => value.toFixed(3) },
  { key: 'SOV', label: 'Strength of Victory', category: 'Resume', higherIsBetter: true, formatter: (value) => value.toFixed(3) },
  { key: 'NET_last', label: 'NET Rank', category: 'Ordinals', higherIsBetter: false, formatter: (value) => Number(value).toFixed(0) },
  { key: 'AdjOE_mean', label: 'AdjOE', category: 'Efficiency', higherIsBetter: true, formatter: (value) => value.toFixed(1) },
  { key: 'AdjDE_mean', label: 'AdjDE', category: 'Efficiency', higherIsBetter: false, formatter: (value) => value.toFixed(1) },
  { key: 'AdjNE_mean', label: 'AdjNE', category: 'Efficiency', higherIsBetter: true, formatter: (value) => value.toFixed(1) },
  { key: 'FG%_mean', label: 'FG%', category: 'Shooting', higherIsBetter: true, formatter: (value) => value.toFixed(3) },
  { key: 'FG3%_mean', label: '3PT%', category: 'Shooting', higherIsBetter: true, formatter: (value) => value.toFixed(3) },
  { key: 'FT%_mean', label: 'FT%', category: 'Shooting', higherIsBetter: true, formatter: (value) => value.toFixed(3) }
];

const slotMap = bracketDefinition.slots.reduce((acc, slot) => {
  acc[slot.slot] = slot;
  return acc;
}, {});

const logistic = (value) => 1 / (1 + Math.exp(-value));

const deterministicCoin = (teamAId, teamBId) => ((teamAId * 31 + teamBId * 17 + SEASON) % 1000) / 1000;

const normalizeDifference = (featureKey, teamAValue, teamBValue) => {
  const scaleMap = {
    Seed: 16,
    WinPct: 1,
    SOS: 1,
    SOV: 1,
    NET_last: 75,
    AdjOE_mean: 40,
    AdjDE_mean: 40,
    AdjNE_mean: 45,
    'FG%_mean': 0.15,
    'FG3%_mean': 0.15,
    'FT%_mean': 0.2
  };

  const definition = featureDefinitions.find((feature) => feature.key === featureKey);
  const orientation = definition?.higherIsBetter === false ? -1 : 1;
  const scale = scaleMap[featureKey] || 1;
  return ((teamAValue - teamBValue) / scale) * orientation;
};

const buildRuntimeModel = ({
  name = 'Browser Weighted Model',
  method = 'weighted-score',
  selectedFeatures = ['Seed', 'AdjOE_mean', 'AdjDE_mean', 'AdjNE_mean', 'WinPct'],
  weights = {},
  bias = 0,
  sharpness = 1.5,
  notes = 'Temporary browser-native model config.'
} = {}) => {
  const resolvedWeights = {};
  selectedFeatures.forEach((featureKey) => {
    resolvedWeights[featureKey] = weights[featureKey] ?? 0;
  });

  return {
    id: `custom-${Date.now()}`,
    name,
    type: 'runtime-config',
    method,
    feature_set: 'base_2026',
    selectedFeatures,
    weights: resolvedWeights,
    bias,
    sharpness,
    notes,
    created_at: new Date().toISOString()
  };
};

const getTeamEntry = (teamId) => teamCatalog.find((team) => team.team_id === Number(teamId));

const getTeamPage = (teamId, season = SEASON) => teamPages[`${teamId}_${season}`];

const getSlot = (slotId) => slotMap[slotId];

const getInitialTeamId = (entry) => entry?.team_id ?? null;

const getSlotParticipants = (slotId, picks = {}) => {
  const slot = getSlot(slotId);
  if (!slot) {
    return { team1Id: null, team2Id: null };
  }

  const resolveSide = (teamRef) => {
    if (teamRef.source === 'seed') {
      return getInitialTeamId(teamRef);
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

const predictCustomMatchup = (teamAId, teamBId, runtimeModel) => {
  const teamA = featureStore.teams[teamAId];
  const teamB = featureStore.teams[teamBId];
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
    explanation: 'Browser-native weighted model. This mirrors a linear classifier workflow more than a TensorFlow.js network.',
    rawScore,
    contributions
  };
};

const predictMatchup = (teamAId, teamBId, modelId = modelsManifest.default_model_id) => {
  const teamA = featureStore.teams[teamAId];
  const teamB = featureStore.teams[teamBId];
  if (!teamA || !teamB) {
    return null;
  }

  if (modelId === 'coin-flip') {
    const probabilityA = deterministicCoin(Number(teamAId), Number(teamBId));
    const winnerId = probabilityA >= 0.5 ? Number(teamAId) : Number(teamBId);
    return {
      winnerId,
      teamAProbability: probabilityA,
      teamBProbability: 1 - probabilityA,
      explanation: 'Random baseline used to mirror Rule #1 from the YDKYK article.'
    };
  }

  const diff = {
    seed: (teamB.Seed - teamA.Seed) * 0.34,
    winPct: (teamA.WinPct - teamB.WinPct) * 3.2,
    sos: (teamA.SOS - teamB.SOS) * 2.8,
    sov: (teamA.SOV - teamB.SOV) * 2.4,
    net: (teamB.NET_last - teamA.NET_last) * 0.08,
    adjO: (teamA.AdjOE_mean - teamB.AdjOE_mean) * 0.09,
    adjD: (teamB.AdjDE_mean - teamA.AdjDE_mean) * 0.11,
    adjN: (teamA.AdjNE_mean - teamB.AdjNE_mean) * 0.08,
    fg: (teamA['FG%_mean'] - teamB['FG%_mean']) * 7.5,
    fg3: (teamA['FG3%_mean'] - teamB['FG3%_mean']) * 6.5,
    ft: (teamA['FT%_mean'] - teamB['FT%_mean']) * 4.5
  };

  const baseScore = Object.values(diff).reduce((sum, value) => sum + value, 0);
  const modelTuning = modelId === 'seed-only' ? 0.65 : 1;
  const probabilityA = logistic(baseScore * modelTuning);
  const winnerId = probabilityA >= 0.5 ? Number(teamAId) : Number(teamBId);

  return {
    winnerId,
    teamAProbability: probabilityA,
    teamBProbability: 1 - probabilityA,
    explanation: modelId === 'seed-only'
      ? 'Seed-first heuristic with light feature adjustments.'
      : 'Temporary weighted heuristic standing in for the real tf.js model.'
  };
};

const fillSlotThrough = (slotId, picks = {}, modelId = modelsManifest.default_model_id) => {
  const nextPicks = { ...picks };
  const slot = getSlot(slotId);
  if (!slot) {
    return nextPicks;
  }

  [slot.team_1, slot.team_2].forEach((teamRef) => {
    if (teamRef.source === 'winner' && !nextPicks[teamRef.source_slot]) {
      const resolved = fillSlotThrough(teamRef.source_slot, nextPicks, modelId);
      Object.assign(nextPicks, resolved);
    }
  });

  const { team1Id, team2Id } = getSlotParticipants(slotId, nextPicks);
  if (!team1Id || !team2Id) {
    return nextPicks;
  }

  nextPicks[slotId] = predictMatchup(team1Id, team2Id, modelId).winnerId;
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
      const resolved = fillSlotThroughCustom(teamRef.source_slot, nextPicks, runtimeModel);
      Object.assign(nextPicks, resolved);
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

const findTeamOpeningSlot = (teamId) => bracketDefinition.slots.find((slot) => slot.round === 1 && [slot.team_1.team_id, slot.team_2.team_id].includes(Number(teamId)));

export {
  SEASON,
  bracketDefinition,
  buildRuntimeModel,
  featureDefinitions,
  featureStore,
  fillSlotThrough,
  fillSlotThroughCustom,
  findTeamOpeningSlot,
  getSlot,
  getSlotParticipants,
  getTeamEntry,
  getTeamPage,
  modelsManifest,
  predictCustomMatchup,
  predictMatchup,
  teamCatalog,
  teamIndex,
  teamPages
};