import { useNavigate } from "react-router-dom";
import { ResumeInfo } from '../../types/resume';
  interface ResumeCardProps {
    resume: ResumeInfo;
  }
  const ResumeCard: React.FC<ResumeCardProps> = ({ resume }) => {
  const navigate = useNavigate();
  const { resume_id, title, price, thumbnail_image_url } = resume;
  
  return (
    <li
      onClick={() => {
        navigate(`/resumes/${resume_id}`, { state: { resume_id } });
      }}
      className="rounded-lg shadow-md overflow-hidden cursor-pointer transition-all hover:scale-105"
    >
      <div className="mt-2 px-2 text-lg flex flex-col justify-between items-center">
        <img src={thumbnail_image_url} alt="Frontend" className="w-60 h-46" />
      </div>
      <div className="p-3">
        <h3 className="truncate font-semibold">{title}</h3>
        <p className="mb-2 text-gray-400 font-semibold text-xs">{`${price} 원`}</p>
      </div>
    </li>
  );
}
export default ResumeCard;