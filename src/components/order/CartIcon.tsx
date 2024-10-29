import { Link } from 'react-router-dom';
import React from 'react';
import { BsHandbag } from "react-icons/bs";
import { useUser } from '../../hooks/useUser';
import { useQuery } from '@tanstack/react-query';
import { getCartList } from '../../api/order';

const CartIcon: React.FC<{ isHovered: boolean }> = ({ isHovered }) => {
  const { data: user } = useUser();
  const { data: cartData } = useQuery({
    queryKey: ['cart'],
    queryFn: getCartList,
    enabled: !!user, // user가 있을 때만 실행
    staleTime: 1000 * 60, // 1분간 캐시 유지
  });
  const cartItemCount = cartData?.body?.total_quantity || 0;

  return (
    <div className="relative flex flex-col items-center justify-center mx-4">
      <Link to="/cart" className="flex flex-col items-center justify-center">
        <div className="relative">
          <BsHandbag size="24" color={isHovered ? 'black' : 'white'}/>
          {cartItemCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {cartItemCount}
            </span>
          )}
        </div>
        <span className={`text-xs mt-1 ${isHovered ? 'text-black' : 'text-white'}`}>장바구니</span>
      </Link>
    </div>
  );
};
export default CartIcon;