import { combineReducers} from "@reduxjs/toolkit";
import authslice from "../slice/authslice";
import stepslice from "../slice/stepslice";

export const combinedreducer = combineReducers({
    auth:authslice,
    steps:stepslice,
})

