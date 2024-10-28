import React, { useState, useEffect }  from 'react';
import Pagination from "../../components/Pagination"
import {getMyList} from "../../api/resume";
import { useUser } from '../../hooks/useUser';
import axios from 'axios';
interface Resume {
  id: number;
  title: string;
  sales_quantity: string;
  status: string;
  registered_at: string;
}

const MySalesResumes: React.FC = () => {
  const [resumeData, setResumeData] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: user } = useUser();
  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        if (!user) {
          setLoading(false);
          return;
        }
        const response = await getMyList();
        console.log("response:",response)
        //setResumeData(data);
        if (response?.result_code === 200) {
          setResumeData(response.data || []);

        } else {
          setError(response?.result_message || '데이터를 가져오는데 실패했습니다.');
        }
      }  catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.result?.result_message || '데이터를 가져오는데 실패했습니다.');
          console.error('Error response:', err.response?.data);
        } else {
          setError('알 수 없는 에러가 발생했습니다.');
          console.error('Unexpected error:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchResumeData();
  }, [user]);
  const handlePageChange = (newPage: number) => {
    // 페이지 변경 로직 구현
    console.log("New page:", newPage);
  };

  // 유저 정보가 없을 때
  if (!user) {
    return <div className="p-6 text-center">로그인이 필요한 서비스입니다.</div>;
  }

  // 데이터 로딩 중일 때
  if (loading) {
    return <div className="p-6 text-center">데이터를 불러오는 중...</div>;
  }

  // 에러가 있을 때
  if (error) {
    return <div className="p-6 text-center text-red-500"> {error}</div>;
  }

  // 데이터가 없을 때
  if (resumeData.length === 0) {
    return <div className="p-6 text-center">판매 중인 이력서가 없습니다.</div>;
  }
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return (
    <div className="p-6 w-full max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">판매중인 판매글 내역 조회</h1>
      <div className="overflow-x-auto ">
        <div className='border border-gray-300'>
          <div className="bg-gray-100 flex font-bold text-sm ">
            <div className="w-[10%] min-w-[60px] p-3 border-r border-gray-300 flex items-center justify-center">#</div>
            <div className="w-[40%] min-w-[200px] p-3 border-r border-gray-300 flex items-center justify-center">제목</div>
            <div className="w-[10%] min-w-[80px] p-3 border-r border-gray-300 flex items-center justify-center">판매량</div>
            <div className="w-[25%] min-w-[150px] p-3 border-r border-gray-300 flex items-center justify-center">등록 날짜</div>
            <div className="w-[15%] min-w-[100px] p-3 flex items-center justify-center">상태</div>
          </div>
          {resumeData.map((resume, index) => (
            <div key={resume.id} className={`flex text-sm ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
              <div className="w-[10%] min-w-[60px] p-3 border-r border-gray-300 flex items-center justify-center">{resume.id}</div>
              <div className="w-[40%] min-w-[200px] p-3 border-r border-gray-300 flex items-center truncate">{resume.title}</div>
              <div className="w-[10%] min-w-[80px] p-3 border-r border-gray-300 flex items-center justify-center">{resume.sales_quantity}</div>
              <div className="w-[25%] min-w-[150px] p-3 border-r border-gray-300 flex items-center truncate">{resume.registered_at}</div>
              <div className="w-[15%] min-w-[100px] p-3 flex items-center justify-center">
                <span className='w-full text-left px-2 py-1 bg-gray-300 hover:bg-gray-500 hover:text-white cursor-pointer rounded'>{resume.status}</span>
              </div>
            </div>
          ))}
        </div>
        <Pagination 
          paginationInfo={{ currentPage: 1, totalPages: 10 }}
          onPageChange={(newPage) => handlePageChange(newPage)} 
        />
      </div>
    </div>
  );
};


export default MySalesResumes;