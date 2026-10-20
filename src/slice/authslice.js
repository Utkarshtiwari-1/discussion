import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token:localStorage.getItem("chattoken")?JSON.parse(localStorage.getItem("chattoken")):null,
    user:localStorage.getItem("chatuser")?JSON.parse(localStorage.getItem("chatuser")):null
}

const authslice  = createSlice({
    name:'auth',
    initialState,
    reducers:{
        settoken:(state,value)=>{
            state.token = value.payload;
           
        },
        setuser:(state,value)=>{
            state.user = value.payload;
           
        }
    }
})

export const {settoken,setuser} = authslice.actions;
export default authslice.reducer;