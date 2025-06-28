
import linear_svc_pred from './predictions/linear_svc'
import poly_svc_1_pred from './predictions/poly_svc_1'
import poly_svc_2_pred from './predictions/poly_svc_2'
import grid_poly_1_2022_pred from './predictions/2022_grid_poly_1'
import base_2024 from './predictions/2024.json'
import nn_2025 from './predictions/nn_2025.json'
import clf_2025 from './predictions/clf_2025.json'
import clf_v2_2025 from './predictions/clf_v2_2025.json'
const model_info_map = {
    "coin": {
        name: "Coin Flip",
        "features": "full",
        min_pred_year: 1970,
        max_pred_year: 9999
    },
    "2022_grid_poly_1": {
        name: "2022 First Model",
        id: "2022_grid_poly_1",
        "predictions": grid_poly_1_2022_pred,
        "features": "full",
        min_pred_year: 2016,
        max_pred_year: 2022
    },
    "linear_svc": {
        name: "2021 First model",
        id: "linear_svc",
        "predictions": linear_svc_pred,
        "features": "full_2021",
        min_pred_year: 2016,
        max_pred_year: 2022
    },
    "poly_svc_1": {
        name: "2021 Balanced ",
        id: "poly_svc_1",
        "predictions": poly_svc_1_pred,
        "features": "full_2021",
        min_pred_year: 2016,
        max_pred_year: 2022
    },
    "poly_svc_2": {
        name: "2021 Upset Based",
        id: "poly_svc_2",
        "predictions": poly_svc_2_pred,
        "features": "full_2021",
        min_pred_year: 2016,
        max_pred_year: 2021
    },
    "base_2024": {
        name: "2024 Base",
        id: "base_2024",
        "predictions": base_2024,
        "features": "base_2024",
        min_pred_year: 2024,
        max_pred_year: 2024
    },
    "nn_2025": {
        name: "2025 Neural",
        id: "nn_2025",
        "predictions": nn_2025,
        "features": "base_2025",
        min_pred_year: 2025,
        max_pred_year: 2025
    },
    "clf_2025": {
        name: "2025 Classifier",
        id: "clf_2025",
        "predictions": clf_2025,
        "features": "base_2025",
        min_pred_year: 2025,
        max_pred_year: 2025
    },
    "clf_v2_2025": {
        name: "2025 V2 Model",
        id: "clf_v2_2025",
        "predictions": clf_v2_2025,
        "features": "base_2025",
        min_pred_year: 2025,
        max_pred_year: 2025
    }
}

export default model_info_map;