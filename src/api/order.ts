import { OrderInfo, CartInfo, OrderOneInfo, PaymentInfo } from '../types/order'
import { VerifyCodeResponse, ApiResponse } from '../types/common';
// API 응답 타입 정의 (필요한 경우)

import api from '../api/axiosConfig';
export const getOrderList = async () => {
    try {
      const response = await api.get(`/api/v1/orders`);
      return response.data;
    } catch (error) {
      console.error('Error adding new order:', error);
      throw error;
    }
  };
  
  export const getOrderListView = async (orderId: number): Promise<ApiResponse<OrderOneInfo>> => {
    try {
      const response = await api.get(`/api/v1/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error adding new order:', error);
      throw error;
    }
  };

export const addNewOrder = async (order: Omit<OrderInfo, 'id'>): Promise<OrderInfo> => {
    try {
      const response = await api.post(`/api/v1/add`, order, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error adding new order:', error);
      throw error;
    }
  };
//장바구니 조회
export const getCartList = async (): Promise<ApiResponse<CartInfo>> => {
  try {
    const response = await api.get<ApiResponse<CartInfo>>('/api/v1/cart-resumes');
    return response.data;
  } catch (error) {
    console.error('장바구니 조회 실패:', error);
    throw error;
  }
};

  //장바구니 추가
  export const addCart = async (resumeId: number ): Promise<VerifyCodeResponse> => {
    try {
      const response = await api.post(`/api/v1/cart-resumes`,  null, {
        params: {
          resumeId: resumeId
        }
      });
      const result = response.data.result;
      return {
        result_code: result.result_code,
        result_message: result.result_message
      }
    } catch (error) {
      console.error('Error adding new order:', error);
      throw error;
    }
  };
//장바구니 선택 삭제
export const deleteCartItem = async (cartIds: number[]): Promise<VerifyCodeResponse> => {
  try {
    const response = await api.delete(`/api/v1/cart-resumes/select`, {
      data: {  // DELETE 메서드에서 request body를 보낼 때는 data 옵션 사용
        cart_resume_ids: cartIds
      }
    });
    const result = response.data.result;
    return {
      result_code: result.result_code,
      result_message: result.result_message
    }
  } catch (error) {
    console.error('Error adding new order:', error);
    throw error;
  }
};
  //장바구니 전체 삭제
export const deleteCartAll = async (): Promise<VerifyCodeResponse> => {
  try {
    const response = await api.delete(`/api/v1/cart-resumes`);
    const result = response.data.result;
    return {
      result_code: result.result_code,
      result_message: result.result_message
    }
  } catch (error) {
    console.error('Error adding new order:', error);
    throw error;
  }
};

export const cancelOrderResume = async (orderId: number, orderResumeIds: number[]): Promise<VerifyCodeResponse> => {
  try {
    const response = await api.post(`/api/v1/checkout/partial-cancel/${orderId}`,
      { order_resume_ids: orderResumeIds }  // request body 추가
    );
    const result = response.data.result;
    return {
      result_code: result.result_code,
      result_message: result.result_message
    }
  } catch (error) {
    console.error('Error adding new order:', error);
    throw error;
  }
};

export const cancelOrderResumeAll = async (orderId: number): Promise<VerifyCodeResponse> => {
  try {
    const response = await api.post(`/api/v1/checkout/cancel/${orderId}`);
    const result = response.data.result;
    return {
      result_code: result.result_code,
      result_message: result.result_message
    }
  } catch (error) {
    console.error('Error adding new order:', error);
    throw error;
  }
};
//결제완료후 서버로 데이터 전송
export const paymentConfirm = async (paymentInfo: PaymentInfo): Promise<VerifyCodeResponse> => {
  try {
    const response = await api.post(`/api/v1/checkout/confirm`, paymentInfo);
    const result = response.data.result;
    return {
        result_code: result.result_code,
        result_message: result.result_message
    }
   } catch (error) {
    console.error('Error adding new order:', error);
    throw error;
  }
};
