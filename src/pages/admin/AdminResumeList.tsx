import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { MdOutlineFilterList } from "react-icons/md";
import Pagination from "../../components/Pagination"
import {getAdminResumeList} from "../../api/resume";
import { ResumeRequestInfo } from '../../types/resume';

const AdminResumeList: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'modified_at' | 'status' | null>(null);
  const [resumes, setResumes] = useState<ResumeRequestInfo[]>([]);
  const [lastId, setLastId] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const data = await getAdminResumeList();
        if (data.result.result_code === 200) {
          setLastId(data.body.last_id);
          setResumes(data.body.results);
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          console.error('Error message:', err.message);
          console.error('Error response:', err.response?.data);
        } else {
          console.error('Unexpected error:', err);
        }
      }
    };

    fetchResumes();
  }, []);

  const toggleFilter = (filter: 'modified_at' | 'status') => {
    setActiveFilter(activeFilter === filter ? null : filter);
  };

  const FilterDropdown: React.FC<{ options: string[] }> = ({ options }) => (
    <div className="absolute top-full right-0 z-10 bg-white border border-gray-300 rounded-md shadow-lg min-w-[120px]">
      {options.map((option) => (
        <div key={option} className="flex items-center px-4 py-2 hover:bg-gray-100">
          <input type="checkbox" id={option} className="mr-2" />
          <label htmlFor={option}>{option}</label>
        </div>
      ))}
    </div>
  );

  const handlePageChange = (newPage: number) => {
    console.log("New page:", newPage);
  };

  const handleClick = (resumeId: number) => {
    navigate(`/resumes/admin/${resumeId}`);
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">전체 가져온 이력서</h1>
      <div className="w-full">
        <table className="min-w-full border border-gray-300 bg-white">
          <thead>
            <tr className="bg-gray-50">
              <th className="w-16 py-3 px-4 text-left border-b border-r">#</th>
              <th className="py-3 px-4 text-left border-b border-r">Title</th>
              <th className="w-28 py-3 px-4 text-left border-b border-r">Field</th>
              <th className="w-28 py-3 px-4 text-left border-b border-r">Level</th>
              <th className="w-44 py-3 px-4 text-left border-b border-r">
                <div className="flex items-center justify-between">
                  <span>Modified At</span>
                  <button onClick={() => toggleFilter('modified_at')} className="focus:outline-none">
                    <MdOutlineFilterList className="text-gray-600" />
                  </button>
                  {activeFilter === 'modified_at' && (
                    <FilterDropdown options={['TODAY', 'WEEK', 'MONTH']} />
                  )}
                </div>
              </th>
              <th className="w-28 py-3 px-4 text-left border-b relative">
                <div className="flex items-center justify-between">
                  <span>Status</span>
                  <button onClick={() => toggleFilter('status')} className="focus:outline-none">
                    <MdOutlineFilterList className="text-gray-600" />
                  </button>
                  {activeFilter === 'status' && (
                    <FilterDropdown options={['PENDING', 'ACTIVE', 'REJECTED']} />
                  )}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {resumes.map((resume, index) => (
              <tr 
                key={resume.id}
                onClick={() => handleClick(resume.id)}
                className={`hover:bg-gray-50 cursor-pointer ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
              >
                <td className="py-3 px-4 border-b border-r">{resume.id}</td>
                <td className="py-3 px-4 border-b border-r truncate max-w-xs">{resume.summary}</td>
                <td className="py-3 px-4 border-b border-r">{resume.field}</td>
                <td className="py-3 px-4 border-b border-r">{resume.level}</td>
                <td className="py-3 px-4 border-b border-r whitespace-normal">{resume.modified_at}</td>
                <td className="py-3 px-4 border-b">{resume.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <Pagination 
          paginationInfo={{ currentPage: lastId || 1, totalPages: 10 }}
          onPageChange={handlePageChange} 
        />
      </div>
    </div>
  );
};

export default AdminResumeList;