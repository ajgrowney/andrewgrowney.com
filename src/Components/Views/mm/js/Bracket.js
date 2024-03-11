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
const SEASON_LIST = [2015, 2016, 2017, 2018, 2019, 2021, 2022]
const TOURNEY_REGION_VIEWS = {
    "W1": { prefix: "Top", slots: ["R1W1", "R1W8", "R1W5", "R1W4", "R2W1", "R2W2", "R3W1"]},
    "W2": { prefix: "Bottom", slots: ["R1W2", "R1W7", "R1W6", "R1W3", "R2W3", "R2W4", "R3W2"]},
    "X1": { prefix: "Top", slots: ["R1X1", "R1X8", "R1X5", "R1X4", "R2X1", "R2X2", "R3X1"]},
    "X2": { prefix: "Bottom", slots: ["R1X2", "R1X7", "R1X6", "R1X3", "R2X3", "R2X4", "R3X2"]},
    "Y1": { prefix: "Top", slots: ["R1Y1", "R1Y8", "R1Y5", "R1Y4", "R2Y1", "R2Y2", "R3Y1"]},
    "Y2": { prefix: "Bottom", slots: ["R1Y2", "R1Y7", "R1Y6", "R1Y3", "R2Y3", "R2Y4", "R3Y2"]},
    "Z1": { prefix: "Top", slots: ["R1Z1", "R1Z8", "R1Z5", "R1Z4", "R2Z1", "R2Z2", "R3Z1"]},
    "Z2": { prefix: "Bottom", slots: ["R1Z2", "R1Z7", "R1Z6", "R1Z3", "R2Z3", "R2Z4", "R3Z2"]},
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
    // Configure Mode options based on season
    let allowed_modes = Object.keys(VIEW_MODES).filter(x => VIEW_MODES[x].is_allowed(viewData.year))
    let otherModes = allowed_modes.map(x => { return {name: VIEW_MODES[x].name, val: x} })
    // Region Dropdown Data
    let selectedRegion = TOURNEY_REGION_VIEWS[viewData.region].prefix;
    if (selectedRegion != "Final Four") {
        let regName = tourneyData["regions"][viewData.region[0]]
        selectedRegion = `${regName} ${selectedRegion}`
    }
    let otherRegions = Object.keys(TOURNEY_REGION_VIEWS).map(x => {
        let opName = TOURNEY_REGION_VIEWS[x].prefix;
        if (opName != "Final Four") {
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


const RegionData = (tourneyData, view) => {
    let selectedRegionSlots = TOURNEY_REGION_VIEWS[view.region].slots
    console.log(selectedRegionSlots)
    // Get Game Data
    let gameData = selectedRegionSlots.map(x => {
        let slotData = tourneyData["slots"][x]
        let strongSeedScore = slotData["strong_seed"] == slotData["winner"] ? slotData["wscore"] : slotData["lscore"]
        let weakSeedScore = slotData["weak_seed"] == slotData["winner"] ? slotData["wscore"] : slotData["lscore"]
        return (
            <div className='slotData'>
                <div className='slotDataItem'>{TeamIds[slotData["strong_seed"]]} ({strongSeedScore})</div>
                <div className='slotDataItem'>{TeamIds[slotData["weak_seed"]]} ({weakSeedScore})</div>
            </div>
        )
    })
    // Format into rounds
    let roundIdxs = view.region == "FF" ? [2, 4, 5] : [4, 6, 7]
    let roundData = [
        <div style={{'display': 'flex', 'flexDirection': 'column', 'justifyContent': 'space-around'}}>{gameData.slice(0, roundIdxs[0])}</div>,
        <div style={{'display': 'flex', 'flexDirection': 'column', 'justifyContent': 'space-around'}}>{gameData.slice(roundIdxs[0], roundIdxs[1])}</div>,
        <div style={{'display': 'flex', 'flexDirection': 'column', 'justifyContent': 'space-around'}}>{gameData.slice(roundIdxs[1], roundIdxs[2])}</div>
    ]
    return (<div style={{'border': '5px solid green', 'display': 'flex', 'flexDirection': 'row', 'minHeight': '10rem'}}>
        {roundData}
    </div>)
}

let SidePanel = (sidePanelData) => {
    let classes = `sidePanel ${sidePanelData.show ? 'show' : 'hide'}`
    return (
        <div classNames={classes}>
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
                <div className='bracketView'>
                    <div className='d-flex flex-column align-items-center'>
                        <div className='selectorContainer'>
                            {ViewSelector(bracketData, selectedState, setSelectedState)}
                        </div>
                    </div>
                    <div className='regionsContainer'>
                        {RegionData(bracketData, selectedState)}
                        {SidePanel(sidePanel)}
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
            <div className='app_container'>
                <Nav page={"MM"} navContent={navContent} />
                <BracketData />
            </div>
        </div>
    )
}
export default Bracket;