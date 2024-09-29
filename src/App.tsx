import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

//메인페이지
import Home from './components/Home';

//사용자
import UserRegister from './components/user/Register'; //회원등록
import UserLogin from './components/user/Login'; //로그인
import UserProfile from './components/user/Profile'; //나의 정보 조회

//이력서
import ResumeRegister from './components/resume/Register';  //이력서 등록
import ResumeEdit from './components/resume/Edit';  //이력서 수정
import ResumeList from './components/resume/Edit';  //이력서 조회
import SalesResumeRegister from './components/resume/SalesResumeRegister'; //이력서 판매글 등록
import SalesResumeList from './components/resume/SalesResumeList'; //이력서 판매글 조회 (비로그인 포함)
import SalesResumeListOne from './components/resume/SalesResumeListOne'; //판매글 단건 상세 조회
import MySalesResumes from './components/resume/MySalesResumes'; //자신이 판매중인 판매글 내역 조회
import MySalesResumeView from './components/resume/MySalesResumeView'; //자신이 판매중인 판매글 내역 상세 조회

//관리자
import AdminResumeList from './components/admin/AdminResumeList'; //  관리자용 이력서 list 전체 조회
import AdminResumeView from './components/admin/AdminResumeView'; //관리자용 이력서 list 조회 상세

//장바구니
import Cart from './components/cart/Cart'; //장바구니


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users/register" element={<UserRegister />} />
        <Route path="/users/login" element={<UserLogin />} />
        <Route path="/users/me" element={<UserProfile />} />

        <Route path="/resumes/register" element={<ResumeRegister />} />
        <Route path="/resumes/:resumeId" element={<ResumeEdit />} />
        <Route path="/resumes/list" element={<ResumeList />} />

        <Route path="/sales-resumes/:resumeId/register" element={<SalesResumeRegister />} />
        <Route path="/sales-resumes" element={<SalesResumeList />} />
        <Route path="/sale-resumes/:salesPostId" element={<SalesResumeListOne />} />
        <Route path="/sale-resumes/{user}" element={<MySalesResumes />} />
        <Route path="/sale-resumes/{user}/:salesPostId" element={<MySalesResumeView />} />

        <Route path="/resumes/admin" element={<AdminResumeList />} />
        <Route path="/resumes/admin/:salesPostId" element={<AdminResumeView />} />

        <Route path="/cart" element={<Cart />} />
      </Routes>
    </Router>
  );
};

export default App;
