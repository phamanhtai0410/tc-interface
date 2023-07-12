import axiosClient from "./axiosClient"

const route = "/admin";

export const followerService = {
    
    // createVertical: (params) => {
    //     return axiosClient.post(`${route}/vertical_keyword_group`, params ) 
    // },
    getListFollower: (params) => {
        return axiosClient.get(`${route}/follower_group`,params)
    },
    createFollowerGroup: (params) => {
        return axiosClient.post(`${route}/follower_group`,params)
    },
    removeFollowerGroup: (params) => {
        return axiosClient.delete(`${route}/follower_group/${params}`)
    },
    updateFollowerGroup: (params) => {
        return axiosClient.put(`${route}/follower_group/${params.id}`, params)
    },
    getListFollowerById: (params) => {
        return axiosClient.get(`${route}/follower_group`,params)
    },

}
