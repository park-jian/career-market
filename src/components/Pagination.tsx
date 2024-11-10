import React from 'react';
import {RiContractLeftLine, RiArrowLeftLine, RiArrowRightLine, RiContractRightLine } from "react-icons/ri";
import { PaginationProps } from '../types/common';
// interface PaginationInfo {
//   currentPage: number;
//   totalPages: number;
// }

//const Pagination: React.FC<PaginationProps> = ({ paginationInfo, onPageChange }) => {
  const Pagination: React.FC<PaginationProps> = ({ onPageChange, hasResumes }) => {
    const handleClick = (action: 'first' | 'prev' | 'next' | 'last') => {
      if (!hasResumes) return;
      // if (!paginationInfo || typeof paginationInfo.currentPage === 'undefined' || typeof paginationInfo.totalPages === 'undefined') {
      //   console.error('Invalid pagination info');
      //   return;
      // }
      // let newPage = paginationInfo.currentPage;
      let pageStep: string;

      switch (action) {
        case 'first':
        // newPage = 1;
          pageStep = 'FIRST';
          break;
        case 'prev':
        //  newPage = Math.max(1, paginationInfo.currentPage - 1);
          pageStep = 'PREVIOUS';
          break;
        case 'next':
        //  newPage = Math.min(paginationInfo.totalPages, paginationInfo.currentPage + 1);
          pageStep = 'NEXT';
          break;
        case 'last':
      //   newPage = paginationInfo.totalPages;
          pageStep = 'LAST';
          break;
        default:
          return;
      }
      //onPageChange(newPage, pageStep);
      onPageChange(pageStep);
  }
  // paginationInfo가 없거나 필요한 속성이 없는 경우 렌더링하지 않음
  // if (!paginationInfo || typeof paginationInfo.currentPage === 'undefined' || typeof paginationInfo.totalPages === 'undefined') {
  //   return null;
  // }
  const buttonStyle = `
    p-1 rounded transition-all duration-200
    ${hasResumes 
      ? 'text-gray-800 hover:bg-gray-200 cursor-pointer' 
      : 'text-gray-300 cursor-not-allowed'}
  `;
  return (
    <div className="flex justify-center mt-6 mb-4">
        <div className='flex justify-between items-center text-3xl w-60'>
        <button className={buttonStyle} onClick={() => handleClick('first')} ><RiContractLeftLine  /></button>
        <button className={buttonStyle} onClick={() => handleClick('prev')}  ><RiArrowLeftLine /></button>
        <button className={buttonStyle} onClick={() => handleClick('next')} ><RiArrowRightLine  /></button>
        <button className={buttonStyle} onClick={() => handleClick('last')} ><RiContractRightLine  /></button>
        </div>
    </div>
  );
}

export default Pagination;