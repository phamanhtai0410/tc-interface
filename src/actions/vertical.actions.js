import { createAsyncThunk } from "@reduxjs/toolkit";
import { verticalService } from "services/vertical";


export const createVerticalGroup = createAsyncThunk(
    "vertical/createVerticalGroup",
    async (params, { dispatch, getState, rejectWithValue }) => {
        try {
          const response = await verticalService.createVertical(params)
          return response;
        } catch (err) {
          return rejectWithValue(err)
        }
      }
  )

  export const getListVerticalGroup = createAsyncThunk(
    "vertical/getListVerticalGroup",
    async (params, { dispatch, getState, rejectWithValue }) => {
        try {
          const response = await verticalService.getListVertical({params})
          return response;
        } catch (err) {
          return rejectWithValue(err)
        }
      }
  )

export const getListVerticalGroupById = createAsyncThunk(
    "vertical/getListVerticalGroupById",
    async (params, { dispatch, getState, rejectWithValue }) => {
        try {
          const response = await verticalService.getListVerticalById({params})
          return response;
        } catch (err) {
          return rejectWithValue(err)
        }
      }
  )
  
export const removeVertical = createAsyncThunk(
  "vertical/removeVertical",
  async (params, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await verticalService.removeVertical(params)
      return response;
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

export const updateVertical = createAsyncThunk(
  "vertical/updateVertical",
  async (params, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await verticalService.updateVertical(params)
      return response;
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)