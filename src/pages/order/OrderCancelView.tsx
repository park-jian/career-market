import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getOrderListView, cancelOrderResume } from '../../api/order';
import { OrderOneInfo } from '../../types/order';
import { AxiosError } from 'axios';
const OrderCancelView: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState<OrderOneInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const selectedResumeIds = useMemo(() => 
    location.state?.selectedResumeIds || [], 
    [location.state?.selectedResumeIds]
  );
  const fetchOrder = useCallback(async () => {
    if (!orderId) return;

    try {
      const data = await getOrderListView(Number(orderId));
      if (data.result.result_code === 200) {
        // 선택된 이력서만 필터링
        const filteredResponses = data.body.order_resume_responses.filter(
          resume => selectedResumeIds.includes(resume.order_resume_id)
        );
        
        setOrderData({
          ...data.body,
          order_resume_responses: filteredResponses
        });
      }
    } catch (error) {
      console.error('Failed to fetch order:', error);
      alert('주문 정보를 불러오는데 실패했습니다.');
      navigate(-1);
    }
  }, [orderId, selectedResumeIds, navigate]);
  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);
  
  const handleCancel = async () => {
    if (!orderData || !orderId) return;
    const cancelableResumes = orderData.order_resume_responses.filter(
      resume => resume.status === 'PAID'
    );

    if (cancelableResumes.length === 0) {
      alert('취소 가능한 이력서가 없습니다.');
      return;
    }

    const confirmed = window.confirm(`${cancelableResumes.length}개의 이력서를 취소하시겠습니까?`);
    if (!confirmed) return;

    setIsLoading(true);
    try {
      // PAID 상태인 이력서의 ID만 전달
      const cancelableIds = cancelableResumes.map(resume => resume.order_resume_id);
      await cancelOrderResume(Number(orderId), cancelableIds);
      alert('주문이 취소되었습니다.');
      navigate(`/orders/${orderId}`);
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response?.data?.result) {
        const result = error.response.data.result;
        if (result.result_code === 9405 && result.result_description) {
          alert(result.result_description);
          fetchOrder();
          return;
        }
      }
      alert('취소 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!orderData || orderData.order_resume_responses.length === 0) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <p>취소할 이력서가 없습니다.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
        >
          돌아가기
        </button>
      </div>
    );
  }

  const cancelableAmount = orderData.order_resume_responses
    .filter(resume => resume.status === 'PAID')
    .reduce((sum, resume) => sum + resume.price, 0);

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow-xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">주문 취소</h1>

      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800 text-sm">
          결제완료 상태인 이력서만 취소가 가능합니다.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex border">
          <div className="border-r w-2/6 p-3">주문 번호</div>
          <div className="w-4/6 p-3">{orderData.order_id}</div>
        </div>

        <h2 className="text-xl font-bold">취소할 이력서 목록</h2>
        {orderData.order_resume_responses.map((resume) => (
          <div key={resume.order_resume_id} 
               className={`border rounded p-4 ${resume.status !== 'PAID' ? 'bg-gray-50' : ''}`}>
            <div className="flex justify-between items-center">
              <div>
                <span className="mr-2">{resume.title}</span>
                <span className={`text-sm px-2 py-1 rounded ${
                  resume.status === 'PAID' ? 'bg-green-100 text-green-800' : ''}`}>
                  {resume.status === 'PAID' ? '결제 완료' : ''}
                </span>
              </div>
              <span className="font-medium">{resume.price.toLocaleString()}원</span>
            </div>
          </div>
        ))}

        <div className="flex justify-between items-center border-t pt-4 mt-6">
          <div>
            <span className="text-gray-600">취소 가능 금액: </span>
            <span className="font-bold text-lg">{cancelableAmount.toLocaleString()}원</span>
          </div>
          <div className="space-x-3">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
              disabled={isLoading}
            >
              이전
            </button>
            <button
              onClick={handleCancel}
              disabled={isLoading || cancelableAmount === 0}
              className={`px-4 py-2 rounded text-white ${
                isLoading || cancelableAmount === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              {isLoading ? '취소 처리중...' : '취소하기'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCancelView;