import React, { useState } from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import Nav from '../../../js/Nav'
import { CalculateWinner, ModelPredictKey } from '../../../../helpers/mm'
import teamData from '../../../../Data/mm/teams'
import teamSeeds from '../../../../Data/mm/teamSeeds'
import tourneyRegions from '../../../../Data/mm/tourneyRegions'
import tourneyGameResults from '../../../../Data/mm/tourneyGameResults'
import tourneySlots from '../../../../Data/mm/tourneySlots'
import slotResults from '../../../../Data/mm/slotResults'
import model_info_map from '../../../../Data/mm/model_info'
import full_features_2021 from "../../../../Data/mm/features/2021/all_models"
import '../css/bracket.css'
import 'bootstrap/dist/css/bootstrap.css'

const DEFAULT_MODEL = "linear_svc"
const DEFAULT_SEASON = 2021
const SEASON_LIST = [2015, 2016, 2017, 2018, 2019, 2021]
const feature_set_map = {
    "full": full_features_2021
}
const selectTeamName = (t_id) => { return teamData.find(y => y.id == t_id).name }

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
    let handler = (new_season) => { 
        setSeason(new_season)
    }
    
    let otherOptions = SEASON_LIST.filter(x => x !== selected).sort((a,b) => b-a)
    return(
        <Dropdown class='selectorItem'>
            <Dropdown.Toggle>Season: {selected}</Dropdown.Toggle>
            <Dropdown.Menu>
                {otherOptions.map(x => <Dropdown.Item onSelect={() => {handler(x)}}>{x}</Dropdown.Item>)}
            </Dropdown.Menu>
        </Dropdown>
    )
}
function ViewSelector(fromBlank, setFromBlank)
{
    let handler = (new_val) => { 
        setFromBlank(new_val)
    }
    let options = [
        {
            val: true,
            name: "From Blank"
        },
        {
            val: false,
            name: "Actual Matchups"
        }
    ]
    let selected = options.filter(x => x.val === fromBlank)[0].name
    let otherOptions = options.filter(x => x.val !== fromBlank)
    console.log(selected)
    console.log(otherOptions)
    return(
        <Dropdown class='selectorItem'>
            <Dropdown.Toggle>Fill: {selected}</Dropdown.Toggle>
            <Dropdown.Menu>
                {otherOptions.map(x => <Dropdown.Item onSelect={() => {handler(x.val)}}>{x.name}</Dropdown.Item>)}
            </Dropdown.Menu>
        </Dropdown>
    )
}


const BracketRegion = (regionName, matchups, fromBlank = false) => {
    let rounds = []
    let startIdx = 0
    let gameIndexes = [];
    if (matchups.length == 17) {
        gameIndexes = [[0,7,3,4,2,5,6,1], [0,3,2,1], [0,1], [0]]
        startIdx = 2
    } else if (matchups.length == 16) {
        gameIndexes = [[0,7,3,4,2,5,6,1], [0,3,2,1], [0,1], [0]]
        startIdx = 1
    } else if (matchups.length == 15) {
        gameIndexes = [[0,7,3,4,2,5,6,1], [0,3,2,1], [0,1], [0]]
    }
    else if (matchups.length == 7) {
        gameIndexes = [[0,3,2,1], [0,1], [0]]
    }
    else if (matchups.length == 3) {
        gameIndexes = [[0,1], [0]]
    }

    for(let curRound = 0; curRound < gameIndexes.length; curRound++)
    {
        let roundIndexes = gameIndexes[curRound]
        let roundMatchups = roundIndexes.length
        let selectedMatchups = matchups.slice(startIdx, startIdx + roundMatchups)
        let orderedMatchups = []
        for(let i = 0; i < roundMatchups; i++)
        {
            orderedMatchups = orderedMatchups.concat(selectedMatchups[roundIndexes[i]])
        }
        let round_id = `round-${curRound+1}`
        rounds = rounds.concat(
            <ul className='round' id={round_id}>{
                orderedMatchups.map((x,idx) => {
                    let [t1, t2] = [null, null]
                    t1 = (fromBlank) ? (x.pt1 ? x.pt1 : x.t1) : x.t1
                    t2 = (fromBlank) ? (x.pt2 ? x.pt2 : x.t2) : x.t2
                    let correctMatchup = (fromBlank) ? ((x.pt2 === x.t2) && (x.pt1 === x.t1)) : true
                    let t1Name = selectTeamName(t1)
                    let t2Name = selectTeamName(t2)

                    let t1ElMask = (x.predicted && (x.predicted == t1) && correctMatchup)
                    let t2ElMask = (x.predicted && (x.predicted == t2) && correctMatchup)

                    let t1Elements = t1ElMask ? [t1Name, x.predict_prob] : [t1Name]
                    let t2Elements = t2ElMask ? [t2Name, x.predict_prob] : [t2Name]
                    let [t1Class,t2Class] = ['','']
                    let isFirstRoundSlot = x.id.charAt(1) == "1"
                    // From Blank
                    if(fromBlank)
                    {
                        if (!isFirstRoundSlot)
                        {
                            if((x.pt1) && (x.t1 == x.pt1))
                            {
                                t1Class = 'correct'
                            } else if ((x.predicted))
                            {
                                t1Class = 'incorrect'
                            }

                            if(x.pt2 && x.t2 == x.pt2)
                            {
                                t2Class = 'correct'
                            } else if(x.predicted)
                            {
                                t2Class = 'incorrect'
                            }
                        }
                        
                    } else if (x.predicted) {
                        if (x.predicted == x.winner && x.winner == t1)
                        {
                            t1Class = 'correct'
                        } else if (x.predicted == x.winner && x.winner == t2)
                        {
                            t2Class = 'correct'
                        } else if (x.predicted == t1) {
                            t1Class = 'incorrect'
                        } else if (x.predicted == t2) {
                            t2Class = 'incorrect'
                        }
                    }
                    

                    // Styling Shenangins
                    let t1Top = (curRound === 0 || idx === 0 || (idx !== (roundMatchups-1))) ? true : false
                    let [topTeamElements, bottomTeamElements] = t1Top ? [t1Elements,t2Elements] : [t2Elements,t1Elements]
                    let [topTeamClass, bottomTeamClass] = t1Top ? [t1Class,t2Class] : [t2Class, t1Class]
                    let [topClass, bottomClass] = [`team-top `+topTeamClass, `team-bottom `+bottomTeamClass]
                    
                    return(
                        <div className='game' id={x.id}>
                            <li className={topClass}>{topTeamElements.map(el => <span>{el}</span>)}</li>
                            <li className='spacer'>&nbsp;</li>
                            <li className={bottomClass}>{bottomTeamElements.map(el => <span>{el}</span>)}</li>
                        </div>
                    )
                })
            }</ul>)
        startIdx += roundMatchups
    }
    return (
        <div className='regionContainer' id={`region-${regionName.replace(" ","")}`}>
            <h3 className='regionName'>{regionName}</h3>
            <div className='regionRounds'>{rounds} </div>
        </div>
    )
}
const GetSlotResults = (season, slot) => {
    // Get the results for a game that played in a tournament slot
    let game = slotResults[`${season}_${slot}`]
    return game
}
const GetMatchupResults = (season, model, team1, team2, slot = null) => {
    let [predicted, predict_prob] = CalculateWinner(model, season, team1, team2)
    let [matchup_key, ] = ModelPredictKey(season, team1, team2)
    let actual = tourneyGameResults[matchup_key]

    let results = {
        t1: team1,
        t2: team2,
        winner: actual ? actual.Winner : null,
        predicted: predicted,
        predict_prob: predict_prob
    }
    return results
}

const CalculateSlotResults = (slots, season, model, fromBlank = false, winnerCache = {}, predictedCache = {}) =>
{
    let matchupResults = {}
    
    slots.forEach(slot => {
        let [strongSeed, weakSeed] = tourneySlots[season][slot]
        let [t1, t2, pt1, pt2] = [null, null, null, null]
        // Resolve from matchup results
        if (slot.length === 3 || slot.charAt(1) === "1")
        {
            // Play In Game (e.g. W11, W16) or First Round Game
            t1 = parseInt(teamSeeds[season][strongSeed])
            pt1 = parseInt(teamSeeds[season][strongSeed])
            t2 = parseInt(teamSeeds[season][weakSeed])
            pt2 = parseInt(teamSeeds[season][weakSeed])
        }
        else
        {
            t1 = parseInt(winnerCache[strongSeed])
            pt1 = parseInt(predictedCache[strongSeed])
            t2 = parseInt(winnerCache[weakSeed])
            pt2 = parseInt(predictedCache[weakSeed])
        }
        let gameResult = null;
        if(fromBlank)
        {
            let slotResults = GetSlotResults(season, slot)
            let [predicted, predict_prob] = CalculateWinner(model, season, pt1, pt2)
            gameResult = {
                ...slotResults,
                pt1: pt1,
                pt2: pt2,
                predicted: predicted,
                predict_prob: predict_prob
            }
        }
        else
        {
            gameResult = GetMatchupResults(season, model, t1, t2)
        }
        
        matchupResults[slot] = gameResult
        winnerCache[slot] = gameResult.winner
        predictedCache[slot] = gameResult.predicted

        // Fill in a Play In Game Winner
        if(slot.length == 3)
        {
            teamSeeds[season][slot] = gameResult.winner
        }
    });
    return matchupResults
}

const GetRegionMatchups = (prefix, season, model, fromBlank) => {
    let results = []
    // Get the slots (remove the R5 Final Four round)
    let slots = Object.keys(tourneySlots[season]).filter(x => (x.includes(prefix) && x.slice(0,2) !== "R5"))
    slots = slots.sort((x,y) => {
        if(x.length !== y.length)
        {
            return x.length - y.length
        }
        else if (x[0] == "R" && y[0] == "R")
        {
            return parseInt(x[1]) - parseInt(x[2])
        }
        else {
            return parseInt(x.slice(-2)) - parseInt(y.slice(-2))
        }
    })
    // Fill the first round slots
    let matchupResults = CalculateSlotResults(slots, season, model, fromBlank)

    // return filled matchups
    return Object.keys(matchupResults).map(slot_id => { 
        let full = matchupResults[slot_id];
        full["id"] = slot_id;
        return full
    })
}

const GetTournamentData = (season, model, fromBlank = false) =>
{
    let results = []
    // Get Slots for the season's tournament 
    let seasonRegions = tourneyRegions[season]

    let regionalWinners = {}
    let regionalsPredicted = {}
    // Resolve matchups for each region
    seasonRegions.forEach(region => {
        let regionMatchups = GetRegionMatchups(region.Prefix, season, model, fromBlank)
        let regionChampionship = regionMatchups.find(m => m.id == `R4${region.Prefix}1`)
        regionalWinners[`R4${region.Prefix}1`] = regionChampionship.winner
        regionalsPredicted[`R4${region.Prefix}1`] = regionChampionship.predicted
        results = results.concat({name: region.Name, matchups: regionMatchups})
    });
    // Resolve final four matchups
    let ff_slots = ["R5WX","R5YZ","R6CH"]
    let ff_results = CalculateSlotResults(ff_slots, season, model, fromBlank, regionalWinners, regionalsPredicted)
    let ff_matchups = Object.keys(ff_results).map(k => { let full = ff_results[k]; full["id"] = k; return full})   

    results = results.concat({name: "Final Four", matchups: ff_matchups})
    
    return results
}

function Bracket()
{
    let pageHeader = "Tournament Bracket"

    let navContent = [
        { type: "SingleLink", title: "Home", pageRef: "/" },
        { type: "SingleLink", title: "March Madness", pageRef: "/marchmadness" },
        { type: "SingleLink", title: "Matchup", pageRef: "/mm/matchup" }
    ]

    let [model, setModel] = useState(DEFAULT_MODEL)
    let [season, setSeason] = useState(DEFAULT_SEASON)
    let [fromBlank, setFromBlank] = useState(false)

    let regions = GetTournamentData(season, model, fromBlank)
    return (
        <div>
            <Nav navContent={navContent}/>
            <div className='bracketView'>
                <div className='d-flex flex-column align-items-center'>
                    <h2>{pageHeader}</h2>
                    <div className='selectorContainer'>
                        {ModelSelector(model, setModel)}
                        {SeasonSelector(season, setSeason)}
                        {ViewSelector(fromBlank, setFromBlank)}
                    </div>
                </div>
                <div className='regionsContainer'>
                    {regions.map(r => BracketRegion(r.name, r.matchups, fromBlank))}
                </div>
            </div>
        </div>
    )
}
export default Bracket;