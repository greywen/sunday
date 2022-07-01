import { getAuthUrl } from '@apis/auth';
import axios, { AxiosRequestConfig } from 'axios';
import { ACCOUNT_INFO } from '../constants';
import { useAccount } from './utils';

const defaultHost = process.env.API_URL;
const account = useAccount();

interface IHttpConfig extends AxiosRequestConfig {
  host?: string;
  body?: any;
}

axios.interceptors.request.use((req) => {
  req.headers = {
    ...req.headers,
    Authorization: `Bearer ${account.token}`,
  };
  return req;
});

axios.interceptors.response.use(
  async (res) => {
    if (res.status === 200 || res.status === 201) {
      if (res.data.result) {
        res.data = res.data.result;
      }
      return res;
    } else if (res.status === 401) {
      localStorage.removeItem(ACCOUNT_INFO);
      const url = await getAuthUrl();
      location.assign(url);
    } else {
      console.log('failed', res);
    }
  },
  async (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem(ACCOUNT_INFO);
      const url = await getAuthUrl();
      location.assign(url);
    }
  }
);

const http = {
  get: async <T>(url: string, config?: IHttpConfig): Promise<T> => {
    const result = await axios.get(
      `${config?.host || defaultHost}${url}`,
      config
    );
    return <T>result.data;
  },
  post: async <T>(url: string, config?: IHttpConfig): Promise<T> => {
    const result = await axios.post(
      `${config?.host || defaultHost}${url}`,
      config?.body,
      config
    );
    console.log(result);
    
    return <T>result.data;
  },
  put: async (url: string, config?: IHttpConfig) => {
    const result = await axios.put(
      `${config?.host || defaultHost}${url}`,
      config?.body,
      config
    );    
    return result.data;
  },
  delete: async (url: string, config?: IHttpConfig) => {
    const result = await axios.delete(
      `${config?.host || defaultHost}${url}`,
      config
    );
    return result.data;
  },
};

export default http;
