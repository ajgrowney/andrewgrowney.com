import json
import os
import pandas as pd

PRED_SRC = os.getenv("MM_DATA", "/Users/andrewgrowney/Code/Python/march-madness-ml")
PRED_DEST_ROOT = "/Users/andrewgrowney/Code/React/andrewgrowney.com/src/Data/mm/predictions"
MODEL_PATHS = [
    ("linear_svc", "Results/2021/grid_linear.csv"),
    ("poly_svc_1", "Results/2021/poly_model.csv"),
    ("poly_svc_2", "Results/2021/grid_poly.csv"),

]
def fill_model_predictions():
    print(MODEL_PATHS, len(MODEL_PATHS))
    for model_id, model_results_path in MODEL_PATHS:
        pred_data = {}
        pred_df = pd.read_csv(os.path.join(PRED_SRC, model_results_path))
        for _, p_id, p_conf in pred_df.itertuples():
            pred_data[p_id] = p_conf
        dest_file = os.path.join(PRED_DEST_ROOT, f"{model_id}.json")
        print("Writing " + dest_file)
        with open(dest_file, "w") as tf:
            json.dump(pred_data, tf)

if __name__ == "__main__":
    fill_model_predictions()
