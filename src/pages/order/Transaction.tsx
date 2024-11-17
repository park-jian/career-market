import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {useUser} from '../../hooks/useAuth';
import { LocationState} from '../../types/order';
import { v4 as uuidv4 } from 'uuid';
// 모듈 임포트 연동방식
import { loadTossPayments } from "@tosspayments/tosspayments-sdk"

const Transaction = () => {
  const location = useLocation();
  const { data: user } = useUser();
  const navigate = useNavigate();
  const { selectedProducts, totalQuantity, totalPrice } = 
    (location.state as LocationState) || { 
      selectedProducts: [], 
      totalQuantity: 0, 
      totalPrice: 0 
    };
  // 로그인이 필요한 기능이라면
  useEffect(() => {
    if (!user) {
      // 로그인 페이지로 리다이렉트
      navigate('/users/login');
    }
  }, [user]);

  // 또는 조건부 렌더링
  if (!user) {
    return <div>로그인이 필요한 서비스입니다</div>;
  }
  const handleTransaction = async () => {
    console.log("토스 위젯 오픈");
    //결제 창 초기화
    //const tossPayments = await loadTossPayments("test_ck_Z61JOxRQVEaJxAQ6K16RVW0X9bAq");
    const tossPayments = await loadTossPayments(`test_ck_Z61JOxRQVEaJxAQ6K16RVW0X9bAq`);
    const payment = tossPayments.payment({ customerKey: `${user.user_id}` });

    // 첫 번째 상품명 가져오기
    const firstProductTitle = selectedProducts[0]?.title || "상품";
    const remainingItems = totalQuantity > 1 ? ` 외 ${totalQuantity - 1}건` : "";
    // (Clock.systemUTC().millis() / 5000) + "#" + userId + "-" + uuidHolder.random()
    // // (uuid 5글자로 통일)
    try {
      const orderId = Math.floor(Date.now() / 5000) + "_" + `${user.user_id}` + "-" + uuidv4().slice(0, 5);
      const requestData = {
        resume_ids: selectedProducts.map(product => product.resume_id),
        payment_key: 'test_ck_Z61JOxRQVEaJxAQ6K16RVW0X9bAq',
        request_id: orderId,
        amount: totalPrice
      };
      console.log("requestData:", requestData);
      localStorage.setItem('paymentRequestData', JSON.stringify(requestData));

      console.log("orderid:",orderId)
      payment.requestPayment({
        method: "CARD",
        amount: {
          currency: "KRW",
          value: totalPrice,
        },
        orderId,
        orderName: `${firstProductTitle}${remainingItems}`,
        customerEmail: `${user.email}`,
        customerName: `${user.name}`,
        // windowTarget: "iframe",
        card: {
          useEscrow: false,
          flowMode: "DEFAULT",
          useCardPoint: false,
          useAppCardOnly: false,
        },
        successUrl: `https://resume-market.netlify.app/success`,
        failUrl: `https://resume-market.netlify.app/fail`,
        //successUrl: `${window.location.origin}/success`,
        //failUrl: `${window.location.origin}/fail`
      });
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-6">주문/결제</h2>
      
      {/* 구매자 정보 섹션 */}
      <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
        <h3 className="text-lg font-medium pb-4 mb-4 border-b-2">구매자정보</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-[120px,1fr] items-center gap-4">
            <label htmlFor="name" className="text-right">이름</label>
            <input
              type="text"
              id="name"
              name="name"
              value={user.name}
              readOnly
              className="max-w-[300px] border rounded px-3 py-1.5 focus:border-blue-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-[120px,1fr] items-center gap-4">
            <label htmlFor="email" className="text-right">이메일</label>
            <input
              type="email"
              id="email"
              name="email"
              value={user.email}
              readOnly
              className="max-w-[300px] border rounded px-3 py-1.5 focus:border-blue-500 outline-none"
            />
          </div>

        </div>
      </div>
        {/* 선택한 상품 목록 */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
          <h3 className="text-lg font-medium pb-4 mb-4 border-b-2">주문상품 정보</h3>
        <ul className="space-y-4">
          {selectedProducts.map(product => (
            <li key={product.cart_resume_id} className="flex justify-between">
              <span>{product.title}</span>
              <span>{product.price.toLocaleString()}원</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between font-medium">
            <span>총 {totalQuantity}개 상품</span>
            <span>{totalPrice.toLocaleString()}원</span>
          </div>
        </div>
      </div>
      {/* 결제 정보 섹션 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium pb-4 mb-4 border-b-2">결제 정보</h3>

        <div className="space-y-6">
          {/* 금액 정보 */}
          <div className="space-y-2">
            <div className="grid grid-cols-[120px,1fr] items-center">
              <span className="text-right">총 상품가격</span>
              <span className="ml-4 font-medium">{totalPrice.toLocaleString()}원</span>
            </div>
            <div className="grid grid-cols-[120px,1fr] items-center">
              <span className="text-right">할인쿠폰</span>
              <div className="flex items-center gap-2">
                <span className="ml-4 text-red-500">0원</span>
                <span className="ml-12 text-gray-500 text-sm">적용 가능한 할인쿠폰이 없습니다.</span>
              </div>
            </div>
            <div className="grid grid-cols-[120px,1fr] items-center">
              <span className="text-right font-medium">총결제금액</span>
              <span className="ml-4 font-medium">{totalPrice.toLocaleString()}원</span>
            </div>
          </div>

          {/* 결제 수단 선택 */}
          {/* <div className="space-y-4">
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2">
                <input type="radio" name="paymentMethod" value="account" className="w-4 h-4" />
                <span>계좌이체</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="paymentMethod" value="coupaymoney" className="w-4 h-4" />
                <span>쿠페이머니</span>
              </label>
              <label className="flex items-center gap-2">
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="credit-card" 
                  className="w-4 h-4"
                  defaultChecked 
                />
                <span>신용/체크카드</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="paymentMethod" value="phone" className="w-4 h-4" />
                <span>휴대폰</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="paymentMethod" value="deposit" className="w-4 h-4" />
                <span>무통장입금</span>
              </label>
            </div>

            <div className="border rounded-md p-4 space-y-4">
              <div className="space-y-2">
                <label className="block">카드선택</label>
                <select className="border rounded px-3 py-1.5 w-full max-w-[400px]">
                  <option>삼성카드</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block">할부기간</label>
                <select className="border rounded px-3 py-1.5 w-full max-w-[400px]">
                  <option>일시불</option>
                </select>
                <p className="text-sm text-gray-500">* 할부는 50,000원 이상만 가능합니다</p>
              </div>

              <div className="text-sm text-gray-500">
                해외발급 카드는 쿠팡 앱, 모바일 웹에서 사용 가능합니다
              </div>

              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-sm">기본 결제 수단으로 사용</span>
              </label>
            </div>
          </div> */}

          <div className="text-sm text-gray-500">
            위 주문 내용을 확인 하였으며, 회원 본인은 개인정보 이용 및 제공(해외직구의 경우 국외제휴사)에 동의합니다.
          </div>

          {/* 결제 버튼 */}
          <div className="flex gap-4">
            <button 
              type="button" 
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={handleTransaction}
            >
              결제하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transaction;