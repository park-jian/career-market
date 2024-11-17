import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { getOrderListView, cancelOrderResume, cancelOrderResumeAll } from '../../api/order';
import { OrderOneInfo } from '../../types/order';

const OrderView: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [orderData, setOrderData] = useState<OrderOneInfo | null>(null);
  const [selectedResumes, setSelectedResumes] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchOrder();
  }, [orderId]);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 60 * 1000); // 1분마다

    return () => clearInterval(intervalId);
  }, []);
  useEffect(() => {
    if (!orderData || !orderData.paid_at) return;
    const now = new Date();
    const paidAt = new Date(orderData.paid_at);
    const localPaidAt = new Date(paidAt.getTime() + (9 * 60 * 60 * 1000));
    // 결제시간의 분 추출
    const paidMinutes = localPaidAt.getMinutes();
    
    // 현재 시간과 결제 시간의 차이(분)
    const diffMinutes = Math.floor((currentTime.getTime() - localPaidAt.getTime()) / (1000 * 60));
    
    // 구매확정까지 남은 시간 계산
    let remainingMinutes;
    if (paidMinutes < 30) {
      // 0~30분 사이 결제: (30-결제분) + 30분
      remainingMinutes = (30 - paidMinutes) + 30;
    } else {
      // 30~60분 사이 결제: (60-결제분) + 30분
      remainingMinutes = (60 - paidMinutes) + 30;
    }
  
    console.log('결제 시각:', localPaidAt.toLocaleTimeString());
    console.log('현재 시각:', now.toLocaleTimeString());
    console.log('경과 시간:', diffMinutes, '분');
    console.log('구매확정까지 남은 시간:', remainingMinutes - diffMinutes, '분');
  
    // 아직 구매확정 시간이 되지 않았다면 타이머 설정
    if (diffMinutes < remainingMinutes) {
      const timeUntilConfirmation = (remainingMinutes - diffMinutes) * 60 * 1000; // 밀리초로 변환
      
      const timerId = setTimeout(() => {
        // PAID 상태인 이력서만 SENT으로 변경
        const updatedResponses = orderData.order_resume_responses.map(resume => ({
          ...resume,
          status: resume.status === 'PAID' ? 'SENT' : resume.status
        }));
  
        setOrderData({
          ...orderData,
          order_resume_responses: updatedResponses
        });
  
        // 모든 체크박스 선택 해제
        setSelectedResumes([]);
      }, timeUntilConfirmation);
  
      return () => clearTimeout(timerId);
    } else {
      // 이미 구매확정 시간이 지났다면 바로 상태 변경
      const updatedResponses = orderData.order_resume_responses.map(resume => ({
        ...resume,
        status: resume.status === 'PAID' ? 'SENT' : resume.status
      }));
  
      setOrderData({
        ...orderData,
        order_resume_responses: updatedResponses
      });
      setSelectedResumes([]);
    }
  }, [orderData, currentTime]);
  const fetchOrder = async () => {
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
  };

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
    const confirmed = window.confirm(
      `선택하신 ${selectedResumes.length}개의 이력서를 취소하시겠습니까?`
    );

    if (!confirmed) return;

    setIsLoading(true);
    try {
      // PAID 상태인 이력서들의 ID 목록
        const cancelableResumes = orderData.order_resume_responses
        .filter(resume => resume.status === 'PAID')
        .map(resume => resume.order_resume_id);
  
        // 선택된 이력서 수가 취소 가능한(PAID 상태인) 전체 이력서 수와 같은지 확인
          const isFullCancellation = selectedResumes.length === cancelableResumes.length &&
          selectedResumes.every(id => cancelableResumes.includes(id));

        if (isFullCancellation) {
          // 전체 취소 API 호출
          await cancelOrderResumeAll(Number(orderId));
        } else {
          // 부분 취소 API 호출
          await cancelOrderResume(Number(orderId), selectedResumes);
        }

      // 주문 정보 새로고침
      await fetchOrder();
      setSelectedResumes([]);
      alert('선택하신 이력서가 취소되었습니다.');
    } catch (error) {
      console.error('Cancel failed:', error);
      alert('취소 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

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
              <div className='w-4/6 p-3'>{new Date(orderData.paid_at).toLocaleString()}</div>
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
                        // disabled={
                        //   ['PAID'].includes(resume.status) 
                        //   ? false : true}
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
                        <span className={`px-2 py-1 rounded ${
                          ['CANCEL', 'PARTIAL_CANCEL'].includes(resume.status) 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                        }`}>
                          {
                          resume.status === 'PAID' ? '결제 완료' : 
                          // resume.status === 'WAIT' ? '발송 대기' : 
                          // resume.status === 'PARTIAL_WAIT' ? '발송 부분 대기' : 
                          resume.status === 'CANCEL' ? '주문 취소' : 
                          // resume.status === 'PARTIAL_CANCEL' ? '부분 취소' : 
                          // resume.status === 'CONFIRM' ? '구매 확정' : 
                          // resume.status === 'PARTIAL_CONFIRM' ? '부분 구매 확정' :
                          resume.status === 'SENT' ? '전송완료' : ''}
                        </span>
                      </div>
                    </div>
                    <div className="flex border-b">
                      <div className='border-r w-2/6 p-3'>가격</div>
                      <div className='w-4/6 p-3'>{resume.price.toLocaleString()}원</div>
                    </div>
                    {resume.sent_at && (
                      <div className="flex border-b">
                        <div className='border-r w-2/6 p-3'>전송일시</div>
                        <div className='w-4/6 p-3'>{new Date(resume.sent_at).toLocaleString()}</div>
                      </div>
                    )}
                    {resume.canceled_at && (
                      <div className="flex border-b">
                        <div className='border-r w-2/6 p-3'>취소일시</div>
                        <div className='w-4/6 p-3'>{new Date(resume.canceled_at).toLocaleString()}</div>
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