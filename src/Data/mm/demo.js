const statInfo = {
    'adjoe': { "full": "Adjusted Offensive Efficiency", short: "AdjOE", "min": 80, "max": 130 },
    'adjde': { "full": "Adjusted Defensive Efficiency", short: "AdjDE", "min": 80, "max": 130 },
    'seed': { "full": "Seed", short: "Seed", "min": 1, "max": 16 },
    'tempo': { "full": "Tempo", short: "Tempo", "min": 60, "max": 80 },
    'luck': { "full": "Luck", short: "Luck", "min": -10, "max": 10 }
};

const playIns = {
    2001: ['Y16'], 2002: ['W16'], 2003: ['X16'], 2004: ['Z16'], 
    2005: ['Z16'], 2006: ['Y16'], 2007: ['Z16'], 2008: ['W16'], 
    2009: ['Y16'], 2010: ['X16'],
    2011: ['W12', 'W16', 'Y16', 'Z11'],
    2012: ['X12', 'X16', 'Y16', 'Z14'],
    2013: ['W16', 'Y11', 'Y16', 'Z13'],
    2014: ['X16', 'Y11', 'Y12', 'Y16'],
    2015: ['W11', 'X16', 'Y16', 'Z11'],
    2016: ['W11', 'W16', 'Y11', 'Z16'],
    2017: ['W11', 'W16', 'Y16', 'Z11'],
    2018: ['W11', 'W16', 'X11', 'Z16'],
    2019: ['W11', 'W16', 'X11', 'X16'],
    2021: ['W11', 'W16', 'X11', 'X16'],
    2022: ['W12', 'Y16', 'X11', 'Z16'],
    2023: ['W16', 'X16', 'Y11', 'Z11'],
    2024: ['X16', 'Y10', 'Z10', 'Z16']
}
  
const initTeamData = {
    101: { name: "Gonzaga", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
    102: { name: "Kansas", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
    103: { name: "Duke", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
    104: { name: "Purdue", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
    105: { name: "Baylor", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
    106: { name: "Houston", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
    107: { name: "Arizona", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
    108: { name: "Kentucky", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
    109: { name: "UCLA", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
    110: { name: "Michigan", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
    111: { name: "Texas Tech", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
    112: { name: "Alabama", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
    113: { name: "Arkansas", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
    114: { name: "Illinois", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
    115: { name: "Ohio State", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
    116: { name: "Tennessee", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
    117: { name: "Villanova", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
    118: { name: "Florida State", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
    119: { name: "Connecticut", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
    120: { name: "Wisconsin", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
    121: { name: "North Carolina", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
    122: { name: "Oregon", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
    123: { name: "LSU", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
    124: { name: "Auburn", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
    125: { name: "Maryland", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
    126: { name: "Iowa State", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
    127: { name: "Colorado State", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
    128: { name: "Texas", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
    129: { name: "Florida", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
    130: { name: "Michigan State", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
    131: { name: "Virginia Tech", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
    132: { name: "Creighton", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
    133: { name: "Memphis", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
    134: { name: "BYU", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
    135: { name: "San Diego State", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
    136: { name: "USC", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
    137: { name: "St. Mary's", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
    138: { name: "Seton Hall", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
    139: { name: "Iowa", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
    140: { name: "Pittsburgh", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
    141: { name: "Minnesota", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
    142: { name: "Wake Forest", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
    143: { name: "Rutgers", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
    144: { name: "Oklahoma State", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
    145: { name: "Oklahoma", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
    146: { name: "TCU", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
    147: { name: "Washington", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
    148: { name: "Georgetown", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
    149: { name: "Marquette", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
    150: { name: "Xavier", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
    151: { name: "Providence", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
    152: { name: "DePaul", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
    153: { name: "St. John's", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
    154: { name: "Butler", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
    155: { name: "High Point", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
    156: { name: "Vanderbilt", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
    157: { name: "Mississippi State", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
    158: { name: "Missouri", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
    159: { name: "South Carolina", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
    160: { name: "Georgia", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
    161: { name: "Grand Canyon", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
    162: { name: "Northern Colorado", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
    163: { name: "UC Riverside", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
    164: { name: "Cal Poly", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 }
};

const tagOptions = [
    { "id": "high-tempo", "type": "style", "color": "red", "name": "High Tempo" },
    { "id": "low-tempo", "type": "style", "color": "blue", "name": "Low Tempo" },
    { "id": "star-power", "type": "style", "color": "yellow", "name": "Star Power" },
    { "id": "depth", "type": "style", "color": "green", "name": "Quality Depth" },
    { "id": "veterans", "type": "experience", "color": "green", "name": "Veterans" },
    { "id": "young", "type": "experience", "color": "yellow", "name": "Young" },
    { "id": "coach-adv", "type": "experience", "color": "orange", "name": "Coach Advantage" },
    { "id": "hot", "type": "resume", "color": "cyan", "name": "Hot Streak" },
    { "id": "cold", "type": "resume", "color": "magenta", "name": "Cold Streak" },
    { "id": "battle-tested", "type": "resume", "color": "purple", "name": "Battle Tested" }
]
// Set randomized values for team-season statistics
Object.keys(initTeamData).forEach(teamId => {
    initTeamData[teamId].stats = {};
    Object.keys(statInfo).forEach(stat => {
        let val = statInfo[stat].min + (statInfo[stat].max - statInfo[stat].min) * Math.random();
        let percentile = (val - statInfo[stat].min) / (statInfo[stat].max - statInfo[stat].min);
        initTeamData[teamId].stats[stat] = [ val, percentile ];
    });
});

// Assign each team 3 random tags
Object.keys(initTeamData).forEach(teamId => {
    initTeamData[teamId].tags = tagOptions.filter(tag => Math.random() > 0.5).map(tag => tag.id);
});
  
const colorPool = ["#FF6633", "#FFB399", "#FF33FF", "#FFFF99", "#00B3E6",
    "#E6B333", "#3366E6", "#999966", "#99FF99", "#B34D4D",
    "#80B300", "#809900", "#E6B3B3", "#6680B3", "#66991A",
    "#FF99E6", "#CCFF1A", "#FF1A66", "#E6331A", "#33FFCC"]
  
const teamGroups = {
    "2023 Tournament": [101, 102, 103, 104, 105],
    "2023 Championship": [101, 102],
    "2024 Final Four": [101, 102, 103, 104],
    "2024 Sweet Sixteen": [101, 102, 103, 104, 105]
};


const bracketInfo = {
    2024: {
        regions: { W: "West", X: "Midwest", Y: "South", Z: "East" },
        seeds: {
            101: 'W1', 102: 'W2', 103: 'W3', 104: 'W4', 105: 'W5', 106: 'W6', 107: 'W7', 108: 'W8', 109: 'W9', 110: 'W10', 111: 'W11', 112: 'W12', 113: 'W13', 114: 'W14', 115: 'W15', 116: 'W16',
            117: 'X1', 118: 'X2', 119: 'X3', 120: 'X4', 121: 'X5', 122: 'X6', 123: 'X7', 124: 'X8', 125: 'X9', 126: 'X10', 127: 'X11', 128: 'X12', 129: 'X13', 130: 'X14', 131: 'X15', 132: 'X16a',
            133: 'Y1', 134: 'Y2', 135: 'Y3', 136: 'Y4', 137: 'Y5', 138: 'Y6', 139: 'Y7', 140: 'Y8', 141: 'Y9', 142: 'Y10a', 143: 'Y11', 144: 'Y12', 145: 'Y13', 146: 'Y14', 147: 'Y15', 148: 'Y16',
            149: 'Z1', 150: 'Z2', 151: 'Z3', 152: 'Z4', 153: 'Z5', 154: 'Z6', 155: 'Z7', 156: 'Z8', 157: 'Z9', 158: 'Z10', 159: 'Z11', 160: 'Z12', 161: 'Z13', 162: 'Z14', 163: 'Z15', 164: 'Z16',
            165: 'X16b', 166: 'Y10b', 167: 'Z10b', 168: 'Z16b'
        },
        slots: {
            'X16': { t1: 132, t2: 165, winner: 132, wScore: 80, lScore: 70 },
            'Y10': { t1: 142, t2: 166, winner: 142, wScore: 80, lScore: 70 },
            'Z10': { t1: 158, t2: 167, winner: 158, wScore: 80, lScore: 70 },
            'Z16': { t1: 164, t2: 168, winner: 164, wScore: 80, lScore: 70 },
            'R1W1': { t1: 101, t2: 116, winner: 101, wScore: 80, lScore: 70 },
            'R1W8': { t1: 102, t2: 115, winner: 102, wScore: 85, lScore: 75 },
            'R1W5': { t1: 103, t2: 114, winner: 103, wScore: 90, lScore: 80 },
            'R1W4': { t1: 104, t2: 113, winner: 104, wScore: 75, lScore: 70 },
            'R1W2': { t1: 105, t2: 112, winner: 105, wScore: 85, lScore: 80 },
            'R1W3': { t1: 106, t2: 111, winner: 106, wScore: 90, lScore: 85 },
            'R1W6': { t1: 107, t2: 110, winner: 107, wScore: 80, lScore: 75 },
            'R1W7': { t1: 108, t2: 109, winner: 108, wScore: 85, lScore: 80 },
            'R1X1': { t1: 117, t2: 132, winner: 117, wScore: 80, lScore: 70 },
            'R1X8': { t1: 118, t2: 131, winner: 118, wScore: 85, lScore: 75 },
            'R1X5': { t1: 119, t2: 130, winner: 119, wScore: 90, lScore: 80 },
            'R1X4': { t1: 120, t2: 129, winner: 120, wScore: 75, lScore: 70 },
            'R1X2': { t1: 121, t2: 128, winner: 121, wScore: 85, lScore: 80 },
            'R1X3': { t1: 122, t2: 127, winner: 122, wScore: 90, lScore: 85 },
            'R1X6': { t1: 123, t2: 126, winner: 123, wScore: 80, lScore: 75 },
            'R1X7': { t1: 124, t2: 125, winner: 124, wScore: 85, lScore: 80 },
            'R1Y1': { t1: 133, t2: 148, winner: 133, wScore: 80, lScore: 70 },
            'R1Y8': { t1: 134, t2: 147, winner: 134, wScore: 85, lScore: 75 },
            'R1Y5': { t1: 135, t2: 146, winner: 135, wScore: 90, lScore: 80 },
            'R1Y4': { t1: 136, t2: 145, winner: 136, wScore: 75, lScore: 70 },
            'R1Y2': { t1: 137, t2: 144, winner: 137, wScore: 85, lScore: 80 },
            'R1Y3': { t1: 138, t2: 143, winner: 138, wScore: 90, lScore: 85 },
            'R1Y6': { t1: 139, t2: 142, winner: 139, wScore: 80, lScore: 75 },
            'R1Y7': { t1: 140, t2: 141, winner: 140, wScore: 85, lScore: 80 },
            'R1Z1': { t1: 149, t2: 164, winner: 149, wScore: 80, lScore: 70 },
            'R1Z8': { t1: 150, t2: 163, winner: 150, wScore: 85, lScore: 75 },
            'R1Z5': { t1: 151, t2: 162, winner: 151, wScore: 90, lScore: 80 },
            'R1Z4': { t1: 152, t2: 161, winner: 152, wScore: 75, lScore: 70 },
            'R1Z2': { t1: 153, t2: 160, winner: 153, wScore: 85, lScore: 80 },
            'R1Z3': { t1: 154, t2: 159, winner: 154, wScore: 90, lScore: 85 },
            'R1Z6': { t1: 155, t2: 158, winner: 155, wScore: 80, lScore: 75 },
            'R1Z7': { t1: 156, t2: 157, winner: 156, wScore: 85, lScore: 80 },
            'R2W1': { t1: 101, t2: 102, winner: 101, wScore: 80, lScore: 70 },
            'R2W4': { t1: 104, t2: 103, winner: 104, wScore: 75, lScore: 70 },
            'R2W3': { t1: 106, t2: 105, winner: 106, wScore: 90, lScore: 85 },
            'R2W2': { t1: 107, t2: 108, winner: 107, wScore: 85, lScore: 80 },
            'R2X1': { t1: 117, t2: 118, winner: 117, wScore: 80, lScore: 70 },
            'R2X4': { t1: 120, t2: 119, winner: 120, wScore: 75, lScore: 70 },
            'R2X3': { t1: 122, t2: 121, winner: 122, wScore: 90, lScore: 85 },
            'R2X2': { t1: 123, t2: 124, winner: 123, wScore: 85, lScore: 80 },
            'R2Y1': { t1: 133, t2: 132, winner: 133, wScore: 80, lScore: 70 },
            'R2Y4': { t1: 135, t2: 134, winner: 134, wScore: 75, lScore: 70 },
            'R2Y3': { t1: 136, t2: 137, winner: 136, wScore: 90, lScore: 85 },
            'R2Y2': { t1: 138, t2: 139, winner: 138, wScore: 85, lScore: 80 },
            'R2Z1': { t1: 149, t2: 150, winner: 149, wScore: 80, lScore: 70 },
            'R2Z4': { t1: 152, t2: 151, winner: 152, wScore: 75, lScore: 70 },
            'R2Z3': { t1: 154, t2: 153, winner: 154, wScore: 90, lScore: 85 },
            'R2Z2': { t1: 155, t2: 156, winner: 156, wScore: 85, lScore: 80 },
            'R3W1': { t1: 101, t2: 104, winner: 101, wScore: 80, lScore: 70 },
            'R3W2': { t1: 106, t2: 107, winner: 106, wScore: 85, lScore: 80 },
            'R3X1': { t1: 117, t2: 120, winner: 117, wScore: 80, lScore: 70 },
            'R3X2': { t1: 122, t2: 123, winner: 122, wScore: 85, lScore: 80 },
            'R3Y1': { t1: 133, t2: 134, winner: 133, wScore: 80, lScore: 70 },
            'R3Y2': { t1: 136, t2: 138, winner: 136, wScore: 85, lScore: 80 },
            'R3Z1': { t1: 149, t2: 152, winner: 149, wScore: 80, lScore: 70 },
            'R3Z2': { t1: 154, t2: 156, winner: 154, wScore: 85, lScore: 80 },
            'R4W1': { t1: 101, t2: 106, winner: 101, wScore: 80, lScore: 70 },
            'R4X1': { t1: 117, t2: 122, winner: 117, wScore: 80, lScore: 70 },
            'R4Y1': { t1: 133, t2: 136, winner: 133, wScore: 80, lScore: 70 },
            'R4Z1': { t1: 149, t2: 154, winner: 149, wScore: 80, lScore: 70 },
            'R5WX': { t1: 101, t2: 117, winner: 101, wScore: 80, lScore: 70 },
            'R5YZ': { t1: 133, t2: 149, winner: 133, wScore: 80, lScore: 70 },
            'R6CH': { t1: 101, t2: 133, winner: 101, wScore: 80, lScore: 70 }
        }
    }
};
const modelInfo = {
    'base-2024': {
        name: 'Base Model 2024',
        description: 'Linear SVC model for 2024 tournament',
        trained: '2024-03-01',
        features: ['adjoe', 'adjde', 'luck', 'tempo'],
        accuracy: 0.85
    },
    'neural-2024': {
        name: 'Neural Net 2024',
        description: 'Neural network model for 2024 tournament',
        trained: '2024-03-03',
        features: ['adjoe', 'adjde', 'luck', 'tempo'],
        accuracy: 0.82
    }
}

// Generate randomized model predictions for each potential matchup of team ids (e.g. '101-102', '101-103', etc.)
const modelPredictions = { 'base-2024': {}, 'neural-2024': {} };
Object.keys(initTeamData).forEach(t1 => {
    Object.keys(initTeamData).forEach(t2 => {
        if (t1 !== t2) {
            modelPredictions['base-2024'][`${t1}-${t2}`] = Math.random() > 0.5 ? t1 : t2;
        }
    });
});

export { statInfo, initTeamData, colorPool, teamGroups, bracketInfo, playIns, modelInfo, modelPredictions };