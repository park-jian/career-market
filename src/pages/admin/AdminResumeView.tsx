import React, {useEffect, useState } from 'react';
import axios from 'axios';
import {setAdminApprove, setAdminDeny} from '../../api/resume';
import { useParams } from 'react-router-dom';
import {getAdminResumeListOne} from '../../api/resume';
import {ResumeRequestOneInfo} from '../../types/resume';

const AdminResumeView: React.FC = () => {
  const { resumeId } = useParams<{ resumeId: string }>();
  const [resumeData, setResumeData] = useState<ResumeRequestOneInfo | null>(null);
  useEffect(() => {
    const fetchResumes = async () => {
      if (resumeId) {
        try {
          const data = await getAdminResumeListOne(resumeId);
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
        }
      }
    };

    fetchResumes();
  }, [resumeId]);
  const handleApprove = async () => {
    if (resumeId) {
      try {
        const data = await setAdminApprove(resumeId);
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
  }
  const handleDeny = async () => {
    if (resumeId) {
      try {
        const data = await setAdminDeny(resumeId);
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
  }
  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow-xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">이력서 상세조회</h1>
      {resumeData ? (
      <div className="">
        <div className="flex border"><div className='border-r w-2/6 p-3'>ID</div><div className='w-4/6 p-3'> {resumeData.id}</div></div>
        <div className="flex border"><div className='border-r w-2/6 p-3'>Email</div><div className='w-4/6 p-3'> {resumeData.email}</div></div>
        <div className="flex border"><div className='border-r w-2/6 p-3'>Field</div><div className='w-4/6 p-3'> {resumeData.field}</div></div>
        <div className="flex border"><div className='border-r w-2/6 p-3'>Level</div><div className='w-4/6 p-3'> {resumeData.level}</div></div>
        <div className="flex border"><div className='border-r w-2/6 p-3'>RESUME_URL</div><div className='w-4/6 p-3 truncate'> <a href={resumeData.resume_url} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">{resumeData.resume_url}</a></div></div>
        <div className="flex border"><div className='border-r w-2/6 p-3'>Description Image</div><div className='w-4/6 p-3 truncate'> <a href={resumeData.description_image_url} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">{resumeData.description_image_url}</a></div></div>
        <div className="flex border"><div className='border-r w-2/6 p-3'>Price</div><div className='w-4/6 p-3'> {resumeData.price}</div></div>
        <div className="flex border"><div className='border-r w-2/6 p-3'>Description</div><div className='w-4/6 p-3'> {resumeData.description}</div></div>
        <div className="flex border">
          <div className='border-r w-2/6 p-3'>Status</div>
          <div className='w-4/6 p-3 flex items-center'>
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
      ) : (
        <p>Loading...</p> // 데이터 로딩 중 표시할 내용
      )}
    </div>
  );
};


export default AdminResumeView;