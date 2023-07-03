from cmath import isnan
import json
import os
import pandas as pd

FT_2021_SRC = "/Users/andrewgrowney/Data/kaggle/marchmadness-2021/Training/V1"
FT_DEST_ROOT = "/Users/andrewgrowney/Code/React/andrewgrowney.com/src/Data/mm/features"
FEATURE_SETS = [
    ('2021', 'all_models', [(y,os.path.join(FT_2021_SRC, f'features_{y}.csv')) for y in range(2003,2023)])
]
def fill_model_features():
    for subfolder, identifier, features_per_year in FEATURE_SETS:
        feature_data = {}
        for year, feature_file in features_per_year:
            feature_year_data = {}
            ft_df = pd.read_csv(feature_file)
            # ft_df.drop(ft_df.columns[0],1, inplace=True)
            for _, data in ft_df.iterrows():
                team_id = int(data[["TeamID"]])
                team_year_data = {}
                for k,v in dict(**data).items():
                    if (k != 'TeamID') and (not pd.isnull(v)):
                        team_year_data[k] = v
                feature_year_data[team_id] = team_year_data
            feature_data[year] = feature_year_data


        dest_file = os.path.join(FT_DEST_ROOT, subfolder, f"{identifier}.json")
        with open(dest_file, "w") as tf:
            json.dump(feature_data, tf)
        return

if __name__ == "__main__":
    fill_model_features()
