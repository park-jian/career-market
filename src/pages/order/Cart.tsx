// import React from 'react';
import CartCard from '../../components/order/CartCard';
// import useOrders from '../../hooks/useOrders';
import { CartInfo, CartResumeItem  } from '../../types/order';
import { GrPrevious } from "react-icons/gr";

const Cart: React.FC = () => {
  // const { cartQuery } = useOrders();
  //const { isLoading, error, data: cartInfoArray   } = cartQuery;
  return (
    <div className='flex flex-col'>
      <div className='mb-10 ml-4 text-4xl flex'>
      <GrPrevious className='cursor-pointer'/><div>장바구니</div>
      </div>
      <div className='flex w-5/6'>
        <div className='border-2 w-4/6 mr-4'>
        {/* {isLoading && <p>Loading...</p>}
        {error && <p>{error.message}</p>}
          <ul className="w-full flex p-4">
            {cartInfoArray  && cartInfoArray.flatMap((cartInfo: CartInfo) => 
              cartInfo.cart_resume_responses.map((item: CartResumeItem) => (
                <CartCard key={item.cart_resume_id} item={item}/>
              ))
            )}
          </ul> */}
        </div>
      
        <div id="cartTotal" className='border-2 w-2/6'>
          <div id="cartTotalPriceInner" className='border-b-2 p-4'> 
            <div className='font-bold text-2xl mb-2'>주문 예상 금액</div>
            <div className='flex justify-between'>
              <div>총 상품 가격</div>
              <div className=''>0원</div>
            </div>
          </div>
          <div id="orderButton" className='text-center p-4'>
            <button className='bg-slate-600 w-full text-white'>구매하기</button>
          </div>
        </div>
      </div>
      <div className='flex py-3 pl-6 items-center'>
        <div className='mr-2'><input type="checkbox" className='mr-2'/><label>전체선택(8/8)</label></div>
        <button className='border border-slate-400'>전체삭제</button>
      </div>
    </div>
  );
};

export default Cart;