import React from "react";
import { useNavigate } from "react-router-dom";
import { IoNewspaperOutline } from "react-icons/io5";

interface OrderCardInfo {
  order_id: number;
  order_title: string;
  total_amount: number;
  status: string;
}

interface OrderCardProps {
  order: OrderCardInfo;
}

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

const getStatusText = (status: string): string => {
  return statusMapping[status] || status;
};

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const navigate = useNavigate();
  const { order_id, order_title, total_amount, status } = order;

  const getStatusColor = (status: string): string => {
    const colorMapping: { [key: string]: string } = {
      ORDERED: "text-blue-600 bg-blue-50",
      PAYMENT_FAILED: "text-red-600 bg-red-50",
      PAID: "text-green-600 bg-green-50",
      WAIT: "text-yellow-600 bg-yellow-50",
      PARTIAL_WAIT: "text-yellow-600 bg-yellow-50",
      CANCEL: "text-gray-600 bg-gray-50",
      PARTIAL_CANCEL: "text-gray-600 bg-gray-50",
      CONFIRM: "text-purple-600 bg-purple-50",
      PARTIAL_CONFIRM: "text-purple-600 bg-purple-50",
    };
    return colorMapping[status] || "text-gray-600 bg-gray-50";
  };

  return (
    <li
      onClick={() => {
        navigate(`/orders/${order_id}`, { state: { order } });
      }}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer overflow-hidden border border-gray-100"
    >
      <div className="flex items-stretch">
        <div className="flex-1 p-4">

          <div className="flex items-center space-x-6">
            <div className="flex items-center flex-shrink-0">
              <IoNewspaperOutline className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-800 mb-1 line-clamp-1">
                {order_title}
              </h3>
              <p className="text-gray-600 font-medium">
                {new Intl.NumberFormat('ko-KR').format(total_amount)}원
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center px-6 border-l border-gray-100 min-w-[120px]"> {/* 최소 너비 지정 */}
          <div className="flex items-center space-x-3 mb-3">
            <span className={`w-32 text-sm font-medium px-3 py-1 text-center whitespace-nowrap overflow-hidden text-ellipsis ${getStatusColor(status)}`}>
              {getStatusText(status)}
            </span>
          </div>
        </div>
      </div>
    </li>
  );
}

export default OrderCard;