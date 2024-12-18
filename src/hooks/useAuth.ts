import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import api from '../api/axiosConfig';
import { tokenUtils } from '../utils/tokenUtils';
import { useCallback, useEffect, useState } from 'react';

// 타입 정의
interface UserInfo {
  id?: number;
  user_id?: number;
  name?: string;
  email?: string;
  status?: string;
}

interface LoginResponse {
  body: {
    access_token: string;
  };
  result: {
    result_code: number;
    result_message: string;
  };
}

export const useAuth = () => {
    const queryClient = useQueryClient();
    const [isInitializing, setIsInitializing] = useState(true);
    // 사용자 정보 조회 함수
    const fetchUserInfo = useCallback(async () => {
      try {
        const response = await api.get('/api/v1/users/me');
        return response.data.body;
      } catch (error) {
        console.error('Failed to fetch user info:', error);
        throw error;
      }
    }, []);
  
    // refresh 토큰으로 access 토큰 갱신 함수
    const refreshAccessToken = useCallback(async () => {
      try {
        const refreshToken = tokenUtils.getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token');
        }
        const response = await api.post('/open-api/v1/token/reissue', null, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Refresh-Token': refreshToken
          }
        });
        console.log("토큰 만료 재발급 성공")
        const access_token = response.data.body;
        tokenUtils.setTokens(access_token);
        tokenUtils.setLoginTime();
        api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        return access_token;
      } catch (error) {
        console.error('Token refresh failed:', error);
        tokenUtils.clearTokens();
        throw error;
      }
    }, []);
  
    // 인증 초기화 함수
    const initializeAuth = useCallback(async () => {
      try {
        setIsInitializing(true);
        const accessToken = tokenUtils.getAccessToken();
        const refreshToken = tokenUtils.getRefreshToken();
        console.log("인증 초기화")
        if (accessToken) {
          // 액세스 토큰이 있는 경우
          try {
            api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            const userData = await fetchUserInfo();
            queryClient.setQueryData(['user'], userData);
          } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 401 && refreshToken) {
              // 액세스 토큰이 만료된 경우 리프레시 토큰으로 갱신
              await refreshAccessToken();
              const userData = await fetchUserInfo();
              queryClient.setQueryData(['user'], userData);
            } else {
              throw error;
            }
          }
        } else if (refreshToken) {
          // 액세스 토큰은 없지만 리프레시 토큰이 있는 경우
          await refreshAccessToken();
          const userData = await fetchUserInfo();
          queryClient.setQueryData(['user'], userData);
        }
      } catch (error) {
        console.error('Authentication failed:', error);
        // 인증 실패 시에만 토큰 클리어 및 로그아웃
        tokenUtils.clearTokens();
        delete api.defaults.headers.common['Authorization'];
        queryClient.setQueryData(['user'], null);
        if (window.location.pathname !== '/users/login') {
          window.location.href = '/users/login';
        }
      } finally {
        setIsInitializing(false);
      }
    }, [refreshAccessToken, fetchUserInfo, queryClient]);
  
    // API 인터셉터 설정
    useEffect(() => {
      const interceptor = api.interceptors.response.use(
        response => response,
        async error => {
          const originalRequest = error.config;
          if (!originalRequest) return Promise.reject(error);
          // refresh token 요청 URL에서 401이 발생하면 바로 로그아웃 처리
          if (originalRequest.url?.includes('/open-api/v1/token/reissue') && error.response?.status === 401) {//debugger;
            //토큰 재발급 url이 401이면 무한 토큰 재발급 api 호출을 하는 문제 때문에 넣은 코드
            tokenUtils.clearTokens();
            delete api.defaults.headers.common['Authorization'];
            queryClient.setQueryData(['user'], null);
            if (window.location.pathname !== '/') {
              window.location.href = '/';
            }
            return Promise.reject(error);
          }
          if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
              console.log("401 토큰 재발급")
              const accessToken = await refreshAccessToken();
              // 새 토큰을 axios 인스턴스의 기본 헤더에도 설정
              api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              return api(originalRequest);
            } catch (refreshError) {
              // 토큰 갱신 실패 시에만 로그아웃
              tokenUtils.clearTokens();
              delete api.defaults.headers.common['Authorization'];
              queryClient.setQueryData(['user'], null);
              if (window.location.pathname !== '/users/login') {
                window.location.href = '/users/login';
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
    }, [refreshAccessToken, queryClient]);
    // 토큰 만료시간 체크 및 갱신
    useEffect(() => {
      const checkTokenExpiration = async () => {
        const accessToken = tokenUtils.getAccessToken();
        if (!accessToken) return;

        try {
          // 로그인 후 50분 이상 지났는지 확인
          const minutesFromLogin = tokenUtils.getMinutesFromLogin();
          if (minutesFromLogin >= 50) { // 50분 이상 지났을 때만 체크

            if (tokenUtils.isTokenExpiringSoon(accessToken) === true) {
              console.log('login 경과시간, 토큰 재발급', minutesFromLogin);
              await refreshAccessToken();
            }
         }
        } catch (error) {
          console.error('Token expiration check failed:', error);
        }
      };
      const intervalId = setInterval(checkTokenExpiration, 60 * 1000);

      // 컴포넌트 마운트 시 최초 1회 체크
      checkTokenExpiration();

      // 클린업
      return () => clearInterval(intervalId);
    }, [refreshAccessToken]);
    return {
      initializeAuth,
      isInitializing
    };
  };
  
  // useUser 훅 = accesstoken이 있으면 user의 정보를 반환 fetchUserInfo 함수랑 겹침
  export const useUser = () => {
   
    return useQuery<UserInfo | null>({
      queryKey: ['user'],
      queryFn: async () => {
        try {
          const access_token = tokenUtils.getAccessToken();
          if (!access_token) {
            return null;
          }
          api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
          const response = await api.get('/api/v1/users/me');
          return response.data.body;
        } catch (error) {
          if (axios.isAxiosError(error) && error.response?.status === 401) {
            return null;
          }
          throw error;
        }
      },
      enabled: !!tokenUtils.getAccessToken(),
      staleTime: Infinity,
      retry: false,
    });
  };

// 로그인 훅
export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const response = await api.post<LoginResponse>('/open-api/v1/users/login', 
        { email, password },
        { withCredentials: true }
      );
      if (response.data.result.result_code === 200) {
        console.log("login_time:",  new Date(Date.now()).toLocaleTimeString());
        const { access_token } = response.data.body;
        const refresh_token = response.headers['refresh-token'];
        tokenUtils.setTokens(access_token, refresh_token);
        tokenUtils.setLoginTime();
        const userResponse = await api.get('/api/v1/users/me');
        return userResponse.data.body;
      }
      
      throw new Error(response.data.result.result_message);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data);
      
      if (data.status === 'USER') {
        navigate('/');
      } else if (data.status === 'ADMIN') {
        navigate('/resumes/admin');
      }
    },
  });
};

// 로그아웃 훅
export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      await api.post('/api/v1/users/logout', {}, { withCredentials: true });
    },
    onSuccess: () => {
      tokenUtils.clearTokens();
      //setAuthToken(null);
      // 모든 쿼리 초기화
      // 특정 쿼리들을 명시적으로 무효화
      queryClient.invalidateQueries({
        queryKey: ['user'],
        refetchType: 'none' // 자동으로 다시 fetch하지 않음
      });
      
    //   queryClient.invalidateQueries({
    //     queryKey: ['auth'],
    //     refetchType: 'none'
    //   });
      
      // 명시적으로 데이터 제거
      queryClient.setQueryData(['user'], null);
      //queryClient.setQueryData(['auth'], null);
      queryClient.setQueryData(['cart'], null);
      navigate('/');
    },
  });
};

// 회원가입 훅
export const useSignup = () => {
  const login = useLogin();

  return useMutation({
    mutationFn: async (userInfo: { email: string; name: string; password: string }) => {
      const response = await api.post('/open-api/v1/users/register', userInfo);
      
      if (response.data.result.result_code === 201) {
        await login.mutateAsync({ 
          email: userInfo.email, 
          password: userInfo.password 
        });
        return response.data.body;
      }
      throw new Error(response.data.result.result_message);
    },
  });
};

// 회원탈퇴 훅
export const useSecession = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      const response = await api.delete('/api/v1/users');
      if (response.data.result.result_code !== 200) {
        throw new Error(response.data.result.result_message);
      }
      return response.data.result;
    },
    onSuccess: () => {
      tokenUtils.clearTokens();
      queryClient.clear();
      navigate('/');
    },
    onError: (error) => {
      if (error instanceof Error) {
        console.error('회원탈퇴 실패:', error.message);
      }
    }
  });
};