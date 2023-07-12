import { createAsyncThunk } from "@reduxjs/toolkit";
import { followerService } from "services/follower.service";

export const createFollowerGroup = createAsyncThunk(
    "follower/createFollowerGroup",
    async (params, { dispatch, getState, rejectWithValue }) => {
        try {
          const response = await followerService.createFollowerGroup(params)
          return response;
        } catch (err) {
          return rejectWithValue(err)
        }
      }
  )

  export const getListFollowerGroup = createAsyncThunk(
    "follower/getListFollowerGroup",
    async (params, { dispatch, getState, rejectWithValue }) => {
        try {
          const response = await followerService.getListFollower({params})
          return response;
        } catch (err) {
          return rejectWithValue(err)
        }
      }
  )

// export const getListVerticalGroupById = createAsyncThunk(
//     "vertical/getListVerticalGroupById",
//     async (params, { dispatch, getState, rejectWithValue }) => {
//         try {
//           const response = await verticalService.getListVerticalById({params})
//           return response;
//         } catch (err) {
//           return rejectWithValue(err)
//         }
//       }
//   )
  
export const removeFollower = createAsyncThunk(
  "follower/removeFollower",
  async (params, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await followerService.removeFollowerGroup(params)
      return response;
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

export const updateFollower = createAsyncThunk(
  "follower/updateFollower",
  async (params, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await followerService.updateFollowerGroup(params)
      return response;
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)


export const getListFollowerGroupById = createAsyncThunk(
  "vertical/getListFollowerGroupById",
  async (params, { dispatch, getState, rejectWithValue }) => {
      try {
        const response = await followerService.getListFollowerById({params})
        return response;
      } catch (err) {
        return rejectWithValue(err)
      }
    }
)