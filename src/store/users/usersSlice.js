import { createSlice } from "@reduxjs/toolkit"
import { getListUsersAction } from "actions/user.actions";




const initialState ={
    num_of_page: 0,
    listUser:[]
}

export const userSlice = createSlice({
    name:'users',
    initialState:initialState,
    reducers:{
       
    },
    extraReducers: (builder) => {
        
        builder.addCase(getListUsersAction.fulfilled,(state,action)=>{
            state.num_of_page = action.payload.data.num_of_page;
            state.listUser = action.payload.data.items;
        })
    }
})

// export const {setGroupKeywords} = verticalSlice.actions;
export const selectNumPagesUsers = (state) => state.users.num_of_page
export const selectUsers = (state) => state.users.listUser

export default userSlice.reducer;