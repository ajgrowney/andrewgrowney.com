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
import '../css/matchup.css'
import 'bootstrap/dist/css/bootstrap.css'
import { Button } from 'react-bootstrap'

const DEFAULT_MODEL = "2022_grid_poly_1"
const DEFAULT_SEASON = 2023
const SEASON_LIST = [ 2023, 2022, 2021, 2019]
const feature_set_map = {
    "full_2021": full_features_2021,
    "full": full_features_2022
}

function SelectTeam(model_id, season, setTeam)
{
    let selectHandler = (selectedOption) => {
        let selectedTeam = teamData.find(x => x.n.toUpperCase() === selectedOption.value.toUpperCase())
        if(selectedTeam)
        {
            let tf = {}
            try {
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
function ModelSelector(selected, setModel)
{
    let modelList = Object.keys(model_info_map)
    let handler = (new_model) => { setModel(new_model)}
    return(
        <Dropdown class='selectorItem'>
            <Dropdown.Toggle>Model: {model_info_map[selected].name}</Dropdown.Toggle>
            <Dropdown.Menu>{
                modelList.filter(x => x !== selected).map(x => 
                    <Dropdown.Item onSelect={() => {handler(x)}}>{model_info_map[x].name}</Dropdown.Item>)
            }</Dropdown.Menu>
        </Dropdown>
    )
}
function SeasonSelector(selected, setSeason, team1, setTeam1, team2, setTeam2)
{
    let handler = (new_season) => { 
        setSeason(new_season)
        setTeam1(null)
        setTeam2(null)
    }
    return(
        <Dropdown class='selectorItem'>
            <Dropdown.Toggle>Season: {selected}</Dropdown.Toggle>
            <Dropdown.Menu>
                {SEASON_LIST.filter(x => x !== selected).map(x => <Dropdown.Item onSelect={() => {handler(x)}}>{x}</Dropdown.Item>)}
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
    } else if(model_id == "coin") {
        winner = (Math.random() > 0.5) ? t1 : t2
        prob = 0.5
        prob = (prob*100).toFixed(2) + "%"
    } else {
        let sorted_teams = [t1, t2].sort((x,y) => x.info.i > y.info.i)
        let team_key_suffix = sorted_teams.map(x => x.info.i).join("_")
        let matchup_key = `${season}_${team_key_suffix}`
        let model_predictions = model_info_map[model_id]["predictions"]
        let matchup_probability = model_predictions[matchup_key]
        if(matchup_probability)
        {
            let t1_won = matchup_probability >= 0.5
            winner = t1_won ? sorted_teams[0].info : sorted_teams[1].info
            prob = t1_won ? matchup_probability : (1 - matchup_probability)
            prob = (prob*100).toFixed(2) + "%"
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
            {ModelSelector(model, setModel)}
            <table>
                <tr><th>Winner</th><th>Probability</th></tr>
                <tr>
                    <td>{winner.name}</td>
                    <td>{probability}</td>
                </tr>
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
    statsToCompare = statsToCompare.filter(x => ! x.endsWith("stdev"))
    // Build out table view comparing features

    let table_rows_data = statsToCompare.map((feature) => {
        let t1_val = t1.features[feature].toFixed(2)
        let t2_val = t2.features[feature].toFixed(2)
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
                {SeasonSelector(season, setSeason, t1, setTeam1, t2, setTeam2)}
            </div>
            <Card className='selectTeamsContainer'>
                {team1Component}
                <p>vs</p>
                {team2Component}
            </Card>
            {CompareTeams(t1, t2)}
            {ModelPrediction(model, setModel, season, t1, t2)}
        </div>
    )
}


function Matchup()
{
    console.log(teamData)
    let navContent = [
        { type: "SingleLink", title: "Home", pageRef: "/" },
        { type: "SingleLink", title: "March Madness", pageRef: "/marchmadness" },
        { type: "SingleLink", title: "Bracket", pageRef: "/mm/bracket" }
    ]

    return (
        <div>
            <Nav navContent={navContent}/>
            <MatchupData />
        </div>
    )
}
export default Matchup;