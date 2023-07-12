import { createSlice } from "@reduxjs/toolkit";
import { fetchDetailAnalytic, fetchResultAnalytic } from "actions/analytic.actions";


const analyticDetailSlice = createSlice({
  name: "analytic-detail",
  _id: '',
  analytics: {},
  initialState: {
    loading: false,
    items: [],
    num_of_page:0,
  },


  reducers: {
    setTabId: (state,action)=>{
      state._id = action.payload
    },
    setAnalyticId: (state,action)=>{
      state.analytics = action.payload
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(fetchResultAnalytic.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchResultAnalytic.fulfilled, (state, action) => {        
        state.items = action.payload.items;
        state.num_of_page = action.payload.num_of_page,
        state.loading = false;
      })
      .addCase(fetchResultAnalytic.rejected, (state, action) => {
        state.storeLists = [];
        state.loading = false;
      })
});

export default analyticDetailSlice.reducer;

export const {setTabId, setAnalyticId} =
  analyticDetailSlice.actions;

export const selectDetailAnalytic = (state) => state.analytic_detail || [];
export const selectIdTab = (state) => state.analytic_detail._id || '';
export const selectIdAnalytic = (state) => state.analytic_detail.analytics || ''
export const selectNumOfPage = (state) =>  state.analytic_detail.num_of_page || 0
