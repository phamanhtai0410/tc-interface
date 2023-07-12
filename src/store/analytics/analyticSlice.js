import { createSlice } from "@reduxjs/toolkit";
import { fetchListAnalytic, fetchListMetadataAnalytics } from "actions/analytic.actions";

export const initialTableData = {
    
    page: 0,
    page_size: 10,
    num_of_page: 0,
};

export const initialFilterData = {
  name: "",
};

export const initialMetadata = {
  num_of_page:0,
  isOpen:false,
  vertical_name:"",
  row: {}
}



const analyticSlice = createSlice({
  name: "analytic",
  initialState: {
    loading: false,
    items: [],
    num_of_page:0,
    tableData: initialTableData,
    filterData: initialFilterData,
    metadata:initialMetadata,
  },
  reducers: {
    updateAnalyticList: (state, action) => {
      state.storeLists = action.payload;
    },
    setTableData: (state, action) => {
      state.tableData = action.payload;
    },
    setFilterData: (state, action) => {
      state.filterData = action.payload;
    },
    setChangeModalDeleteMetadata: (state, action) => {

      state.metadata.isOpen = action.payload.isOpen;
      state.metadata.row = action.payload.row;
      state.metadata.vertical_name = action.payload.vertical_name
    }
  },
  extraReducers: (builder) =>
    builder
      .addCase(fetchListAnalytic.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchListAnalytic.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.num_of_page = action.payload.num_of_page;
        state.loading = false;
      })
      .addCase(fetchListAnalytic.rejected, (state, action) => {
        state.storeLists = [];
        state.loading = false;
      })
      .addCase(fetchListMetadataAnalytics.fulfilled,(state,action) => {
        state.metadata.num_of_page = action.payload.num_of_page
      })
});

export default analyticSlice.reducer;

export const { updateAnalyticList, setTableData, setFilterData,setChangeModalDeleteMetadata } =
  analyticSlice.actions;

export const selectListAnalytic = (state) => state.analytic || [];
export const selectTableData = (state) => state.analytic.tableData || [];
export const selectFilterData = (state) => state.analytic.filterData || [];
export const selectMetaData = (state) => state.analytic.metadata;
export const selectOpenMetaData = (state) => state.analytic.metadata.isOpen;
export const selectDataRemove = (state) => state.analytic.metadata.row;


