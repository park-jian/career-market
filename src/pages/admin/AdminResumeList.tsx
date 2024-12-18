import React, { useEffect, useState } from 'react';
import { MdOutlineFilterList } from "react-icons/md";
import Pagination from '../../components/Pagination'
import {getAdminResumeList} from '../../api/resume';
import AdminResumeCard from '../../components/resume/AdminResumeCard';
import { ResumeRequestInfo, AdminListParams } from '../../types/resume';
import LogoutButton from '../../components/user/LogoutButton';
import {useUser} from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminResumeList: React.FC = () => {
  // const { resumesQuery: { isLoading, error, data: resumes }, } = useResumes();
  const { data: user } = useUser();
  const [periodCond, setPeriodCond] = useState<string | undefined>();//기간조건
  const [status, setStatus] = useState<string | undefined>();//상태
  //const [lastModifiedAt , setLastModifiedAt ] = useState<string | undefined>();//수정날짜
  const [error, setError] = useState<string | null>(null);
  const [resumes, setResumes] = useState<ResumeRequestInfo[]>([]);
  const [currentPage, setCurrentPage] = useState<string>();
  //const [lastId, setLastId] = useState<number | undefined>();
  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const initialParams: AdminListParams = {
          pageStep: 'FIRST'
        };
  
        const data = await getAdminResumeList(initialParams);
        if (data?.result?.result_code === 200) {
          //const last_id = data.body.last_id;
          // const last_modified_at = data.body.last_modified_at;
          // setLastModifiedAt(last_modified_at);
          //setLastId(last_id);
          setResumes(data.body.result);
          if (data.body.first_page === true && data.body.last_page === false) {
            setCurrentPage('first');
          } else if (data.body.first_page === false && data.body.last_page === true) {
            setCurrentPage('last');
          } else if (data.body.first_page === false && data.body.last_page === false) {
            setCurrentPage('middle');
          } else if (data.body.first_page === true && data.body.last_page === true) {
            setCurrentPage('none');
          }
          setError(null);
        } else if (data === "") {
          setResumes([]);
          setCurrentPage('none');
          // alert('판매글이 존재 하지 않습니다');
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.result?.result_message || '데이터를 가져오는데 실패했습니다.');
          console.error('Error response:', err.response?.data);
        } else {
          setError('알 수 없는 에러가 발생했습니다.');
          console.error('Unexpected error:', err);
        }
      }
    };

    fetchResumes();
  }, []);

  //const handlePageChange = async (newPage: number, pageStep: string) => {
    const handlePageChange = async (pageStep: string) => {
    try {
      const prevResumes = resumes;
      let calLastId;
      if (prevResumes.length > 0) {
        if (pageStep === 'PREVIOUS') {
          calLastId = prevResumes[0].id;
        } else if (pageStep === 'NEXT') {
          calLastId = prevResumes[prevResumes.length - 1].id;
        }
      }
      const params: AdminListParams = {
        pageStep: pageStep,
        // 기존 필터 조건들 유지
        ...(periodCond && { periodCond }),
        ...(status && { status }),
        ...(calLastId && { lastId: calLastId })
      };
      const data = await getAdminResumeList(params);
      if (data?.result?.result_code === 200) {
        //setLastId(data.body.last_id);
        setResumes(data.body.result);
        if (data.body.first_page === true && data.body.last_page === false) {
          setCurrentPage('first');
        } else if (data.body.first_page === false && data.body.last_page === true) {
          setCurrentPage('last');
        } else if (data.body.first_page === false && data.body.last_page === false) {
          setCurrentPage('middle');
        } else if (data.body.first_page === true && data.body.last_page === true) {
          setCurrentPage('none');
        }
        setError(null);
        //setPageStep(pageStep);  // 현재 pageStep 업데이트
      } else if (data === "") {
        setResumes([]);
        setCurrentPage('none');
        //alert('판매글이 존재 하지 않습니다');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.result?.result_message || '데이터를 가져오는데 실패했습니다.');
        console.error('Error response:', err.response?.data);
      } else {
        setError('알 수 없는 에러가 발생했습니다.');
        console.error('Unexpected error:', err);
      }
    }
  };


  const handleSort = async () => {
    try {
      // 선택된 값들만 파라미터에 포함
      const params: AdminListParams = {
        pageStep: 'FIRST',  // 필수값
      };
  
      if (periodCond) params.periodCond = periodCond;
      if (status) params.status = status;
      //if (lastId) params.lastId = lastId;
      const data = await getAdminResumeList(params);
      if (data?.result?.result_code === 200) {
        //setLastId(data.body.last_id);
        setResumes(data.body.result);
        if (data.body.first_page === true && data.body.last_page === false) {
          setCurrentPage('first');
        } else if (data.body.first_page === false && data.body.last_page === true) {
          setCurrentPage('last');
        } else if (data.body.first_page === false && data.body.last_page === false) {
          setCurrentPage('middle');
        } else if (data.body.first_page === true && data.body.last_page === true) {
          setCurrentPage('none');
        }
        setError(null);
      } else if (data === "") {
        setResumes([]);
        setCurrentPage('none');
        //alert('판매글이 존재 하지 않습니다');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.result?.result_message || '데이터를 가져오는데 실패했습니다.');
        console.error('Error response:', err.response?.data);
      } else {
        setError('알 수 없는 에러가 발생했습니다.');
        console.error('Unexpected error:', err);
      }
    }
  }
  return (
    <div className='w-full py-6'>
      <ul className="flex w-full items-center justify-end text-sm relative z-10 py-4">
        <li className="relative px-4">
        {user ?  (
          <Link to="/users/me" className='inline-block transition-colors duration-300'>
            <span>{user.name}님</span>
          </Link>
          ) : (
            <></>
          )}
        </li>
        <li className="relative px-4">
        {user ?  (
           <LogoutButton className='inline-block transition-colors duration-300' />
        ) : (
          <Link to="/users/login" className='inline-block transition-colors duration-300'>
            로그인
          </Link>
          
        )}
        </li>
      </ul>
      <div className='w-full max-w-[1280px] mx-auto px-4'>
        {/* 필터 영역 */}
        <div className="flex flex-wrap gap-3 mb-6 w-full">
          {/* 기간 조건 */}
          <div className="flex-1">
            <select 
              onChange={(e) => setPeriodCond(e.target.value)} 
              value={periodCond}
              className="w-full bg-transparent focus:outline-none text-sm p-2 rounded-lg border"
            >
              <option value="">기간 조건</option>
              <option value="TODAY">TODAY</option>
              <option value="WEEK">WEEK</option>
              <option value="MONTH">MONTH</option>
            </select>
          </div>
  
          {/* 상태 조건 */}
          <div className="flex-1">
            <select 
              onChange={(e) => setStatus(e.target.value)} 
              value={status} 
              className="w-full p-2 rounded-lg border text-sm"
            >
              <option value="">상태</option>
              <option value="PENDING">PENDING</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>
  
          {/* 정렬 버튼 */}
          <button 
            onClick={handleSort}
            className="p-2 rounded-lg border hover:bg-gray-100 flex items-center"
          >
            <MdOutlineFilterList className="text-gray-500 text-xl" />
          </button>
        </div>
  
        {/* 컨텐츠 영역 - 동일한 너비 제한 적용 */}
        {error ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-red-500 bg-red-50 px-6 py-4 rounded-lg shadow">
              {error}
            </div>
          </div>
        ) : (
          <>
          <div className="w-full">
            <ul className="space-y-2"> {/* grid 대신 space-y 사용 */}
              {resumes && Array.isArray(resumes) && resumes.map((resume: ResumeRequestInfo) => (
                <AdminResumeCard key={resume.id} resume={resume}/>
              ))}
            </ul>
          </div>
          </>
        )}   
          <div className="mt-8 flex justify-center">
            <Pagination 
              currentPage={currentPage}
              onPageChange={handlePageChange} 
            />
          </div>

      </div>
    </div>
  );
};
export default AdminResumeList;