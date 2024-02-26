import React, { useEffect, useState } from 'react'
import Helmet from 'react-helmet';
import { BrowserRouter as Router, useLocation } from 'react-router-dom'
import Nav  from '../../../js/Nav'
import { MMBracket } from '../../../../images/Blogs/MarchMadnessML'
import 'bootstrap/dist/css/bootstrap.css'
import '../css/team.css'

const DATA_HOME = 'https://raw.githubusercontent.com/ajgrowney/march-madness-ml/master/data/web/ts/'

const isEmptyObject = (obj) => (Object.keys(obj).length === 0 && obj.constructor === Object)

const HorizontalTable = ({ data }) => {
    // Component displaying data in a horizontal table
    // data is an object with keys as the header and values as the data
    let cols = []
    for (let key in data){
        let div_val = data[key]
        // Expand Array Data
        if (div_val.constructor === Array){
            console.log(div_val);
            let new_val = []
            for (let i = 0; i < div_val.length; i++){
                let div_key = `${key}-${i}`
                if (div_val[i].constructor === Array){
                    let new_row = []
                    for (let j = 0; j < div_val[i].length; j++){
                        let div_row_key = `${div_key}-${j}`
                        new_row.push(<div key={div_row_key}>{div_val[i][j]}</div>)
                    }
                    new_val.push(<div className='horizontal-data' key={div_key}>{new_row}</div>)
                } else {
                    new_val.push(<div className='horizontal-data' key={div_key}>{div_val[i]}</div>)
                }
                new_val.push(<br key={`br-${div_key}`} />)
            }
            div_val = new_val
        }
        cols.push(<div key={key}>
                <h6>{key}</h6>
                <div className='vertical-data'>{div_val}</div>
            </div>
        )

    }
    return (<div className='horizontal-table'>{cols}</div>)
}

const TeamOverview = ({ teamData }) => {
    // Still Loading
    if (isEmptyObject(teamData)){
        return <div>Loading...</div>
    }
    let tableData = {
        "Seed": teamData.tourney_seed,
        "Conference": `${teamData.record_conf[0]} - ${teamData.record_conf[1]}`,
        "Overall": `${teamData.record[0]} - ${teamData.record[1]}`,
        "Home": `${teamData.record_home[0]} - ${teamData.record_home[1]}`,
        "Road": `${teamData.record_road[0]} - ${teamData.record_road[1]}`
    }
    return(
        <div id={"teamOverview"} style={{width: "100%", border: "1px solid black"}}>
            <h1>Overview</h1>
            <hr />
            <HorizontalTable data={tableData} />
        </div>
    )
}

const TeamHeader = ({ teamData }) => {
    // TODO
    if (isEmptyObject(teamData)){
        return <div>Loading...</div>
    }
    return (
        <div id={"teamHeader"} style={{width: "100%", border: "1px solid blue"}}>
            <h1>{teamData.name}</h1>
            <h1>{teamData.year}</h1>
        </div>
    )
}

// ---- Resume Helpers ----
const get_quad_record = (wins, losses, quad) => {
    wins = wins[quad]
    losses = losses[quad]
    return [wins.length, losses.length]
}

const get_quad_data = (wins, losses, quad) => {
    let q_rec = get_quad_record(wins, losses, quad)
    let quad_key = `${q_rec[0]} - ${q_rec[1]} vs Quad ${quad}`
    let quad_value = []
    for (let i = 0; i < wins[quad].length; i++){
        let game = wins[quad][i]
        let loc_prefix = game.team_loc === 'H' ? 'vs' : 'at'
        quad_value.push([
            game.date_int,
            game.date_str,
            `${loc_prefix} ${game.opp_name}`,
            `${game.team_score} - ${game.opp_score}`
        ])
    }
    for (let i = 0; i < losses[quad].length; i++){
        let game = losses[quad][i]
        let loc_prefix = game.team_loc === 'H' ? 'vs' : 'at'
        quad_value.push([
            game.date_int,
            game.date_str,
            `${loc_prefix} ${game.opp_name}`,
            `${game.team_score} - ${game.opp_score}`
        ])
    }
    // Sort quad_value by date_int
    // and remove it from the value
    quad_value.sort((a, b) => (a[0] > b[0]) ? -1 : 1)
    quad_value.forEach((game) => game.splice(0, 1))
    
    return [quad_key, quad_value]
}

const TeamResume = ({ teamData }) => {
    // Component displaying record and games by quad

    // Still Loading
    if (isEmptyObject(teamData)){
        return <div>Loading...</div>
    }
    let quad_table = {}
    for (let i = 1; i < 5; i++){
        let quad_data = get_quad_data(teamData.quad_wins, teamData.quad_losses, i.toString())
        quad_table[quad_data[0]] = quad_data[1]
    }
    return (
        <div id={"teamResume"} style={{width: "100%", border: "1px solid green"}}>
            <h1>Resume</h1>
            <hr />
            <HorizontalTable data={quad_table} />
        </div>
    )
}

const TeamStats = ({ teamData }) => {
    // TODO
    if (isEmptyObject(teamData)){
        return <div>Loading...</div>
    }
    return (
        <div id={"teamStats"} style={{width: "100%", border: "1px solid red"}}>
        </div>
    )
}

const TeamData = () => {
    let location = useLocation();
    let queryParams = new URLSearchParams(location.search);
    const [selectedTeam, setselectedTeam] = useState(queryParams.get('tid') || '');
    const [selectedYear, setselectedYear] = useState(queryParams.get('year') || '2023');
    console.log(`Team: ${selectedTeam} Year: ${selectedYear}`);
    let [teamData, setTeamData] = useState({})
    useEffect(() => {
        fetch(`${DATA_HOME}/${selectedTeam}_${selectedYear}.json`)
            .then(response => response.json())
            .then(data => {setTeamData(data)})
            .catch(error => console.log(error));
        }, [selectedTeam, selectedYear]);
    console.log(teamData);

    return (
        <div style={{width: "100%", border: "1px solid yellow"}}>
            <TeamHeader     teamData={teamData} />
            <TeamOverview   teamData={teamData} />
            <TeamResume     teamData={teamData} />
            <TeamStats      teamData={teamData} />
        </div>
    )
}

const TeamView = () => {
    
    let navContent = [
        { type: "SingleLink", title: "Matchup", pageRef: "/mm/matchup" },
        { type: "SingleLink", title: "Bracket", pageRef: "/mm/bracket" }
    ]
    
    return (
        <Router>
            <div id="root">
                <Helmet>
                        <meta name="image" property="og:image" content={MMBracket} />
                        <meta name="description" property="og:description" content={"March Madness Predictions"} />
                </Helmet>
                <div className='app_container'>
                    <Nav page={"MM"} navContent={navContent} />
                    <TeamData />
                </div>
            </div>
        </Router>
    )
}

export default TeamView;
