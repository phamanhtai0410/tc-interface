import axiosClient from "./axiosClient";


const route = "/auth";

export const authService = {
  login: (params) => {
    return axiosClient.post(`${route}/login`, params);
  },
  getRole: (params) => { 
    return axiosClient.get(`${route}/me`) 
  }
};
