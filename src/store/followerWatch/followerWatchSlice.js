import { createSlice } from "@reduxjs/toolkit"
import { getListFollowerWatch } from "actions/user.actions";


const initialState = {

    followerWatch: {
        num_of_page: 0,
        listFollowerWatch: []
    }
    
}

export const followerWatchSlice = createSlice({
    name: 'followerWatch',
    initialState: initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(getListFollowerWatch.fulfilled, (state, action) => {
            state.followerWatch.num_of_page = action.payload.data.num_of_page;
            state.followerWatch.listFollowerWatch = action.payload.data.items
        })
    }
})

export const selectFollowerWatch = (state) => state.followerWatch;


export default followerWatchSlice.reducer;