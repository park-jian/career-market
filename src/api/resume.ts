//import axios from 'axios';
import api from '../api/axiosConfig';
import axios from 'axios';
import { ResumeInfo, ListParams, AdminListParams, UpdateResumeData, ResponsePendingResumeOne, ResponsePendingResume } from '../types/resume';
import { VerifyCodeResponse, ApiResponseProp } from '../types/common';

// export type SortType = 'OLD' | 'NEW' | 'HIGHEST_PRICE' | 'LOWEST_PRICE' | 'BEST_SELLING';
// export type FieldCond = 'FRONTEND' | 'BACKEND' | 'ANDROID' | 'IOS' | 'DEVOPS' | 'AI' | 'ETC';
// export type LevelCond = 'NEW' | 'JUNIOR' | 'SENIOR';
// export type PageStep = 'FIRST' | 'NEXT' | 'PREVIOUS' | 'LAST';

//모든 사용자 판매글 페이지 조회
export const getList = async (params?: ListParams) => {
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
    const response = await api.get(`api/v1/sales-posts`);
    return response.data;
  } catch (error) {
    console.error('Error adding new resume:', error);//이거 없애면 왜 에러나?
    throw error;
  }
};
//나의 판매중인 이력서 판매글 상태 변경
export const modifySalesStatus = async (resume_id: number, status: string) => {
  try {
    const response = await api.put(`/api/v1/sales-posts/${resume_id}?status=${status}`);
    return response.data;
  } catch (error) {
    console.error('Error adding new resume:', error);//이거 없애면 왜 에러나?
    throw error;
  }
};
//나의 요청중인 이력서 전체 조회
export const getMyPendingList = async () => {
  try {
    const response = await api.get<ResponsePendingResume>(`/api/v1/resumes`);
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
export const getMyPendingListOne = async (resumeId: number): Promise<ResponsePendingResumeOne> => {
  try {
    const response = await api.get<ResponsePendingResumeOne>(`/api/v1/resumes/${resumeId}`);
    const result = response.data;
    return result;
  } catch (error) {
    console.error('Error adding new resume:', error);
    throw error;
  }
};
export const deleteResume = async (resumeId: number): Promise<ResponsePendingResumeOne> => {
  try {
    const response = await api.delete<ResponsePendingResumeOne>(`/api/v1/resumes/${resumeId}`);
    const result = response.data;
    return result;
  } catch (error) {
    console.error('Error adding new resume:', error);
    throw error;
  }
}
export const updateResume = async (resumeId: number, resumeData: UpdateResumeData, descriptionImage: File | string | undefined): Promise<ResponsePendingResumeOne> => {
  try {
    // const response = await api.put<ResponsePendingResumeOne>(`/api/v1/resumes/${resumeId}`);
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

    const response = await api.put<ResponsePendingResumeOne>(
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
export const getAdminResumeList = async (params?: AdminListParams) => {//관리자 요청 이력서 조회
  const response = await api.get(`/admin-api/v1/resumes`,{
    params: {
      periodCond: params?.periodCond,
      status: params?.status,
      pageStep: params?.pageStep || 'FIRST',
      limit: 6,
      registered_at: params?.registered_at,
      //lastModifiedAt: params?.lastModifiedAt,
      lastId: params?.lastId
    }
  });
  return response.data;
};
export const getAdminResumeListOne = async (resumeId: number) => {//관리자 요청 이력서 조회
  try {
    const response = await api.get(`/admin-api/v1/resumes/${resumeId}`,{
      params: {
        resumeId,
      }});
    return response.data;
  } catch (error) {
    console.error('Error adding new resume:', error);
    throw error;
  }
};

export const setAdminApprove = async (resumeId: number) => {//관리자 요청 이력서 승인
  try {
    const response = await api.post(`/admin-api/v1/resumes/${resumeId}/approve`);
    return response.data;
  } catch (error) {
    console.error('Error adding new resume:', error);
    throw error;
  }
};
export const setAdminDeny = async (resumeId: number) => {//관리자 요청 이력서 거절
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
    const response = await api.post<ApiResponseProp>('/api/v1/resumes/register', 
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

