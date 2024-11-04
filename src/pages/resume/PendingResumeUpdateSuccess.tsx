// pages/resume/PendingResumeUpdateSuccess.tsx
import React, { useEffect, useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { getMyPendingListOne } from '../../api/resume';
import { PendingResumeOneType } from '../../types/resume';

const PendingResumeUpdateSuccess: React.FC = () => {
  const { resumeId } = useParams<{ resumeId: string }>();
  const [resumeData, setResumeData] = useState<PendingResumeOneType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResume = async () => {
      if (!resumeId) return;

      try {
        const data = await getMyPendingListOne(Number(resumeId));
        if (data.result.result_code === 200) {
          setResumeData(data.body);
        }
      } catch (error) {
        console.error('Failed to fetch resume:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResume();
  }, [resumeId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!resumeData) {
    return <Navigate to="/" />;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow-xl space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">이력서 수정 완료</h1>
        <Link to="/">
          <button className="px-6 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors">
            홈으로
          </button>
        </Link>
      </div>

      <div className="space-y-4">
        {/* Field */}
        <div className="flex border">
          <div className='border-r w-2/6 p-3 bg-gray-50'>Field</div>
          <div className='w-4/6 p-3'>{resumeData.field}</div>
        </div>

        {/* Level */}
        <div className="flex border">
          <div className='border-r w-2/6 p-3 bg-gray-50'>Level</div>
          <div className='w-4/6 p-3'>{resumeData.level}</div>
        </div>

        {/* Resume URL */}
        <div className="flex border">
          <div className='border-r w-2/6 p-3 bg-gray-50'>RESUME_URL</div>
          <div className='w-4/6 p-3 truncate'>
            <a 
              href={resumeData.resume_url} 
              className="text-blue-500 hover:underline" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              {resumeData.resume_url}
            </a>
          </div>
        </div>

        {/* Description Image */}
        <div className="flex border">
          <div className='border-r w-2/6 p-3 bg-gray-50'>Description Image</div>
          <div className='w-4/6 p-3 truncate'>
            <a 
              href={resumeData.description_image_url} 
              className="text-blue-500 hover:underline" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              {resumeData.description_image_url}
            </a>
          </div>
        </div>

        {/* Price */}
        <div className="flex border">
          <div className='border-r w-2/6 p-3 bg-gray-50'>Price</div>
          <div className='w-4/6 p-3'>{resumeData.price}</div>
        </div>

        {/* Sales Quantity */}
        <div className="flex border">
          <div className='border-r w-2/6 p-3 bg-gray-50'>Sales Quantity</div>
          <div className='w-4/6 p-3'>{resumeData.sales_quantity}</div>
        </div>

        {/* Description */}
        <div className="flex border">
          <div className='border-r w-2/6 p-3 bg-gray-50'>Description</div>
          <div className='w-4/6 p-3'>{resumeData.description}</div>
        </div>

        {/* Status */}
        <div className="flex border">
          <div className='border-r w-2/6 p-3 bg-gray-50'>Status</div>
          <div className='w-4/6 p-3'>{resumeData.status}</div>
        </div>
      </div>
    </div>
  );
};

export default PendingResumeUpdateSuccess;