// 
// Bracket Page supportts multiple viewing modes
// 1. Read -    View the actual matchups and results
// 2. Edit - View, fill, and export a bracket's results 
//         - Support "fill with model" option
//

import React, { useEffect, useState } from 'react'
import Helmet from 'react-helmet';
import { useLocation, navigate } from '@reach/router';
import Dropdown from 'react-bootstrap/Dropdown'
import Nav from '../../../js/Nav'
import TeamIds from '../../../../Data/mm/team_ids'
import { CalculateWinner, ModelPredictKey } from '../../../../helpers/mm'
import teamData from '../../../../Data/mm/teams'
import teamSeeds from '../../../../Data/mm/teamSeeds'
import tourneyRegions from '../../../../Data/mm/tourneyRegions'
import tourneyGameResults from '../../../../Data/mm/tourneyGameResults'
import tourneySlots from '../../../../Data/mm/tourneySlots'
import slotResults from '../../../../Data/mm/slotResults'
import model_info_map from '../../../../Data/mm/model_info'
import full_features_2021 from "../../../../Data/mm/features/2021/all_models"
import full_features_2022 from "../../../../Data/mm/features/2022/all_models"
import '../css/bracket.css'
import 'bootstrap/dist/css/bootstrap.css'
const DATA_HOME = 'https://raw.githubusercontent.com/ajgrowney/march-madness-ml/master/data/web/tourney'

const DEFAULT_MODEL = "2022_grid_poly_1"
const DEFAULT_SEASON = 2022
// const SEASON_LIST = [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2021, 2022]
const SEASON_LIST = [2022, 2021, 2019, 2018, 2017, 2016, 2015, 2014, 2013]
const TOURNEY_REGION_VIEWS = {
    "W1": { prefix: "Top",      slots: ["R1W1", "R1W8", "R1W5", "R1W4", "R2W1", "R2W4", "R3W1"]},
    "W2": { prefix: "Bottom",   slots: ["R1W6", "R1W3", "R1W7", "R1W2", "R2W3", "R2W2", "R3W2"]},
    "X1": { prefix: "Top",      slots: ["R1X1", "R1X8", "R1X5", "R1X4", "R2X1", "R2X4", "R3X1"]},
    "X2": { prefix: "Bottom",   slots: ["R1X2", "R1X7", "R1X6", "R1X3", "R2X3", "R2X2", "R3X2"]},
    "Y1": { prefix: "Top",      slots: ["R1Y1", "R1Y8", "R1Y5", "R1Y4", "R2Y1", "R2Y4", "R3Y1"]},
    "Y2": { prefix: "Bottom",   slots: ["R1Y2", "R1Y7", "R1Y6", "R1Y3", "R2Y3", "R2Y2", "R3Y2"]},
    "Z1": { prefix: "Top",      slots: ["R1Z1", "R1Z8", "R1Z5", "R1Z4", "R2Z1", "R2Z2", "R3Z1"]},
    "Z2": { prefix: "Bottom",   slots: ["R1Z2", "R1Z7", "R1Z6", "R1Z3", "R2Z3", "R2Z4", "R3Z2"]},
    "16WX": { prefix: "Regionals", slots: ["R3W1", "R3W2", "R3X1", "R3X2", "R4W1", "R4X1", "R5WX"]},
    "16YZ": { prefix: "Regionals", slots: ["R3Y1", "R3Y2", "R3Z1", "R3Z2", "R4Y1", "R4Z1", "R5YZ"]},
    "FF": { prefix: "Final Four", slots: ["R5WX", "R5YZ", "R6CH"]}
}
const feature_set_map = {
    "full_2021": full_features_2021,
    "full": full_features_2022
}


// ---- Bracket Viewing Modes ---
const VIEW_MODES = {
    "read": { name: "Read", is_allowed: (x) => true },
    "edit": { name: "Edit", is_allowed: (x) => x == 2024 }
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
        <Dropdown key='mode' class='selectorItem'>
            <Dropdown.Toggle>{viewData.mode}</Dropdown.Toggle>
            <Dropdown.Menu>
                {otherModes.map(x => <Dropdown.Item onSelect={() => {changeMode(x.val)}}>{x.name}</Dropdown.Item>)}
            </Dropdown.Menu>
        </Dropdown>
        <Dropdown key='year' class='selectorItem'>
            <Dropdown.Toggle>{viewData.year}</Dropdown.Toggle>
            <Dropdown.Menu>
                {SEASON_LIST.map(x => <Dropdown.Item onSelect={() => {changeYear(x)}}>{x}</Dropdown.Item>)}
            </Dropdown.Menu>
        </Dropdown>
        <Dropdown key='region' class='selectorItem'>
            <Dropdown.Toggle>{selectedRegion}</Dropdown.Toggle>
            <Dropdown.Menu>
                {otherRegions.map(x => <Dropdown.Item onSelect={() => {changeRegion(x.val)}}>{x.name}</Dropdown.Item>)}
            </Dropdown.Menu>
        </Dropdown>
        </div>
    )
}

const TeamDataEntryTitle = ({title, classNames, toggle_key}) => (
    <div className={classNames}>
        <h5>{title}</h5>
        <button onClick={() => {toggleCollapse(toggle_key, "flex")}}>+</button>
    </div> 
)

const TeamDataTable = ({ data, maxValueHeight }) => {
// Description: Component displaying data in a 'team-data-table' div
// param data: list of objects with keys: title, value, is_collapsible
// param maxValueHeight: max height of the value div
if (data.constructor !== Array){
    console.error("TeamDataTable: data is not an array")
    return <div>Error</div>
}

let entries = data.map((obj) => {
    let entry_key = obj.key;
    let data_div_key = `${entry_key}_data`;
    let objClassNames = obj.is_collapsible ? 'panel-entry is-collapsible' : 'panel-entry not-collapsible'
    let titleClassNames = obj.is_collapsible ? 'panel-entry-title is-collapsible' : 'panel-entry-title not-collapsible'
    return(<div className={objClassNames} key={entry_key}>
        <TeamDataEntryTitle title={obj.title} classNames={titleClassNames} toggle_key={data_div_key} />
        <div id={data_div_key} className='vertical-data' style={{'maxHeight': maxValueHeight}}>{obj.value}</div>
    </div>)
})
return (<div className='panel-table'>{entries}</div>)
}

let fmtContent = (teamName, teamYear, content) => {
    let [wins, losses] = content["Rec"]
    let ranks = content["Ranks"]
    let rankDiv = <div>{Object.keys(ranks).map(x => <div>{x}: {ranks[x]}</div>)}</div>
    let simTeams = content["Sims"] // Format: [ { i: tid, y: year, s: sim_score, e: exit round}]
    let simDiv = <div>{simTeams.map(x => <div>{x.y} {TeamIds[x.i]}: {x.s}</div>)}</div>

    return [
        {title: `${teamName} ${teamYear}`, value: <div>{`Record: ${wins} - ${losses}`}</div>, is_collapsible: false, key: "team_info"},
        {title: "Insights", value: <div>Coming Soon</div>, is_collapsible: false, key: "insights"},
        {title: "Ranks", value: rankDiv, is_collapsible: true, key: "ranks"},
        {title: "Similar Teams", value: simDiv, is_collapsible: true, key: "sims"}
    ]
}

const RegionData = (tourneyData, view, setSidePanel) => {
    let selectedRegionSlots = TOURNEY_REGION_VIEWS[view.region].slots
    // Get Game Data
    let gameData = selectedRegionSlots.map(x => {
        let s = tourneyData["slots"][x]
        let [strongSeedScore, strongSeedColor] = s["strong_seed"] == s["winner"] ? [s["wscore"], "green"] : [s["lscore"], ""]
        let [weakSeedScore, weakSeedColor] = s["weak_seed"] == s["winner"] ? [s["wscore"], "green"] : [s["lscore"], ""]
        // Flip Round 2 games that aren't the 1 vs 8 slot
        let isFlipped = x.substr(0,2) == "R2" && x[3] != "1"
        let [ssid, wsid] = [s["strong_seed"], s["weak_seed"]]
        let strongSeedContent = [TeamIds[ssid], strongSeedColor, fmtContent(TeamIds[ssid], view.year, tourneyData.teams[ssid])]
        let weakSeedContent = [TeamIds[wsid], weakSeedColor, fmtContent(TeamIds[wsid], view.year, tourneyData.teams[wsid])]
        let [topData, topColor, topSideCont] = isFlipped ? weakSeedContent : strongSeedContent
        let [bottomData, bottomColor, bottomSideCont] = isFlipped ? strongSeedContent : weakSeedContent
        return (
            <div key={x} id={x} className='game-container'>
                <div className={`team-container ${topColor}`} onClick={() => setSidePanel({show: true, content: <TeamDataTable data={topSideCont} />})}>{topData}</div>
                <div className='team-container'>{strongSeedScore} - {weakSeedScore}</div>
                <div className={`team-container ${bottomColor}`} onClick={() => setSidePanel({show: true, content: <TeamDataTable data={bottomSideCont} />})}>{bottomData}</div>
            </div>
        )
    })
    // Format into region based view
    let className = ""
    let roundData = []
    if (view.region == "FF") {
        className = "ff-container"
        roundData = [
            <div className='round-container-ff'>{gameData.slice(0, 2)}</div>,
            <div className='round-container-ch'>{gameData.slice(2, 3)}</div>
        ]

    } else {
        className = "tourney-region"
        roundData = [
            <div className="round-container left">{gameData.slice(0, 4)}</div>,
            <div className="round-container center">{gameData.slice(4, 6)}</div>,
            <div className="round-container right">{gameData.slice(6, 7)}</div>
        ]
    }
    return (<div className={className}>{roundData}</div>)
}

let SidePanel = (sidePanelData, setSidePanel) => {
    console.log(`Panel Change: ${sidePanelData.show}`)
    let toggleVal = sidePanelData.show ? false : true
    let classes = `sidePanel ${sidePanelData.show ? 'show' : 'hide'}`
    return (
        <div className={classes} onClick={() => {setSidePanel({show: toggleVal, content: sidePanelData.content})}}>
            {sidePanelData.content}
        </div>
    )
}

let BracketData = () => {
    let [sidePanel, setSidePanel] = useState({show: false, content: "hi"})
    let location = useLocation();
    let queryParams = new URLSearchParams(location.search);
    const [selectedState, setSelectedState] = useState({
        mode: queryParams.get('mode') || 'read',
        year: queryParams.get('year') || '2022',
        region: queryParams.get('region') || 'FF'
    });
    console.log(`Year: ${selectedState}`);
    let [bracketData, setbracketData] = useState(null)
    useEffect(() => {
        fetch(`${DATA_HOME}/${selectedState.year}.json`)
            .then(response => response.json())
            .then(data => {setbracketData(data)})
            .catch(error => {
                setbracketData({not_found: true});})
        }, [selectedState]);
    console.log(bracketData);
    
    if (bracketData === null){
        return <div>Loading...</div>
    } else if (bracketData.not_found) {
        return <div>Bracket data not found. Change year.</div>
    } else {
        return (
                <div className='data-container'>
                    <div className='d-flex flex-column align-items-center'>
                        <div className='selectorContainer'>
                            {ViewSelector(bracketData, selectedState, setSelectedState)}
                        </div>
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
    let [predictions, setPredictions] = useState({})

    return (
        <div id="root">
            <Helmet>
                    <meta name="description" property="og:description" content={"March Madness Predictions"} />
            </Helmet>
            <div className='app-container'>
                <Nav page={"MM"} navContent={navContent} />
                <BracketData />
            </div>
        </div>
    )
}
export default Bracket;