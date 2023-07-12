import { createAsyncThunk } from "@reduxjs/toolkit";
import { AnalyticService } from "services/analytic.service";

export const fetchListAnalytic = createAsyncThunk(
    'analytics/fetchListAnalytic',
    async (params) => {
        const response = await AnalyticService.getAnalyticVertical({
            params
        })
        return response.data
    }
)

export const fetchListMetadataAnalytics = createAsyncThunk(
    'analytics/fetchListMetadataAnalytics',
    async (params) => {
        const response = await AnalyticService.getListMetadata({params});
        return response.data;
    }
)

export const runAnalytics = async (dataReq) => {
  
    if (dataReq) {
      try {
        const response = await AnalyticService.run(dataReq)
            const { data, error_code} = response;
            if (error_code === '') {
                
                return {
                    _id: data?._id , 
                    message: '',
                }
            }
        } catch (err) {
            return {
                status: 'failed',
                message: err?.msg || err.toString(),
            }
        }
    }
};

export const updateAnalytics = async (dataReq) => {
  
    if (dataReq) {
        try {
            const response = await AnalyticService.update(dataReq)
            const { data, error_code} = response;
            if (error_code === '') {
                return {
                    status: 'true' , 
                    message: '',
                }
            }
            } catch (err) {
                return {
                    status: 'failed',
                    message: err?.msg || err.toString(),
                }
            }
    }
};

export const removeAnalytic = createAsyncThunk(
    "analytics/removeAnalytic",
    async (params, { dispatch, getState, rejectWithValue }) => {
      try {
        const response = await AnalyticService.remove(params)
        return response;
      } catch (err) {
        return rejectWithValue(err)
      }
    }
  )

//  Run Analytics Vertical Metadata

export const runAnalyticsVerticalAction = createAsyncThunk(
    "analytics/runAnalyticsVerticalAction",
    async (params, { dispatch, getState, rejectWithValue }) => {
        try {
          const response = await AnalyticService.runAnalyticsVertical(params)
          return response.data;
        } catch (err) {
          return rejectWithValue(err)
        }
      }
  )


export const fetchDetailAnalytic = createAsyncThunk(
    'analytics/fetchDetailAnalytic',
    async (params) => {
        const response = await AnalyticService.detailAnalitic({
            params
        })
       
        return response.data
    }
)

export const exportDetailAnalytic = async (params) => {
  
    if (params) {
      try {
            await AnalyticService.exportAnalitic({params})

        } catch (err) {
            return {
                status: 'failed',
                message: err?.msg || err.toString(),
            }
        }
  
    }
};

export const fetchResultAnalytic = createAsyncThunk(
    'analytics/fetchResultAnalytic',
    async (params) => {
        const response = await AnalyticService.resultAnalitic({
            params
        })
       
        return response.data
    }
)

