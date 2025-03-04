////
// BracketV2.js
// Goal: Allow users to visualize current NCAA Tournament bracket with contexutalized insights
// Insights:
// - Team Strengths: Offense, Defense, Rebounding, Turnovers
// - Team Performance: Win %, SOS, Tempo
// - Matchup Analysis: Key Stats, Win Probability
// - Tournament Predictions: per slot and overall
// Navigation:
// - 
////
import React, { useEffect, useState } from 'react'

import Nav from '../../../js/Nav'

const TOURNEY_REGION_VIEWS = {
    "W1":   { prefix: "Top",      slots: ["R1W1", "R1W8", "R1W5", "R1W4", "R2W1", "R2W4", "R3W1"], nav: { down: "Z2", up: "W2", left: "16WX", right: "W1"}},
    "W2":   { prefix: "Bottom",   slots: ["R1W6", "R1W3", "R1W7", "R1W2", "R2W3", "R2W2", "R3W2"], nav: { down: "W1", up: "X1", left: "16WX", right: "W2"}},
    "X1":   { prefix: "Top",      slots: ["R1X1", "R1X8", "R1X5", "R1X4", "R2X1", "R2X4", "R3X1"], nav: { down: "W2", up: "X2", left: "16WX", right: "X1"}},
    "X2":   { prefix: "Bottom",   slots: ["R1X6", "R1X3", "R1X7", "R1X2", "R2X3", "R2X2", "R3X2"], nav: { down: "X1", up: "Y1", left: "16WX", right: "X2"}},
    "Y1":   { prefix: "Top",      slots: ["R1Y1", "R1Y8", "R1Y5", "R1Y4", "R2Y1", "R2Y4", "R3Y1"], nav: { down: "X2", up: "Y2", left: "16YZ", right: "Y1"}},
    "Y2":   { prefix: "Bottom",   slots: ["R1Y6", "R1Y3", "R1Y7", "R1Y2", "R2Y3", "R2Y2", "R3Y2"], nav: { down: "Y1", up: "Z1", left: "16YZ", right: "Y2"}},
    "Z1":   { prefix: "Top",      slots: ["R1Z1", "R1Z8", "R1Z5", "R1Z4", "R2Z1", "R2Z4", "R3Z1"], nav: { down: "Y2", up: "Z2", left: "16YZ", right: "Z1"}},
    "Z2":   { prefix: "Bottom",   slots: ["R1Z6", "R1Z3", "R1Z7", "R1Z2", "R2Z3", "R2Z2", "R3Z2"], nav: { down: "Z1", up: "W1", left: "16YZ", right: "Z2"}},
    "16WX": { prefix: "Regionals", slots: ["R3W1", "R3W2", "R3X1", "R3X2", "R4W1", "R4X1", "R5WX"], nav: { down: "16YZ", up: "16YZ", left: "FF", right: "W1"}},
    "16YZ": { prefix: "Regionals", slots: ["R3Y1", "R3Y2", "R3Z1", "R3Z2", "R4Y1", "R4Z1", "R5YZ"], nav: { down: "16WX", up: "16WX", left: "FF", right: "Y1"}},
    "FF":   { prefix: "Final Four", slots: ["R5WX", "R5YZ", "R6CH"], nav: { right: "16WX" }}
}


const getSlotTeams = (season) => {
    console.log("Getting Slot Teams");
    let teams = {};
    let slots = {};
    if (season === 2025) {
        // Random Values until Bracket Released
        for (let i = 0; i < 64; i++) {
            teams[i] = { name: `Team ${i + 1}` };
        }
        
        let idx = 0
        for (let region in TOURNEY_REGION_VIEWS) {
            for (let slot of TOURNEY_REGION_VIEWS[region].slots) {
                if (slot[1] === "1") { // Round 1 -> teams
                    slots[slot] = { 
                        strongSeed: idx, 
                        weakSeed: idx + 1,
                        winner: null
                    };
                    idx = idx + 2;
                }
            }
        }
    } else {
        // TODO: fetch teams from API
        for (let i = 0; i < 64; i++) {
            teams[i] = { name: `Team ${i + 1}` };
        }
    }
    return [teams, slots];
};

let isActiveTournament = ( season ) => season === 2025;

let Bracket = () => {
    let [teams, setTeams] = useState(null);
    let [slots, setSlots] = useState(null);
    let [season, setSeason] = useState(2025);
    useEffect(() => {
        let [teams, slots] = getSlotTeams(season);
        setTeams(teams);
        setSlots(slots);
    }, [season]);
    console.log(teams);
    console.log(slots);
    if (teams === null || slots === null) {
        return <div>Loading...</div>;
    }
    return (
        <div>
            {Object.keys(TOURNEY_REGION_VIEWS).map(region => {
                    return (
                        <div key={region} className="region">
                            <h2>{region}</h2>
                            <div className="round">
                                {TOURNEY_REGION_VIEWS[region].slots.map(slot => {
                                    console.log(slot);
                                    console.log(slots[slot])
                                    if (slots[slot] === undefined) {
                                        return null;
                                    }
                                    console.log(teams[slots[slot].strongSeed]);
                                    return (
                                        <div key={slot} className="slot">
                                            <div className="strongSeed">{teams[slots[slot].strongSeed].name}</div>
                                            <div className="weakSeed">{teams[slots[slot].weakSeed].name}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
        </div>
    )

}

let Page = () => {
    let navContent = []
    return (
        <div>
            <Nav page={"MM Bracket V2"} navContent={navContent} />
            <Bracket />
        </div>
    )
}
export default Page;