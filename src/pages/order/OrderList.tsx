import React, { useState, useEffect }  from 'react';
import OrderCard from '../../components/order/OrderCard';
import { OrderInfo } from '../../types/order';
import { useUser } from '../../hooks/useUser';
import {getOrderList} from '../../api/order';
import axios from 'axios';
interface OrderType {
  order_id: number;
  order_title: string;
  status: string;
  total_amount: number;
}
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
          if (response.body.length === 0) {//response.status === 204
            setError("컨텐츠가 존재 하지 않습니다.");
          }
        } else {
          setError(response.result.result_message || '데이터를 가져오는데 실패했습니다.');
        }
      }  catch (err) {
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
  // 데이터 로딩 중일 때
  if (loading) {
    return <div className="p-6 text-center">데이터를 불러오는 중...</div>;
  }

  // 에러가 있을 때
  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }
  return (
    <div className="p-6 w-full max-w-5xl mx-auto flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">판매중인 판매글 내역 조회</h1>
      <ul className="w-3/6 grid grid-cols-1 gap-4 p-4">
        {orderData && orderData.map((order: OrderInfo) => (
          <OrderCard key={order.order_id} order={order} />
        ))}
      </ul>
    </div>
  );
};

export default OrderList;