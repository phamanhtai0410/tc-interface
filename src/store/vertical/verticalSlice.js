import { createSlice } from "@reduxjs/toolkit"
import { getListVerticalGroup } from "actions/vertical.actions"



const initialState ={
    num_of_page:0,
    isOpen:false,
    key:[],
    verEdit:{
        id:"",
        name:"",
        weight:"",
        key:[],
    }
    
}

export const verticalSlice = createSlice({
    name:'vertical',
    initialState:initialState,
    reducers:{
       setChangeModalAddKey: (state,action)=>{
            // state.keys = action.payload.key
            state.isOpen = action.payload.isOpen;
       },
       setKeyValue: (state,action)=>{
            state.key = action.payload.key;
       },
       setEdit: (state,action)=>{
            state.verEdit.id = action.payload._id
            state.verEdit.name = action.payload.name;
            state.verEdit.weight = action.payload.weight;
            state.verEdit.key = action.payload.keywords;
       }
    },
    extraReducers: (builder) =>{
        builder.addCase(getListVerticalGroup.fulfilled,(state,action)=>{
            state.num_of_page = action.payload.data.num_of_page;
        })
    }
})

export const {setChangeModalAddKey,setKeyValue,setEdit} = verticalSlice.actions;

export const selectNumpagesVertical = (state) => state.vertical.num_of_page
export const selectOpenModalAddKey = (state) => state.vertical.isOpen
export const selectKey = (state) => state.vertical.key
export const selectVerticalEdit = (state) => state.vertical.verEdit


export default verticalSlice.reducer;