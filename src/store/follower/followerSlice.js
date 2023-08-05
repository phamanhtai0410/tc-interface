import { createSlice } from "@reduxjs/toolkit"
import { getListFollowerGroup } from "actions/follower.actions";

const initialState ={
    num_of_page:0,
    isOpen:false,
    key:[],
    followerEdit:{
        id:"",
        name:"",
        key:[],
    }
    
}

export const followerSlice = createSlice({
    name:'follower',
    initialState:initialState,
    reducers:{
        setChangeModalAddKeyFollower: (state,action)=>{
            // state.keys = action.payload.key
            state.isOpen = action.payload.isOpen;
        },
        setKeyValueFollower: (state,action)=>{
            state.key = action.payload.key;
        },
        setEditFollower: (state, action) => {
            state.followerEdit.id = action.payload._id
            state.followerEdit.name = action.payload.name;
            state.followerEdit.key = action.payload.accounts;
        },
        resetState: (state) => {
            Object.assign(state, initialState);
        },
    },
    extraReducers: (builder) =>{
        builder.addCase(getListFollowerGroup.fulfilled,(state,action)=>{
            state.num_of_page = action.payload.data.num_of_page;
        })
    }
})

export const { setChangeModalAddKeyFollower, setKeyValueFollower, setEditFollower, resetState } = followerSlice.actions;

export const selectNumpagesFollower = (state) => state.follower.num_of_page
export const selectOpenModalAddKeyFollower = (state) => state.follower.isOpen
export const selectKeyFollower = (state) => state.follower.key
export const selectFollowerEdit = (state) => state.follower.followerEdit


export default followerSlice.reducer;