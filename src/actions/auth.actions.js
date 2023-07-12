import { createAsyncThunk } from "@reduxjs/toolkit";
import { LocalStorageService } from "helpers";
import { authService } from "services/auth.service";


export const authLogin = async (dataReq) => {
  
    if (dataReq) {
      try {
        const response = await authService.login(dataReq)

            const { data } = response;

            if (data && data.access_token) {
                LocalStorageService.setToken(data)
                
                return {
                    status: 'success',
                    message: '',
                }
            }
        } catch (err) {
            console.log('errors.response. msg', err)
            return {
                status: 'failed',
                message: err?.msg || errors.toString(),
            }
        }
  
    }
};

export const getMeRole = createAsyncThunk(
    "auth/getMeRole",
    async (params, { dispatch, getState, rejectWithValue }) => {
        try {
            const response = await authService.getRole(params)
            return response;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)