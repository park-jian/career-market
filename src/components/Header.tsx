import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GoPerson  } from "react-icons/go";
import { IoIosHome } from "react-icons/io";
import Navbar from './Navbar'
import CartIcon from '../components/order/CartIcon';

const Header: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isHoveredStr, setIsHoveredStr] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const linkClass = `flex flex-col items-center justify-center mx-4 transition-colors duration-300 ${
    isHovered ? 'text-black' : 'text-white'
  }`;
  const handleMouseOver = (id: string) => {
    setHoveredItem(id);
  }

  const handleMouseLeave = () => {
    setHoveredItem(null);
  }
  useEffect(() => {
    if (hoveredItem) {
      setIsHoveredStr(true);
    } else {
      setIsHoveredStr(false);
    }
  }, [hoveredItem]);
  const renderSubMenu = () => {
    switch (hoveredItem) {
      case 'resume':
        return (
          <div className="flex justify-center space-x-8">
            <Link to="/resumes/register" className="hover:underline hover:text-red-500">이력서 등록</Link>
            <Link to="/resumes/pending" className="hover:underline hover:text-red-500">요청중인 이력서</Link>
            <Link to="/resumes/sale-resumes" className="hover:underline hover:text-red-500">판매중인 이력서</Link>
            <Link to="/resumes/list" className="hover:underline hover:text-red-500">판매글</Link>
          </div>
        );
      case 'order':
        return (
          <div className="flex justify-center space-x-8">
            <Link to="/orders" className="hover:underline hover:text-red-500">주문 내역</Link>
          </div>
        );
      case 'customerCenter':
        return (
          <div className="flex justify-center space-x-8">
            <Link to="/users/inquiry" className="hover:underline hover:text-red-500">문의 하기</Link>
          </div>
        );
      default:
        return null;
    }
  }
  return (
    <div 
      className='relative h-[500px] font-bold border-b-2 border-slate-200'
      
    >
      <div className="absolute inset-0 z-0">
        <img src='https://images.unsplash.com/photo-1529400971008-f566de0e6dfc' className="w-full h-full object-cover" />
      </div>
      <div className={`relative z-10 flex flex-col w-full h-full transition-colors duration-300 `}>
        <Navbar isHovered={isHovered} setIsHovered={setIsHovered}/>
        <header className={`flex flex-col  text-lg w-full ${
          isHovered ? 'bg-white' : 'bg-transparent'
        }`} onMouseEnter={() => setIsHovered(true)} 
        onMouseLeave={() => {
          setIsHovered(false);
          handleMouseLeave();
        }}>
          <div className={`flex flex-row items-center justify-between`}>
          <div className="hidden sm:block sm:w-1/3"></div>
          <ul className="flex items-center justify-center font-bold text-sm relative z-10 py-2 w-full">
            <li className="relative px-2 sm:px-8" id="resume" onMouseEnter={() => handleMouseOver("resume")}>
                <strong className="hover:underline hover:text-red-500">이력서</strong>
            </li>
            <li className="relative px-2 sm:px-8 ml-8 sm:ml-16" id="order" onMouseEnter={() => handleMouseOver("order")}>
                <strong className="hover:underline hover:text-red-500">주문</strong>
            </li>
            <li className="relative px-2 sm:px-8 ml-8 sm:ml-16" id="order" onMouseEnter={() => handleMouseOver("customerCenter")}>
                <strong className="hover:underline hover:text-red-500">고객 센터</strong>
            </li>
          </ul>
            <div className="flex justify-end items-center h-full p-3 sm:p-3 w-auto sm:w-1/3">
              <Link to="/" className={linkClass}>
                <IoIosHome size="24" color={isHovered ? 'black' : 'white'}/>
                <span className='text-xs mt-1'>홈</span>
              </Link>
              
              <Link to="/resumes/sale-resumes" className={linkClass}>
                <GoPerson  size="24" color={isHovered ? 'coral' : 'white'}/>
                <span className={`text-xs mt-1 ${isHovered ? 'text-red-500' : 'text-white'}`}>나의 이력서</span>
              </Link>
              <CartIcon isHovered={isHovered} />
            </div>
          </div>
          <div className={`h-24 bg-white border-t-2 text-black justify-center items-center ${isHoveredStr ? 'flex' : 'hidden'}`}>{renderSubMenu()}</div>
        </header>
      </div>
    </div>
  );
}

export default Header;