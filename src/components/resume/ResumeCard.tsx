import { useNavigate } from "react-router-dom";
interface ResumeInfo {
    resume_id: number;
    title: string;
    price: number;
    thumbnail_image_url: string;
    sales_quantity: number;
    view_count: number;
    field: string;
    level: string;
    status: string;
    registered_at: string | null;
  }
  interface ResumeCardProps {
    resume: ResumeInfo;
  }
  const ResumeCard: React.FC<ResumeCardProps> = ({ resume }) => {
  const navigate = useNavigate();
  //const { id, title, price, sales_quantity, view_count, field, level, status, registered_at } = resume;
  const { resume_id, title, price, field, level, thumbnail_image_url } = resume;
  return (
    <li
      onClick={() => {
        navigate(`/resumes/${resume_id}`, { state: { resume } });
      }}
      className="rounded-lg shadow-md overflow-hidden cursor-pointer transition-all hover:scale-105"
    >
    
      <div className="mt-2 px-2 text-lg flex flex-col justify-between items-center">
      {/* {getFieldIcon(resume.thumbnail_image_url)} */}
      <img src={thumbnail_image_url} alt="Frontend" className="w-60 h-40" />
      </div>
      <div className="p-3">
      <h3 className="truncate font-semibold">{title}</h3>
      <p className="mb-2 text-gray-400 font-semibold text-xs">{`${price} 원`}</p>
      <div className="border-t-2 pt-1">
      <span className={`mb-2 px-2 text-white text-sm rounded-md
        ${field === 'AI' ? 'bg-red-300' : 
            field === 'BACKEND' ? 'bg-blue-300' : 
            field === 'FRONTEND' ? 'bg-yellow-300' : 'bg-gray-300'}
        `}>{field}</span>
      <span className={`ml-2 mb-2 px-2 text-white text-xs rounded-md
        ${level === 'SENIOR' ? 'bg-neutral-300' : 
            level === 'INTERMEDIATE' ? 'bg-orange-300' : 
            level === 'ADVANCED' ? 'bg-lime-300' : 'bg-teal-300'}
        `}>{level}</span>
        </div>
        </div>
    </li>
  );
}
export default ResumeCard;