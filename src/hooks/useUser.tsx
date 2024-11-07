import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import api, { setAuthToken } from '../api/axiosConfig';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import {tokenUtils} from '../utils/tokenUtils';
interface UserInfo {
    id?: number;
    user_id?: number;
    name?: string;
    email?: string;
    status?: string;
  }
// 로그인 훅

export const useLogin = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
  //useMutation은 서버의 데이터를 변경하는 작업을 수행
  //useMutation은 React Query 라이브러리에서 제공하는 hook
    return useMutation({
      //mutationFn : 실제 api를 호출하는 비동기 함수
      mutationFn: async ({ email, password }: { email: string; password: string }) => {
        const response = await api.post('/open-api/v1/users/login', 
          { email, password },
          { withCredentials: true }
        );
        if (response.data.result.result_code === 200) {
          const { access_token} = response.data.body;
          const refresh_token = response.headers['refresh-token'];
          console.log("Headers refresh token:", refresh_token);
          //쿠키에 jwtToken, refreshToken 저장
         // tokenUtils.setTokens(access_token, refresh_token); 기존
         // access_token과 refresh_token을 sessionStorage에 저장
         tokenUtils.setTokens(access_token, refresh_token);
          // 사용자 정보 가져오기
          const userResponse = await api.get('/api/v1/users/me');
          console.log("로그인 성공, 사용자 정보:", userResponse.data.body)
          return userResponse.data.body;
        }
        
        throw new Error(response.data.result.result_message);
      },
      //성공시
      onSuccess: (data) => {
        // auth와 user 전역 상태  업데이트
        queryClient.setQueryData(['auth'], { access_token: api.defaults.headers.common['Authorization'] });
        queryClient.setQueryData(['user'], data);
        //각 페이지에서 꺼낼때는 아래와 같이 꺼내서 사용가능. 인증 상태 확인
        //const { data: auth } = useAuth();
        // 사용자 정보 가져오기
        //const { data: user } = useUser();
        if (data.status === 'USER') {
          navigate('/');
        } else if (data.status === 'ADMIN') {
          navigate('/resumes/admin');
        }

      },
    });
  };
// 회원가입 훅
export const useSignup = () => {
    const login = useLogin();
  
    return useMutation({
        mutationFn: async (userInfo: { email: string; name: string; password: string }) => {
            const response = await api.post('/open-api/v1/users/register', userInfo);
            console.log("회원가입")
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
        tokenUtils.clearTokens();
        setAuthToken(null);
        // 모든 쿼리 초기화
        queryClient.clear();
        navigate('/');
      },
    });
  };
  export const useCheckAndRefreshToken = () => {
    const queryClient = useQueryClient();
    const { data: user } = useUser();
    const checkAndRefreshToken = async () => {
      try {
        //로그인 전에는 refresh, access token 모두 없음.//새로고침은 둘 다 있음.
        const ac_token = tokenUtils.getAccessToken();
        //새로고침이면 ac_token이 있어. refresheh 도 있고, 401일때는 ac_token없고 refsh만 있어.
        // if (ac_token) {
        //   return { access_token: ac_token };
        // }
        const rf_token = tokenUtils.getRefreshToken();
        console.log("ac,rf token:", ac_token, rf_token);
        if (!rf_token) {
          return null;
        }
        //로그인시에도 여기를 타고 ac, rf,있는데 그때는 user가 있음
        if (rf_token && !user) {
          try {
            //   const response = await api.post('/api/v1/token/reissue').then(
            //     (result) => {
            //         console.log("API 성공:", result);
            //         return result;
            //     },
            //     (error) => {
            //         console.log("API 실패:", error);
            //         throw error;
            //     }
            // );
            const response = await api.post('/api/v1/token/reissue', null, {
              withCredentials: true,
              headers: {
                'Content-Type': 'application/json',
                'Refresh-Token': rf_token // refresh token을 헤더에 추가
              }
            });
              console.log("reissue API 응답:", response);
      
              if (response.data.body?.access_token) {
                  try {
                      //tokenUtils.setTokens(response.data.body.access_token);
                       // refresh token 유지하면서 access token만 업데이트 기존
                      tokenUtils.setTokens(response.data.body.access_token, rf_token);
                      console.log("새 토큰 설정 완료");
                      
                      const userResponse = await api.get('/api/v1/users/me');
                      console.log("사용자 정보 조회 성공:", userResponse);
                      
                      const userData = userResponse.data.body;
                      queryClient.setQueryData(['user'], userData);
                      
                      return response.data.body;
                  } catch (innerError) {
                      console.error("토큰 설정 또는 사용자 정보 조회 실패:", innerError);
                      throw innerError;
                  }
              }
              
              console.log("토큰 재발급 실패 - 응답에 access_token이 없음");
              tokenUtils.clearTokens();
              if (window.location.pathname !== '/users/login') {
                  window.location.href = '/users/login';
              }
          } catch (reissueError) {
              console.error("토큰 재발급 API 호출 실패:", reissueError);
              throw reissueError;
          }
      }
       
        
        
        return null;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          tokenUtils.clearTokens();
          if (window.location.pathname !== '/users/login') {
            window.location.href = '/users/login';
          }
          return null;
        }
        throw error;
      }
    };
    return { checkAndRefreshToken };
  };
  
  export const useAuth = () => {
    const { checkAndRefreshToken } = useCheckAndRefreshToken();
  
    return useQuery({
      queryKey: ['auth'],
      queryFn: () => checkAndRefreshToken,
      retry: false,
      staleTime: 4.5 * 60 * 1000, // 4.5분, 만료시 재발급
    });
  };
// useUser hook 수정
export const useUser = () => {
    return useQuery<UserInfo | null>({
      queryKey: ['user'],
      queryFn: async () => {
        try { console.log("유저")
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
      mutationFn: async () => { console.log("탈퇴")
        const response = await api.delete('/api/v1/users');
        if (response.data.result.result_code !== 200) {
          throw new Error(response.data.result.result_message);
        }
        return response.data.result;
      },
      onSuccess: () => {
        tokenUtils.clearTokens();
        setAuthToken(null);
        // 모든 쿼리 초기화
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