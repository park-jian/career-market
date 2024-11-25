import { useEffect, useState }  from 'react';
import { useSearchParams, useNavigate  } from 'react-router-dom';
import { paymentConfirm } from '../../api/order';
import { useQueryClient } from '@tanstack/react-query';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient(); 
  useEffect(() => {
    const confirmPayment = async () => {
    const paymentKey = searchParams.get('paymentKey');
    const orderId = searchParams.get('orderId');
    const amount = searchParams.get('amount');
    const savedRequestData = localStorage.getItem('paymentRequestData');
    let parsedData; 
    if (savedRequestData && paymentKey && orderId && amount) {
      parsedData = JSON.parse(savedRequestData);
      // 사용 후 데이터 삭제
      localStorage.removeItem('paymentRequestData');
      console.log('Payment Success:', {
        requestData: parsedData,
        paymentKey,
        request_id: orderId,
        amount,
      });

      // 결제 승인 요청
      try {
        const result = await paymentConfirm({
          resume_ids: parsedData.resume_ids,
          payment_key: paymentKey,
          request_id: orderId,
          amount: Number(amount)
        });
        setLoading(false);
        if (result.result_code === 200) {  // 성공 코드는 서버 응답에 따라 수정
          // 결제 성공 시 장바구니 데이터 갱신
          queryClient.invalidateQueries({ queryKey: ['cart'] });
          setTimeout(() => {
            navigate('/orders');
          }, 3000);
        }
      } catch (error) {
        console.log("결제실패:", error)
        setLoading(false);
        setError('결제 확인 중 오류가 발생했습니다.');
        navigate('/');  // 에러 시 메인 페이지로 이동
      }
    }
  };

  confirmPayment();
    
  }, [searchParams, navigate, queryClient]);

  if (loading) {
    return (
      <div className="flex flex-col items-center mt-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-4" />
        <p>결제 확인 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center mt-20">
        <h1 className="text-2xl font-bold text-red-500 mb-4">오류 발생</h1>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          메인으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center mt-20">
      <h1 className="text-2xl font-bold text-green-500 mb-4">결제 성공!</h1>
      <p className="text-gray-600 mb-2">결제가 성공적으로 완료되었습니다.</p>
      <p className="text-gray-600 mb-4">잠시 후 주문 내역 페이지로 이동합니다...</p>
      <button 
        onClick={() => navigate('/mypage/orders')}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        바로 이동하기
      </button>
    </div>
  );
}
