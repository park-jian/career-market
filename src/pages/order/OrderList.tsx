import React, { useState, useEffect } from 'react';
import OrderCard from '../../components/order/OrderCard';
import { OrderType } from '../../types/order';
import { useUser } from '../../hooks/useAuth';
import { getOrderList } from '../../api/order';
import axios from 'axios';

const OrderList: React.FC = () => {
  const [orderData, setOrderData] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: user } = useUser();

  useEffect(() => {
    const fetchOrderList = async () => {
      try {
        if (!user) {
          setLoading(false);
          return;
        }
        const response = await getOrderList();
        if (response.result.result_code === 200) {
          setOrderData(response.body);
          if (response.body.length === 0) {
            setError("컨텐츠가 존재 하지 않습니다.");
          }
        } else {
          setError(response.result.result_message || '데이터를 가져오는데 실패했습니다.');
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.result?.result_message || '데이터를 가져오는데 실패했습니다.');
          console.error('Error response:', err.response?.data);
        } else {
          setError('알 수 없는 에러가 발생했습니다.');
          console.error('Unexpected error:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrderList();
  }, [user]);
  return (
    <div className="bg-gray-50 min-h-screen py-8">
     <div className="max-w-4xl mx-auto px-4">
       <div className="flex justify-between items-center mb-8">
         <h1 className="text-3xl font-bold text-gray-800">주문 내역 조회</h1>
       </div>
       {loading ? (
          <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
          ) : error ? (
          <div className="text-center mt-20">
            <div className="text-red-500 bg-red-50 px-6 py-4 rounded-lg shadow inline-block">
              {error}
            </div>
          </div>
          ) : (
          <>
            <div className="space-y-4">
              {orderData && orderData.map((order: OrderType) => (
                <div key={order.order_id} className="flex items-center space-x-4">
                  <div className="flex-1">
                    <OrderCard order={order} />
                  </div>
                </div>
              ))}
            </div>     
          </>
          )}
     </div>
   </div>
 );
};

export default OrderList;