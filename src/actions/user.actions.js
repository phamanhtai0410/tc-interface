import { createAsyncThunk } from "@reduxjs/toolkit";
import { UserService } from "services/user.service";


export const fetchCreateUser = async (dataReq) => {
  
    if (dataReq) {
      try {
            const response = await UserService.createUser(dataReq)
            const { data } = response;
            if (data) {
                return {
                    status: 'success',
                    message: '',
                }
            }

        } catch (err) {
            return {
                status: 'failed',
                message: err?.errors?.username || err?.errors[0]?.password || err?.msg || err.toString(),
            }
        }
  
    }
};


export const getListUsersAction = createAsyncThunk(
  "users/getListUsersAction",
  async (params, { dispatch, getState, rejectWithValue }) => {
      try {
        const response = await UserService.getListUsers({params})
        return response;
      } catch (err) {
        return rejectWithValue(err)
      }
    }
)



export const updateUserPassword = createAsyncThunk(
    "users/updateUserPassword",
    async (
      params,
      { dispatch, getState, rejectWithValue }
    ) => {
      try {
        const response = await UserService.updatePassword(params);
        return response.data;
      } catch (err) {
        return rejectWithValue(err);
      }
    }
  );

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (params, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await UserService.deleteUser(params)
      return response
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)
  //
export const getListFollowerWatch = createAsyncThunk(
  "user/getListFollowerWatch",
  async (params, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await UserService.followerWatch({ params })
      return response;
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)
export const addFollowerWatchUser = createAsyncThunk(
  "user/addFollowerWatchUser",
  async(params, {dispatch, getState, rejectWithValue}) =>{
    try{
      const response = await UserService.addFollowerWatch(params)
      return response
    }catch(err){
      return rejectWithValue(err)
    }
  }
)
export const deleteFollowerWatchUser = createAsyncThunk(
  "user/deleteFollowerWatchUser",
  async (params, {dispatch, getState, rejectWithValue}) =>{
    try{
      const response = await UserService.deleteFollowerWatch(params)
      return response
    }catch(err){
      return rejectWithValue(err)
    }
  }
)
export const addTakeNote = createAsyncThunk(
  "user/addTakeNote",
  async (params,{dispatch,getState,rejectWithValue})=>{
    try{
      const response = await UserService.addTakeNote(params)
      return response
    }catch(err){
      return rejectWithValue(err)
    }
  }
)