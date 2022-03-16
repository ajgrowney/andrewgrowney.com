import model_info_map from '../Data/mm/model_info'

function CalculateWinner(model_id, season, t1_id, t2_id, prob_precision = 0)
{
    let winner = ""
    let prob = 0.0
    if(model_id == "coin")
    {
        winner = (Math.random() > 0.5) ? t1_id : t2_id
        prob = 0.5
        prob = (prob*100).toFixed(prob_precision) + "%"
    }
    else
    {
        let [ matchup_key, sorted_teams ] = ModelPredictKey(season, t1_id, t2_id)
        let model_predictions = model_info_map[model_id]["predictions"]
        let matchup_probability = model_predictions[matchup_key]
        if(matchup_probability)
        {
            let t1_won = matchup_probability >= 0.5
            winner = t1_won ? sorted_teams[0] : sorted_teams[1] 
            prob = t1_won ? matchup_probability : (1 - matchup_probability)
            prob = (prob*100).toFixed(prob_precision) + "%"
        }
        else
        {
            winner = null
            prob = null
        }
    }
    return [winner, prob]
}


// Description: Resolve the key to fetch a prediction for a game between two teams in a season from a model
// Param: t1 { int } - Team ID
// Param: t2 { int } - Team ID
// Return: [String, Boolean] - The key and whether your teams were sorted
function ModelPredictKey(season, t1, t2)
{
    let sorted_teams = [t1, t2].sort()
    let team_key_suffix = sorted_teams.join("_")
    let matchup_key = `${season}_${team_key_suffix}`
    return [matchup_key, sorted_teams]
}

export { CalculateWinner, ModelPredictKey };