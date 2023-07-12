import { getMeRole } from "actions/auth.actions";

const { createSlice } = require("@reduxjs/toolkit")

const initialState = {
    userRole: {}
}

const roleSlice = createSlice({
    name: "role",
    initialState: initialState,
    reducers: {
        // setRoleUser: (state, action) => {
        //     console.log(action.payload);
        //     state.userRole = action.payload.role;
        // }
    },
    extraReducers: (builder) => {
        builder.addCase(getMeRole.fulfilled, (state, action) => {
            state.userRole = action.payload.data;
        })
    }
})

export const { setRoleUser } = roleSlice.actions;
export const selectUserRole = (state) => state.role.userRole;
export default roleSlice.reducer;