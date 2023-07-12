import axiosClient from "./axiosClient"

const route = "/admin";

export const UserService = {
    
    createUser: (params) => {
        return axiosClient.post(`${route}/users`, params ) 
    },
    getListUsers: (params) => {
        return axiosClient.get(`${route}/users`,params)
    },
    updatePassword: (params) => {
        return axiosClient.put(`${route}/users/${params.id}`,params)
    },
    //follower watch
    followerWatch: (params) => {
        return axiosClient.get(`${route}/follower_watch`, params)
    }
}
