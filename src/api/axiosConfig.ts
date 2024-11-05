import { tokenUtils } from './../utils/tokenUtils';
import axios from 'axios';
// import Cookies from 'js-cookie';

const api = axios.create({
  //baseURL: 'http://43.201.73.11:8080',
  baseURL: process.env.NODE_ENV === 'production' 
    ? '/api'
    : 'http://43.201.73.11:8080',
  withCredentials: true
});
// 토큰 관련 상태 관리
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// 토큰 재발급 대기 중인 요청들을 처리하는 함수
const onRefreshed = (token: string) => {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
};

// 토큰 재발급 요청을 구독
const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// Request 인터셉터 - 최신 access token을 저장
api.interceptors.request.use(
  (config) => {
    const token = tokenUtils.getAccessToken();
    console.log("axiosConfig_getActoken:", token)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response 인터셉터
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 토큰 재발급 요청 자체가 실패한 경우
    if (originalRequest.url?.includes('/api/v1/token/reissue')) {
      tokenUtils.clearTokens();
      window.location.href = '/users/login';
      return Promise.reject(error);
    }

    // 401 에러이고 재시도하지 않은 요청인 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // 토큰 재발급 중인 경우, 대기열에 추가
        return new Promise(resolve => {
          addRefreshSubscriber(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {//access token 재발급
        //console.log("refresh_token:", Cookies.get('refreshToken'));
        // refresh token을 sessionStorage에서 가져오기
        const refreshToken = tokenUtils.getRefreshToken();
        console.log("refresh_token:", refreshToken);
        const response = await api.post('/api/v1/token/reissue', null, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Refresh-Token': refreshToken
          }
        });
        console.log("response:", response);
        const newToken = response.data.body.access_token;
        //tokenUtils.setTokens(newToken);기존
        // refresh token 유지하면서 access token만 업데이트
        tokenUtils.setTokens(newToken, refreshToken || undefined);

        // 헤더 업데이트
        // api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        // originalRequest.headers.Authorization = `Bearer ${newToken}`;

        // 대기 중인 요청들 처리
        onRefreshed(newToken);
        isRefreshing = false;

        // 원래 요청 재시도
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        tokenUtils.clearTokens();
        if (window.location.pathname !== '/users/login') {
          window.location.href = '/users/login';
        }
        return Promise.reject(refreshError);
      }
    } else if (error.response?.status === 404) {
      const errorData = error.response.data;
      if (errorData?.result?.result_code === 5404) {
        // 에러 메시지를 포함하여 reject
        return Promise.reject({
          status: 404,
          code: errorData.result.result_code,
          message: errorData.result.result_message || '요청하신 리소스를 찾을 수 없습니다.'
        });
      }
    }
    return Promise.reject(error);
  }
);

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export const getAuthToken = () => {
  // return Cookies.get('access_token');
  return sessionStorage.getItem('access_token');
};

export default api;