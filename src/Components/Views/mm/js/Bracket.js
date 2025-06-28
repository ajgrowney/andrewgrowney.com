// 
// Bracket Page supportts multiple viewing modes
// 1. Read -    View the actual matchups and results
// 2. Edit - View, fill, and export a bracket's results 
//         - Support "fill with model" option
//

import React, { useEffect, useState } from 'react'
import { Link } from 'gatsby'
import { Button, Card, Table, Carousel, Tab } from 'react-bootstrap'
import { useSwipeable } from 'react-swipeable';
import { useLocation, navigate } from '@reach/router';
import Dropdown from 'react-bootstrap/Dropdown'
import Nav from '../../../js/Nav'
import TeamIds from '../../../../Data/mm/team_ids'
import { CalculateWinner, ModelPredictKey } from '../../../../helpers/mm'
import { MMBracket } from '../../../../images/Blogs/MarchMadnessML';
import { IMAGE_HOST } from '../../../../images';
import '../css/bracket.css'
import 'bootstrap/dist/css/bootstrap.css'

const DATA_HOME = 'https://raw.githubusercontent.com/ajgrowney/march-madness-ml/master/data/web/tourney_v3'

const DEFAULT_MODEL = "2022_grid_poly_1"
const DEFAULT_SEASON = 2025
const statFriendly = {
    "AdjOE": "Adj Off Eff",
    "AdjDE": "Adj Def Eff",
    "AdjNE": "Adj Net Eff",
    "SOS": "Strength of Schedule",
    "Poss": "Tempo"
}

const IButton = () => {
    return (<Button size="sm" className='minibutton'>i</Button>)
}

const SEASON_LIST = [2025, 2024, 2023, 2022, 2021, 2019, 2018, 2017, 2016, 2015, 2014, 2013]
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


// ---- Bracket Viewing Modes ---
const VIEW_MODES = {
    "read": { name: "Read", is_allowed: (x) => true },
    "edit": { name: "Edit", is_allowed: (x) => x == 2026 }
}

let  ViewSelector = (tourneyData, viewData, setView) => {
    // view: {mode: "read", year: 2022, region: "finalfour"}
    let changeMode = (new_val) => { setView({mode: new_val, region: viewData.region, year: viewData.year}) }
    let changeYear = (new_val) => { setView({mode: viewData.mode, region: viewData.region, year: new_val}) }
    let changeRegion = (new_val) => { setView({mode: viewData.mode, region: new_val, year: viewData.year}) }
    // Other Modes Dropdown
    let allowed_modes = Object.keys(VIEW_MODES).filter(x => VIEW_MODES[x].is_allowed(viewData.year))
    let otherModes = allowed_modes.map(x => { return {name: VIEW_MODES[x].name, val: x} })
    // Other Regions Dropdown
    let selectedRegion = TOURNEY_REGION_VIEWS[viewData.region].prefix;
    if (selectedRegion == "Regionals") {
        let [r1, r2] = [viewData.region.charAt(2), viewData.region.charAt(3)]
        selectedRegion = `${tourneyData["regions"][r1]} ${tourneyData["regions"][r2]} Regionals`
    } else if (selectedRegion != "Final Four") {
        let regName = tourneyData["regions"][viewData.region[0]]
        selectedRegion = `${regName} ${selectedRegion}`
    }
    let otherRegions = Object.keys(TOURNEY_REGION_VIEWS).map(x => {
        let opName = TOURNEY_REGION_VIEWS[x].prefix;
        if (opName == "Regionals") {
            let [r1, r2] = [x.charAt(2), x.charAt(3)]
            opName = `${tourneyData["regions"][r1]} ${tourneyData["regions"][r2]} Regionals`
        } else if (opName != "Final Four") {
            let regName = tourneyData["regions"][x[0]]
            opName = `${regName} ${opName}`
        }
        return ({name: opName, val: x})
    })
    return(
        <div style={{'display': 'flex', 'flexDirection': 'row', 'justifyContent': 'space-around'}}>
        <Dropdown key='mode' className='selectorItem'>
            <Dropdown.Toggle>{viewData.mode}</Dropdown.Toggle>
            <Dropdown.Menu>
                {otherModes.map(x => <Dropdown.Item onSelect={() => {changeMode(x.val)}}>{x.name}</Dropdown.Item>)}
            </Dropdown.Menu>
        </Dropdown>
        <Dropdown key='year' className='selectorItem' onSelect={(evt, _) => {changeYear(evt)}}>
            <Dropdown.Toggle>{viewData.year}</Dropdown.Toggle>
            <Dropdown.Menu>
                {SEASON_LIST.map(x => <Dropdown.Item eventKey={x}>{x}</Dropdown.Item>)}
            </Dropdown.Menu>
        </Dropdown>
        <Dropdown key='region' className='selectorItem' onSelect={(evt, _) => {changeRegion(evt)}}>
            <Dropdown.Toggle>{selectedRegion}</Dropdown.Toggle>
            <Dropdown.Menu>
                {otherRegions.map(x => <Dropdown.Item eventKey={x.val}>{x.name}</Dropdown.Item>)}
            </Dropdown.Menu>
        </Dropdown>
        </div>
    )
}
let toggleCollapse = (id, display_val, e) => {
    let element = document.getElementById(id);
    if (element.style.display === "none") {
        element.style.display = display_val;
    } else {
        element.style.display = "none";
    }
    if (e && e.stopPropagation) { e.stopPropagation(); }
}

const TeamDataEntryTitle = ({title, classNames, toggle_key}) => (
    <Card.Title className={classNames}>
        <div className='titleVal'>{title}</div>
        <Button onClick={(e) => {toggleCollapse(toggle_key, "flex", e)}}>+</Button>
    </Card.Title> 
)

const TeamDataTable = ({ tableData, maxValueHeight }) => {
    // Description: Component displaying data in a 'team-data-table' div
    // param data: list of objects with keys: title, value, is_collapsible
    // param maxValueHeight: max height of the value div
    if (tableData.constructor !== Array){
        return <div>Error</div>
    }

    let entries = tableData.map((obj) => {
        let entry_key = obj.key;
        let data_div_key = `${entry_key}_data`;
        let objClassNames = obj.is_collapsible ? 'panel-entry is-collapsible' : 'panel-entry not-collapsible'
        let titleClassNames = obj.is_collapsible ? 'panel-entry-title is-collapsible' : 'panel-entry-title not-collapsible'
        return(<Card className={objClassNames} key={entry_key}>
            <TeamDataEntryTitle title={obj.title} classNames={titleClassNames} toggle_key={data_div_key} />
            <div id={data_div_key} className='vertical-data' style={{'maxHeight': maxValueHeight}}>{obj.value}</div>
        </Card>)
    })
    return (<div className='panel-table'>{entries}</div>)
}

let displayExitRound = (er) => {
    if (er == "Champion") { return "Champion" }
    else if (er === null ) { return "Missed Tourney" }
    else { return `Lost in ${er}` }
}

let fmtContent = (tid, teamName, teamYear, content) => {
    let [wins, losses] = content["Rec"]
    let ranks = content["Ranks"]
    let rankDiv = (<Table>
        <thead><tr><th>Stat</th><th>Rank</th></tr></thead>
        <tbody>{Object.keys(ranks).map(x => <tr><td>{statFriendly[x]}</td><td>{ranks[x]}</td></tr>)}</tbody>
    </Table>)
    let simTeams = content["Sims"] // Format: [ { i: tid, y: year, s: sim_score, e: exit round}]
    let simCurrentYear = simTeams.filter(x => x.y == teamYear)
    let simCurrentYearTable = (<Table>
        <thead><tr><th>Team</th><th>Similarity</th></tr></thead>
        <tbody>{simCurrentYear.map(x => <tr><td><Link to={`/mm/team/?tid=${x.i}&year=${x.y}`}>{x.y} {TeamIds[x.i]}</Link></td><td>{(x.s*100).toFixed(2)}%</td></tr>)}</tbody>
    </Table>)
    let otherYears = simTeams.filter(x => x.y != teamYear)
    let otherYearsTable = (<Table>
        <thead><tr><th>Team</th><th>Similarity</th></tr></thead>
        <tbody>{otherYears.map(x => <tr><td><Link to={`/mm/team/?tid=${x.i}&year=${x.y}`}>{x.y} {TeamIds[x.i]}</Link> <br /> {displayExitRound(x.e)}</td><td>{(x.s*100).toFixed(2)}%</td></tr>)}</tbody>
    </Table>)
    let simDiv = (<Card>
        <Card style={{'textAlign': 'center'}}>
        <Card.Title>Previous Years</Card.Title>
        {otherYearsTable}
        </Card>
        <Card style={{'textAlign': 'center'}}>
        <Card.Title>Current Year</Card.Title>
        {simCurrentYearTable}
        </Card>
    </Card>)

    return [
        {title: <Link to={`/mm/team/?tid=${tid}&year=${teamYear}`}>{teamName} {teamYear}</Link>, value: <div>{`Record: ${wins} - ${losses}`}</div>, is_collapsible: false, key: "team_info"},
        {title: "Insights", value: <div>Coming Soon</div>, is_collapsible: false, key: "insights"},
        {title: "Ranks", value: rankDiv, is_collapsible: true, key: "ranks"},
        {title: "Similar Teams", value: simDiv, is_collapsible: true, key: "sims"}
    ]
}



let ReadSlotSidePanel = ({r, y, sid, sname, tsid, ts, wname, twid, tw, tourneyProbs, matchupProbs, tourneyData, neuralProbs, neuralMatchupProbs, clfV2Probs, clfV2MatchupProbs }) => {
    let [rankCarIdx, setRankCarIdx] = useState(0)
    let [modelInsightsCarIdx, setmodelInsightsCarIdx] = useState(0)
    let roundName = ""
    let regName = ""
    if (sid.startsWith("R1")) { roundName = "Round of 64"; regName = tourneyData["regions"][sid[2]] }
    else if (sid.startsWith("R2")) { roundName = "Round of 32"; regName = tourneyData["regions"][sid[2]] }
    else if (sid.startsWith("R3")) { roundName = "Sweet Sixteen"; regName = tourneyData["regions"][sid[2]] }
    else if (sid.startsWith("R4")) { roundName = "Elite 8"; regName = tourneyData["regions"][sid[2]]}
    else if (sid.startsWith("R5")) { roundName = "Final Four"; regName = tourneyData["regions"][sid[2]] + " vs " + tourneyData["regions"][sid[3]] }
    else if (sid.startsWith("R6")) { roundName = "Championship"; regName = "Championship" }
    let isMatchup = (tsid && twid) ? (!Array.isArray(twid)) : false
    let panelTitle = isMatchup ? <Card.Title>{sname} vs {wname}</Card.Title> : <Card.Title>{regName}</Card.Title>
    let carousel_items = []

    // ---- Tournament Probability Insights ----
    // Sort tourneyProbs by value and select top 5
    let showTourneyProbs = Object.keys(tourneyProbs)
        .sort((a, b) => tourneyProbs[b] - tourneyProbs[a])
        .slice(0, 5).map(x => [x, TeamIds[x], tourneyProbs[x]])
    let includedIds = showTourneyProbs.map(x => x[0])
    // Add the two teams if they aren't already included
    if (tsid) { if(!includedIds.includes(tsid.toString())) { showTourneyProbs.push([tsid.toString(), sname, tourneyProbs[tsid]]) } }
    if (twid) { if(!includedIds.includes(twid.toString())) { showTourneyProbs.push([twid.toString(), wname, tourneyProbs[twid]]) } }
    let showTourneyProbsDiv = (<Table>
        <thead><tr><th>Team</th><th>Probability</th></tr></thead>
        <tbody>
            {showTourneyProbs.map(x => <tr><td>{x[1]}</td><td>{(x[2]*100).toFixed(2)}%</td></tr>)}
        </tbody>
    </Table>)
    // Is there also slots_neural available to use
    if (neuralProbs) {
        let neuralTourneyProbs = Object.keys(neuralProbs).sort((a, b) => neuralProbs[b] - neuralProbs[a]).slice(0, 5).map(x => [x, TeamIds[x], neuralProbs[x]])
        let neuralTourneyProbsDiv = (<Table>
            <thead><tr><th>Team</th><th>Probability</th></tr></thead>
            <tbody>{neuralTourneyProbs.map(x => <tr><td>{x[1]}</td><td>{(x[2]*100).toFixed(2)}%</td></tr>)}</tbody>
        </Table>)
        carousel_items.push(
            <Carousel.Item variant="dark">
                <Card.Title>Neural Model</Card.Title>
                <Card.Body>{neuralTourneyProbsDiv}</Card.Body>
            </Carousel.Item>)
    }
    // Is there also slots_clf_v2 available to use
    if (clfV2Probs) {
        let clfV2TourneyProbs = Object.keys(clfV2Probs).sort((a, b) => clfV2Probs[b] - clfV2Probs[a]).slice(0, 5).map(x => [x, TeamIds[x], clfV2Probs[x]])
        let clfV2TourneyProbsDiv = (<Table>
            <thead><tr><th>Team</th><th>Probability</th></tr></thead>
            <tbody>{clfV2TourneyProbs.map(x => <tr><td>{x[1]}</td><td>{(x[2]*100).toFixed(2)}%</td></tr>)}</tbody>
        </Table>)
        carousel_items.push(
            <Carousel.Item variant="dark">
                <Card.Title>clfV2 Model</Card.Title>
                <Card.Body>{clfV2TourneyProbsDiv}</Card.Body>
            </Carousel.Item>)
    }

    carousel_items.push(
        <Carousel.Item variant="dark">
            <Card.Title>Tournament Probability</Card.Title>
            <Card.Body>{showTourneyProbsDiv}</Card.Body>
        </Carousel.Item>)
    // ---- Matchup Probability Insights ----
    if (matchupProbs) {
        let [mWinner, mP] = matchupProbs
        let matchupProbsDiv = (sid.startsWith("R1") || y < 2025) ? (<div>{TeamIds[mWinner]}: {(mP*100).toFixed(2)}%</div>) : (<div>Coming Soon</div>)
        carousel_items.push(
            <Carousel.Item variant="dark">
                <Card.Title>Matchup Probability</Card.Title>
                <Card.Body>{matchupProbsDiv}</Card.Body>
            </Carousel.Item>)
    }
    if (neuralMatchupProbs) {
        let [mWinner, mP] = neuralMatchupProbs
        let neuralMatchupProbsDiv = (sid.startsWith("R1") || y < 2025) ? (<div>{TeamIds[mWinner]}: {(mP*100).toFixed(2)}%</div>) : (<div>Coming Soon</div>)
        carousel_items.push(
            <Carousel.Item variant="dark">
                <Card.Title>Neural Model Probability</Card.Title>
                <Card.Body>{neuralMatchupProbsDiv}</Card.Body>
            </Carousel.Item>)
    }
    if (clfV2MatchupProbs) {
        let [mWinner, mP] = clfV2MatchupProbs
        let clfV2MatchupProbsDiv = (sid.startsWith("R1") || y < 2025) ? (<div>{TeamIds[mWinner]}: {(mP*100).toFixed(2)}%</div>) : (<div>Coming Soon</div>)
        carousel_items.push(
            <Carousel.Item variant="dark">
                <Card.Title>V2 Model Probability</Card.Title>
                <Card.Body>{clfV2MatchupProbsDiv}</Card.Body>
            </Carousel.Item>)
    }
    
    let modelInsightsCarSelect = (selectedIndex, e) => {
        setmodelInsightsCarIdx(selectedIndex)
        if (e && e.stopPropagation) { e.stopPropagation(); }
    }
    let modelInsightsDiv = (<Card>
            <Card.Title>Model Insights</Card.Title>
            <Card.Body>
                <Carousel variant="dark" activeIndex={modelInsightsCarIdx} onSelect={modelInsightsCarSelect}  style={{'paddingBottom': '0.5rem'}}>
                    {carousel_items}
                </Carousel>
            </Card.Body>
        </Card>)
    // ---- Rank Comparison Insights ----
    let rankInsights = ""
    if (isMatchup) {
        // Matchup View
        let ranksInBoth = Object.keys(ts["Ranks"]).filter(x => Object.keys(tw["Ranks"]).includes(x))
        let rankTable = (<Table>
            <thead><tr><th>{sname}</th><th>Stat</th><th>{wname}</th></tr></thead>
            <tbody>{ranksInBoth.map(x => <tr> <td>{ts["Ranks"][x]}</td> <td>{x}</td> <td>{tw["Ranks"][x]}</td></tr>)}</tbody>
        </Table>)
        rankInsights = (<div>
            <h5>Rank Comparison</h5>
            {rankTable}
        </div>)
    } else {
        // Slot View
        let includedTeamRanks = Object.keys(tourneyProbs).map(x => [x, tourneyData.teams[x]["Ranks"]])
        let statsToRank = Object.keys(includedTeamRanks[0][1])
        // Build out a table for each stat with columns of team name and rank
        let rankTables = statsToRank.map(x => {
            let statRanks = includedTeamRanks.map(y => [y[0], y[1][x]])
            let sortedRanks = statRanks.sort((a, b) => a[1] - b[1])
            let rankTable = (<Table>
                <thead><tr><th>Team</th><th>Rank</th></tr></thead>
                <tbody>{sortedRanks.map(y => <tr> <td>{TeamIds[y[0]]}</td> <td>{y[1]}</td></tr>)}</tbody>
            </Table>)
            return (<Carousel.Item>
                <h6>{x}</h6>
                {rankTable}
            </Carousel.Item>)
        })
        
        let rankCarSelect = (selectedIndex, e) => {
            setRankCarIdx(selectedIndex)
            if (e && e.stopPropagation) { e.stopPropagation(); }
        }
        rankInsights = (<div>
            <h5>Rank Comparison</h5>
            <Carousel variant="dark" activeIndex={rankCarIdx} onSelect={rankCarSelect}>
            {rankTables}
            </Carousel>
        </div>)
    }
    
    return (
        <Card style={{'textAlign': 'center'}}>
            <Card.Header style={{'display': 'grid', 'gridTemplateColumns': '90% 10%'}}>
                <div>
                    {panelTitle}
                    <Card.Subtitle>{roundName}</Card.Subtitle>
                </div>
                <Button variant='outline-danger'>x</Button>
            </Card.Header>
            <Card.Body>
                <hr />
                {modelInsightsDiv}
                <hr />
                {rankInsights}
            </Card.Body>
        </Card>
    )
}




const RegionData = (tourneyData, view, setSidePanel) => {
    let selectedRegionSlots = TOURNEY_REGION_VIEWS[view.region].slots
    let neuralPreds = tourneyData["predictions_neural"]
    let clfV2Preds = tourneyData["predictions_clf_v2"]
    // Get Game Data
    let gameData = selectedRegionSlots.map(x => {
        let neuralSlot = tourneyData["slots_neural"] ? tourneyData["slots_neural"][x] : null
        let clfV2Slot = tourneyData["slots_clf_v2"] ? tourneyData["slots_clf_v2"][x] : null
        let s = tourneyData["slots"][x]
        let isPrediction = false
        if (view.year < 2025 || x.startsWith("R1")){
            let [strongSeedScore, strongSeedColor] = s["strong_seed"] == s["winner"] ? [s["wscore"], "green"] : [s["lscore"], ""]
            let [weakSeedScore, weakSeedColor] = s["weak_seed"] == s["winner"] ? [s["wscore"], "green"] : [s["lscore"], ""]
            
            let [ssid, wsid] = [s["strong_seed"], s["weak_seed"]]
            let [sName, sTeam, sSeed] = [TeamIds[ssid], tourneyData.teams[ssid], tourneyData.teams[ssid]["Seed"]]
            let [wName, wTeam, wSeed, wSeedSideContent] = [null, null, null, null]
            let slotContent = (strongSeedScore) ? <div>{strongSeedScore} - {weakSeedScore}<IButton /></div> : <div> vs <IButton /></div>
            
            if (wsid.toString().includes("/")) { 
                wsid = wsid.split("/")
                wName = [TeamIds[wsid[0]], TeamIds[wsid[1]]].join("/")
                wTeam = [tourneyData.teams[wsid[0]], tourneyData.teams[wsid[1]]]
                wSeed = tourneyData.teams[wsid[0]]["Seed"]
                let playInKey = wsid.sort().join("_")
                let playInMatchup = tourneyData["predictions"][wsid.join("_")]
                let loser = playInMatchup[0] == wsid[0] ? wsid[1] : wsid[0]
                let playInTourney = { [playInMatchup[0]]: playInMatchup[1], [loser]: 1 - playInMatchup[1] }
                // Try to Fetch neural predictions
                let neuralPlayInMatchup = null
                if (neuralPreds) {
                    neuralPlayInMatchup = neuralPreds[playInKey]
                }
                let clfV2PlayInMatchup = null
                if (clfV2Preds) {
                    clfV2PlayInMatchup = clfV2Preds[playInKey]
                }

                wSeedSideContent = <ReadSlotSidePanel r={view.region} y={view.year} sid={wsid[0]} sname={TeamIds[wsid[0]]} tsid={wsid[0]} ts={tourneyData.teams[wsid[0]]}
                                    wid={wsid[1]} wname={TeamIds[wsid[1]]} twid={wsid[1]} tw={tourneyData.teams[wsid[1]]}
                                    tourneyProbs={playInTourney} matchupProbs={playInMatchup} tourneyData={tourneyData}
                                    neuralProbs={neuralSlot ? neuralSlot["prob"] : null} neuralMatchupProbs={neuralPlayInMatchup} 
                                    clfV2Probs={clfV2Slot ? clfV2Slot["prob"] : null} clfV2MatchupProbs={clfV2PlayInMatchup} />

            } else {
                wName = TeamIds[wsid]
                wTeam = tourneyData.teams[wsid]
                wSeed = tourneyData.teams[wsid]["Seed"]
                wSeedSideContent = <TeamDataTable tableData={fmtContent(wsid, wName, view.year, tourneyData.teams[wsid]) } />
            }
            let strongSeedContent = [<div className='team-info'><div>{sSeed}</div><div> {sName}</div><IButton /></div>, strongSeedColor, <TeamDataTable tableData={fmtContent(ssid, sName, view.year, tourneyData.teams[ssid])} />]
            let weakSeedContent = [<div className='team-info'><div>{wSeed}</div><div> {wName}</div><IButton /></div>, weakSeedColor, wSeedSideContent]

            // Flip Round 2 games that aren't the 1 vs 8 slot, Round 3 games that are in the bottom half of the region
            let isFlipped = (x.substr(0,2) == "R2" && x[3] != "1") || (x.substr(0,2) == "R3" && x[3] == "2")

            let [topData, topColor, topSideCont] = isFlipped ? weakSeedContent : strongSeedContent
            let [bottomData, bottomColor, bottomSideCont] = isFlipped ? strongSeedContent : weakSeedContent

            // Sort Ids and join them into string with _ between
            let sortedIds = [ssid, wsid].sort((a, b) => a - b).join("_")
            let matchupProbabilities = tourneyData["predictions"][sortedIds]
            let slotSideContent = <ReadSlotSidePanel r={view.region} y={view.year} sid={x} sname={sName} tsid={ssid} ts={sTeam} wname={wName} twid={wsid} tw={wTeam}
                                tourneyProbs={s["prob"]} matchupProbs={matchupProbabilities} tourneyData={tourneyData}
                                neuralProbs={neuralSlot ? neuralSlot["prob"] : null} neuralMatchupProbs={neuralPreds ? neuralPreds[sortedIds] : null} 
                                clfV2Probs={clfV2Slot ? clfV2Slot["prob"] : null} clfV2MatchupProbs={clfV2Preds ? clfV2Preds[sortedIds] : null} />
            return (
                <Card key={x} id={x} className='game-container'>
                    <div className={`team-container ${topColor}`} onClick={() => setSidePanel({show: true, content: topSideCont})}>{topData}</div>
                    <div className='score-container' onClick={() => setSidePanel({show: true, content: slotSideContent})}>{slotContent}</div>
                    <div className={`team-container ${bottomColor}`} onClick={() => { setSidePanel({show: true, content: bottomSideCont})}}>{bottomData}</div>
                </Card>
            )
        // } else if (isPrediction) {
        //     let [ssid, wsid] = [s["strong_seed"], s["weak_seed"]]
        //     let [sName, sTeam, sSeed] = [TeamIds[ssid], tourneyData.teams[ssid], tourneyData.teams[ssid]["Seed"]]
        //     let [wName, wTeam, wSeed] = [TeamIds[wsid], tourneyData.teams[wsid], tourneyData.teams[wsid]["Seed"]]
        //     let sortedIds = [ssid, wsid].sort((a, b) => a - b).join("_")
        //     let matchupProbabilities = tourneyData["predictions"][sortedIds]
        //     let neuralSlot = tourneyData["slots_neural"] ? tourneyData["slots_neural"][x] : null
        //     let slotContent = <div>Coming Soon<IButton /></div>
        //     let slotSideContent = <ReadSlotSidePanel r={view.region} y={view.year} sid={x} sname={sName} tsid={ssid} ts={sTeam} wname={wName} twid={wsid} tw={wTeam}
        //                         tourneyProbs={s["prob"]} matchupProbs={matchupProbabilities} tourneyData={tourneyData} neuralProbs={neuralSlot ? neuralSlot["prob"] : null} />
        //     return (
        //         <Card key={x} id={x} className='game-container'>
        //             <div className='team-container'>{sSeed} {ssid} {sName}</div>
        //             <div className='score-container' onClick={() => setSidePanel({show: true, content: slotSideContent})}>{slotContent}</div>
        //             <div className='team-container'>{wSeed} {wsid} {wName}</div>
        //         </Card>
        //     )
        } else {
            // let slotContent = <ReadSlotSidePanel y={view.year} sid={x} sname={sName} tsid={ssid} ts={sTeam} wname={wName} twid={wsid} tw={wTeam}
            //                     tourneyProbs={s["prob"]} matchupProbs={matchupProbabilities} />
            let roundName = ""
            let regPrefix = ""
            if (x.startsWith("R1")) { roundName = "Round of 64"; regPrefix = tourneyData["regions"][x[2]] }
            else if (x.startsWith("R2")) { roundName = "Round of 32"; regPrefix = tourneyData["regions"][x[2]] }
            else if (x.startsWith("R3")) { roundName = "Sweet Sixteen"; regPrefix = tourneyData["regions"][x[2]] }
            else if (x.startsWith("R4")) { roundName = "Elite 8"; regPrefix = tourneyData["regions"][x[2]]}
            else if (x.startsWith("R5")) { roundName = "Final Four"; regPrefix = tourneyData["regions"][x[2]] + " vs " + tourneyData["regions"][x[3]]}
            else if (x.startsWith("R6")) { roundName = "Championship" }
            roundName = regPrefix ? regPrefix + " " + roundName : roundName
            let sideSlotContent = <ReadSlotSidePanel r={view.region} y={view.year} sid={x} sname={null} tsid={null} ts={null} wname={null} twid={null} tw={null}
                tourneyProbs={s["prob"]} matchupProbs={null} tourneyData={tourneyData} neuralProbs={neuralSlot ? neuralSlot["prob"] : null} 
                clfV2Probs={clfV2Slot ? clfV2Slot["prob"] : null} />
            return (
                <Card key={x} id={x} className='slot-container' onClick={() => setSidePanel({show: true, content: sideSlotContent})}>
                    <div>
                    {roundName}
                        <IButton />
                    </div>
                </Card>
            )
        }
    })
    // Format into region based view
    let className = ""
    let roundData = []
    let roundTitles = []
    if (view.region == "FF") {
        className = "ff-container"
        roundTitles = ["Final Four", "Championship"]
        roundData = [
            <div className='round-container-ff'><div>{roundTitles[0]}</div>{gameData.slice(0, 2)}</div>,
            <div className='round-container-ch'><div>{roundTitles[1]}</div>{gameData.slice(2, 3)}</div>
        ]

    } else {
        className = "tourney-region"
        roundTitles = view.region.startsWith("16") ? ["Sweet 16", "Elite 8", "Final 4"] : ["Round of 64", "Round of 32", "Sweet Sixteen"]
        roundData = [
            <div className="round-container left">  <div>{roundTitles[0]}</div>{gameData.slice(0, 4)}</div>,
            <div className="round-container center"><div>{roundTitles[1]}</div>{gameData.slice(4, 6)}</div>,
            <div className="round-container right"> <div>{roundTitles[2]}</div>{gameData.slice(6, 7)}</div>
        ]
    }
    return (<div className={className}>{roundData}</div>)
}

let SidePanel = (sidePanelData, setSidePanel) => {
    let toggleVal = sidePanelData.show ? false : true
    let classes = `sidePanel ${sidePanelData.show ? 'show' : 'hide'}`
    return (
        <Card className={classes} onClick={() => {setSidePanel({show: toggleVal, content: sidePanelData.content})}}>
            {sidePanelData.content}
        </Card>
    )
}

let BracketData = () => {
    let [sidePanel, setSidePanel] = useState({show: false, content: ""})
    let location = useLocation();
    let queryParams = new URLSearchParams(location.search);
    const [selectedState, setSelectedState] = useState({
        mode: queryParams.get('mode') || 'read',
        year: queryParams.get('year') || '2025',
        region: queryParams.get('region') || 'W1'
    });
    let [bracketData, setbracketData] = useState(null)
    let [predictions, setPredictions] = useState({})
    
    // Fetch Read Data from GitHub
    useEffect(() => {
        if (selectedState.mode == "edit") {
            setbracketData(predictions)
        } else {
            fetch(`${DATA_HOME}/${selectedState.year}.json`)
                .then(response => response.json())
                .then(data => {setbracketData(data)})
                .catch(error => {setbracketData({not_found: true});})
        }
    }, [selectedState]);
    const swipeHandlers = useSwipeable({
        onSwipedRight: () => { if (sidePanel.show === false) {setSelectedState(prevState => ({...prevState, region: TOURNEY_REGION_VIEWS[prevState.region].nav.right}))}},
        onSwipedLeft: () =>  { if (sidePanel.show === false) {setSelectedState(prevState => ({...prevState, region: TOURNEY_REGION_VIEWS[prevState.region].nav.left}))}},
        onSwipedUp: () =>    { if (sidePanel.show === false) {setSelectedState(prevState => ({...prevState, region: TOURNEY_REGION_VIEWS[prevState.region].nav.up}))}},
        onSwipedDown: () =>  { if (sidePanel.show === false) {setSelectedState(prevState => ({...prevState, region: TOURNEY_REGION_VIEWS[prevState.region].nav.down}))}}
    });
    
    if (bracketData === null){
        return <div>Loading...</div>
    } else if (bracketData.not_found) {
        return <div>Bracket data not found. Change year.</div>
    } else {
        return (
            <div className='data-container' {...swipeHandlers}>
                <div className='d-flex flex-column align-items-center'>
                    <div className='selectorContainer'>{ViewSelector(bracketData, selectedState, setSelectedState)}</div>
                </div>
                <div className='region-container'>
                    {RegionData(bracketData, selectedState, setSidePanel)}
                    {SidePanel(sidePanel, setSidePanel)}
                </div>
            </div>)
    }
}

function Bracket()
{

    let navContent = [
        { type: "SingleLink", title: "Home", pageRef: "/" },
        { type: "SingleLink", title: "March Madness", pageRef: "/marchmadness" },
        { type: "SingleLink", title: "Matchup", pageRef: "/mm/matchup/" },
        { type: "SingleLink", title: "Team Viewer", pageRef: "/mm/team/" },
    ]

    return (
        <div id="root">
            <div className='app-container'>
                <Nav page={"MM"} navContent={navContent} />
                <BracketData />
            </div>
        </div>
    )
}
export default Bracket;