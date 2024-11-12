import React, {useEffect} from 'react';
import { Route, Routes, Outlet, Navigate, useLocation } from 'react-router-dom';
import NotFound from './pages/NotFound';
import {useUser, useAuth } from './hooks/useAuth';
//메인페이지
import Home from './pages/Home';

//사용자
import UserRegister from './pages/user/Register'; //회원등록
import UserLogin from './pages/user/Login'; //로그인
import UserProfile from './pages/user/Profile'; //나의 정보 조회
import PasswordSearch from './pages/user/PasswordSearch'; //비밀번호 찾기
import Secession from './pages/user/Secession'; //탈퇴

//이력서
import ResumeList from './pages/resume/List';  //이력서 조회
import MySalesResumes from './pages/resume/MySalesResumes'; //자신이 판매중인 판매글 내역 조회
import ResumeRegister from './pages/resume/Register';  //이력서 등록
import PendingResumeList from './pages/resume/PendingResumeList'; //판매 요청중인 이력서 조회
import PendingResumeView from './pages/resume/PendingResumeView'; //판매 요청중인 이력서 단건 조회
import SalesResumeView from './pages/resume/SalesResumeView'; //판매글 단건 상세 조회
import OrderList from './pages/order/OrderList'; //주문내역 전체 조회
import OrderView from './pages/order/OrderView'; //주문내역 상세조회

//관리자
import AdminResumeList from './pages/admin/AdminResumeList'; //  관리자용 이력서 list 전체 조회
import AdminResumeView from './pages/admin/AdminResumeView'; //관리자용 이력서 list 조회 상세

//장바구니
import Cart from './pages/order/Cart'; //장바구니
//결제
import Transaction from './pages/order/Transaction';
import PaymentSuccess from './pages/order/PaymentSuccess';
import PaymentFail from './pages/order/PaymentFail';

import Header from './components/Header'

import RegisterSuccess from './pages/user/RegisterSuccess';
// import Footer from './components/Footer'
// PrivateRoute 컴포넌트 정의
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: user, isLoading } = useUser();
  const location = useLocation();
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
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: user, isLoading } = useUser();
  const location = useLocation();

  // 로딩 중일 때의 UI
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
  if (user.status !== "ADMIN") {  // 또는 user.role !== 'ADMIN'
    return <Navigate to="/" replace />;  // 홈으로 리다이렉트
  }

  return <>{children}</>;
};
const App: React.FC = () => {
  const { initializeAuth } = useAuth();

  // 컴포넌트 마운트 시 인증 상태 복구
  useEffect(() => {
    const restoreAuth = async () => {
      await initializeAuth();
    };
    restoreAuth();
  }, [initializeAuth]);

  return (
      <Routes>
        <Route path="/resumes/admin" element={<AdminRoute><AdminResumeList /></AdminRoute>} />
        <Route path="/resumes/admin/:resumeId" element={<AdminRoute><AdminResumeView /></AdminRoute>} />
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
          <Route path="/resumes/:resumeId" element={<PrivateRoute><SalesResumeView /></PrivateRoute>} />

          <Route path="/resumes/pending" element={<PrivateRoute><PendingResumeList /></PrivateRoute>} />
          <Route path="/resumes/pending/:resumeId" element={<PrivateRoute><PendingResumeView /></PrivateRoute>} />
          <Route path="/resumes/register" element={<ResumeRegister />} />
          <Route path="/resumes/sale-resumes/" element={<PrivateRoute><MySalesResumes /></PrivateRoute>} />
          <Route path="/orders" element={<PrivateRoute><OrderList /></PrivateRoute>} />
          <Route path="/orders/:orderId" element={<PrivateRoute><OrderView /></PrivateRoute>} />
          {/* <Route path="/resumes/admin" element={<PrivateRoute><AdminResumeList /></PrivateRoute>} />
          <Route path="/resumes/admin/:resumeId" element={<PrivateRoute><AdminResumeView /></PrivateRoute>} /> */}

          <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
          <Route path="/transaction" element={<PrivateRoute><Transaction /></PrivateRoute>} />
          <Route path="/success" element={<PrivateRoute><PaymentSuccess /></PrivateRoute>} />
          <Route path="/fail" element={<PrivateRoute><PaymentFail /></PrivateRoute>} />
          
          {/* NotFound route */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
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
