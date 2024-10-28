import React, { useEffect, useState } from 'react';
import ResumeCard from '../../components/resume/ResumeCard';
import { MdOutlineFilterList } from "react-icons/md";
// import useResumes from '../../hooks/useResume';
import {getList} from '../../api/resume';
import { ResumeInfo } from '../../types/resume';
import Pagination from '../../components/Pagination'
interface ListParams {
  sortType?: string;
  minPrice?: number;
  maxPrice?: number;
  field?: string;
  level?: string;
  pageStep: string;
  lastId?: number;
}
const List: React.FC = () => {
  // const { resumesQuery: { isLoading, error, data: resumes }, } = useResumes();
  const [resumes, setResumes] = useState<ResumeInfo[]>([]);
  const [lastId, setLastId] = useState<number | undefined>();
  const [sortType, setSortType] = useState<string | undefined>();//정렬조건
  const [minPrice, setMinPrice] = useState<number | undefined>();//최소가격
  const [maxPrice, setMaxPrice] = useState<number | undefined>();//최대가격
  const [field, setField] = useState<string | undefined>();//분야
  const [level, setLevel] = useState<string | undefined>();//년차
  //const [pageStep, setPageStep] = useState<string>('FIRST');
  const handlePageChange = async (newPage: number, pageStep: string) => {
    try {
      const params: ListParams = {
        pageStep: pageStep,
        // 기존 필터 조건들 유지
        ...(sortType && { sortType }),
        ...(minPrice && { minPrice }),
        ...(maxPrice && { maxPrice }),
        ...(field && { field }),
        ...(level && { level }),
        ...(lastId && { lastId })
      };

      const data = await getList(params);
      if (data?.result?.result_code === 200) {
        setLastId(data.body.last_id);
        setResumes(data.body.results);
        //setPageStep(pageStep);  // 현재 pageStep 업데이트
      }
    } catch (err) {
      console.error('Failed to fetch page:', err);
    }
  };
  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const initialParams: ListParams = {
          pageStep: 'FIRST'
        };
  
        const data = await getList(initialParams);
        if (data?.result?.result_code === 200) {
          const last_id = data.body.last_id;
          setLastId(last_id);
          const resumeList = data.body.results;
          setResumes(resumeList);
        }
      }catch (err) {
        console.log('Failed to fetch resumes.:', err);
      }
    };

    fetchResumes();
  }, []);
  const handleSort = async () => {
    try {
      // 선택된 값들만 파라미터에 포함
      const params: ListParams = {
        pageStep: 'FIRST',  // 필수값
      };
  
      if (sortType) params.sortType = sortType;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (field) params.field = field;
      if (level) params.level = level;
      if (lastId) params.lastId = lastId;
  
      const data = await getList(params);
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
          {/* 정렬 조건 */}
          <div className="flex-1">
            <select 
              onChange={(e) => setSortType(e.target.value)} 
              value={sortType}
              className="w-full bg-transparent focus:outline-none text-sm p-2 rounded-lg border"
            >
              <option value="">정렬 조건</option>
              <option value="OLD">오래된 순</option>
              <option value="NEW">최신 순</option>
              <option value="HIGHEST_PRICE">가격 높은 순</option>
              <option value="LOWEST_PRICE">가격 낮은 순</option>
              <option value="VIEW_COUNT">조회 수 순</option>
              <option value="BEST_SELLING">베스트셀러 순</option>
            </select>
          </div>
  
          {/* 가격 범위 */}
          <div className="flex gap-2 flex-1">
            <input 
              placeholder="최소가격" 
              value={minPrice} 
              onChange={(e) => setMinPrice(Number(e.target.value))} 
              className="w-full p-2 rounded-lg border text-sm"
            />
            <input 
              placeholder="최대가격" 
              value={maxPrice} 
              onChange={(e) => setMaxPrice(Number(e.target.value))} 
              className="w-full p-2 rounded-lg border text-sm"
            />
          </div>
  
          {/* 분야 선택 */}
          <div className="flex-1">
            <select 
              onChange={(e) => setField(e.target.value)} 
              value={field} 
              className="w-full p-2 rounded-lg border text-sm"
            >
              <option value="">분야</option>
              <option value="FRONTEND">프론트엔드</option>
              <option value="BACKEND">백엔드</option>
              <option value="ANDROID">안드로이드</option>
              <option value="IOS">IOS</option>
              <option value="DEVOPS">데브옵스</option>
              <option value="AI">AI</option>
              <option value="ETC">기타</option>
            </select>
          </div>
  
          {/* 년차 선택 */}
          <div className="flex-1">
            <select 
              onChange={(e) => setLevel(e.target.value)} 
              value={level} 
              className="w-full p-2 rounded-lg border text-sm"
            >
              <option value="">년차</option>
              <option value="NEW">신입</option>
              <option value="JUNIOR">주니어</option>
              <option value="SENIOR">시니어</option>
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
        <div className="w-full">
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {resumes && Array.isArray(resumes) && resumes.map((resume: ResumeInfo) => (
              <ResumeCard key={resume.resume_id} resume={resume}/>
            ))}
          </ul>
        </div>
  
        <div className="mt-8 flex justify-center">
          <Pagination 
            paginationInfo={{ currentPage: 1, totalPages: 10 }}
            onPageChange={handlePageChange} 
          />
        </div>
      </div>
    </div>
  );
};
export default List;