//import axios from 'axios';
// import { useAuth } from '../Context';
import axios from 'axios';
import api from './axiosConfig';
import { VerifyCodeResponse, ApiResponseProp } from '../types/common';
import { MyInfo } from '../types/user';

export const fetchUser = async (): Promise<MyInfo> => {
  try {
    const response = await api.get('/api/v1/users/me');
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.data) {
      console.log("error:",error);
    };
    throw new Error('알 수 없는 에러가 발생했습니다.');
  }
};

export const verifyCode = async (email: string, code: string): Promise<VerifyCodeResponse> => {
  try {
    const response = await api.post<ApiResponseProp>('/open-api/v1/users/code/verify', {
      email,
      code
    });
    const result = response.data.result;
    return {
      result_code: result.result_code,
      result_message: result.result_message
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.data) {
      const result = error.response.data.result;
      return {
        result_code: result.result_code,
        result_message: result.result_message
      };
    }
    return {
      result_code: 500,
      result_message: '인증 처리 중 오류가 발생했습니다.'
    };
  }
};
//비밀번호 수정
export const modifyPassword = async (password: string): Promise<VerifyCodeResponse> => {
  try {
    const response = await api.put<ApiResponseProp>('/api/v1/users/password', {
      password
    });
    const result = response.data.result;
    return {
      result_code: result.result_code,
      result_message: result.result_message
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.data) {
      const result = error.response.data.result;
      return {
        result_code: result.result_code,
        result_message: result.result_message
      };
    }
    return {
      result_code: 500,
      result_message: '인증 처리 중 오류가 발생했습니다.'
    };
  }
};
//비밀번호 검증
export const verifyPassword = async (password: string): Promise<VerifyCodeResponse> => {
  try {
    const response = await api.post<ApiResponseProp>('/api/v1/users/verify-password', {
      password
    });
    const result = response.data.result;
    return {
      result_code: result.result_code,
      result_message: result.result_message
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.data) {
      const result = error.response.data.result;
      return {
        result_code: result.result_code,
        result_message: result.result_message
      };
    }
    return {
      result_code: 500,
      result_message: '인증 처리 중 오류가 발생했습니다.'
    };
  }
};
//임시 비밀번호 발급
export const searchPassword = async (name: string, email: string): Promise<VerifyCodeResponse> => {
  try {
    const response = await api.post<ApiResponseProp>('/open-api/v1/users/password/issue-temporary', {
      name,
      email
    });
    const result = response.data.result;
    return {
      result_code: result.result_code,
      result_message: result.result_message
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.data) {
      const result = error.response.data.result;
      return {
        result_code: result.result_code,
        result_message: result.result_message
      };
    }
    return {
      result_code: 500,
      result_message: '인증 처리 중 오류가 발생했습니다.'
    };
  }
};
//탈퇴
export const fetchDelete = async (): Promise<VerifyCodeResponse> => {
  try {
    const response = await api.delete<ApiResponseProp>('/api/v1/users');
    const result = response.data.result;
    return {
      result_code: result.result_code,
      result_message: result.result_message
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.data) {
      const result = error.response.data.result;
      return {
        result_code: result.result_code,
        result_message: result.result_message
      };
    }
    return {
      result_code: 500,
      result_message: '인증 처리 중 오류가 발생했습니다.'
    };
  }
};