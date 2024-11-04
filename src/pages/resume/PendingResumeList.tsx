import React, { useState, useEffect }  from 'react';
import { useUser } from '../../hooks/useUser';
import { getMyPendingList, deleteResume } from '../../api/resume';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PendingResumeType } from '../../types/resume';
import { MdDeleteOutline } from "react-icons/md";
const PendingResumeList: React.FC = () => {
  const [resumeData, setResumeData] = useState<PendingResumeType[]>([]);
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

  const handleRowClick = (resume_id: number) => {
    navigate(`/resumes/pending/${resume_id}`);
  };

  // 삭제 핸들러 추가
  const handleDelete = async (e: React.MouseEvent, resumeId: number) => {
    e.stopPropagation(); // 행 클릭 이벤트 전파 방지
    try {
      // 삭제 확인
      if (!window.confirm('이력서를 삭제하시겠습니까?')) {
        return;
      }
      
      // TODO: 삭제 API 호출
      const _resumeId = Number(resumeId);
      const data = await deleteResume(_resumeId);
      if (data.result.result_code === 200) {
        setResumeData(prev => prev.filter(resume => resume.resume_id !== resumeId));
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        // Axios 에러인 경우
        console.error('Error message:', err.message);
        console.error('Error response:', err.response?.data);
      } else {
        // 일반 에러인 경우
        console.error('Unexpected error:', err);
      }
      console.log('Failed to fetch resumes.');
    }
  };

  if (loading) {
    return <div className="p-6 text-center">로딩 중...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 w-full max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold my-6">판매 요청중인 이력서 전체 조회</h1>
      <div className="border border-gray-300 rounded-lg overflow-hidden text-center">
        {/* 헤더 */}
        <div className="bg-gray-50 flex text-sm font-medium">
          <div className="w-[32%] p-3 border-r border-gray-300">제목</div>
          <div className="w-[9%] p-3 border-r border-gray-300 text-center">판매량</div>
          <div className="w-[12%] p-3 border-r border-gray-300 text-center">분야</div>
          <div className="w-[12%] p-3 border-r border-gray-300 text-center">레벨</div>
          <div className="w-[17%] p-3 border-r border-gray-300 text-center">요청 날짜</div>
          <div className="w-[11%] p-3 border-r border-gray-300 text-center">상태</div>
          <div className="w-[7%] p-3 text-center">삭제</div>
        </div>

        {/* 데이터 로우 */}
        {resumeData.map((resume, index) => (
          <div 
            key={resume.resume_id} 
            className={`flex text-sm hover:bg-gray-100 cursor-pointer ${
              index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
            }`}
            onClick={() => handleRowClick(resume.resume_id)}
          >
            <div className="w-[32%] p-3 border-r border-t border-gray-300 truncate">{resume.summary}</div>
            <div className="w-[9%] p-3 border-r border-t border-gray-300 text-center">{resume.sales_quantity}</div>
            <div className="w-[12%] p-3 border-r border-t border-gray-300 text-center">
              <span className="text-blue-600 font-medium">{resume.field}</span>
            </div>
            <div className="w-[12%] p-3 border-r border-t border-gray-300 text-center">
              <span className="text-orange-600 font-medium">{resume.level}</span>
            </div>
            <div className="w-[17%] p-3 border-r border-t border-gray-300 text-center">
              {new Date(resume.modified_at).toLocaleDateString()}
            </div>
            <div className="w-[11%] p-3 border-r border-t border-gray-300 text-center">
              <span className="inline-block px-1 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                {resume.status}
              </span>
            </div>
            <div className="w-[7%] p-3 border-t border-gray-300 text-center">
              <button
                onClick={(e) => handleDelete(e, resume.resume_id)}
                className="p-1.5 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                title="삭제"
              >
              <MdDeleteOutline className="w-7 h-7" />
            </button>
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

export default PendingResumeList;