import axiosClient from "./axiosClient"

const route = "/admin";

export const verticalService = {
    
    createVertical: (params) => {
        return axiosClient.post(`${route}/vertical_keyword_group`, params ) 
    },
    getListVertical: (params) => {
        return axiosClient.get(`${route}/vertical_keyword_group`,params)
    },
    getListVerticalById: (params) => {
        return axiosClient.get(`${route}/vertical_keyword_group`,params)
    },
    removeVertical: (params) => {
        return axiosClient.delete(`${route}/vertical_keyword_group/${params}`)
    },
    updateVertical: (params) => {
        return axiosClient.put(`${route}/vertical_keyword_group/${params.id}`, params)
    }
    // getListUsers: (params) => {
    //     return axiosClient.get(`${route}/users?page=${params.page}&page_size=${params.page_size}`)
    // },
    // updatePassword: (params) => {
    //     return axiosClient.put(`${route}/users/${params.id}`,params)
    // }

}
