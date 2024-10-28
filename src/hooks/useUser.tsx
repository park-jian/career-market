import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import api, { setAuthToken } from '../api/axiosConfig';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
interface UserInfo {
    id?: number;
    user_id?: number;
    name?: string;
    email?: string;
    role_type?: string;
  }
// 로그인 훅
export const useLogin = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
  
    return useMutation({
      mutationFn: async ({ email, password }: { email: string; password: string }) => {
        const response = await api.post('/open-api/v1/users/login', 
          { email, password },
          { withCredentials: true }
        );
        
        if (response.data.result.result_code === 200) {
          const { access_token } = response.data.body;
          setAuthToken(access_token);
          
          // 사용자 정보 가져오기
          const userResponse = await api.get('/api/v1/users/me');
          console.log("hi:", userResponse.data.body)
          return userResponse.data.body;
        }
        
        throw new Error(response.data.result.result_message);
      },
      onSuccess: (data) => {
        // auth와 user 모두 업데이트
        queryClient.setQueryData(['auth'], { access_token: api.defaults.headers.common['Authorization'] });
        queryClient.setQueryData(['user'], data);
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
            // 회원가입 성공 후 자동 로그인
                await login.mutateAsync({ 
                    email: userInfo.email, 
                    password: userInfo.password 
                });
                return response.data.body;
            }
            throw new Error(response.data.result.result_message);
        }
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
        setAuthToken(null);
        // 모든 쿼리 초기화
        queryClient.clear();
        navigate('/');
      },
    });
  };
  
  // 인증 상태 확인 훅
  export const useAuth = () => {
    const queryClient = useQueryClient();
  
    return useQuery({
      queryKey: ['auth'],
      queryFn: async () => {
        try {
          // 토큰이 없으면 null 반환
          if (!api.defaults.headers.common['Authorization']) {
            return null;
          }
  
          const response = await api.post('/api/v1/token/reissue', null, {
            withCredentials: true,
          });
          
          if (response.data.body?.access_token) {
            setAuthToken(response.data.body.access_token);
            
            // 토큰 갱신 성공 시 사용자 정보도 함께 갱신
            const userResponse = await api.get('/api/v1/users/me');
            const userData = userResponse.data.body;
            queryClient.setQueryData(['user'], userData);
            
            return response.data.body;
          }
          return null;
        } catch (error) {
          if (axios.isAxiosError(error) && error.response?.status === 401) {
            return null;
          }
          throw error;
        }
      },
      retry: false,
      staleTime: 5 * 60 * 1000, // 5분
    });
  };
// useUser hook 수정
export const useUser = () => {
    return useQuery<UserInfo | null>({
      queryKey: ['user'],
      queryFn: async () => {
        try {
          if (!api.defaults.headers.common['Authorization']) {
            return null;
          }
          const response = await api.get('/api/v1/users/me');
          return response.data.body;
        } catch (error) {
          if (axios.isAxiosError(error) && error.response?.status === 401) {
            return null;
          }
          throw error;
        }
      },
      staleTime: Infinity,
      retry: false,
    });
  };

  //탈퇴 훅
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
        // 로그아웃과 동일한 처리
        setAuthToken(null);
        // 모든 쿼리 초기화
        queryClient.clear();
        // 홈으로 이동
        navigate('/');
      },
      onError: (error) => {
        if (error instanceof Error) {
          console.error('회원탈퇴 실패:', error.message);
        }
      }
    });
  };