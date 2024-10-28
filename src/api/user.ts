//import axios from 'axios';
// import { useAuth } from '../auth/AuthContext';
import axios from 'axios';
import api from './axiosConfig';
export interface bodyType {
  email: string,
  name: string,
  role_type: string
}
export interface resultType {
  result_code: number,
  result_description: string,
  result_message: string
}
export interface User {
  body: bodyType,
  result: resultType
}
interface VerifyCodeResponse {
  result_code: number;
  result_message: string;
}
// interface userInfoType {
//   name: string;
//   email: string;
//   password: string;
// }
// interface SignupResponse {
//   result_code: number;
//   result_message: string;
//  }
interface ApiResponse {
  result: {
    result_code: number;
    result_message: string;
  };
  body?: string;
}
export const fetchUser = async (): Promise<User> => {
  // const { accessToken } = useAuth(); // useAuth 훅을 사용하여 accessToken을 가져옵니다

  // if (!accessToken) {
  //   throw new Error('No access token available');
  // }
  // const response = await axios.get(`http://13.209.85.115:8080/api/v1/users/me`, {
  //   headers: {
  //     Authorization: `Bearer ${accessToken}`
  //   }
  // });
  const response = await api.get('/api/v1/users/me');
  const data = response.data;
  return data;
};

export const verifyCode = async (email: string, code: string): Promise<VerifyCodeResponse> => {
  try {
    const response = await api.post<ApiResponse>('/open-api/v1/users/code/verify', {
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
    const response = await api.put<ApiResponse>('/api/v1/users/password', {
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
    const response = await api.post<ApiResponse>('/api/v1/users/verify-password', {
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
    const response = await api.post<ApiResponse>('/open-api/v1/users/password/issue-temporary', {
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
    const response = await api.delete<ApiResponse>('/api/v1/users');
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