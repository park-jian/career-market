import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-2xl text-gray-600 mb-8">페이지를 찾을 수 없습니다</p>
      <p className="text-lg text-gray-500 mb-8">
        죄송합니다. 요청하신 페이지를 찾을 수 없습니다.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
};

export default NotFound;