import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

import { URL_LOGIN, URL_LOGOUT, URL_REFRESH_TOKEN, URL_REGISTER } from 'src/apis/auth.api';
import CONFIG from 'src/constants/config';
import { AuthResponse, RefreshTokenResponse } from 'src/types/auth.type';
import { User } from 'src/types/user.type';
import {
  clearAuthFromLS,
  getAccessTokenFromLS,
  getRefreshTokenFromLS,
  setAccessTokenToLS,
  setProfileToLS,
  setRefreshTokenToLS
} from './auth';
import { isExpiredTokenError, isUnauthorizedError } from './utils';

class Http {
  instance: AxiosInstance;
  private accessToken: string;
  private refreshToken: string;
  private refreshTokenRequest: Promise<string> | null;
  private profile: User | null;

  constructor() {
    this.accessToken = getAccessTokenFromLS();
    this.refreshToken = getRefreshTokenFromLS();
    this.refreshTokenRequest = null;
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
        if (this.accessToken && config.headers) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }
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
      async (error) => {
        // Xử lý lỗi 401
        if (isUnauthorizedError(error)) {
          const config = error.response?.config || ({ headers: {} } as InternalAxiosRequestConfig);
          const { url } = config;
          // Xử lý khi hết hạn token
          if (isExpiredTokenError(error) && url !== URL_REFRESH_TOKEN) {
            this.refreshTokenRequest = this.refreshTokenRequest
              ? this.refreshTokenRequest
              : this.handleRefreshToken().finally(() => {
                  setTimeout(() => {
                    this.refreshTokenRequest = null;
                  }, 10000);
                });
            return this.refreshTokenRequest.then((access_token) => {
              config.headers.Authorization = `Bearer ${access_token}`;
              // Tiếp tục request cũ nếu bị lỗi
              return this.instance({
                ...config,
                headers: {
                  ...config.headers,
                  Authorization: `Bearer ${access_token}`
                }
              });
            });
          }
          clearAuthFromLS();
          this.accessToken = '';
          this.refreshToken = '';
          this.profile = null;
        }
        return Promise.reject(error);
      }
    );
  }

  private handleRefreshToken = async () => {
    return this.instance
      .post<RefreshTokenResponse>(URL_REFRESH_TOKEN, { refresh_token: this.refreshToken })
      .then((res) => {
        const { access_token, refresh_token } = res.data.data;
        setAccessTokenToLS(access_token);
        setRefreshTokenToLS(refresh_token);
        this.accessToken = access_token;
        return access_token;
      })
      .catch((error) => {
        clearAuthFromLS();
        this.accessToken = '';
        this.refreshToken = '';
        throw error;
      });
  };
}

const http = new Http().instance;
export default http;
