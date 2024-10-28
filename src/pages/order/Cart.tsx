import React, {useEffect, useState} from 'react';
import { useUser } from '../../hooks/useUser';
import CartCard from '../../components/order/CartCard';
import { GrPrevious } from "react-icons/gr";
import {getCartList, deleteCartItem, deleteCartAll} from "../../api/order";
export interface CartResumeItem {
  cart_resume_id: number;
  title: string;
  price: number;
}

export interface CartInfo {
  total_quantity: number;
  total_price: number;
  cart_resume_responses: CartResumeItem[];
}
const Cart: React.FC = () => {
  const [cartData, setCartData] = useState<CartInfo>({
    total_quantity: 0,
    total_price: 0,
    cart_resume_responses: []
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: user } = useUser();
  const [selectedItems, setSelectedItems] = useState<number[]>([]);  // 선택된 아이템의 ID 배열
  // 장바구니 데이터 조회 함수
  const fetchCartData = async () => {
    try {
      const response = await getCartList();
      console.log('장바구니 응답:', response); // 디버깅용
  
      if (response?.result?.result_code === 200) {
        setCartData(response.body);  // response.data가 아닌 response.body 사용
      } else {
        setError(response?.result?.result_message || '장바구니 조회에 실패했습니다.');
      }
    } catch (error) {
      console.error('장바구니 조회 실패:', error);
      setError('장바구니 조회 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);  // 로딩 상태 해제를 finally에서 처리
    }
  };
  const handleSelect = (cart_resume_id: number) => {
    setSelectedItems(prev => 
      prev.includes(cart_resume_id)
        ? prev.filter(id => id !== cart_resume_id)
        : [...prev, cart_resume_id]
    );
  };
  // 전체 선택 핸들러
  const handleSelectAll = () => {
    if (selectedItems.length === cartData.cart_resume_responses.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartData.cart_resume_responses.map(item => item.cart_resume_id));
    }
  };
  //선택 취소
  const handleCancelSelected = () => {
    if (selectedItems.length > 0) {
      setSelectedItems([]);
    }
  }

  const handleDeleteSelected = async () => {
    try {
      setLoading(true);
      const result = selectedItems.length === cartData.cart_resume_responses.length
        ? await deleteCartAll()
        : await deleteCartItem(selectedItems);

      if (result.result_code === 200) {
        // 삭제 성공 후 장바구니 데이터 새로 조회
        await fetchCartData();
        // 선택 상태 초기화
        setSelectedItems([]);
      }
    } catch (error) {
      console.error('삭제 실패:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const loadCartData = async () => {
      if (user) {
        setLoading(true);  // 데이터 로딩 시작
        await fetchCartData();
      } else {
        setLoading(false);  // 유저 정보가 없을 때도 로딩 상태 해제
      }
    };
  
    loadCartData();
  }, [user]);
  const selectedTotal = cartData.cart_resume_responses
  .filter(item => selectedItems.includes(item.cart_resume_id))
  .reduce((sum, item) => sum + item.price, 0);
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* 헤더 */}
      <div className="flex items-center gap-4 mb-8 pl-4">
        <GrPrevious className="text-2xl cursor-pointer hover:opacity-70" />
        <h1 className="text-3xl font-bold">장바구니</h1>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* 장바구니 리스트 */}
        <div className="lg:w-2/3 w-full">
          <div className="bg-white rounded-lg border shadow-sm">
            {loading ? (
              <div className="p-8 text-center">
                <p className="text-gray-500">로딩중...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <p className="text-red-500">{error}</p>
              </div>
            ) : cartData.cart_resume_responses.length > 0 ? (
              <ul className="divide-y">
                {cartData.cart_resume_responses.map((item: CartResumeItem) => (
                  <CartCard
                  key={item.cart_resume_id}
                  item={item}
                  isSelected={selectedItems.includes(item.cart_resume_id)}
                  onSelect={handleSelect}
                />
                ))}
              </ul>
            ) : (
              <div className="p-8 text-center text-gray-500">
                장바구니가 비어있습니다.
              </div>
            )}
          </div>
          {/* 수량 및 총금액 정보 */}
          <div className="bg-white rounded-lg border shadow-sm mt-4">
            <div className="grid grid-cols-2 divide-x">
              <div className="p-4 text-center space-y-1">
                <span className="text-gray-600 block text-sm">총 수량</span>
                <span className="font-bold text-lg">{cartData.total_quantity}</span>
              </div>
              <div className="p-4 text-center space-y-1">
                <span className="text-gray-600 block text-sm">총 금액</span>
                <span className="font-bold text-lg">{cartData.total_price.toLocaleString()}원</span>
              </div>
            </div>
          </div>
          {/* 전체 선택 영역 */}
          {cartData.cart_resume_responses.length > 0 && (
            <div className="mt-4 p-4 bg-white rounded-lg border shadow-sm flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={selectedItems.length === cartData.cart_resume_responses.length}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-gray-300" />
                <span>전체선택 ({selectedItems.length}/{cartData.total_quantity})</span>
              </label>
              <button
                onClick={handleDeleteSelected}
                disabled={selectedItems.length === 0} 
                className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                선택 삭제
              </button>
              <button
                onClick={handleCancelSelected}
                disabled={selectedItems.length === 0} 
                className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                선택 해제
              </button>
            </div>
          )}
        </div>

        {/* 주문 금액 정보 */}
        <div className="lg:w-1/3 w-full">
          <div className="bg-white rounded-lg border shadow-sm sticky top-4">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold mb-4">주문 예상 금액</h2>
              <div className="flex justify-between items-center text-lg">
                <span>수량</span>
                <span className="font-bold">{selectedItems.length}</span>
              </div>
              <div className="flex justify-between items-center text-lg">
                <span>결제 가격</span>
                <span className="font-bold">{selectedTotal.toLocaleString()}원</span>
              </div>
            </div>
            <div className="p-6">
              <button className="w-full py-4 bg-slate-800 text-white rounded-md hover:bg-slate-700 transition-colors font-medium">
                구매하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;