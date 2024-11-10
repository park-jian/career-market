import { useState } from "react"; // 로컬 상태 관리용
import {modifySalesStatus} from "../../api/resume";
import { AxiosError } from 'axios';
import { ResumeCardProps } from '../../types/resume';

const ResumeCard: React.FC<ResumeCardProps> = ({ resume: initialResume }) => {
  // 로컬 상태로 관리
  const [resume, setResume] = useState(initialResume);
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    if (resume.status === newStatus || isLoading) return;

    setIsLoading(true);
    try {
      const data = await modifySalesStatus(resume.resume_id, newStatus);
      if (data?.result?.result_code === 200) {
      // 성공하면 로컬 상태 업데이트
        setResume(prev => ({
          ...prev,
          status: newStatus
        }));
      }
    } catch (error: unknown) { // 타입 명시
      // 에러 메시지 처리 개선
      if (error instanceof AxiosError && error.response?.data) {
        const errorData = error.response.data;
        
        if (errorData.result?.result_code === 5403) {
          alert('이력서가 활성 상태여야 상태를 변경할 수 있습니다.');
        } else {
          alert(`상태 업데이트에 실패했습니다: ${errorData.result?.result_message}`);
        }
      } else {
        alert('예기치 않은 에러가 발생했습니다.');
      }
      console.error('Status update failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <li className="w-72 bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200">
      <div className="p-5">
        <h3 className="text-xl font-medium text-gray-900 mb-4">
          {resume.title}
        </h3>

        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <span className="text-gray-500 w-20">판매량:</span>
            <span className="text-gray-700">{resume.sales_quantity}</span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-500 w-20">등록 날짜:</span>
            <span className="text-gray-700">
              {resume.registered_at ? new Date(resume.registered_at).toLocaleDateString() : '-'}
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-500 w-20">상태:</span>
            <div className="flex gap-4">
              <button
                onClick={() => handleStatusChange('SELLING')}
                disabled={isLoading}
                className={`px-3 py-1 rounded transition-colors ${
                  resume.status === 'SELLING'
                    ? 'bg-black text-white font-medium'
                    : 'text-gray-300 hover:text-gray-500'
                }`}
              >
                SELLING
              </button>
              <button
                onClick={() => handleStatusChange('CANCELED')}
                disabled={isLoading}
                className={`px-3 py-1 rounded transition-colors ${
                  resume.status === 'CANCELED'
                    ? 'bg-black text-white font-medium'
                    : 'text-gray-300 hover:text-gray-500'
                }`}
              >
                CANCELED
              </button>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

export default ResumeCard;