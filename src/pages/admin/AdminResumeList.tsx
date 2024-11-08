import React, { useEffect, useState } from 'react';
import { MdOutlineFilterList } from "react-icons/md";
import Pagination from '../../components/Pagination'
import {getAdminResumeList} from '../../api/resume';
import AdminResumeCard from '../../components/resume/AdminResumeCard';
import { ResumeRequestInfo, AdminListParams } from '../../types/resume';
import axios from 'axios';
const AdminResumeList: React.FC = () => {
  // const { resumesQuery: { isLoading, error, data: resumes }, } = useResumes();

  const [periodCond, setPeriodCond] = useState<string | undefined>();//기간조건
  const [status, setStatus] = useState<string | undefined>();//상태
  const [lastModifiedAt , setLastModifiedAt ] = useState<string | undefined>();//수정날짜
  const [error, setError] = useState<string | null>(null);
  const [resumes, setResumes] = useState<ResumeRequestInfo[]>([]);
  const [lastId, setLastId] = useState<number | undefined>();
  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const initialParams: AdminListParams = {
          pageStep: 'FIRST'
        };
  
        const data = await getAdminResumeList(initialParams);
        if (data?.result?.result_code === 200) {
          const last_id = data.body.last_id;
          const last_modified_at = data.body.last_modified_at;
          setLastModifiedAt(last_modified_at);
          setLastId(last_id);
          const resumeList = data.body.results;
          setResumes(resumeList);
        }
      } catch (err) {
        if (err instanceof Error) {  // Error 타입인지 체크
          setError(err.message);
        } else if (typeof err === 'object' && err !== null && 'code' in err) {  // code 속성이 있는 객체인지 체크
          const error = err as { code: number; message: string };
          if (error.code === 5404) {
            setError(error.message);
          }
        } else {
          setError('알 수 없는 에러가 발생했습니다.');
        }
      }
    };

    fetchResumes();
  }, []);

  const handlePageChange = async (newPage: number, pageStep: string) => {
    try {
      console.log("페이지이동:", newPage);
      const params: AdminListParams = {
        pageStep: pageStep,
        // 기존 필터 조건들 유지
        ...(periodCond && { periodCond }),
        ...(status && { status })
      };
      if (lastModifiedAt) params.lastModifiedAt = lastModifiedAt;
      console.log("lastModifiedAt:",lastModifiedAt)
      if (lastId) params.lastId = lastId;
      const data = await getAdminResumeList(params);
      if (data?.result?.result_code === 200) {
        setLastId(data.body.last_id);
        setResumes(data.body.results);
        //setPageStep(pageStep);  // 현재 pageStep 업데이트
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
      if (lastModifiedAt) params.lastModifiedAt = lastModifiedAt;
      if (lastId) params.lastId = lastId;
  
      const data = await getAdminResumeList(params);
      if (data?.result?.result_code === 200) {
        setLastId(data.body.last_id);
        setResumes(data.body.results);
      }
    } catch (err) {
      console.error('Failed to fetch sorted resumes:', err);
    }
  }
  return (
    <div className='w-full py-6'>
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
    
          <div className="mt-8 flex justify-center">
            <Pagination 
              paginationInfo={{ currentPage: lastId || 1, totalPages: 10 }}
              onPageChange={handlePageChange} 
            />
          </div>
          </>
        )}
      </div>
    </div>
  );
};
export default AdminResumeList;