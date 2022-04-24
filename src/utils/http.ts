import axios, { AxiosRequestConfig } from "axios";

const defaultHost = "http://192.168.3.39:3334";

interface IHttpConfig extends AxiosRequestConfig {
    host?: string,
    body?: any,
}

axios.interceptors.request.use((req) => {
    return req;
})
axios.interceptors.response.use((res) => {
    if (res.status === 200) {
        if (res.data.result) {
            res.data = res.data.result;
        }
        return res;
    } else {
        console.log('fail', res);
    }
})

const http = {
    get: async <T>(url: string, config?: IHttpConfig): Promise<T> => {
        const result = await axios.get(`${config?.host || defaultHost}${url}`, config);
        return <T>result.data;
    },
    post: async (url: string, config?: IHttpConfig) => {
        const result = await axios.post(`${config?.host || defaultHost}${url}`, config?.body, config);
        return result.data;
    },
    put: async (url: string, config?: IHttpConfig) => {
        const result = await axios.put(`${config?.host || defaultHost}${url}`, config?.body, config);
        return result.data;
    },
    delete: async (url: string, config?: IHttpConfig) => {
        const result = await axios.delete(`${config?.host || defaultHost}${url}`, config);
        return result.data;
    }
}

export default http;