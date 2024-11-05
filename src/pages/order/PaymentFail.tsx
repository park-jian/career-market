import { useEffect }  from 'react';
import { useSearchParams } from 'react-router-dom';

export default function PaymentFail() {
    const [searchParams] = useSearchParams();
    
    useEffect(() => {
      const message = searchParams.get('message');
      const code = searchParams.get('code');
      
      // 실패 정보 처리
      console.error('Payment failed:', { message, code });
    }, [searchParams]);
  
    return (
      <div>
        <h1>결제 실패</h1>
        {/* 결제 실패 UI */}
      </div>
    );
  }