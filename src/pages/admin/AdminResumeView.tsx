import React, {useEffect, useState } from 'react';
import axios from 'axios';
import {setAdminApprove, setAdminDeny} from '../../api/resume';
import { useParams } from 'react-router-dom';
import {getAdminResumeListOne} from '../../api/resume';
import {ResumeRequestOneInfo} from '../../types/resume';

const AdminResumeView: React.FC = () => {
  const { resumeId } = useParams<{ resumeId: string }>();
  const [resumeData, setResumeData] = useState<ResumeRequestOneInfo | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchResumes = async () => {
      if (!resumeId) return;
      const resumeIdNumber = parseInt(resumeId);
      if (isNaN(resumeIdNumber)) {
        console.error('Invalid resume ID');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await getAdminResumeListOne(resumeIdNumber);
        if (data.result.result_code === 200) {
          setResumeData(data.body);
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
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, [resumeId]);
  const handleApprove = async () => {
    if (!resumeId) return;
    
    const resumeIdNumber = parseInt(resumeId);
    if (isNaN(resumeIdNumber)) return;
    try {
      const data = await setAdminApprove(resumeIdNumber);
      if (data.result.result_code === 200) {
        //성공
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
  }
  const handleDeny = async () => {
    if (!resumeId) return;
    
    const resumeIdNumber = parseInt(resumeId);
    if (isNaN(resumeIdNumber)) return;
    try {
      const data = await setAdminDeny(resumeIdNumber);
      if (data.result.result_code === 200) {
        //api 성공로직
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
  }
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!resumeData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">이력서 데이터를 불러오는데 실패했습니다.</div>
      </div>
    );
  }
  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow-xl space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">이력서 상세조회</h1>
      </div>
      {/* id */}
      <div className="flex border items-center">
        <div className='border-r w-2/6 p-3'>ID</div>
        <div className='w-3/6 p-3'>
          {resumeData.id}
        </div>
      </div>

      {/* Field */}
      <div className="flex border items-center">
        <div className='border-r w-2/6 p-3'>Field</div>
        <div className='w-3/6 p-3'>
          {resumeData.field}
        </div>
      </div>

      {/* Level */}
      <div className="flex border items-center">
      <div className='border-r w-2/6 p-3'>Level</div>
      <div className='w-3/6 p-3'>
        {resumeData.level}
      </div>
      </div>

      {/* Resume URL */}
      <div className="flex border items-center">
      <div className='border-r w-2/6 p-3'>Resume url</div>
      <div className='w-3/6 p-3 truncate'>
        <a href={resumeData.resume_url} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
          {resumeData.resume_url}
        </a>
      </div>
      </div>

      {/* Description Image */}
      <div className="flex border items-center">
      <div className='border-r w-2/6 p-3'>Description Image</div>
      <div className='w-3/6 p-3 truncate'>
          <img src={resumeData.description_image_url} alt="Frontend" className="w-60 h-40" />
      </div>
    </div>
      
      {/* price */}
      <div className="flex border">
        <div className='border-r w-2/6 p-3'>price</div>
        <div className='w-4/6 p-3'>
          {resumeData.price}
        </div>
      </div>

      {/* Description */}
      <div className="flex border items-center">
        <div className='border-r w-2/6 p-3'>Description</div>
        <div className='w-3/6 p-3'>
          {resumeData.description}
        </div>
      </div>

      {/* Status - 읽기 전용 */}
      <div className="flex border">
      <div className='border-r w-2/6 p-3'>Status</div>
      <div className='w-4/6 p-3 flex'>
        {resumeData.status}
        {resumeData.status === 'PENDING' && (
          <div className="ml-4">
            <button className="bg-green-500 text-white px-2 py-1 rounded mr-2" onClick={handleApprove}>승인</button>
            <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={handleDeny}>거절</button>
          </div>
        )}  
      </div>
      </div>
      
    </div>
  );
};


export default AdminResumeView;