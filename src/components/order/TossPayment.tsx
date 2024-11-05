import { loadTossPayments, TossPaymentsPayment  } from "@tosspayments/tosspayments-sdk";
import React, { useEffect, useState } from "react";

// ------  SDK 초기화 ------
const clientKey = "test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq";
const customerKey = generateRandomString();

interface Amount {
  currency: string;
  value: number;
}

const amount: Amount = {
  currency: "KRW",
  value: 50000,
 };
// interface PaymentRequestParams {
//   method: 'CARD' | 'TRANSFER' | 'VIRTUAL_ACCOUNT' | 'MOBILE_PHONE' | 'CULTURE_GIFT_CERTIFICATE' | 'FOREIGN_EASY_PAY';
//   amount: {
//     currency: string; // 통화
//     value: number; // 금액
//   };
//   orderId: string; // 고유 주문번호
//   orderName: string; // 주문 이름
//   successUrl: string; // 성공 시 리다이렉트 URL
//   failUrl: string; // 실패 시 리다이렉트 URL
//   customerEmail: string; // 고객 이메일
//   customerName: string; // 고객 이름
//   customerMobilePhone: string; // 고객 전화번호
//   card?: { // 카드 관련 속성
//     useEscrow: boolean;
//     flowMode: string;
//     useCardPoint: boolean;
//     useAppCardOnly: boolean;
//   };
//   transfer?: { // 계좌이체 관련 속성
//     cashReceipt: {
//       type: string; // 소득공제 등
//     };
//     useEscrow: boolean; // 에스크로 사용 여부
//   };
//   virtualAccount?: { // 가상계좌 관련 속성
//     cashReceipt: {
//       type: string; // 소득공제 등
//     };
//     useEscrow: boolean; // 에스크로 사용 여부
//     validHours: number; // 유효 시간
//   };
//   foreignEasyPay?: {
//     provider: string,
//     country: string,
//   },
// }

// interface BillingAuthParams {
//   method: string; // 자동 결제 방법
//   successUrl: string; // 성공 시 리다이렉트 URL
//   failUrl: string; // 실패 시 리다이렉트 URL
//   customerEmail: string; // 고객 이메일
//   customerName: string; // 고객 이름
// }
// interface TossPaymentsPayment {
//   requestPayment: (params: PaymentRequestParams) => Promise<void>;
//   requestBillingAuth: (params: BillingAuthParams) => Promise<void>;
// }
const TossPayment: React.FC = () => {
  const [payment, setPayment] = useState<TossPaymentsPayment | null>(null); // 타입을 TossPaymentsPayment로 설정할 수 있습니다.
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);

  function selectPaymentMethod(method: string) {
    setSelectedPaymentMethod(method);
  }

  useEffect(() => {
    async function fetchPayment() {
      try {
        const tossPayments = await loadTossPayments(clientKey);
        const payment = tossPayments.payment({ customerKey });

        setPayment(payment);
      } catch (error) {
        console.error("Error fetching payment:", error);
      }
    }

    fetchPayment();
  }, []);

  // ------ '결제하기' 버튼 누르면 결제창 띄우기 ------
  async function requestPayment() {
    if (!payment || !selectedPaymentMethod) return;

    const commonParams = {
      amount,
      orderId: generateRandomString(),
      orderName: "토스 티셔츠 외 2건",
      successUrl: `${window.location.origin}/payment/success`,
      failUrl: `${window.location.origin}/fail`,
      customerEmail: "customer123@gmail.com",
      customerName: "김토스",
      customerMobilePhone: "01012341234",
    };

    switch (selectedPaymentMethod) {
      case "CARD":
        await payment.requestPayment({
          ...commonParams,
          method: "CARD",
          card: {
            useEscrow: false,
            flowMode: "DEFAULT",
            useCardPoint: false,
            useAppCardOnly: false,
          },
        });
        break;
      case "TRANSFER":
        await payment.requestPayment({
          ...commonParams,
          method: "TRANSFER",
          transfer: {
            cashReceipt: {
              type: "소득공제",
            },
            useEscrow: false,
          },
        });
        break;
      case "VIRTUAL_ACCOUNT":
        await payment.requestPayment({
          ...commonParams,
          method: "VIRTUAL_ACCOUNT",
          virtualAccount: {
            cashReceipt: {
              type: "소득공제",
            },
            useEscrow: false,
            validHours: 24,
          },
        });
        break;
      case "MOBILE_PHONE":
        await payment.requestPayment({
          ...commonParams,
          method: "MOBILE_PHONE",
        });
        break;
      case "CULTURE_GIFT_CERTIFICATE":
        await payment.requestPayment({
          ...commonParams,
          method: "CULTURE_GIFT_CERTIFICATE",
        });
        break;
      case "FOREIGN_EASY_PAY":
        await payment.requestPayment({
          method: "FOREIGN_EASY_PAY",
          amount: {
            value: 100,
            currency: "USD",
          },
          orderId: generateRandomString(),
          orderName: "토스 티셔츠 외 2건",
          successUrl: `${window.location.origin}/payment/success`,
          failUrl: `${window.location.origin}/fail`,
          customerEmail: "customer123@gmail.com",
          customerName: "김토스",
          customerMobilePhone: "01012341234",
          foreignEasyPay: {
            provider: "PAYPAL",
            country: "KR",
          },
        });
        break;
      default:
        console.error("Unknown payment method");
    }
  }

  async function requestBillingAuth() {
    if (!payment) return;

    await payment.requestBillingAuth({
      method: "CARD", // 자동결제(빌링)은 카드만 지원합니다
      successUrl: `${window.location.origin}/payment/billing`,
      failUrl: `${window.location.origin}/fail`,
      customerEmail: "customer123@gmail.com",
      customerName: "김토스",
    });
  }

  return (
    <div className="wrapper">
      <div className="box_section">
        <h1>일반 결제</h1>
        <div id="payment-method" style={{ display: "flex" }}>
          {["CARD", "TRANSFER", "VIRTUAL_ACCOUNT", "MOBILE_PHONE", "CULTURE_GIFT_CERTIFICATE", "FOREIGN_EASY_PAY"].map(method => (
            <button
              key={method}
              id={method}
              className={`button2 ${selectedPaymentMethod === method ? "active" : ""}`}
              onClick={() => selectPaymentMethod(method)}
            >
              {method === "CULTURE_GIFT_CERTIFICATE" ? "문화상품권" : method}
            </button>
          ))}
        </div>
        <button className="button" onClick={requestPayment}>
          결제하기
        </button>
      </div>
      <div className="box_section">
        <h1>정기 결제</h1>
        <button className="button" onClick={requestBillingAuth}>
          빌링키 발급하기
        </button>
      </div>
    </div>
  );
}

function generateRandomString(): string {
  return window.btoa(Math.random().toString()).slice(0, 20);
}

export default TossPayment;