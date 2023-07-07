import axios, { AxiosInstance } from 'axios';

import { URL_LOGIN, URL_LOGOUT, URL_REGISTER } from 'src/apis/auth.api';
import CONFIG from 'src/constants/config';
import { AuthResponse } from 'src/types/auth.type';
import { User } from 'src/types/user.type';
import {
  clearAuthFromLS,
  getAccessTokenFromLS,
  getRefreshTokenFromLS,
  setAccessTokenToLS,
  setProfileToLS,
  setRefreshTokenToLS
} from './auth';

class Http {
  instance: AxiosInstance;
  private accessToken: string;
  private refreshToken: string;
  // private refreshTokenRequest: Promise<string> | null;
  private profile: User | null;

  constructor() {
    this.accessToken = getAccessTokenFromLS();
    this.refreshToken = getRefreshTokenFromLS();
    // this.refreshTokenRequest = null;
    this.profile = null;
    this.instance = axios.create({
      baseURL: CONFIG.BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.instance.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config;
        if (url === URL_LOGIN || url === URL_REGISTER) {
          this.accessToken = (response.data as AuthResponse).data.access_token;
          this.refreshToken = (response.data as AuthResponse).data.refresh_token;
          this.profile = (response.data as AuthResponse).data.user;
          setAccessTokenToLS(this.accessToken);
          setRefreshTokenToLS(this.refreshToken);
          setProfileToLS(this.profile);
        } else if (url === URL_LOGOUT) {
          clearAuthFromLS();
        }
        return response;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }
}

const http = new Http().instance;
export default http;
