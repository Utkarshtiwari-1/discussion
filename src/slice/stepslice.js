import { createSlice } from "@reduxjs/toolkit"



const initialState = {
    step :1,
    loading:false,
    questionid:null
}

const stepslice = createSlice({
    name:"steps",
    initialState,
    reducers:{
        setsteps:(state,value)=>{
            state.step = value.payload;
        },
        setloading:(state,value)=>{
            state.loading = value.payload;
        },
        setquestionid:(state,value)=>{
            state.questionid = value.payload;
        }
    }
})

export const {setloading,setsteps,setquestionid} = stepslice.actions;
export default stepslice.reducer;