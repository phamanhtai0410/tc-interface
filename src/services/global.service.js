import axiosClient from "./axiosClient"

const route = "/admin";

export const globalService = {
    
    createGlobal: (params) => {
        return axiosClient.put(`${route}/global_setting`, params )
    },

    getGlobal: (params) => {
        return axiosClient.get(`${route}/global_setting`, params )
    },
}