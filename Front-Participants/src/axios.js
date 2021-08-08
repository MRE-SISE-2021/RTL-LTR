import axios from "axios";
// import { Cookies } from "react-cookie";
import inMemoryToken from "./inMemoryToken";

const baseURL = "http://127.0.0.1:8000/";
// const baseURL = "http://34.71.248.148:8000/";
// const cookies = new Cookies();

const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 15000,

  headers: {
    Authorization: inMemoryToken.getToken()
      ? "JWT " + inMemoryToken.getToken()
      : null,
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    // debugger
    if (typeof error.response === "undefined") {
      alert(error.message);
      return Promise.reject(error);
    }

    if (
      error.response.status === 401 &&
      originalRequest.url === baseURL + "token/refresh/"
    ) {
      window.location.href = "/";
      return Promise.reject(error);
    }

    // if (
    //   // error.response.data.code === 'token_not_valid' &&
    //   error.response.status === 401 &&
    //   error.response.statusText === "Unauthorized"
    //   // cookies.get("refresh_token") !== "undefined"
    // ) {
    // const refreshToken = cookies.get("refresh_token");

    //   if (refreshToken) {
    //     const tokenParts = JSON.parse(atob(refreshToken.split(".")[1]));

    //     // exp date in token is expressed in seconds, while now() returns milliseconds:
    //     const now = Math.ceil(Date.now() / 1000);
    //     //console.log(tokenParts.exp);

    //     if (tokenParts.exp > now) {
    //       return axiosInstance
    //         .post("/token/refresh/", { refresh: refreshToken })
    //         .then((response) => {
    //           //console.log(response)

    //           //cookies.set('access_token', response.data.access);
    //           // cookies.set('refresh_token', response.data.refresh);
    //           inMemoryToken.token = response.data.access;
    //           axiosInstance.defaults.headers["Authorization"] =
    //             "JWT " + response.data.access;
    //           originalRequest.headers["Authorization"] =
    //             "JWT " + response.data.access;

    //           return axiosInstance(originalRequest);
    //         })
    //         .catch((err) => {
    //           console.log(err);
    //         });
    //     } else {
    //       console.log("Refresh token is expired", tokenParts.exp, now);
    //       window.location.href = "/";
    //     }
    //   } else {
    //     console.log("Refresh token not available.");
    //     window.location.href = "/";
    //   }
    // } else {
    //   console.log(error);
    //   //window.location.href = '/';
    // }

    // specific error handling done elsewhere
    return Promise.reject(error);
  }
);

export default axiosInstance;
