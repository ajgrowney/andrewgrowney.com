// 
// Bracket Page supportts multiple viewing modes
// 1. Read -    View the actual matchups and results
// 2. Edit - View, fill, and export a bracket's results 
//         - Support "fill with model" option
//

import React, { useEffect, useState } from 'react'
import { Link } from 'gatsby'
import { Button, Card} from 'react-bootstrap'
import Helmet from 'react-helmet';
import { useSwipeable } from 'react-swipeable';
import { useLocation, navigate } from '@reach/router';
import Dropdown from 'react-bootstrap/Dropdown'
import Nav from '../../../js/Nav'
import TeamIds from '../../../../Data/mm/team_ids'
import { CalculateWinner, ModelPredictKey } from '../../../../helpers/mm'
import '../css/bracket.css'
import 'bootstrap/dist/css/bootstrap.css'
const DATA_HOME = 'https://raw.githubusercontent.com/ajgrowney/march-madness-ml/master/data/web/tourney'

const DEFAULT_MODEL = "2022_grid_poly_1"
const DEFAULT_SEASON = 2023
const SEASON_LIST = [2023, 2022, 2021, 2019, 2018, 2017, 2016, 2015, 2014, 2013]
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
        return(<Card className={objClassNames} key={entry_key}>
            <TeamDataEntryTitle title={obj.title} classNames={titleClassNames} toggle_key={data_div_key} />
            <div id={data_div_key} className='vertical-data' style={{'maxHeight': maxValueHeight}}>{obj.value}</div>
        </Card>)
    })
    return (<div className='panel-table'>{entries}</div>)
}

let fmtContent = (tid, teamName, teamYear, content) => {
    let [wins, losses] = content["Rec"]
    let ranks = content["Ranks"]
    let rankDiv = <div>{Object.keys(ranks).map(x => <div>{x}: {ranks[x]}</div>)}</div>
    let simTeams = content["Sims"] // Format: [ { i: tid, y: year, s: sim_score, e: exit round}]
    let simDiv = <div>{simTeams.map(x => <div>{x.y} {TeamIds[x.i]}: {(x.s*100).toFixed(2)}%</div>)}</div>

    return [
        {title: <Link to={`/mm/team/?tid=${tid}&year=${teamYear}`}>{teamName} {teamYear}</Link>, value: <div>{`Record: ${wins} - ${losses}`}</div>, is_collapsible: false, key: "team_info"},
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
        let strongSeedContent = [TeamIds[ssid], strongSeedColor, fmtContent(ssid, TeamIds[ssid], view.year, tourneyData.teams[ssid])]
        let weakSeedContent = [TeamIds[wsid], weakSeedColor, fmtContent(wsid, TeamIds[wsid], view.year, tourneyData.teams[wsid])]
        let [topData, topColor, topSideCont] = isFlipped ? weakSeedContent : strongSeedContent
        let [bottomData, bottomColor, bottomSideCont] = isFlipped ? strongSeedContent : weakSeedContent
        return (
            <Card key={x} id={x} className='game-container'>
                <div className={`team-container ${topColor}`} onClick={() => setSidePanel({show: true, content: <TeamDataTable data={topSideCont} />})}>{topData}</div>
                <div className='score-container'>{strongSeedScore} - {weakSeedScore}</div>
                <div className={`team-container ${bottomColor}`} onClick={() => setSidePanel({show: true, content: <TeamDataTable data={bottomSideCont} />})}>{bottomData}</div>
            </Card>
        )
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
        year: queryParams.get('year') || '2023',
        region: queryParams.get('region') || 'FF'
    });
    const swipeHandlers = useSwipeable({
        onSwipedRight: () => setSelectedState(prevState => ({...prevState, region: TOURNEY_REGION_VIEWS[prevState.region].nav.right})),
        onSwipedLeft: () => setSelectedState(prevState => ({...prevState, region: TOURNEY_REGION_VIEWS[prevState.region].nav.left})),
        onSwipedUp: () => setSelectedState(prevState => ({...prevState, region: TOURNEY_REGION_VIEWS[prevState.region].nav.up})),
        onSwipedDown: () => setSelectedState(prevState => ({...prevState, region: TOURNEY_REGION_VIEWS[prevState.region].nav.down}))
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