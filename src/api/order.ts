import {OrderInfo, CartInfo} from '../types/order'
interface VerifyCodeResponse {
  result_code: number;
  result_message: string;
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

  export const getCartList = async (): Promise<CartInfo[]> => {
    try {
      const response = await api.post(`/api/v1/cart/summary`);
      return response.data;
    } catch (error) {
      console.error('Error adding new order:', error);
      throw error;
    }
  };
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