import React from 'react';
import {RiContractLeftLine, RiArrowLeftLine, RiArrowRightLine, RiContractRightLine } from "react-icons/ri";

// interface PaginationInfo {
//   currentPage: number;
//   totalPages: number;
// }
interface PaginationProps {
  //paginationInfo: PaginationInfo;
  //onPageChange: (page: number, pageStep: string) => void;
  onPageChange: (pageStep: string) => void;
}

//const Pagination: React.FC<PaginationProps> = ({ paginationInfo, onPageChange }) => {
  const Pagination: React.FC<PaginationProps> = ({ onPageChange }) => {
 const handleClick = (action: 'first' | 'prev' | 'next' | 'last') => {
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
  return (
    <div className="flex justify-center mt-6 mb-4">
        <div className='flex justify-between items-center text-3xl w-60'>
        <button className="hover:bg-gray-200 p-1 rounded" onClick={() => handleClick('first')} ><RiContractLeftLine  /></button>
        <button className="hover:bg-gray-200 p-1 rounded" onClick={() => handleClick('prev')}  ><RiArrowLeftLine /></button>
        <button className="hover:bg-gray-200 p-1 rounded" onClick={() => handleClick('next')} ><RiArrowRightLine  /></button>
        <button className="hover:bg-gray-200 p-1 rounded" onClick={() => handleClick('last')} ><RiContractRightLine  /></button>
        </div>
    </div>
  );
}

export default Pagination;