import { useEffect }  from 'react';
import { useSearchParams, useNavigate  } from 'react-router-dom';
export default function PaymentFail() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    useEffect(() => {
      const message = searchParams.get('message');
      const code = searchParams.get('code');
      
      // 실패 정보 처리
      console.error('Payment failed:', { message, code });
      setTimeout(() => {
        navigate('/orders');
      }, 3000);
    }, [searchParams, navigate]);
  
    return (
      <div>
        <h1>결제 실패</h1>
        {/* 결제 실패 UI */}
      </div>
    );
  }