
import linear_svc_pred from './predictions/linear_svc'
import poly_svc_1_pred from './predictions/poly_svc_1'
import poly_svc_2_pred from './predictions/poly_svc_2'
import grid_poly_1_2022_pred from './predictions/2022_grid_poly_1'
const model_info_map = {
    "coin": {
        "features": "full"
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
    }
}

export default model_info_map;