import React, { useState, useEffect }  from 'react';
import { useUser } from '../../hooks/useUser';
import { getMyPendingList } from '../../api/resume';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface resumeType {
  id: number;  // salesPostId를 위한 id 추가
  summary: string;
  sales_quantity: number;
  field: string;
  level: string;
  status: string;
  modified_at: string;
}

const SalesResumeList: React.FC = () => {
  const [resumeData, setResumeData] = useState<resumeType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResumeList = async () => {
      try {
        if (!user) {
          setLoading(false);
          return;
        }
        const response = await getMyPendingList();
        if (response?.result_code === 200) {
          setResumeData(response?.data);
          if (response.data.length === 0) {
            setError("컨텐츠가 존재 하지 않습니다.");
          }
        } else {
          setError(response?.result_message || '데이터를 가져오는데 실패했습니다.');
        }
      } catch (err) {
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

    fetchResumeList();
  }, [user]);

  const handleRowClick = (id: number) => {
    navigate(`/resumes/pending/${id}`);
  };

  if (loading) {
    return <div className="p-6 text-center">로딩 중...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 w-full max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">판매 요청중인 이력서 전체 조회</h1>
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        {/* 헤더 */}
        <div className="bg-gray-50 flex text-sm font-medium">
          <div className="w-[40%] p-3 border-r border-gray-300">제목</div>
          <div className="w-[10%] p-3 border-r border-gray-300 text-center">판매량</div>
          <div className="w-[15%] p-3 border-r border-gray-300 text-center">분야</div>
          <div className="w-[10%] p-3 border-r border-gray-300 text-center">레벨</div>
          <div className="w-[15%] p-3 border-r border-gray-300 text-center">요청 날짜</div>
          <div className="w-[10%] p-3 text-center">상태</div>
        </div>

        {/* 데이터 로우 */}
        {resumeData.map((resume, index) => (
          <div 
            key={resume.id} 
            className={`flex text-sm hover:bg-gray-100 cursor-pointer ${
              index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
            }`}
            onClick={() => handleRowClick(resume.id)}
          >
            <div className="w-[40%] p-3 border-r border-t border-gray-300">{resume.summary}</div>
            <div className="w-[10%] p-3 border-r border-t border-gray-300 text-center">{resume.sales_quantity}</div>
            <div className="w-[15%] p-3 border-r border-t border-gray-300 text-center">
              <span className="text-blue-600 font-medium">{resume.field}</span>
            </div>
            <div className="w-[10%] p-3 border-r border-t border-gray-300 text-center">
              <span className="text-orange-600 font-medium">{resume.level}</span>
            </div>
            <div className="w-[15%] p-3 border-r border-t border-gray-300 text-center">
              {new Date(resume.modified_at).toLocaleDateString()}
            </div>
            <div className="w-[10%] p-3 border-t border-gray-300 text-center">
              <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                {resume.status}
              </span>
            </div>
          </div>
        ))}

        {/* 데이터 없음 */}
        {resumeData.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            요청중인 이력서가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesResumeList;