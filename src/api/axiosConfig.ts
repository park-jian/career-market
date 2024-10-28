import axios from 'axios';
const api = axios.create({
  // baseURL: 'http://13.125.34.240:8080'
  baseURL: 'http://43.201.73.11:8080'
  
});
let authToken: string | null = null;
export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};
export const getAuthToken = (): string | null => {
  return authToken;
};
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//       if (error.response?.status === 401 && error.config && !error.config.__isRetryRequest) {
//           try {
//               const response = await api.post('/api/v1/token/reissue', null, {
//                   withCredentials: true,
//               });
//               setAuthToken(response.data.accessToken);
//               error.config.headers['Authorization'] = `Bearer ${response.data.accessToken}`;
//               error.config.__isRetryRequest = true;
//               return api(error.config);
//           } catch (refreshError) {
//               // useQueryClient hook을 직접 사용할 수 없으므로 다른 방식으로 처리
//               setAuthToken(null);
//               window.location.href = '/users/login';  // 또는 다른 방식의 리다이렉트
//               return Promise.reject(refreshError);
//           }
//       }
//       return Promise.reject(error);
//   }
// );
export default api;