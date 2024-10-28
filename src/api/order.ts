import {OrderInfo, CartInfo} from '../types/order'
interface VerifyCodeResponse {
  result_code: number;
  result_message: string;
}
// API 응답 타입 정의 (필요한 경우)
interface ApiResponse<T> {
  result: {
    result_code: number;
    result_message?: string;
  };
  body: T;
}
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
  
  export const getOrderListView = async (orderId: number): Promise<OrderInfo> => {
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