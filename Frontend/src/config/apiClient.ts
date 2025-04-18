import axios from "axios";
import queryClient from "./queryClient";
import { navigate } from "../lib/navigate";
import { UNAUTHORIZED } from "../constants/http";

const options = {
  baseURL: import.meta.env.VITE_REACT_APP_API,
  withCredentials: true,
};

const tokenRefreshClient = axios.create(options);
tokenRefreshClient.interceptors.response.use((response) => response.data);

const API = axios.create(options);

API.interceptors.response.use(
  (response) => {
    console.log(`response is : `,response);
    return response.data;
  },
  async (error) => {
    console.log(`the error is `, error);
    const { config, response } = error;
    const { status, data } = response || {};


    if (data.errorCode === "InvalidAccessToken" && status === UNAUTHORIZED) {
      try {
        await tokenRefreshClient.get("/api/v1/auth/refresh");
        return tokenRefreshClient(config);
      } catch (error) {
        queryClient.clear();
        navigate("/login", {
          state: window.location.pathname,
        });
      }
    }
    return Promise.reject({ status, ...data });
  }
);

export default API;
