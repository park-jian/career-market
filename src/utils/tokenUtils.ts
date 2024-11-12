// utils/tokenUtils.ts
// import Cookies from 'js-cookie';
import api from '../api/axiosConfig';

// export const TOKEN_CONFIG = {
//   ACCESS_TOKEN_EXPIRY: 5 * 60 * 1000, // 5분
//   REFRESH_TOKEN_EXPIRY: 14 * 24 * 60 * 60 * 1000, // 14일
// } as const;

// 토큰 관련 상태 관리
// let isRefreshing = false;
// let refreshSubscribers: ((token: string) => void)[] = [];
export const tokenUtils = {
  setTokens: (accessToken: string, refreshToken?: string) => {
    sessionStorage.setItem('access_token', accessToken);
    if (refreshToken) {
      sessionStorage.setItem('refresh_token', refreshToken);
    }
    console.log("set_access_token:", sessionStorage.getItem('access_token'));
    console.log("set_refresh_token:", sessionStorage.getItem('refresh_token'));
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  },

  clearTokens: () => {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    console.log("clear_access_token:", sessionStorage.getItem('access_token'));
    console.log("clear_refresh_token:", sessionStorage.getItem('refresh_token'));
    delete api.defaults.headers.common['Authorization'];
  },

  getAccessToken: () => sessionStorage.getItem('access_token'),
  getRefreshToken: () => sessionStorage.getItem('refresh_token'),
  // 새로 추가될 메서드들
  // onRefreshed: (token: string) => {
  //   refreshSubscribers.forEach(callback => callback(token));
  //   refreshSubscribers = [];
  // },

  // addRefreshSubscriber: (callback: (token: string) => void) => {
  //   refreshSubscribers.push(callback);
  // },

  // // access 토큰 재발급 로직
  // refreshToken: async () => {
  //   try {
  //     const refreshToken = tokenUtils.getRefreshToken();
  //     if (!refreshToken) return null;

  //     const response = await api.post('/api/v1/token/reissue', null, {
  //       withCredentials: true,
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Refresh-Token': refreshToken
  //       }
  //     });

  //     const newAccessToken = response.data.body.access_token;
  //     tokenUtils.setTokens(newAccessToken, refreshToken);
  //     return newAccessToken;
  //   } catch (error) {
  //     tokenUtils.clearTokens();
  //     if (window.location.pathname !== '/users/login') {
  //       window.location.href = '/users/login';
  //     }
  //     throw error;
  //   }
  // },

  // 토큰 재발급 상태 관리
  // isRefreshing: () => isRefreshing,
  // setRefreshing: (state: boolean) => {
  //   isRefreshing = state;
  // }
//   setTokens: (accessToken: string, refreshToken?: string) => {
//     // Cookies.set('access_token', accessToken, { 
//     //   path: '/', 
//     //   expires: new Date(new Date().getTime() + TOKEN_CONFIG.ACCESS_TOKEN_EXPIRY)
//     // });
//     // access token도 sessionStorage에 저장
//     sessionStorage.setItem('access_token', accessToken);
//     if (refreshToken) {
//     //   Cookies.set('refreshToken', refreshToken, { 
//     //     path: '/',
//     //     httpOnly: false,
//     //     // secure: true,    // HTTPS 사용시
//     //     sameSite: 'None', // CORS 요청 허용
//     //     expires: new Date(new Date().getTime() + TOKEN_CONFIG.REFRESH_TOKEN_EXPIRY)
//     //   });
//         if (refreshToken) {
//             sessionStorage.setItem('refresh_token', refreshToken);
//         }

//     }
//     // console.log("cookie-set_at:", Cookies.get('access_token'));
//     // console.log("cookie-set_rt:", Cookies.get('refreshToken'));
//     console.log("session-set_at:", sessionStorage.getItem('access_token'));
//     console.log("session-set_rt:", sessionStorage.getItem('refresh_token'));
//     api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
//   },

//   clearTokens: () => {
//     // Cookies.remove('access_token', { path: '/' });
//     // Cookies.remove('refreshToken', { path: '/' });
//     // console.log("clear_token_at:", Cookies.get('access_token'));
//     // console.log("clear_token_rt:", Cookies.get('refreshToken'));
//     sessionStorage.removeItem('access_token');
//     sessionStorage.removeItem('refresh_token');
//     console.log("clear_token_at:", sessionStorage.getItem('access_token'));
//     console.log("clear_token_rt:", sessionStorage.getItem('refresh_token'));
//     delete api.defaults.headers.common['Authorization'];
//   },

// //   getAccessToken: () => Cookies.get('access_token'),
// //   getRefreshToken: () => Cookies.get('refreshToken')
//     getAccessToken: () => sessionStorage.getItem('access_token'),
//     getRefreshToken: () => sessionStorage.getItem('refresh_token')
};

export default tokenUtils;