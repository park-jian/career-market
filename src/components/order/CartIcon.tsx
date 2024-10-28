import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { BsHandbag } from "react-icons/bs";

const CartIcon: React.FC<{ isHovered: boolean }> = ({ isHovered }) => {
    const [cartItemCount, setCartItemCount] = useState(1); // 예시를 위해 1로 설정
  
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