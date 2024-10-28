import React from 'react';
import { BrowserRouter as Router, Route, Routes, Outlet, Navigate, useLocation } from 'react-router-dom';
import NotFound from './pages/NotFound';
// import {AuthProvider, useAuth } from './auth/AuthContext';
import {useUser} from './hooks/useUser';
//메인페이지
import Home from './pages/Home';

//사용자
import UserRegister from './pages/user/Register'; //회원등록
import UserLogin from './pages/user/Login'; //로그인
import UserProfile from './pages/user/Profile'; //나의 정보 조회
import PasswordSearch from './pages/user/PasswordSearch'; //나의 정보 조회
import Secession from './pages/user/Secession'; //탈퇴

//이력서
import ResumeRegister from './pages/resume/Register';  //이력서 등록
import ResumeEdit from './pages/resume/Edit';  //이력서 수정
import ResumeList from './pages/resume/List';  //이력서 조회
import SalesResumeList from './pages/resume/SalesResumeList'; //이력서 판매글 조회 (비로그인 포함)
import SalesResumeView from './pages/resume/SalesResumeView'; //판매글 단건 상세 조회
import MySalesResumes from './pages/resume/MySalesResumes'; //자신이 판매중인 판매글 내역 조회
import OrderList from './pages/order/OrderList'; //주문내역 전체 조회
import OrderDetail from './pages/order/OrderDetail'; //주문내역 상세조회

//관리자
import AdminResumeList from './pages/admin/AdminResumeList'; //  관리자용 이력서 list 전체 조회
import AdminResumeView from './pages/admin/AdminResumeView'; //관리자용 이력서 list 조회 상세

//장바구니
import Cart from './pages/order/Cart'; //장바구니

import Header from './components/Header'

import RegisterSuccess from './pages/user/RegisterSuccess';
// import Footer from './components/Footer'
// PrivateRoute 컴포넌트 정의
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: user, isLoading } = useUser();
  const location = useLocation();
  console.log("PrivateRoute:", user);
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/users/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
const App: React.FC = () => {
  return (
    <Router>
      
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/" element={<Home />} />
          <Route path="/users/register" element={<UserRegister />} />
          <Route path="/users/login" element={<UserLogin />} />
          <Route path="/users/password/new" element={<PasswordSearch />} />
          <Route path="/users/join_success" element={<PrivateRoute><RegisterSuccess /></PrivateRoute>} />

          <Route path="/users/me" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
          <Route path="/users/secession" element={<PrivateRoute><Secession /></PrivateRoute>} />

          
          <Route path="/resumes/list" element={<ResumeList />} />
          <Route path="/resumes/:salesPostId" element={<PrivateRoute><SalesResumeView /></PrivateRoute>} />

          <Route path="/resumes/pending" element={<PrivateRoute><SalesResumeList /></PrivateRoute>} />
          <Route path="/resumes/pending/:salesPostId" element={<PrivateRoute><SalesResumeView /></PrivateRoute>} />
          <Route path="/resumes/register" element={<ResumeRegister />} />
          <Route path="/resumes/:id" element={<PrivateRoute><ResumeEdit /></PrivateRoute>} />
          <Route path="/resumes/sale-resumes/" element={<PrivateRoute><MySalesResumes /></PrivateRoute>} />
          <Route path="/orders" element={<PrivateRoute><OrderList /></PrivateRoute>} />
          <Route path="/orders/:salesPostId" element={<PrivateRoute><OrderDetail /></PrivateRoute>} />
          <Route path="/resumes/admin" element={<PrivateRoute><AdminResumeList /></PrivateRoute>} />
          <Route path="/resumes/admin/:resumeId" element={<PrivateRoute><AdminResumeView /></PrivateRoute>} />

          <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />

          {/* NotFound route */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
    
  );
};
const Layout: React.FC = () => {
  return (
      <div className='min-h-screen flex flex-col'>
        {/* 헤더는 전체 너비 사용 */}
        <div className='w-full'>
          <Header />
        </div>
        
        {/* 컨텐츠 영역은 중앙 정렬 및 여백 설정 */}
        <div className='flex-grow flex justify-center'>
          <main className='w-full mx-auto px-4
            md:max-w-[768px] 
            lg:max-w-[1024px] lg:px-8
            xl:max-w-[1280px] xl:px-12'
          >
            <Outlet />
          </main>
        </div>
        
        {/* 푸터도 필요하다면 헤더처럼 전체 너비 사용 */}
        {/* <div className='w-full'>
          <Footer />
        </div> */}
      </div>
  );
}
export default App;
