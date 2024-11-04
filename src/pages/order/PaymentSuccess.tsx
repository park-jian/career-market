import React, { useEffect }  from 'react';
import { useSearchParams } from 'react-router-dom';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    const paymentKey = searchParams.get('paymentKey');
    const orderId = searchParams.get('orderId');
    const amount = searchParams.get('amount');

    //debugger;
    if (paymentKey && orderId && amount) {
      // 결제 승인 요청
      //confirmPayment({ paymentKey, orderId, amount: Number(amount) });
    }
  }, [searchParams]);

  return (
    <div>
      <h1>결제 성공</h1>
      {/* 결제 성공 UI */}
    </div>
  );
}
