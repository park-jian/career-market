import React, { useEffect, useState } from 'react';
import {getMyList} from '../../api/resume';
import ResumeCard from '../../components/resume/ResumeCard';
// import useResumes from '../../hooks/useResume';
import { ResumeInfo } from '../../types/resume';
const MySalesResumes: React.FC = () => {
  // const { resumesQuery: { isLoading, error, data: resumes }, } = useResumes();
  const [resumes, setResumes] = useState<ResumeInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const data = await getMyList();
        if (data?.result?.result_code === 200) {
          const resumeMySalesResumes = data.body;
          setResumes(resumeMySalesResumes);
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
  if (error) {
    return (
      <div className="text-center mt-20">
        <div className="text-red-500 bg-red-50 px-6 py-4 rounded-lg shadow inline-block">{error}</div>
      </div>
    );
  }
  return (
    <div className='w-full py-6'>
      <div className='w-full max-w-[1280px] mx-auto px-4'>
        {/* 컨텐츠 영역 - 동일한 너비 제한 적용 */}
        <div className="w-full">
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {resumes && Array.isArray(resumes) && resumes.map((resume: ResumeInfo) => (
              <ResumeCard key={resume.resume_id} resume={resume}/>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
export default MySalesResumes;