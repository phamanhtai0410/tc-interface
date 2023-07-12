import axios from 'axios';
import appConfig from 'configs/app.config';
import { LocalStorageService } from 'helpers';

const defaultHeader = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
  'Accept': 'application/json',
}

// for multiple requests
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  })
  
  failedQueue = [];
}

const baseURL = appConfig.apiPrefix

const axiosClient = axios.create({
  baseURL:baseURL,
  // withCredentials: true,
  // headers: defaultHeader,
});

// Add a request interceptor
axiosClient.interceptors.request.use(
  config => {

      const token = LocalStorageService.getAccessToken();
      if (token) {
          config.headers['Authorization'] = 'Bearer ' + token;
      }

      return config;

  },error => {
      Promise.reject(error)
  });

//Add a response interceptor
axiosClient.interceptors.response.use( (response) => {
 return handleResponse(response)
}, (error) => {
  
  const originalRequest = error.config;

  if (error.response.status === 401 && !originalRequest._retry) {

      console.log("HET^! TOKEN ")
         
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({resolve, reject})
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return axiosClient.request(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        })
      }

      originalRequest._retry = true;
      isRefreshing = true;

  }

  return Promise.reject(handleError(error)) ;

});


const handleResponse = (res) =>{

  if (res && res.data) {
    return res.data;
  }

  return res;

}

const handleError = (error)  => {

  const { data } = error.response;

  if( data && (data.error_code === "USER_LOCKED_USING") ){
    clearAuthToken()
  }

  return data;

}

const clearAuthToken = () =>{
  LocalStorageService.clearToken();
  window.location.reload();  
}

export default axiosClient;