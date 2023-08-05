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
    deleteUser: (params) => { 
        return axiosClient.delete(`${route}/users/${params.id}`,params)
    },
    //follower watch
    followerWatch: (params) => {
        return axiosClient.get(`${route}/follower_watch`, params)
    },
    addFollowerWatch:(params) =>{
        return axiosClient.post(`${route}/favourite_account/${params.username}`, params)
    },
    deleteFollowerWatch:(params)=>{
        return axiosClient.delete(`${route}/favourite_account/${params.username}`, params)
    },
    addTakeNote:(params)=>{
        return axiosClient.put(`/analytics/vertical/accounts_filtered/note`, params)
    }
}
