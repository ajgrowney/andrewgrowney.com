import React, { useState } from 'react'
import Card from 'react-bootstrap/Card'
import Select from 'react-select';
import Dropdown from 'react-bootstrap/Dropdown'
import { Link } from 'gatsby'
import Nav from '../../../js/Nav'
import teamData from '../../../../Data/mm/teams_v2'
import teamSeeds from '../../../../Data/mm/teamSeeds_v2'
import model_info_map from '../../../../Data/mm/model_info';
import full_features_2021 from "../../../../Data/mm/features/2021/all_models"
import full_features_2022 from "../../../../Data/mm/features/2022/all_models"
import base_2024 from "../../../../Data/mm/features/2024/base"
import base_2025 from "../../../../Data/mm/features/2025/base"
import '../css/matchup.css'
import 'bootstrap/dist/css/bootstrap.css'
import { Button } from 'react-bootstrap'
import { IMAGE_HOST, MMBracket } from '../../../../images'

const DEFAULT_MODEL = "nn_2025"
const DEFAULT_SEASON = 2025
const SEASON_LIST = [ 2025, 2024, 2022, 2021, 2019]
const feature_set_map = {
    "full_2021": full_features_2021,
    "full": full_features_2022,
    "base_2024": base_2024,
    "nn_2025": base_2025,
    "base_2025": base_2025
}
const def_model = {
    2019: "coin",
    2021: "linear_svc",
    2022: "2022_grid_poly_1",
    2024: "base_2024",
    2025: "nn_2025"
}

const statFriendly = {
    "AdjOE_mean": "Adjusted Offensive Eff",
    "AdjDE_mean": "Adjusted Defensive Eff",
    "AdjNE_mean": "Adjusted Net Eff",
    "FGA3_mean": "3pt Attempts",
    "TO_mean": "Turnovers",
    "OR_mean": "Offensive Rebounds",
    "FT%_mean": "Free Throw %",
    "EFG%_mean": "Effective FG%",
    "OppEFG%_mean": "Opponent EFG%",
    "OppFGA3_mean": "Opponent 3pt Attempts",
    "OppTO_mean": "Turnovers Forced",
    "OppOR_mean": "Opponent Offensive Rebounds",
    "SOS": "Strength of Schedule",
    "Q1_WinPct": "Q1 Win %",
    "Q2_WinPct": "Q2 Win %",
    "Poss_mean": "Tempo"
}

const is_pct = (stat) => {
    return ["OppEFG%_mean", "EFG%_mean", "FT%_mean", "Q1_WinPct", "Q2_WinPct"].includes(stat)
}


function SelectTeam(model_id, season, setTeam)
{
    let selectHandler = (selectedOption) => {
        let selectedTeam = teamData.find(x => x.n.toUpperCase() === selectedOption.value.toUpperCase())
        if(selectedTeam)
        {
            let tf = {}
            try {
                console.log(model_info_map[model_id]["features"])
                console.log(feature_set_map[model_info_map[model_id]["features"]])
                tf = feature_set_map[model_info_map[model_id]["features"]][season][selectedTeam.i]
            } catch (error) {
                console.log(error)
            }
            setTeam({info: selectedTeam, features: tf})
        }   
    }
    let options = teamData.filter(x => Object.values(teamSeeds[season]).includes(x.i)).map(x => ({value: x.n, label: x.n}))
    return(
        <Card.Body className='teamItemBody'>
            <Select placeholder={'Select Team'} maxMenuHeight={200} options={options} onChange={selectHandler} />
        </Card.Body>
    )
}
function ModelSelector(selected, setModel, season)
{
    let modelList = Object.keys(model_info_map)
    let handler = (new_model) => { setModel(new_model)}
    console.log(modelList.map(x => model_info_map[x].name))
    let options = modelList.filter(x => model_info_map[x].min_pred_year <= season && model_info_map[x].max_pred_year >= season).map(x => ({value: x, label: model_info_map[x].name}))
    return(
        <Dropdown className='selectorItem'>
            <Dropdown.Toggle>Model: {model_info_map[selected].name}</Dropdown.Toggle>
            <Dropdown.Menu>{
                options.filter(x => x.value !== selected).map(x => <Dropdown.Item key={x.value} onClick={() => {handler(x.value)}}>{x.label}</Dropdown.Item>)
            }</Dropdown.Menu>
        </Dropdown>
    )
}
function SeasonSelector(selected, setSeason, team1, setTeam1, team2, setTeam2, setModel)
{
    let handler = (new_season) => { 
        setSeason(new_season)
        setModel(def_model[new_season])
        setTeam1(null)
        setTeam2(null)
    }
    return(
        <Dropdown className='selectorItem'>
            <Dropdown.Toggle>Season: {selected}</Dropdown.Toggle>
            <Dropdown.Menu>
                {SEASON_LIST.filter(x => x !== selected).map(x => <Dropdown.Item key={x} onClick={() => {handler(x)}}>{x}</Dropdown.Item>)}
            </Dropdown.Menu>
        </Dropdown>
    )
}
function TeamComponent(team, setTeam)
{
    let team_title = (
        <Card.Title className='teamItemName'>
        {team.info.n} &nbsp; &nbsp;
            {/* Info Button */}
            <Link to={`/mm/team/?tid=${team.info.i}`}><Button variant='outline-info'>i</Button></Link>
            {/* Remove Button */}
            <Button variant='outline-danger' onClick={() => { setTeam(null) }}>X</Button>
        </Card.Title>
    )
    return(
        <Card.Body className='teamItemBody'>
            {team_title}
        </Card.Body>
    )
}

function CalculateWinner(model_id, season, t1, t2)
{
    let winner = ""
    let prob = 0.0
    if (t1 === null || t2 === null) {
        winner = { name: "Select Teams" }
        prob = "N/A"
    } else if(model_id === "coin") {
        winner = (Math.random() > 0.5) ? t1.info : t2.info
        prob = 0.5
    } else {
        console.log(`Calculating Winner for ${model_id} ${season} ${t1.info.i} vs ${t2.info.i}`)
        let sorted_teams = [t1, t2].sort((x,y) => parseInt(x.info.i) - parseInt(y.info.i))
        let team_key_suffix = sorted_teams.map(x => x.info.i).join("_")
        let matchup_key = `${season}_${team_key_suffix}`
        let model_predictions = model_info_map[model_id]["predictions"]
        console.log(model_predictions)
        console.log(matchup_key)
        console.log(model_predictions[matchup_key])
        let matchup_probability = model_predictions[matchup_key]
        if(matchup_probability)
        {
            if (model_id === "base_2024" || model_id === "nn_2025" || model_id === "clf_2025") {
                let [model_winner, model_prob] = matchup_probability
                winner = model_winner === sorted_teams[0].info.i ? sorted_teams[0].info : sorted_teams[1].info
                prob = model_prob
            } else {
                let t1_won = matchup_probability >= 0.5
                winner = t1_won ? sorted_teams[0].info : sorted_teams[1].info
                prob = t1_won ? matchup_probability : (1 - matchup_probability)
            }
        }
        else
        {
            winner = { name: "Matchup Not Found" }
            prob = "N/A"
        }
    }
    return [winner, prob]
}
let ModelPrediction = (model, setModel, season, t1, t2) => {
    let [winner, probability] = CalculateWinner(model, season, t1, t2)

    return (
        <Card className='matchupResultsContainer'>
            {ModelSelector(model, setModel, season)}
            <table>
                <thead><tr><th>Winner</th><th>Probability</th></tr></thead>
                <tbody><tr><td>{winner.n}</td><td>{(probability*100).toFixed(2)}%</td></tr></tbody>
            </table>
        </Card>
    )
}

let CompareTeams = (t1, t2) => {
    if (t1 === null || t2 === null){
        return <Card className='compareTeams'>Select Teams Above</Card>
    }
    let t1_features = Object.keys(t1.features)
    let t2_features = Object.keys(t2.features)
    let statsToCompare = t1_features.filter(x => t2_features.includes(x))
    statsToCompare = statsToCompare.filter(x => ! x.endsWith("stdev") && x !== "TeamID")
    // Build out table view comparing features

    let table_rows_data = statsToCompare.map((feature) => {
        let t1_val = is_pct(feature) ? (100*t1.features[feature]).toFixed(2) + "%" : t1.features[feature].toFixed(2)
        let t2_val = is_pct(feature) ? (100*t2.features[feature]).toFixed(2) + "%" : t2.features[feature].toFixed(2)
        feature = statFriendly[feature] || feature;
        return (
            <Card.Text className='compareTeamsElement'>
                <div>{t1_val}</div>
                <div>{feature}</div>
                <div>{t2_val}</div>
            </Card.Text>
        )
    })
    let m_data = (
        <Card.Body className='compareTeamsBody'>
            <Card.Title className='compareTeamsHeader'>
                <div>{t1.info.n}</div>
                <div>Stat</div>
                <div>{t2.info.n}</div>
            </Card.Title>

            {table_rows_data}
        </Card.Body>
    )

    return (<Card className='compareTeams'>{m_data}</Card>)
}

let MatchupData = () => {
    let [model, setModel] = useState(DEFAULT_MODEL)
    let [season, setSeason] = useState(DEFAULT_SEASON)
    let [ t1, setTeam1 ] = useState(null)
    let [ t2, setTeam2 ] = useState(null)
    let team1Component = (t1 !== null) ? TeamComponent(t1, setTeam1) : SelectTeam(model, season, setTeam1)
    let team2Component = (t2 !== null) ? TeamComponent(t2, setTeam2) : SelectTeam(model, season, setTeam2)
    return (
        <div className='matchupView'>
            <h2>Matchup Analyzer</h2>
            <div className='selectorContainer'>
                {SeasonSelector(season, setSeason, t1, setTeam1, t2, setTeam2, setModel)}
            </div>
            <Card className='selectTeamsContainer'>
                {team1Component}
                <div>vs</div>
                {team2Component}
            </Card>
            {ModelPrediction(model, setModel, season, t1, t2)}
            {CompareTeams(t1, t2)}
        </div>
    )
}


function Matchup()
{
    let navContent = [
        { type: "SingleLink", title: "Home", pageRef: "/" },
        { type: "SingleLink", title: "Madness Suite", pageRef: "/marchmadness" },
        { type: "SingleLink", title: "Bracket", pageRef: "/mm/bracket/" }
    ]
    return (
        <div id="root">
            <div className="app-container">
                <Nav navContent={navContent}/>
                <MatchupData />
            </div>
        </div>
    )
}
export default Matchup;

export const Head = ({ location, params, data, pageContext }) => {
    console.log("Head: ", location, params, data, pageContext)
    return (
        <>
        <title>{"Matchup Analyzer"}</title>
        <meta name="image" property="og:image" content={`${IMAGE_HOST}${MMBracket}`} />
        <meta name="description" property="og:description" content={"March Madness - Matchup Analyzer"} />
        <meta name="author" content="Andrew Growney" />
        </>
    )
}
