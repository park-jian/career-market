//import axios from 'axios';
import {ResumeInfo} from '../types/resume'
import api from '../api/axiosConfig';
import axios from 'axios';
import {PendingResumeType, PendingResumeOneType} from '../types/resume';
// interface resumeDataType {
//   field: string;
//   level: string;
//   url: string;
//   price: string;
//   description: string;
// }
interface VerifyCodeResponse {
  result_code: number;
  result_message: string;
}
interface ApiResponse {
  result: {
    result_code: number;
    result_message: string;
  };
  body?: string;
}
interface UpdateResumeData {
  field: 'FRONTEND' | 'BACKEND' | 'ANDROID' | 'IOS' | 'DEVOPS' | 'AI' | 'ETC';
  level: 'NEW' | 'JUNIOR' | 'SENIOR';
  resume_url: string;
  price: number;
  description: string;
}
// interface Resume {
//   id: number;
//   title: string;
//   sales_quantity: string;
//   status: string;
//   registered_at: string;
// }
// interface ResumeType2 {
//   id: number;  // salesPostId를 위한 id 추가
//   summary: string;
//   sales_quantity: number;
//   field: string;
//   level: string;
//   status: string;
//   modified_at: string;
// }

interface ApiResponse2 {
  result: {
    result_code: number;
    result_message: string;
  };
  body: PendingResumeOneType;
}
interface ApiResponse3 {
  result: {
    result_code: number;
    result_message: string;
  };
  body: PendingResumeType[];
}
//모든 사용자 판매글 페이지 조회
export const getList = async (params?: {
  sortType?: string;
  minPrice?: number;
  maxPrice?: number;
  field?: string;
  level?: string;
  pageStep?: string;
  lastId?: number;
}) => {
  try {
    const response = await api.get(`/open-api/v1/sales-posts`,{
      params: {
        sortType: params?.sortType,
        minPrice: params?.minPrice,
        maxPrice: params?.maxPrice,
        field: params?.field,
        level: params?.level,
        pageStep: params?.pageStep || 'FIRST', // 기본값 'FIRST'
        limit: 6, // 기본값 6
        lastId: params?.lastId
      }});
    return response.data;
  } catch (error) {
    console.error('Error adding new resume:', error);//이거 없애면 왜 에러나?
    throw error;
  }
};

export const getListOne = async (salesPostId: number): Promise<ResumeInfo> => {//모든 사용자 판매글 단건 상세 조회
  try {
    const response = await api.get(`/open-api/v1/sale-posts/${salesPostId}`);
    return response.data;
  } catch (error) {
    console.error('Error adding new resume:', error);
    throw error;
  }
};

export const addNewResume = async (resume: Omit<ResumeInfo, 'id'>): Promise<ResumeInfo> => {
  try {
    const response = await api.post(`/api/v1/resumes/register`, resume, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding new resume:', error);
    throw error;
  }
};
//나의 판매중인 판매글 조회
export const getMyList = async () => {
  try {
    const response = await api.get<ApiResponse2>(`api/v1/sales-posts`);//debugger;
    const result = response.data.result;
    const data = response.data.body;
    return {
      result_code: result.result_code,
      result_message: result.result_message,
      data: data
    }
  } catch (error) {//debugger;
    console.error('Error adding new resume:', error);
    throw error;
  }
};
//나의 요청중인 이력서 전체 조회
export const getMyPendingList = async () => {
  try {
    const response = await api.get<ApiResponse3>(`/api/v1/resumes`);
    const result = response.data.result;
    const data = response.data.body;
    return {
      result_code: result.result_code,
      result_message: result.result_message,
      data: data
    }
  } catch (error) {
    console.error('Error adding new resume:', error);
    throw error;
  }
};
//나의 요청중인 이력서 단건 조회
export const getMyPendingListOne = async (resumeId: number) => {
  try {
    const response = await api.get<ApiResponse2>(`/api/v1/resumes/${resumeId}`);
    const result = response.data;
    return result;
  } catch (error) {
    console.error('Error adding new resume:', error);
    throw error;
  }
};
export const deleteResume = async (resumeId: number) => {
  try {
    const response = await api.delete<ApiResponse2>(`/api/v1/resumes/${resumeId}`);
    const result = response.data;
    return result;
  } catch (error) {
    console.error('Error adding new resume:', error);
    throw error;
  }
}
export const updateResume = async (resumeId: number, resumeData: UpdateResumeData, descriptionImage: File | string | undefined) => {
  try {
    // const response = await api.put<ApiResponse2>(`/api/v1/resumes/${resumeId}`);
    // const result = response.data;
    // return result;
    // FormData 생성
    const formData = new FormData();
    
    // JSON 데이터를 문자열로 변환하여 추가
    formData.append('resumeData', JSON.stringify(resumeData));
    
    // 이미지 파일 추가
    if (descriptionImage) {
      formData.append('descriptionImage', descriptionImage);
    }

    const response = await api.put<ApiResponse2>(
      `/api/v1/resumes/${resumeId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error adding new resume:', error);
    throw error;
  }
}
export const getAdminResumeList = async () => {//관리자 요청 이력서 조회
  try {
    const response = await api.get(`/admin-api/v1/resumes`,{
      params: {
        pageStep: 'FIRST',
        limit: 6
      }});
    return response.data;
  } catch (error) {
    console.error('Error adding new resume:', error);
    throw error;
  }
};
export const getAdminResumeListOne = async (resumeId: string) => {//관리자 요청 이력서 조회
  try {
    const response = await api.get(`/admin-api/v1/resumes/${resumeId}`,{
      params: {
        resumeId: resumeId,
      }});
    return response.data;
  } catch (error) {
    console.error('Error adding new resume:', error);
    throw error;
  }
};

export const setAdminApprove = async (resumeId: string) => {//관리자 요청 이력서 승인
  try {
    const response = await api.post(`/admin-api/v1/resumes/${resumeId}/approve`);
    return response.data;
  } catch (error) {
    console.error('Error adding new resume:', error);
    throw error;
  }
};
export const setAdminDeny = async (resumeId: string) => {//관리자 요청 이력서 거절
  try {
    const response = await api.post(`/admin-api/v1/resumes/${resumeId}/deny`);
    return response.data;
  } catch (error) {
    console.error('Error adding new resume:', error);
    throw error;
  }
};
//이력서 등록
export const ResumeRegister = async (formData: FormData): Promise<VerifyCodeResponse> => {
  try {
    const response = await api.post<ApiResponse>('/api/v1/resumes/register', 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
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

