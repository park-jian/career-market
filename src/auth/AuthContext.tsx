import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import api, { setAuthToken, getAuthToken  } from '../api/axiosConfig';
import axios, { AxiosError } from 'axios';
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  isAuthenticated: boolean;
  userId: number | null;
  login: (email: string, password: string) => Promise<number>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const checkAuthStatus = async () => {
    try {
      const response = await api.post('/api/v1/token/reissue', null, {
        withCredentials: true,
      });
      console.log("reissue:", response)
      setIsAuthenticated(true);
      setUserId(response.data.userId);
      setAuthToken(response.data.accessToken);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setIsAuthenticated(false);
        setUserId(null);
        setAuthToken(null);
      } else {
        console.error('Failed to check auth status:', error);
      }
    } finally {
      setIsLoading(false);
    }
   };

  useEffect(() => {
    console.log("useEffect triggered");  // 추가
    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string): Promise<number> => {
    try {
      const response = await api.post('/open-api/v1/users/login', { email, password }, {
        withCredentials: true,
      });
      //debugger;
      const { result_code, result_message } = response.data.result;
      const { user_id, access_token } = response.data.body;
      
      if (result_code === 200) {
        setIsAuthenticated(true);
        setUserId(user_id);
        setAuthToken(access_token);
        navigate('/');
      } else {
        setIsAuthenticated(false);
        alert(result_message || 'email 또는 비밀번호가 일치하지 않습니다.');
      }
      return result_code;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ result: { result_code: number; result_message: string } }>;
        if (axiosError.response?.data) {
          const { result_code, result_message } = axiosError.response.data.result;
          alert(result_message || 'email 또는 비밀번호가 일치하지 않습니다.');
          return result_code;
        }
      }
      alert('로그인 중 오류가 발생했습니다.');
      return 500;
    }
  };

  const logout = async () => {
    try {
      await api.post('/api/v1/auth/logout', {}, { withCredentials: true });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsAuthenticated(false);
      setUserId(null);
      setAuthToken(null);
      navigate('/users/login');
    }
  };
  useEffect(() => {
    let isRefreshing = false;
    let refreshSubscribers: ((token: string) => void)[] = [];

    const onRefreshed = (token: string) => {
      refreshSubscribers.forEach(callback => callback(token));
      refreshSubscribers = [];
    };

    const subscribeTokenRefresh = (cb: (token: string) => void) => {
      refreshSubscribers.push(cb);
    };
    // axios 요청 인터셉터 추가
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        const token = getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        // 모든 요청에 credentials 포함
        config.withCredentials = true;
        return config;
      },
      (error) => Promise.reject(error)
    );

    // axios 응답 인터셉터 추가
    const responseInterceptor = api.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;

        // 토큰 재발급 요청 자체가 실패한 경우
        if (originalRequest.url?.includes('/api/v1/token/reissue')) {
          setIsAuthenticated(false);
          setUserId(null);
          setAuthToken(null);
          if (window.location.pathname !== '/users/login') {
            navigate('/users/login');
          }
          return Promise.reject(error);
        }

        // 401 에러이고 재시도하지 않은 요청인 경우
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (isRefreshing) {
            // 토큰 재발급 중인 경우, 대기열에 추가
            return new Promise(resolve => {
              subscribeTokenRefresh(token => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                resolve(api(originalRequest));
              });
            });
          }

          originalRequest._retry = true;
          isRefreshing = true;

          try {//debugger;
            const response = await api.post('/api/v1/token/reissue', null, {
              withCredentials: true,
            });

            const newToken = response.data.accessToken;
            setAuthToken(newToken);
            onRefreshed(newToken);
            
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            isRefreshing = false;
            return api(originalRequest);
          } catch (refreshError) {
            isRefreshing = false;
            setIsAuthenticated(false);
            setUserId(null);
            setAuthToken(null);
            if (window.location.pathname !== '/users/login') {
              navigate('/users/login');
            }
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    // 컴포넌트 언마운트 시 인터셉터 제거
    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [navigate]);
  // useEffect(() => {
  //   const interceptor = api.interceptors.request.use(
  //     (response) => response,
  //     async (error) => {
  //       if (error.response?.status === 401) {
  //         try {
  //           const response = await api.post('/api/v1/token/reissue', null, {
  //             withCredentials: true,
  //           });
  //           setAuthToken(response.data.accessToken);
  //           error.config.headers['Authorization'] = `Bearer ${response.data.accessToken}`;
  //           return api(error.config);
  //         } catch (refreshError) {
  //           setIsAuthenticated(false);
  //           setUserId(null);
  //           setAuthToken(null);
  //           // 로그인 페이지가 아닐 때만 리다이렉트
  //           if (window.location.pathname !== '/users/login') {
  //             navigate('/users/login');
  //           }
  //           return Promise.reject(refreshError);
  //         }
  //       }
  //       return Promise.reject(error);
  //     }
  //   );

  //   return () => {
  //     api.interceptors.response.eject(interceptor);
  //   };
  // }, [navigate]);

  if (isLoading) {
    return <div>Loading...</div>; // 또는 로딩 스피너 컴포넌트
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};