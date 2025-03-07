import React, { useState, useEffect } from 'react';
import { CardGroup, Card } from 'react-bootstrap';
import { bracketInfo, initTeamData, teamGroups } from '../../../../Data/mm/demo';
import { BracketControlPanel } from '../../../../components/js/ControlPanels';
import Nav from '../../../../components/js/Nav';

import { useSwipeable } from "react-swipeable";

const zIndexes = {
    "bracket": 1,
    "controlPanel": 2,
    "insightsPanel": 3
}

const LOCATION_INFO = {
    "W1":   { prefix: "Top",      slots: ["R1W1", "R1W8", "R1W5", "R1W4", "R2W1", "R2W4", "R3W1"], nav: { up: "W2", left: "16WX", right: "W1"}},
    "W2":   { prefix: "Bottom",   slots: ["R1W6", "R1W3", "R1W7", "R1W2", "R2W3", "R2W2", "R3W2"], nav: { down: "W1", up: "X1", left: "16WX", right: "W2"}},
    "X1":   { prefix: "Top",      slots: ["R1X1", "R1X8", "R1X5", "R1X4", "R2X1", "R2X4", "R3X1"], nav: { down: "W2", up: "X2", left: "16WX", right: "X1"}},
    "X2":   { prefix: "Bottom",   slots: ["R1X6", "R1X3", "R1X7", "R1X2", "R2X3", "R2X2", "R3X2"], nav: { down: "X1", up: "Y1", left: "16WX", right: "X2"}},
    "Y1":   { prefix: "Top",      slots: ["R1Y1", "R1Y8", "R1Y5", "R1Y4", "R2Y1", "R2Y4", "R3Y1"], nav: { down: "X2", up: "Y2", left: "16YZ", right: "Y1"}},
    "Y2":   { prefix: "Bottom",   slots: ["R1Y6", "R1Y3", "R1Y7", "R1Y2", "R2Y3", "R2Y2", "R3Y2"], nav: { down: "Y1", up: "Z1", left: "16YZ", right: "Y2"}},
    "Z1":   { prefix: "Top",      slots: ["R1Z1", "R1Z8", "R1Z5", "R1Z4", "R2Z1", "R2Z4", "R3Z1"], nav: { down: "Y2", up: "Z2", left: "16YZ", right: "Z1"}},
    "Z2":   { prefix: "Bottom",   slots: ["R1Z6", "R1Z3", "R1Z7", "R1Z2", "R2Z3", "R2Z2", "R3Z2"], nav: { down: "Z1", left: "16YZ", right: "Z2"}},
    "16WX": { prefix: "Regionals", slots: ["R3W1", "R3W2", "R3X1", "R3X2", "R4W1", "R4X1", "R5WX"], nav: { up: "16YZ", left: "FF", right: "W1"}},
    "16YZ": { prefix: "Regionals", slots: ["R3Y1", "R3Y2", "R3Z1", "R3Z2", "R4Y1", "R4Z1", "R5YZ"], nav: { down: "16WX", left: "FF", right: "Y1"}},
    "FF":   { prefix: "Final Four", slots: ["R5WX", "R5YZ", "R6CH"], nav: { right: "16WX", left: "CH" }},
    "CH":  { prefix: "Champion", slots: ["R7CH"], nav: { right: "FF" }}
}
const bracketRounds = {
    1: { col: 'left', offset: 0, name: "Round of 64", games: ["R1W1", "R1W8", "R1W5", "R1W4", "R1W6", "R1W3", "R1W7", "R1W2", "R1X1", "R1X8", "R1X5", "R1X4", "R1X6", "R1X3", "R1X7", "R1X2", "R1Y1", "R1Y8", "R1Y5", "R1Y4", "R1Y6", "R1Y3", "R1Y7", "R1Y2", "R1Z1", "R1Z8", "R1Z5", "R1Z4", "R1Z6", "R1Z3", "R1Z7", "R1Z2"]},
    2: { col: 'right', offset: 0, name: "Round of 32", games: ["R2W1", "R2W4", "R2W3", "R2W2", "R2X1", "R2X4", "R2X3", "R2X2", "R2Y1", "R2Y4", "R2Y3", "R2Y2", "R2Z1", "R2Z4", "R2Z3", "R2Z2"]},
    3: { col: 'left', offset: 2, name: "Sweet 16", games: ["R3W1", "R3W2", "R3X1", "R3X2", "R3Y1", "R3Y2", "R3Z1", "R3Z2"]},
    4: { col: 'right', offset: 2, name: "Elite 8", games: ["R4W1", "R4X1", "R4Y1", "R4Z1"]},
    5: { col: 'left',  offset: 3, name: "Final Four", games: ["R5WX", "R5YZ"]} ,
    6: { col: 'right', offset: 3,  name: "Championship", games: ["R6CH"] },
    7: { col: 'both', offset: 2.75, name: "Champion", games: ["R7CH"] }
}

const getTeamName = (teamId) => initTeamData[teamId] ? initTeamData[teamId].name : 'Unknown';
const getSeed = (slotKey) => slotKey.substr(1);
const getLocName = (loc, regionInfo) => {
    if (loc === "16WX") return `${regionInfo.W} / ${regionInfo.X} Regionals`;
    if (loc === "16YZ") return `${regionInfo.Y} / ${regionInfo.Z} Regionals`;
    if (loc === "FF") return "Final Four";
    if (loc === "CH") return "Champion";
    return `${LOCATION_INFO[loc].prefix} ${regionInfo[loc[0]]}`;
}
const MATCHUP_HEIGHT = "20dvh";
const locOffsets = {
    "W1": [0, 0], "W2": [0, 1], "X1": [0, 2], "X2": [0, 3], "Y1": [0, 4], "Y2": [0, 5], "Z1": [0, 6], "Z2": [0, 7], 
    "16WX": [1, 2], "16YZ": [1, 3], "FF": [2, 2.75], "CH": [3, 2.75]
}
const [scrollScaleX, scrollScaleY] = [100, 88];

const InsightsPanel = ({ isOpen, insightId, setInsightsOpen }) => {
    return (
        <div style={{ 
            position: "absolute", 
            top: "0", 
            left: "0", 
            width: "100dvw", 
            height: "100dvh", 
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            opacity: isOpen ? 1 : 0,
            pointerEvents: isOpen ? "auto" : "none",
            transition: "opacity 0.3s ease-in-out",
            zIndex: zIndexes["insightsPanel"]
        }}>
            <div style={{ 
                position: "absolute", 
                top: "0", 
                right: isOpen ? "0" : "-80dvw", // Slide from right side
                width: "80dvw", 
                height: "100dvh", // Full height
                backgroundColor: "white",
                boxShadow: "-2px 0 5px rgba(0,0,0,0.2)",
                transition: "right 0.3s ease-in-out"
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "1rem" }}>
                    <h3>Insights</h3>
                    <button onClick={() => setInsightsOpen(false)}>Close</button>
                </div>
                <div style={{ padding: "1rem", overflowY: "auto", height: "calc(100% - 60px)" }}>
                    <p>Insight ID: {insightId}</p>
                    <p>Insight Data: {insightId}</p>
                </div>
            </div>
        </div>
    );
};

const Bracket = ({ data, loc, setLoc, registerCloseInsights }) => {
    const [insightsOpen, setInsightsOpen] = useState(false);
    const [insightId, setInsightId] = useState(null);
    // Register the close insights function with the parent
    useEffect(() => {
        if (registerCloseInsights) {
            registerCloseInsights(() => setInsightsOpen(false));
        }
    }, [registerCloseInsights]);

    const handlers = useSwipeable({
        onSwipedLeft: () => setLoc((prev) => LOCATION_INFO[prev].nav.left || prev),
        onSwipedRight: () => setLoc((prev) => LOCATION_INFO[prev].nav.right || prev),
        onSwipedUp: () => setLoc((prev) => LOCATION_INFO[prev].nav.up || prev),
        onSwipedDown: () => setLoc((prev) => LOCATION_INFO[prev].nav.down || prev),
        preventScrollOnSwipe: true,
        trackMouse: true,
    });
    
    let bracketOffset = { 
        left:  -locOffsets[loc][0] * scrollScaleX + "dvw", 
        top: -locOffsets[loc][1] * scrollScaleY + "dvh",
        transition: "left 0.3s ease-in-out, top 0.3s ease-in-out"
    };
    console.log(loc, bracketOffset);
    return (
        <div {...handlers} style={styles.container}>
            {/* Full bracket grid */}
            <div style={{...styles.bracketGrid, ...bracketOffset}}>
                {renderFullBracket(data.seeds, data.slots, setInsightId, setInsightsOpen)}
                <InsightsPanel isOpen={insightsOpen} insightId={insightId} setInsightsOpen={setInsightsOpen} />
            </div>
        </div>
    );
};

const styles = {
    container: { position: "relative", overflow: "hidden", width: "100dvw", height: "100dvh" },
    bracketGrid: { position: "absolute", display: "flex", width: "350dvw", height: "100dvh", zIndex: zIndexes["bracket"] }, // Big grid
    bracket: { display: "flex", flexDirection: "row", flex: 1, width: "100dvw" }, // Row of rounds
    round: { display: "flex", flexDirection: "column", flex: 1, width: "50dvw", height: "100dvh" }, // Column of matchups
    roundMatchups: { display: "flex", flexDirection: "column", flex: 1 }, // Column of matchups
    matchup: { display: "flex", flexDirection: "column", width: "100%", justifyContent: "space-between", height: MATCHUP_HEIGHT }, // Two teams
    matchupInfo: { display: "flex", flexDirection: "row", justifyContent: "space-around", width: "100%" }, // Open Insights
    team: { display: "flex", justifyContent: "space-around", textAlign: "center", width: "100%" }, // Team box
    champion: { display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }
};

let roundStyle = (col, offset) => {
    if (col === 'left') { return { marginTop: offset * scrollScaleY + "dvh" };
    } else { return { justifyContent: "space-between", marginTop: offset * scrollScaleY + "dvh" }; }
}
let matchupStyle = (col) => {
    if (col === 'left') { return { marginTop: "1dvh", marginBottom: "1dvh" };
    } else { return { marginTop: "12dvh", marginBottom: "12dvh" }; }
}
let rndMatchupsStyle = (col) => {
    if (col === 'both') { return { width: "100dvw", paddingTop: "1dvh", paddingBottom: "1dvh" } }
    else if (col === 'right') { return { paddingTop: "1dvh", paddingBottom: "1dvh" } }
    else { return { paddingTop: "0dvh", paddingBottom: "0dvh" } }
}

const renderFullBracket = (seedData, slotData, setInsightId, setInsightsOpen) => {
    return (
        <div style={styles.bracket}>
            {Object.keys(bracketRounds).map((roundKey, roundIndex) => {
                return (<CardGroup key={roundIndex} style={{...styles.round, ...roundStyle(bracketRounds[roundKey].col, bracketRounds[roundKey].offset)}}>
                    <CardGroup style={{...styles.roundMatchups, ...rndMatchupsStyle(bracketRounds[roundKey].col)}}>
                    {bracketRounds[roundKey].games.map((matchup, matchupIndex) => {
                        if (matchup === "R7CH" && slotData["R6CH"]) {
                            return (<Card style={styles.champion} key={matchupIndex}>
                                <Card.Title>Champion</Card.Title>
                                <Card.Body>
                                    <Card.Text>{getTeamName(slotData["R6CH"].winner)}</Card.Text>
                                </Card.Body>
                            </Card>
                            )
                        } else if (slotData[matchup] === undefined) {
                            // Placeholder for empty slot
                            return (
                            <Card key={matchupIndex} style={styles.matchup}>
                                <div style={styles.team}>TBD</div>
                                <div>{matchup}</div>
                                <div style={styles.team}>TBD</div>
                            </Card>)
                        } else {
                            let { t1, t2, winner, wScore, lScore } = slotData[matchup];
                            let [topScore, bScore] = winner === t1 ? [wScore, lScore] : [lScore, wScore];
                            let [t1Style, t2Style] = winner === t1 ? [{color: "green"}, {}] : [{}, {color: "green"}];
                            let colMatchup = matchupStyle(bracketRounds[roundKey].col);

                            return (<Card key={matchupIndex} style={{...styles.matchup, ...colMatchup}}>
                                <div style={{...styles.team, ...t1Style}} onClick={() => {setInsightId(["team", t1]); setInsightsOpen(true)}}
                                    ><span>{getSeed(seedData[t1])}</span><span>{getTeamName(t1)}</span><span>{topScore}</span></div>
                                <div style={styles.matchupInfo} onClick={() => {setInsightId(["matchup", matchup]); setInsightsOpen(true)}}
                                    ><span>Insights {matchup}</span></div>
                                <div style={{...styles.team, ...t2Style}} onClick={() => {setInsightId(["team", t2]); setInsightsOpen(true)}}
                                    ><span>{getSeed(seedData[t2])}</span><span>{getTeamName(t2)}</span><span>{bScore}</span></div>
                            </Card>)

                        }
                    })}
                    </CardGroup>
                </CardGroup>)
            })}
        </div>
    );
};

const Page = () => {
    const navContent = [
        { type: "SingleLink", title: "Home", pageRef: "/" },
        { type: "SingleLink", title: "Bracket", pageRef: "/mm/bracketv2" },
        { type: "SingleLink", title: "DataLab", pageRef: "/mm/datalab" }
    ];
    const [season, setSeason] = useState(2024);
    const [mode, setMode] = useState("history")
    const [bracketData, setBracketData] = useState(bracketInfo[season]);
    const [loc, setLoc] = useState("W1");
    const [ctrlPanelExpanded, setCtrlPanelExpanded] = useState(false);
    // Reference to close insights function
    const closeInsightsRef = React.useRef(null);
    
    // Custom handler for control panel expansion
    const handleCtrlPanelToggle = (isExpanded) => {
        setCtrlPanelExpanded(isExpanded);
        
        // If opening control panel, close insights panel
        if (isExpanded && closeInsightsRef.current) {
            closeInsightsRef.current();
        }
    };

    return (
        <div style={{ height: "100dvh", width: "100dvw", display: "flex", flexDirection: "column" }}>
            <Nav page={"MM Bracket"} navContent={navContent} />
            <Bracket data={bracketData} loc={loc} setLoc={setLoc}
                registerCloseInsights={(closeFunc) => {closeInsightsRef.current = closeFunc}} />
            <BracketControlPanel bracketInfo={bracketData} 
                isExpanded={ctrlPanelExpanded} setIsExpanded={handleCtrlPanelToggle}
                location={getLocName(loc, bracketData.regions)} setLocation={setLoc}
                season={season} setSeason={setSeason} mode={mode} setMode={setMode}
                zIndex={zIndexes["controlPanel"]}
                />
        </div>
    );
};

export default Page;