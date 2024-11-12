import React from 'react';
import {RiContractLeftLine, RiArrowLeftLine, RiArrowRightLine, RiContractRightLine } from "react-icons/ri";
import { PaginationProps } from '../types/common';

  const Pagination: React.FC<PaginationProps> = ({ currentPage, onPageChange }) => {
    const handleClick = (action: 'first' | 'prev' | 'next' | 'last') => {
      let pageStep: string;
      switch (action) {
        case 'first':
          pageStep = 'FIRST';
          break;
        case 'prev':
          pageStep = 'PREVIOUS';
          break;
        case 'next':
          pageStep = 'NEXT';
          break;
        case 'last':
          pageStep = 'LAST';
          break;
        default:
          return;
      }
      onPageChange(pageStep);
  }
  return (
    <div className="flex justify-center mt-6 mb-4">
        <div className='flex justify-between items-center text-3xl w-60'>
        <button
         className={`p-1 rounded transition-all duration-200 
          ${currentPage === 'none' || currentPage === 'first' ? 'text-gray-300 cursor-not-allowed'
          : 'text-gray-800 hover:bg-gray-200 cursor-pointer'}`} 
          onClick={() => handleClick('first')} ><RiContractLeftLine  /></button>
        <button 
          className={`p-1 rounded transition-all duration-200 
          ${currentPage === 'none' || currentPage === 'first' ? 'text-gray-300 cursor-not-allowed'
          : 'text-gray-800 hover:bg-gray-200 cursor-pointer'}`} 
          onClick={() => handleClick('prev')}  ><RiArrowLeftLine /></button>
        <button
          className={`p-1 rounded transition-all duration-200 
          ${currentPage === 'none' || currentPage === 'last' ? 'text-gray-300 cursor-not-allowed'
          : 'text-gray-800 hover:bg-gray-200 cursor-pointer'}`}
          onClick={() => handleClick('next')} ><RiArrowRightLine  /></button>
        <button
          className={`p-1 rounded transition-all duration-200 
          ${currentPage === 'none' || currentPage === 'last' ? 'text-gray-300 cursor-not-allowed'
          : 'text-gray-800 hover:bg-gray-200 cursor-pointer'}`}
          onClick={() => handleClick('last')} ><RiContractRightLine  /></button>
        </div>
    </div>
  );
}

export default Pagination;