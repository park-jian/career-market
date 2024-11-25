import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { getOrderListView, confirmImmediately } from '../../api/order';
import { OrderOneInfo } from '../../types/order';
import { convertToKST } from '../../utils/dateUtils';
const OrderView: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [orderData, setOrderData] = useState<OrderOneInfo | null>(null);
  const [selectedResumes, setSelectedResumes] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const fetchOrder = useCallback(async () => {
    if (orderId) {
      try {
        const _orderId = Number(orderId);
        const data = await getOrderListView(_orderId);
        if (data.result.result_code === 200) {
          setOrderData(data.body);
          console.log("주문상세:", data.body);
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          console.error('Error message:', err.message);
          console.error('Error response:', err.response?.data);
        } else {
          console.error('Unexpected error:', err);
        }
        console.log('Failed to fetch order.');
      }
    }
  }, [orderId]);
  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleCheckboxChange = (resumeId: number) => {
    setSelectedResumes(prev => {
      if (prev.includes(resumeId)) {
        return prev.filter(id => id !== resumeId);
      } else {
        return [...prev, resumeId];
      }
    });
  };

  const handleSelectAll = () => {
    if (!orderData) return;
    if (selectedResumes.length === orderData.order_resume_responses.length) {
      setSelectedResumes([]);
    } else {
      const allResumeIds = orderData.order_resume_responses
        .filter(resume => resume.status === 'PAID')
        .map(resume => resume.order_resume_id);
      setSelectedResumes(allResumeIds);
    }
  };

  const handleCancel = async () => {
    if (!orderData || selectedResumes.length === 0) {
      alert('취소할 이력서를 선택해주세요.');
      return;
    }
    // CONFIRM 상태인 이력서가 있는지 확인
    const hasConfirmed = selectedResumes.some(id => 
      orderData.order_resume_responses.find(
        resume => resume.order_resume_id === id && resume.status === 'SENT'
      )
    );

    if (hasConfirmed) {
      alert('구매확정된 이력서는 취소할 수 없습니다.');
      return;
    }
    setIsLoading(true);
    navigate(`/orders/${orderId}/cancel`, { 
      state: { selectedResumeIds: selectedResumes }
    });
  };
  const handleConfirmImmediately = async (orderId: number, resumeId: number) => {
    try {
      const response = await confirmImmediately(orderId, resumeId);
      if (response.result.result_code === 200) {
        alert('구매가 확정되었습니다.');
        fetchOrder(); // 주문 정보 새로고침
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.data?.result) {
          alert(err.response?.data?.result.result_description);
        }
      } else {
        console.error('Unexpected error:', err);
      }
      fetchOrder();
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow-xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">주문 상세조회</h1>
      {orderData ? (
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex border">
              <div className='border-r w-2/6 p-3'>주문 번호</div>
              <div className='w-4/6 p-3'>{orderData.order_id}</div>
            </div>
            <div className="flex border">
              <div className='border-r w-2/6 p-3'>결제일시</div>
              <div className='w-4/6 p-3'>{convertToKST(orderData.paid_at).toLocaleString()}</div>
            </div>
            <div className="flex border">
              <div className='border-r w-2/6 p-3'>이메일</div>
              <div className='w-4/6 p-3'>{orderData.email}</div>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">주문 이력서 목록</h2>
              <div className="space-x-2">
                <button
                  onClick={handleSelectAll}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                >
                  전체선택
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isLoading || selectedResumes.length === 0}
                  className={`px-3 py-1 rounded text-sm text-white ${
                    isLoading || selectedResumes.length === 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  {isLoading ? '취소 처리중...' : '선택항목 취소'}
                </button>
              </div>
            </div>
            {orderData.order_resume_responses.some(resume => resume.status === 'PAID') && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">
                  결제완료 후 30~60분 이내에 자동으로 구매확정이 되며, 구매확정 후에는 취소가 불가능합니다.
                </p>
              </div>
            )}
            {orderData.order_resume_responses.map((resume) => (
              <div key={resume.order_resume_id} className="border mb-4 rounded-lg">
                <div className="flex">
                  {/* 체크박스 열 */}
                  <div className="w-12 flex items-center justify-center border-r">
                    {['PAID'].includes(resume.status) && (
                      <input
                        type="checkbox"
                        checked={selectedResumes.includes(resume.order_resume_id)}
                        onChange={() => handleCheckboxChange(resume.order_resume_id)}
                        className="h-4 w-4 text-blue-600"
                      />
                    )}
                  </div>
                  {/* 상세 정보 영역 */}
                  <div className="flex-1">
                    <div className="flex border-b">
                      <div className='border-r w-2/6 p-3'>제목</div>
                      <div className='w-4/6 p-3'>{resume.title}</div>
                    </div>
                    <div className="flex border-b">
                      <div className='border-r w-2/6 p-3'>상태</div>
                      <div className='w-4/6 p-3'>
                        <span className={`py-1 rounded`}>
                          {
                          resume.status === 'PAID' ? '결제 완료' : 
                          resume.status === 'CANCEL' ? '주문 취소' : 
                          resume.status === 'SENT' ? '전송완료' : ''}
                        </span>
                        {resume.status === 'PAID' && (
                          <button
                            onClick={() => handleConfirmImmediately(Number(orderId), Number(resume.order_resume_id))}
                            className="mx-6 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm"
                          >
                            즉시 구매확정
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="flex border-b">
                      <div className='border-r w-2/6 p-3'>가격</div>
                      <div className='w-4/6 p-3'>{resume.price.toLocaleString()}원</div>
                    </div>
                    {resume.sent_at && (
                      <div className="flex border-b">
                        <div className='border-r w-2/6 p-3'>전송일시</div>
                        <div className='w-4/6 p-3'>{convertToKST(resume.sent_at).toLocaleString()}</div>
                      </div>
                    )}
                    {resume.canceled_at && (
                      <div className="flex border-b">
                        <div className='border-r w-2/6 p-3'>취소일시</div>
                        <div className='w-4/6 p-3'>{convertToKST(resume.canceled_at).toLocaleString()}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <div className="flex border bg-gray-50">
              <div className='border-r w-2/6 p-3 font-bold'>총 결제금액</div>
              <div className='w-4/6 p-3 font-bold'>{orderData.total_amount.toLocaleString()}원</div>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default OrderView;