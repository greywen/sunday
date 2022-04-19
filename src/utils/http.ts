import axios, { AxiosRequestConfig } from "axios";

const host = "http://192.168.3.110:3334";

const http = {
    get: async (url: string, data?: AxiosRequestConfig) => {
        const result = await axios.get(`${host}${url}`, data);
        return result.data;
    },
    post: async (url: string, data?: any, config?: AxiosRequestConfig) => {
        const result = await axios.post(`${host}${url}`, data, config);
        return result.data;
    },
    put: async (url: string, data?: any, config?: AxiosRequestConfig) => {
        const result = await axios.put(`${host}${url}`, data, config);
        return result.data;
    }
}

export default http;