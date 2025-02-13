import React, { useEffect, useState } from 'react'
import { Badge, Button, Card } from 'react-bootstrap'
import Select from 'react-select';
import { Link } from 'gatsby';
import { useLocation, navigate } from '@reach/router';
import { RadialBar, RadialBarChart, RadarChart, Radar, PolarAngleAxis, PolarRadiusAxis, PolarGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Nav  from '../../../js/Nav'
import { MMBracket } from '../../../../images/Blogs/MarchMadnessML';
import { IMAGE_HOST } from '../../../../images';
import TeamIds from '../../../../Data/mm/team_ids'
import TeamSeasons from '../../../../Data/mm/team_seasons'
import 'bootstrap/dist/css/bootstrap.css'
import '../css/team.css'
const CURRENT_YEAR = 2024
const DATA_HOME = 'https://raw.githubusercontent.com/ajgrowney/march-madness-ml/master/data/web/ts'

let navTo  = (team, year, setTeamYear) => {
    navigate(`/mm/team?tid=${team}&year=${year}`);
    setTeamYear({team: team, year: year});
}

let toggleCollapse = (id, display_val) => {
    let element = document.getElementById(id);
    if (element.style.display === "none") {
        element.style.display = display_val;
    } else {
        element.style.display = "none";
    }
}

const TeamDataEntryTitle = ({is_collapsible, title, classNames, toggle_key}) => {
        if (is_collapsible === true) {
            return(
                <div className={classNames}>
                    <h5>{title}</h5><Badge variant='primary' onClick={() => {toggleCollapse(toggle_key, "flex")}}>+</Badge>
                </div>)
        } else {
            return(
                <div className={classNames}>
                    <h5>{title}</h5>
                </div>)
        }
    }

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
        return(<Card className={objClassNames} key={entry_key}>
            <TeamDataEntryTitle is_collapsible={obj.is_collapsible} title={obj.title} classNames={titleClassNames} toggle_key={data_div_key} />
            <div id={data_div_key} className='vertical-data' style={{'maxHeight': maxValueHeight}}>{obj.value}</div>
        </Card>)
    })
    return (<div className='team-data-table'>{entries}</div>)
}

const TeamOverview = ({ teamData }) => {
    // Tournament Data
    let teamTourney = teamData.tournament;
    let tourneyVal = ""
    if (teamData.year === CURRENT_YEAR){
        tourneyVal = "TBD March 19"
    } else if (teamTourney === null){
        tourneyVal = "Missed Tournament"
    } else {
        tourneyVal = teamTourney.seed === null ? "Missed Tournament" : (teamTourney.exit_round === "Champion" ? "Champion" : `Lost in ${teamTourney.exit_round} (${teamTourney.seed} Seed)`)
    }
    let tableData = [
        {key: 'tourney',    title: <Link to={`/mm/bracket/?year=${teamData.year}`} >Tournament</Link>,      value: tourneyVal},
        {key: 'rec-ov',     title: "Overall", value: `${teamData.record.overall[0]} - ${teamData.record.overall[1]}`},
        {key: 'conf',       title: "Conference", value: `${teamData.record.conf[0]} - ${teamData.record.conf[1]}`},
        {key: 'rec-home',   title: "Home", value: `${teamData.record.home[0]} - ${teamData.record.home[1]}`},
        {key: 'rec-road',   title: "Road", value: `${teamData.record.road[0]} - ${teamData.record.road[1]}`}
    ]
    // Apply a 'stat-value' div to each object value
    tableData.forEach((obj) => obj.value = <div className='stat-value'>{obj.value}</div>)
    return(
        <Card id={"teamOverview"} style={{width: "100%"}}>
            <h1>Overview</h1>
            <hr />
            <TeamDataTable data={tableData}  maxValueHeight={'8rem'}/>
        </Card>
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


    // Replace with react-select
    let options = Object.entries(TeamIds).map(([teamId, teamName]) => ({value: teamId, label: teamName}))
    const handleSelect = (selectedOption) => {
        navTo(selectedOption.value, selectedYear, setTeamF);
    }
    return (
        <div className='team-search-bar'>
            <Select placeholder={'Select Team'} maxMenuHeight={200} options={options} onChange={handleSelect} />
        </div>
    )
  };

const YearSearchBar = ({ current, teamYears, selectedTeam, setTeamYearF }) => {
    // Replace with react-select
    let options = teamYears.map((ty) => ({value: ty, label: ty}))
    const handleSelect = (selectedOption) => {
        navTo(selectedTeam, selectedOption.value, setTeamYearF);
    }
    return (
        <div className='team-search-bar'>
            <Select placeholder={current} maxMenuHeight={200} options={options} onChange={handleSelect} />
        </div>
    )
    // return (
    //   <div className='team-search-bar'>
    //     <select onChange={(e) => navTo(selectedTeam, e.target.value, setTeamYearF)}>
    //       {teamYears.map((ty) => (
    //         <option key={ty} value={ty}>{ty}</option>
    //       ))}
    //     </select>
    //   </div>
};

const TeamHeader = ({ teamData, selectedSzn, setTeamF }) => {
    let [teamStartYear, teamEndYear] = TeamSeasons[teamData.id]
    // TODO: replace with end year once 2023 data is available
    let teamYears = Array.from({length: teamEndYear - teamStartYear + 1}, (_, i) => teamStartYear + i).reverse();
    return (
        <div id={"teamHeader"} className='team-header'>
            <YearSearchBar current={selectedSzn} teamYears={teamYears} selectedTeam={teamData.id} setTeamYearF={setTeamF} />
            <div><h1>{teamData.name}</h1><h5>{teamData.year}</h5></div>
            <TeamSearchBar selectedYear={selectedSzn} setTeamF={setTeamF}  />
        </div>
    )
}

// ---- Resume Helpers ----

const get_quad_data = (rec, quad_wins, quad_losses, quad, year, setTeamF) => {
    let quad_key = `${rec[0]} - ${rec[1]} vs Quad ${quad}`
    let quad_games = []
    for (let i = 0; i < quad_wins.length; i++){
        let game = quad_wins[i]
        let loc_prefix = game.team_loc === 'H' ? 'vs' : 'at'
        quad_games.push([
            game.date_int,
            game.date_str,
            game.opp_id,
            `${loc_prefix} ${TeamIds[game.opp_id]}`,
            `${game.team_score} - ${game.opp_score}`,
            game.team_score > game.opp_score ? 'green' : 'red'
        ])
    }
    for (let i = 0; i < quad_losses.length; i++){
        let game = quad_losses[i]
        let loc_prefix = game.team_loc === 'H' ? 'vs' : 'at'
        quad_games.push([
            game.date_int,
            game.date_str,
            game.opp_id,
            `${loc_prefix} ${TeamIds[game.opp_id]}`,
            `${game.team_score} - ${game.opp_score}`,
            game.team_score > game.opp_score ? 'green' : 'red'
        ])
    }
    // Sort quad_games by date_int
    quad_games.sort((a, b) => (a[0] > b[0]) ? -1 : 1)
    // and remove it from the value
    quad_games.forEach((game) => game.splice(0, 1))
    // Format the game into a div
    quad_games = quad_games.map((game, i) => 
        <div className='quad-game' key={i}>
        <div>{game[0]}</div> <a href="javascript:;" onClick={() => { navTo(game[1], year, setTeamF)}}>{game[2]}</a> <div style={{'color': game[4]}}>{game[3]}</div>
        </div>)
    
    return [quad_key, quad_games]
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
        let [quad_data_key, quad_data_val] = get_quad_data(teamData.record[`quad_${i}`], teamData.quad_wins[i], teamData.quad_losses[i], i.toString(), teamData.year, setTeamF)
        quad_table.push({key: `quad_${i}_data`, title: quad_data_key, value: quad_data_val, is_collapsible: true})
    }
    return (
        <div id={"teamResume"} style={{width: "100%"}}>
            <h1>Resume</h1>
            <hr />
            <TeamDataTable data={strength_data} maxValueHeight={'8rem'} />
            <TeamDataTable data={quad_table} maxValueHeight={'200px'} />
        </div>
    )
}

const TeamStatsChart = ({ values, rankings }) => {
    // Radar Chart to view team stats
    //     stats: OE, DE, Poss, FG%, FG3%, FT%, Ast, TO, OppPoints, OppFG%, OppFG3%, OppFT%, OppAst, OppTO
    // param values: object with each stat as a key
    // param rankings: object with each stat as a key
    let cols = [{t: 'Efficiency', o: 'OE', d: 'DE'}, {o: 'Points', d: 'OppPoints'}, {o: 'Poss', d: 'Poss'}, {o: 'FG%', d: 'OppFG%'}, {o: 'FGM', d: 'OppFGM'}, {o: 'FG3%', d: 'OppFG3%'}, {o: 'FGM3', d: 'OppFGM3'}, {o: 'FT%', d: 'OppFT%'}, {o: 'FTM', d: 'OppFTM'}, {o: 'Ast', d: 'OppAst'}, {o: 'TO', d: 'OppTO'}]
    
    let data = cols.map((c) => ({
        stat: c.t ? c.t : c.o, 
        off_ranking: rankings[c.o], def_ranking: rankings[c.d], 
        off_bar_value: (363 - rankings[c.o]), def_bar_value: (363 - rankings[c.d])
    }));
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
          const p = payload[0].payload;
          return (
            <div className="custom-tooltip">
              <p>{`Offense: ${ordinal_with_suffix(p.off_ranking)}`}</p>
              <p>{`Defense: ${ordinal_with_suffix(p.def_ranking)}`}</p>
            </div>
          );
        }
      
        return null;
      };

    return (
        <ResponsiveContainer width={500} height={400} className={'team-stats-chart'}>
            <RadarChart width={500} height={400}
                className={'team-stats-chart'} data={data} >
                <PolarGrid />
                <PolarAngleAxis dataKey="stat" />
                <PolarRadiusAxis domain={[1, 363]} />
                <Tooltip content={<CustomTooltip />}/>
                <Legend />
                <Radar name='offense' dataKey="off_bar_value" fill="#8884d8" stroke="#8884d8" opacity={0.5}/>
                <Radar name="defense" dataKey="def_bar_value" fill="#82ca9d" stroke="#82ca9d" opacity={0.5} />
            </RadarChart>
        </ResponsiveContainer>
    )
}

const TeamStats = ({ teamData }) => {
    let offEntries = [
        { name: "Adj Off Efficiency", rank: teamData.stat_rankings["AdjOE"], val: teamData.stats["AdjOE"]},
        { name: "Off Efficiency", rank: teamData.stat_rankings["OE"], val: teamData.stats["OE"] },
        { name: "Possessions", rank: teamData.stat_rankings["Poss"], val: teamData.stats["Poss"] },
        { name: "FG%", rank: teamData.stat_rankings["FG%"], val: teamData.stats["FG%"] },
        { name: "FG3%", rank: teamData.stat_rankings["FG3%"], val: teamData.stats["FG3%"] },
        { name: "FT%", rank: teamData.stat_rankings["FT%"], val: teamData.stats["FT%"] }
    ];
    let defEntries = [
        { name: "Adj Def Efficiency", rank: teamData.stat_rankings["AdjDE"], val: teamData.stats["AdjDE"]},
        { name: "Def Efficiency", rank: teamData.stat_rankings["DE"], val: teamData.stats["DE"] },
        { name: "Opponent FG%", rank: teamData.stat_rankings["OppFG%"], val: teamData.stats["OppFG%"] },
        { name: "Opponent FG3%", rank: teamData.stat_rankings["OppFG3%"], val: teamData.stats["OppFG3%"] },
        { name: "Opponent FT%", rank: teamData.stat_rankings["OppFT%"], val: teamData.stats["OppFT%"] }
    ];

    let offData = offEntries.map((obj) => {
        return (<div style={{display: 'grid', gridTemplateRows: '1fr', gridTemplateColumns: '50% 25% 25%', width: '100%', alignItems: 'center'}}>
                <div>{obj.name}</div><div>{obj.val}</div><div>{ordinal_with_suffix(obj.rank)}</div>
            </div>
        )})
    let defData = defEntries.map((obj) => {
        return (<div style={{display: 'grid', gridTemplateRows: '1fr', gridTemplateColumns: '50% 25% 25%', width: '100%', alignItems: 'center', marginBottom: '0.1rem'}}>
                <div>{obj.name}</div><div>{obj.val}</div><div>{ordinal_with_suffix(obj.rank)}</div>
            </div>
        )})
    

    return (
        <div id={"teamStats"} style={{width: "100%"}}>
            <h1>Stats</h1>
            <hr />
            <div className='team-stats-data'>
                <TeamDataTable key={'offense-key-stats'} data={[{key: 'offense', title: "Offense", value: offData, is_collapsible: true}]} />
                <TeamStatsChart values={teamData.stats} rankings={teamData.stat_rankings} />
                <TeamDataTable key={'defense-key-stats'} data={[{key: 'defense', title: "Defense", value: defData, is_collapsible: true}]} />
            </div>
        </div>
    )
}

const SimilarTeamsTable = ({ similarTeamsData, setTeamYearF }) => {
    if (similarTeamsData === undefined){
        console.log("No similar team data found")
        return <div></div>
    }
    let formattedData = similarTeamsData.map((team) => {
        let teamTourney = (team.year == 2024) ? "TBD" : (team.er === null ? "Missed Tournament" : team.er === "Champion" ? "Champion" : `Lost in ${team.er}`)
        let labelVal = `${team.year} ${TeamIds[team.id]}`
        let data = [{'s': (team.st*100).toFixed(2)}]
        return (
            <Card className='similar-teams-table-entry' >
                {/* RadialBarChart with SemiCircle of data val and value under in text box */}
                <ResponsiveContainer width={100} height={100}>
                    <RadialBarChart cy={80} innerRadius={40} outerRadius={60} data={data} startAngle={180} endAngle={0}>
                        <RadialBar minPointSize={15} background dataKey="s" fill="#82ca9d" />
                    <text textAnchor='middle' verticalAnchor='middle' x='50%' y='80%' fill="#000">{(team.st*100).toFixed(2)}%</text>
                    </RadialBarChart>
                </ResponsiveContainer>
                <a href="javascript:;" onClick={() => navTo(team.id, team.year, setTeamYearF)}>{labelVal}</a>
                <div>{teamTourney}</div>
            </Card>
        )
    })
    return (
        <div style={{'height': 'fit-content'}} >
            <h2>Similar Teams</h2>
            <div className='similar-teams-table'>
            {formattedData}
            </div>
        </div>
    )
}


const TeamData = () => {
    let location = useLocation();
    let queryParams = new URLSearchParams(location.search);
    const [selectedTeamYear, setSelectedTeamYear] = useState({
        team: queryParams.get('tid') || '1242',
        year: queryParams.get('year') || '2024'
    });
    console.log(`Team: ${selectedTeamYear.team} Year: ${selectedTeamYear.year}`);
    let [teamData, setTeamData] = useState(null)
    useEffect(() => {
        fetch(`${DATA_HOME}/${selectedTeamYear.team}_${selectedTeamYear.year}.json`)
            .then(response => response.json())
            .then(data => {setTeamData(data)})
            .catch(error => {
                setTeamData({not_found: true});})
        }, [selectedTeamYear]);
    console.log(teamData);
    
    if (teamData === null){
        return <div>Loading...</div>
    }
    else if (teamData.not_found === true){
        return (<div>
            <h1>Select a valid team</h1>
            <select id="team-select" onChange={(e) => {navTo(e.target.value, selectedTeamYear.year, setSelectedTeamYear)}}>
                <option value="" disabled selected>Select a Team</option>
                {Object.keys(TeamIds).map((team_id) => <option key={team_id} value={team_id}>{TeamIds[team_id]}</option>)}
            </select>

        </div>)
    }
    return (
        <div style={{width: "100%"}}>
            <TeamHeader     teamData={teamData} selectedSzn={selectedTeamYear.year} setTeamF={setSelectedTeamYear} />
            <TeamOverview   teamData={teamData} />
            <TeamResume     teamData={teamData} setTeamF={setSelectedTeamYear} />
            <TeamStats      teamData={teamData} />
            <SimilarTeamsTable similarTeamsData={teamData.similar_teams}  setTeamYearF={setSelectedTeamYear} />
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
            <div className='app_container'>
                <Nav page={"MM"} navContent={navContent} />
                <TeamData />
            </div>
        </div>
    )
}

export default TeamView;

export const Head = ({  location, params, data, pageContext }) => {
    console.log("Head: ", location, params, data, pageContext)
    return (
        <>
        <title>Team Profile</title>
        {/* <title>{blog_selected.title}</title> */}
        {/* <meta name="image" property="og:image" content={blog_selected.image} /> */}
        <meta name="description" property="og:description" content="March Madness - Team Profile" />
        {/* <meta name="description" property="og:description" content={blog_selected.title} /> */}
        <meta name="author" content="Andrew Growney" />
        </>
    )
}
