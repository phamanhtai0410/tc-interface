
import axiosClient from "./axiosClient"

const route = "/analytics"
const routeRun = "/analytics/vertical/run"


export const AnalyticService = {
    
    getAnalyticVertical: (params) => {
        return axiosClient.get(`${route}/vertical/run`, params ) 
    },
    getListMetadata: (params) =>{
        return axiosClient.get(`${route}/vertical`,params)
    },
    run: (params) =>{
        return axiosClient.post(`${route}/vertical`,params)
    },

    update: (params) =>{
        return axiosClient.put(`${route}/vertical/${params.id}`,params)
    },

    remove: (params) => {
        return axiosClient.delete(`${route}/vertical/${params}`)
    },
    //  Run Analytics Vertical Metadata
    runAnalyticsVertical: (params) =>{
        return axiosClient.post(`${routeRun}/${params._id}`)
    },

    detailAnalitic: (params) => {
        return axiosClient.get(`${route}/vertical/result`, params ) 
    },

    exportAnalitic: (params) => {
        return axiosClient.get(`${route}/vertical/result/export`, params ) 
    },

    resultAnalitic: (params) => {
        return axiosClient.get(`https://tc-api.esollabs.com/v1/tool/score`, params ) 
    },
}
