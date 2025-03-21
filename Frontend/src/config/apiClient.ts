import axios from "axios";

const options = {
  baseURL: import.meta.env.VITE_REACT_APP_API,
  withCredentials: true,
};

axios.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const { status, data } = error.response;
    return Promise.reject({ status, ...data });
  }
);

const API = axios.create(options);

export default API;
