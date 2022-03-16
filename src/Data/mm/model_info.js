
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
        "features": "full"
    },
    "linear_svc": {
        name: "2021 Linear SVC",
        id: "linear_svc",
        "predictions": linear_svc_pred,
        "features": "full"
    },
    "poly_svc_1": {
        name: "2021 Poly Kernel SVC 1",
        id: "poly_svc_1",
        "predictions": poly_svc_1_pred,
        "features": "full"
    },
    "poly_svc_2": {
        name: "2021 Poly Kernel SVC 2",
        id: "poly_svc_2",
        "predictions": poly_svc_2_pred,
        "features": "full"
    }
}

export default model_info_map;