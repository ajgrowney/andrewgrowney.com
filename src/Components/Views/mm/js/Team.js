import React, { useEffect, useState } from 'react'
import Helmet from 'react-helmet';
import { useLocation, createHistory, createMemorySource, navigate } from '@reach/router';
import Nav  from '../../../js/Nav'
import { MMBracket } from '../../../../images/Blogs/MarchMadnessML'
import TeamIds from '../../../../Data/mm/team_ids'
import 'bootstrap/dist/css/bootstrap.css'
import '../css/team.css'
const CURRENT_YEAR = 2024
const DATA_HOME = 'https://raw.githubusercontent.com/ajgrowney/march-madness-ml/master/data/web/ts/'

let navTo  = (team, year, setTeamF) => {
    console.log(`Navigating to /mm/team?tid=${team}&year=${year}`)
    navigate(`/mm/team?tid=${team}&year=${year}`);
    setTeamF(team);
}

let toggleCollapse = (id, display_val) => {
    let element = document.getElementById(id);
    if (element.style.display === "none") {
        element.style.display = display_val;
    } else {
        element.style.display = "none";
    }
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
        let objClassNames = obj.is_collapsible ? 'team-data-table-entry is-collapsible' : 'team-data-table-entry not-collapsible'
        let titleClassNames = obj.is_collapsible ? 'team-data-table-entry-title is-collapsible' : 'team-data-table-entry-title not-collapsible'
        return(<div className={objClassNames} key={entry_key}>
            <TeamDataEntryTitle title={obj.title} classNames={titleClassNames} toggle_key={data_div_key} />
            <div id={data_div_key} className='vertical-data' style={{'maxHeight': maxValueHeight}}>{obj.value}</div>
        </div>)
    })
    return (<div className='team-data-table'>{entries}</div>)
}

const TeamOverview = ({ teamData }) => {
    let tableData = [
        {key: 'seed',       title: "Seed",      value: teamData.tourney_seed},
        {key: 'conf',       title: "Conference", value: `${teamData.record_conf[0]} - ${teamData.record_conf[1]}`},
        {key: 'rec-ov',     title: "Overall", value: `${teamData.record[0]} - ${teamData.record[1]}`},
        {key: 'rec-home',   title: "Home", value: `${teamData.record_home[0]} - ${teamData.record_home[1]}`},
        {key: 'rec-road',   title: "Road", value: `${teamData.record_road[0]} - ${teamData.record_road[1]}`}
    ]
    // Apply a 'stat-value' div to each object value
    tableData.forEach((obj) => obj.value = <div className='stat-value'>{obj.value}</div>)
    return(
        <div id={"teamOverview"} style={{width: "100%", border: "1px solid black"}}>
            <h1>Overview</h1>
            <hr />
            <TeamDataTable data={tableData}  maxValueHeight={'8rem'}/>
        </div>
    )
}

const TeamSearchBar = ({ selectedYear, setTeamF }) => {
    const [searchTerm, setSearchTerm] = useState('');
  
    const handleChange = (e) => { setSearchTerm(e.target.value) };
  
    const handleSelectTeam = (teamId) => { setSearchTerm(''); navTo(teamId, selectedYear, setTeamF);};
  
    // Filter teams based on search term
    const filteredTeams = Object.entries(TeamIds).filter(([teamId, teamName]) => {
        if (searchTerm === '') { return false } 
        else { return teamName.toLowerCase().includes(searchTerm.toLowerCase()) }
    }
    );
  
    return (
      <div className='team-search-bar'>
        <input type="text" placeholder="Search for a team" value={searchTerm} onChange={handleChange} />
        <ul className='search-results'>
          {filteredTeams.map(([teamId, teamName]) => (
            <li key={teamId} onClick={() => handleSelectTeam(teamId)}>
              {teamName}
            </li>
          ))}
        </ul>
      </div>
    );
  };

const TeamHeader = ({ teamData, selectedSzn, setTeamF }) => {
    return (
        <div id={"teamHeader"} className='team-header'>
            <div>TODO: Change year dropdown</div>
            <div><h1>{teamData.name}</h1><h5>{teamData.year}</h5></div>
            <TeamSearchBar selectedYear={selectedSzn} setTeamF={setTeamF}  />
        </div>
    )
}

// ---- Resume Helpers ----
const get_quad_record = (wins, losses, quad) => {
    wins = wins[quad]
    losses = losses[quad]
    return [wins.length, losses.length]
}

const get_quad_data = (wins, losses, quad, year, setTeamF) => {
    let q_rec = get_quad_record(wins, losses, quad)
    let quad_key = `${q_rec[0]} - ${q_rec[1]} vs Quad ${quad}`
    let quad_value = []
    for (let i = 0; i < wins[quad].length; i++){
        let game = wins[quad][i]
        let loc_prefix = game.team_loc === 'H' ? 'vs' : 'at'
        quad_value.push([
            game.date_int,
            game.date_str,
            game.opp_id,
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
            game.opp_id,
            `${loc_prefix} ${game.opp_name}`,
            `${game.team_score} - ${game.opp_score}`
        ])
    }
    // Sort quad_value by date_int
    quad_value.sort((a, b) => (a[0] > b[0]) ? -1 : 1)
    // and remove it from the value
    quad_value.forEach((game) => game.splice(0, 1))
    // Format the game into a div
    quad_value = quad_value.map((game, i) => 
        <div className='quad-game' key={i}>
        <div>{game[0]}</div> <div onClick={() => { navTo(game[1], year, setTeamF)}}>{game[2]}</div> <div>{game[3]}</div>
        </div>)
    
    return [quad_key, quad_value]
}

let ordinal_with_suffix = (i) => {
    let j = i % 10,
        k = i % 100;
    if (j === 1 && k !== 11) {
        return i + "st";
    }
    if (j === 2 && k !== 12) {
        return i + "nd";
    }
    if (j === 3 && k !== 13) {
        return i + "rd";
    }
    return i + "th";
}

const TeamResume = ({ teamData, setTeamF }) => {
    // Component displaying record and games by quad
    // Strength Data Table
    let strength_data = []
    strength_data.push({key: "sos", title: "Strength of Schedule", value: ordinal_with_suffix(teamData.stat_rankings["SOS"])})
    strength_data.push({key: "sov", title: "Strength of Victory", value: ordinal_with_suffix(teamData.stat_rankings["SOV"])})

    // Add Ordinal Data
    let sys_title = (teamData.year > 2018) ? "NET" : "RPI";
    strength_data.push({title: sys_title, value: ordinal_with_suffix(teamData.ordinal_data[sys_title])})
    strength_data.forEach((obj) => obj.value = <div className='stat-value'>{obj.value}</div>)


    let quad_table = []
    for (let i = 1; i < 5; i++){
        let [quad_data_key, quad_data_val] = get_quad_data(teamData.quad_wins, teamData.quad_losses, i.toString(), teamData.year, setTeamF)
        quad_table.push({key: `quad_${i}_data`, title: quad_data_key, value: quad_data_val, is_collapsible: true})
    }
    return (
        <div id={"teamResume"} style={{width: "100%", border: "1px solid green"}}>
            <h1>Resume</h1>
            <hr />
            <TeamDataTable data={strength_data} maxValueHeight={'8rem'} />
            <TeamDataTable data={quad_table} maxValueHeight={'200px'} />
        </div>
    )
}

const TeamStats = ({ teamData }) => {
    return (
        <div id={"teamStats"} style={{width: "100%", border: "1px solid red"}}>
        </div>
    )
}

const TeamData = () => {
    let location = useLocation();
    let queryParams = new URLSearchParams(location.search);
    const [selectedTeam, setSelectedTeam] = useState(queryParams.get('tid') || '');
    const [selectedYear, setselectedYear] = useState(queryParams.get('year') || '2023');
    console.log(`Team: ${selectedTeam} Year: ${selectedYear}`);
    let [teamData, setTeamData] = useState(null)
    useEffect(() => {
        fetch(`${DATA_HOME}/${selectedTeam}_${selectedYear}.json`)
            .then(response => response.json())
            .then(data => {setTeamData(data)})
            .catch(error => {
                setTeamData({not_found: true});})
        }, [selectedTeam, selectedYear]);
    console.log(teamData);
    
    if (teamData === null){
        return <div>Loading...</div>
    }
    else if (teamData.not_found === true){
        return (<div>
            <h1>Select a valid team</h1>
            <select id="team-select" onChange={(e) => {navTo(e.target.value, selectedYear, setSelectedTeam)}}>
                <option value="" disabled selected>Select a Team</option>
                {Object.keys(TeamIds).map((team_id) => <option key={team_id} value={team_id}>{TeamIds[team_id]}</option>)}
            </select>

        </div>)
    }
    return (
        <div style={{width: "100%", border: "1px solid yellow"}}>
            <TeamHeader     teamData={teamData} selectedSzn={selectedYear} setTeamF={setSelectedTeam} />
            <TeamOverview   teamData={teamData} />
            <TeamResume     teamData={teamData} setTeamF={setSelectedTeam} />
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
    )
}

export default TeamView;
