import { createAsyncThunk } from "@reduxjs/toolkit";
import { globalService } from "services/global.service";


export const createGlobalAnalytic = createAsyncThunk(
    "global/createGlobalAnalytic",
    async (params, { dispatch, getState, rejectWithValue }) => {
        try {
            const response = await globalService.createGlobal(params)
            return response;
        } catch (err) {
            return rejectWithValue(err)
        }
      }
  )


export const fetchGlobalAnalytic = createAsyncThunk(
    "global/fetchGlobalAnalytic",
    async (params, { dispatch, getState, rejectWithValue }) => {
        try {
            const response = await globalService.getGlobal(params)
            return response;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

