import axios, { InternalAxiosRequestConfig } from 'axios';

const BASE_URL = axios.create({
  baseURL: 'https://api.hellofit.site',
});

BASE_URL.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    if (config.headers['exclude-access-token']) {
      delete config.headers['exclude-access-token'];
      return config;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default BASE_URL;
