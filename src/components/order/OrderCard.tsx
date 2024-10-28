import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { IoNewspaperOutline } from "react-icons/io5";
interface OrderInfo {
    order_id: number;
    order_title: string;
    total_amount: number;
    status: string;
  }
  interface OrderCardProps {
    order: OrderInfo;
  }
  // status 매핑 객체
    const statusMapping: { [key: string]: string } = {
        ORDERED: "주문 생성",
        PAYMENT_FAILED: "결제 실패",
        PAID: "결제 완료",
        WAIT: "발송 대기",
        PARTIAL_WAIT: "발송 부분 대기",
        CANCEL: "주문 취소",
        PARTIAL_CANCEL: "부분 취소",
        CONFIRM: "구매 확정",
        PARTIAL_CONFIRM: "부분 구매 확정",
    };
    // status를 변환하는 함수
const getStatusText = (status: string): string => {
    return statusMapping[status] || status; // 매핑되지 않은 상태는 원래 값을 반환
  };
  const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const navigate = useNavigate();
  const { order_id, order_title, total_amount, status } = order;
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  // 컴포넌트가 리렌더링 될 때마다 색상이 변경되지 않도록 useMemo 사용
  const randomColor = useMemo(() => getRandomColor(), [order_id]);
  return (
    <li
      onClick={() => {
        navigate(`/orders/${order_id}`, { state: { order } });
      }}
      className="rounded-lg border flex"
    >
        <div className="border-r w-4/6 p-3">
            <div className="font-bold">{getStatusText(status)}</div>
            <div className="flex items-center">
                <div className="mr-2">
                    <IoNewspaperOutline color={randomColor}/>
                </div>
                <div className="truncate ">
                    {order_title}
                </div>
            </div>
            <div>{`${total_amount}원`}</div>
        </div>
        <div className="w-2/6 flex justify-center items-center ">
            <button className="text-center px-2 py-1 border-2 border-yellow-200 text-yellow-800 rounded-full font-semibold text-xl hover:bg-yellow-800 hover:text-yellow-200">구매 확정</button>
        </div>
      
    </li>
  );
}
export default OrderCard;