import json
import os
import pandas as pd

DATA_SRC = os.getenv("MM_DATA", "/Users/andrewgrowney/Data/kaggle/marchmadness-2022/stage_1")
TEAMS_DATA_LOC = "/Users/andrewgrowney/Code/React/andrewgrowney.com/src/Data/mm/teams.js"
def fill_mm_teams():
    teams_df = pd.read_csv(os.path.join(DATA_SRC, "MTeams.csv"))
    teams_data = []
    for _, t_id, t_name, t_first_season, t_last_season in teams_df.itertuples():
        teams_data.append({'id': t_id, 'name': t_name, 'first_season': t_first_season, 'last_season': t_last_season})
    with open(TEAMS_DATA_LOC, "w") as tf:
        json.dump(teams_data, tf)
    return

if __name__ == "__main__":
    fill_mm_teams()
