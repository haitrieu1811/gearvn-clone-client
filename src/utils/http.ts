import axios, { AxiosInstance } from 'axios';

class Http {
  instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: process.env.BACKEND_BASE_URL
    });
  }
}

const http = new Http();
export default http;
