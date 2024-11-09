import { useNavigate } from "react-router-dom";
import { ResumeRequestInfo } from '../../types/resume';
interface AdminResumeCardProps {
  resume: ResumeRequestInfo;
}
const AdminResumeCard: React.FC<AdminResumeCardProps> = ({ resume }) => {
  const navigate = useNavigate();
  const { id, summary, field, level, status, registered_at } = resume;

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'ACTIVE':
        return 'bg-green-50 text-green-600';
      case 'PENDING':
        return 'bg-yellow-50 text-yellow-600';
      case 'REJECTED':
        return 'bg-red-50 text-red-600';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <li
      onClick={() => {
        navigate(`/resumes/admin/${id}`, { state: { resume } });
      }}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100"
    >
      <div className="p-4 flex items-center justify-between gap-4">
        {/* 요약 */}
        <div className="w-[300px] truncate">
          {summary || 'This is a ...'}
        </div>

        {/* Field & Level */}
        <div className="flex gap-2 min-w-[200px]">
          <span>{field}</span>
          <span>{level}</span>
        </div>

        {/* Status */}
        <div className="min-w-[100px]">
          <span className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(status)}`}>
            {status}
          </span>
        </div>

        {/* 날짜 */}
        <div className="text-gray-500 min-w-[180px]">
          {new Date(registered_at).toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>
    </li>
  );
}
export default AdminResumeCard;