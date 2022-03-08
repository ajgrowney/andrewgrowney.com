import React, { useState } from 'react'
import Card from 'react-bootstrap/Card'
import Select from 'react-select';
import Dropdown from 'react-bootstrap/Dropdown'
import teamData from '../../../../Data/mm/teams'
import linear_svc_pred from '../../../../Data/mm/predictions/linear_svc'
import poly_svc_1_pred from '../../../../Data/mm/predictions/poly_svc_1'
import poly_svc_2_pred from '../../../../Data/mm/predictions/poly_svc_2'
import full_features_2021 from "../../../../Data/mm/features/2021/all_models"
import '../css/matchup.css'
import 'bootstrap/dist/css/bootstrap.css'
import { Button } from 'react-bootstrap'

const DEFAULT_MODEL = "linear_svc"
const DEFAULT_SEASON = 2021
const SEASON_LIST = [2021]
const feature_set_map = {
    "full": full_features_2021
}
const model_info_map = {
    "coin": {
        "features": "full"
    },
    "linear_svc": {
        name: "Linear SVC",
        id: "linear_svc",
        "predictions": linear_svc_pred,
        "features": "full"
    },
    "poly_svc_1": {
        name: "Poly Kernel SVC 1",
        id: "poly_svc_1",
        "predictions": poly_svc_1_pred,
        "features": "full"
    },
    "poly_svc_2": {
        name: "Poly Kernel SVC 2",
        id: "poly_svc_2",
        "predictions": poly_svc_2_pred,
        "features": "full"
    }
}
function SelectTeam(model_id, season, setTeam, setTeamFeatures)
{
    let selectHandler = (selectedOption) => {
        console.log(selectedOption)
        let team = teamData.find(x => x.name.toUpperCase() === selectedOption.value.toUpperCase())
        if(team)
        {
            console.log("Fetching "+ team.id+ " features for "+season)
            let teamFeatures = feature_set_map[model_info_map[model_id]["features"]][season][team.id]
            setTeam(team)
            if(teamFeatures){ setTeamFeatures(teamFeatures) }
        }   
    }

    let options = teamData.map(x => ({value: x.name, label: x.name}))
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
function SeasonSelector(selected, setSeason)
{
    let handler = (new_season) => { setSeason(new_season)}
    return(
        <Dropdown class='selectorItem'>
            <Dropdown.Toggle>Season: {selected}</Dropdown.Toggle>
            <Dropdown.Menu>
                {SEASON_LIST.filter(x => x !== selected).map(x => <Dropdown.Item onSelect={() => {handler(x)}}>{x}</Dropdown.Item>)}
            </Dropdown.Menu>
        </Dropdown>
    )
}
function TeamComponent(team, teamFeatures, setTeam)
{

    let team_title = (
        <Card.Title className='teamItemName'>
        {team.name} &nbsp; &nbsp;
            <Button variant='outline-danger' onClick={() => { setTeam(null) }}>X</Button>
        </Card.Title>
    )

    if (teamFeatures)
    {
        return (
            <Card.Body className='teamItemBody'>
                {team_title}
                <Card.Subtitle>Features</Card.Subtitle>
                <div className='teamItemFeatures'>
                    <Card.Text>{
                        Object.keys(teamFeatures).map(x => 
                            <div>{x}: {teamFeatures[x].toFixed(2)}</div>)
                    }</Card.Text>
                </div>
            </Card.Body>
        )
    } else {
        return(
            <Card.Body className='teamItemBody'>
                {team_title}
            </Card.Body>
        )
    }
}

function CalculateWinner(model_id, season, t1,t2)
{
    let winner = ""
    let prob = 0.0
    if(model_id == "coin")
    {
        winner = (Math.random() > 0.5) ? t1 : t2
        prob = 0.5
        prob = (prob*100).toFixed(2) + "%"
    }
    else
    {
        let sorted_teams = [t1, t2].sort((x,y) => x.id > y.id)
        let team_key_suffix = sorted_teams.map(x => x.id).join("_")
        let matchup_key = `${season}_${team_key_suffix}`
        let model_predictions = model_info_map[model_id]["predictions"]
        let matchup_probability = model_predictions[matchup_key]
        if(matchup_probability)
        {
            let t1_won = matchup_probability >= 0.5
            winner = t1_won ? sorted_teams[0] : sorted_teams[1] 
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
function MatchupResults(model, season, t1, t2)
{
    let [winner, probability] = ["", 0.0]
    if (t1 && t2)
    {
        console.log("Making prediction using "+ model + " between " + t1.id + " and " + t2.id);
        [winner, probability] = CalculateWinner(model, season, t1, t2)
    }

    return (
        <Card className='matchupResultsContainer'>
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


function Matchup()
{
    let pageHeader = "Tournament Matchup"
    let [model, setModel] = useState(DEFAULT_MODEL)
    let [season, setSeason] = useState(DEFAULT_SEASON)
    let [ t1, setTeam1 ] = useState(null)
    let [ t2, setTeam2 ] = useState(null)
    let [ t1features, setTeam1Features ] = useState(null)
    let [ t2features, setTeam2Features ] = useState(null)
    let team1Component = (t1) ? TeamComponent(t1, t1features, setTeam1) : SelectTeam(model, season, setTeam1, setTeam1Features)
    let t1Class = (t1) ? 'teamItem' : 'selectTeamItem'
    let team2Component = (t2) ? TeamComponent(t2, t2features, setTeam2) : SelectTeam(model, season, setTeam2, setTeam2Features)
    let t2Class = (t2) ? 'teamItem' : 'selectTeamItem'

    return (
        <div>
            <div className='matchupView'>
                <div className='d-flex flex-column align-items-center'>
                    <h2>{pageHeader}</h2>
                    <div className='selectorContainer'>
                        {ModelSelector(model, setModel)}
                        {SeasonSelector(season, setSeason)}
                    </div>
                </div>
                <div className='matchupContainer'>
                    <Card className={t1Class}>{team1Component}</Card>
                    <p>vs</p>
                    <Card className={t2Class}>{team2Component}</Card>
                </div>
                {MatchupResults(model, season, t1, t2)}
            </div>
        </div>
    )
}
export default Matchup;