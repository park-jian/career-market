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

  const checkAuthStatus = useCallback(async () => {
    try {
      if (!getAuthToken()) {
        return;
      }
      console.log("getAuthToken():",getAuthToken())
      const response = await api.post('/api/v1/token/reissue', null, {
        withCredentials: true,
      });
      setIsAuthenticated(true);
      setUserId(response.data.userId);
      setAuthToken(response.data.accessToken);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        // 401 오류는 로그인 전 상태에서 정상적인 상황으로 처리
        console.log('Not authenticated. This is normal before login.');
      } else {
        console.error('Failed to check auth status:', error);
      }
      setIsAuthenticated(false);
      setUserId(null);
      setAuthToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = async (email: string, password: string): Promise<number> => {
    try {
      const response = await api.post('/open-api/v1/users/login', { email, password }, {
        withCredentials: true,
      });
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
    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401 && error.config && !error.config.__isRetryRequest) {
          try {
            const response = await api.post('/api/v1/token/reissue', null, {
              withCredentials: true,
            });
            setAuthToken(response.data.accessToken);
            error.config.headers['Authorization'] = `Bearer ${response.data.accessToken}`;
            error.config.__isRetryRequest = true;
            return api(error.config);
          } catch (refreshError) {
            setIsAuthenticated(false);
            setUserId(null);
            setAuthToken(null);
            // 로그인 페이지가 아닐 때만 리다이렉트
            if (window.location.pathname !== '/users/login') {
              navigate('/users/login');
            }
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, [navigate]);

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