import React from 'react';
import { Link } from 'react-router-dom';
import {useUser} from '../hooks/useUser';
import LogoutButton from './user/LogoutButton';
import { NavbarProps } from '../types/common';

const Navbar: React.FC<NavbarProps> = ({ isHovered, setIsHovered }) => {
  const { data: user } = useUser();
  const linkClass = `inline-block transition-colors duration-300 ${
    isHovered ? 'text-black' : 'text-white'
  }`;
  return (
    <nav className={`relative ${
        isHovered ? 'bg-white' : 'bg-transparent'
      }`}
      onMouseEnter={() => setIsHovered(true)} 
        onMouseLeave={() => {
          setIsHovered(false);
        }}>
      <ul className="flex w-full items-center justify-end text-sm relative z-10 py-2">
        <li className="relative px-4">
        {user ?  (
          <Link to="/users/me" className={linkClass}>
            <span>{user.name}님</span>
          </Link>
          ) : (
            <Link to="/users/register" className={linkClass}>
            회원가입
          </Link>
          )}
          {/* <span className={`absolute top-1/2 -translate-y-1/2 right-0 w-px h-4 transition-colors duration-300 ${
            isHovered ? 'bg-gray-400' : 'bg-gray-200'
          }`} /> */}
        </li>
        <li className="relative px-4">
        {user ?  (
           <LogoutButton className={linkClass} />
        ) : (
          <Link to="/users/login" className={linkClass}>
            로그인
          </Link>
          
        )}
          
          {/* <span className={`absolute top-1/2 -translate-y-1/2 right-0 w-px h-4 transition-colors duration-300 ${
            isHovered ? 'bg-gray-400' : 'bg-gray-200'
          }`} /> */}
        </li>
        {/* <li className="px-4">
          <Link to="/users/register" className={linkClass}>
            회원가입
          </Link>
        </li> */}
      </ul>
    </nav>
  );
}

export default Navbar;