import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    excluded:[]
}


export const excludedSlice = createSlice({
    name: 'excluded',
    initialState: initialState,
    reducers: {
        //add ỏr remove
        actionExcluded: (state, action) => {
            let UpdateExcluded = [...state.excluded];
            const { user } = action.payload;
            
            let index = UpdateExcluded.findIndex(item => item.id === user.id);
            if (index !== -1) { 
                UpdateExcluded.splice(index, 1);
            } else {
                UpdateExcluded.push(user);
            }
            state.excluded = UpdateExcluded;
        },
    },
    extraReducers: (builder) => {
       
    }
})

export const { actionExcluded } = excludedSlice.actions;
export const selectExcluded = (state) => state.excluded;
export default excludedSlice.reducer;