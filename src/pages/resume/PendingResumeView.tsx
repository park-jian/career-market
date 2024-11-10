import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMyPendingListOne, updateResume } from '../../api/resume';
import { PendingResumeOneType, UpdateResumeData } from '../../types/resume';
import Select from '../../components/resume/Select';
const fieldOptions = [
  { value: 'FRONTEND', label: 'FRONTEND' },
  { value: 'BACKEND', label: 'BACKEND' },
  { value: 'ANDROID', label: 'ANDROID' },
  { value: 'IOS', label: 'IOS' },
  { value: 'DEVOPS', label: 'DEVOPS' },
  { value: 'AI', label: 'AI' },
  { value: 'ETC', label: 'ETC' },
];

const levelOptions = [
  { value: 'NEW', label: 'NEW' },
  { value: 'JUNIOR', label: 'JUNIOR' },
  { value: 'SENIOR', label: 'SENIOR' },
];

const PendingResumeView: React.FC = () => {
  const { resumeId } = useParams<{ resumeId: string }>();
  const [resumeData, setResumeData] = useState<PendingResumeOneType | null>(null);
  const [tempData, setTempData] = useState<PendingResumeOneType | null>(null);
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
  const [isModified, setIsModified] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [descriptionImage, setDescriptionImage] = useState<File | null>(null);
  const navigate = useNavigate();
  // 컴포넌트 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        handleSaveTemp();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [tempData]);

  // 데이터 fetch
  useEffect(() => {
    const fetchResumes = async () => {
      if (resumeId) {
        try {
          const _resumeId = Number(resumeId);
          const data = await getMyPendingListOne(_resumeId);
          if (data.result.result_code === 200) {
            setResumeData(data.body);
            setTempData(data.body);
          }
        } catch (err) {
          console.error('Failed to fetch resume:', err);
        }
      }
    };

    fetchResumes();
  }, [resumeId]);

  // 임시 저장 처리
  const handleSaveTemp = () => {
    if (tempData) {
      setResumeData(tempData);
      setEditMode({});
    }
  };

  // 수정 모드 토글
  const toggleEditMode = (field: string) => {
    if (editMode[field] && tempData) {
      // 완료 버튼을 눌렀을 때
      setResumeData(tempData); // 수정된 데이터를 반영
    }
    setEditMode(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // 필드 값 변경
  const handleChange = (field: string, value: string) => {
    if (tempData) {
      setTempData({
        ...tempData,
        [field]: value
      });
      setIsModified(true);
    }
  };

  // 이미지 파일 변경 핸들러
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDescriptionImage(file);
      handleChange('description_image_url', URL.createObjectURL(file));
    }
  };
  // 폼 유효성 검사
  // const validateForm = (data: UpdateResumeData): boolean => {
  //   if (!data.field || !data.level || !data.resume_url || !data.description) {
  //     alert('모든 필수 필드를 입력해주세요.');
  //     return false;
  //   }

  //   if (!descriptionImage) {
  //     alert('이미지를 첨부해주세요.');
  //     return false;
  //   }

  //   const price = Number(data.price);
  //   if (isNaN(price) || price < 10000 || price > 100000) {
  //     alert('가격은 1만원 이상 10만원 이하여야 합니다.');
  //     return false;
  //   }

  //   return true;
  // };
  // 최종 수정사항 서버 저장
  // const handleFinalSubmit = async () => {
  //   if (!tempData || !resumeId) return;

  //   try {
  //     const response = await updateResume(Number(resumeId), tempData);
  //     if (response.result_code === 200) {
  //       alert('수정이 완료되었습니다.');
  //       setIsModified(false);
  //     }
  //   } catch (error) {
  //     console.error('Failed to update resume:', error);
  //     alert('수정 중 오류가 발생했습니다.');
  //   }
  // };
  const handleFinalSubmit = async () => {
    if (!tempData || !resumeId) return;
    // 이미지를 수정하지 않은 경우 기존 이미지 사용
    let imageToSend: File | string | undefined;
    if (descriptionImage) {
      imageToSend = descriptionImage;
    } else {
      //imageToSend = resumeData?.description_image_url;
      imageToSend = undefined;
    }

    const updateData: UpdateResumeData = {
      field: tempData.field as UpdateResumeData["field"],
      level: tempData.level as UpdateResumeData["level"],
      resume_url: tempData.resume_url,
      price: Number(tempData.price),
      description: tempData.description
    };
  
    try {
      const response = await updateResume(Number(resumeId), updateData, imageToSend);
      if (response.result.result_code === 200) {
        alert(response.result.result_message);
        navigate(`/resumes/pending/${resumeId}`);
      }
    } catch (error) {
      console.error('Failed to update resume:', error);
      alert('수정 중 오류가 발생했습니다.');
    }
  };

  if (!resumeData || !tempData) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow-xl space-y-6" ref={containerRef}>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">요청한 이력서 상세조회</h1>
        {isModified && (
          <button
            onClick={handleFinalSubmit}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            수정 완료
          </button>
        )}
      </div>

      {/* Field */}
      <div className="flex border items-center">
        <div className='border-r w-2/6 p-3'>Field</div>
        <div className='w-3/6 p-3'>
          {editMode.field ? (
            <Select
              options={fieldOptions}
              value={tempData.field}
              onChange={(value) => handleChange('field', value)}
              placeholder="개발 직군 선택"
            />
          ) : (
            resumeData.field
          )}
        </div>
        <div className='w-1/6 p-3'>
          <button 
            onClick={() => toggleEditMode('field')}
            className={`px-4 py-1 ${
              editMode.field ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'
            } text-white rounded`}
          >
            {editMode.field ? '완료' : '수정'}
          </button>
        </div>
      </div>

      {/* Level */}
      <div className="flex border items-center">
      <div className='border-r w-2/6 p-3'>Level</div>
      <div className='w-3/6 p-3'>
        {editMode.level ? (
          <Select
            options={levelOptions}
            value={tempData.level}
            onChange={(value) => handleChange('level', value)}
            placeholder="등급 선택"
          />
        ) : (
          resumeData.level
        )}
      </div>
      <div className='w-1/6 p-3'>
        <button 
          onClick={() => toggleEditMode('level')}
          className={`px-4 py-1 ${
            editMode.level ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'
          } text-white rounded`}
        >
          {editMode.level ? '완료' : '수정'}
        </button>
      </div>
      </div>

      {/* Resume URL */}
      <div className="flex border items-center">
      <div className='border-r w-2/6 p-3'>RESUME_URL</div>
      <div className='w-3/6 p-3 truncate'>
        {editMode.resume_url ? (
          <input
            type="text"
            value={tempData.resume_url}
            onChange={(e) => handleChange('resume_url', e.target.value)}
            className="w-full p-2 border rounded"
          />
        ) : (
          <a href={resumeData.resume_url} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
            {resumeData.resume_url}
          </a>
        )}
      </div>
      <div className='w-1/6 p-3'>
        <button 
          onClick={() => toggleEditMode('resume_url')}
          className={`px-4 py-1 ${
            editMode.resume_url ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'
          } text-white rounded`}
        >
          {editMode.resume_url ? '완료' : '수정'}
        </button>
      </div>
      </div>

      {/* Description Image */}
      <div className="flex border items-center">
      <div className='border-r w-2/6 p-3'>Description Image</div>
      <div className='w-3/6 p-3 truncate'>
        {editMode.description_image ? (
          <input
            type="file"
            accept="image/*"
            name="descriptionImage"
            onChange={handleImageChange}
            className="w-full p-2"
          />
        ) : (
          // <a href={resumeData.description_image_url} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
          //   {resumeData.description_image_url}
          // </a>
          <img src={resumeData.description_image_url} alt="Frontend" className="w-60 h-40" />
        )}
      </div>
      <div className='w-1/6 p-3'>
        <button 
          onClick={() => toggleEditMode('description_image')}
          className={`px-4 py-1 ${
            editMode.description_image ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'
          } text-white rounded`}
        >
          {editMode.description_image ? '완료' : '수정'}
        </button>
      </div>
    </div>
      {/* <div className="flex border items-center">
      <div className='border-r w-2/6 p-3'>Description Image</div>
      <div className='w-3/6 p-3 truncate'>
        {editMode.description_image ? (
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handleChange('description_image_url', URL.createObjectURL(e.target.files[0]));
              }
            }}
            className="w-full p-2"
          />
        ) : (
          <a href={resumeData.description_image_url} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
            {resumeData.description_image_url}
          </a>
        )}
      </div>
      <div className='w-1/6 p-3'>
        <button 
          onClick={() => toggleEditMode('description_image')}
          className={`px-4 py-1 ${
            editMode.description_image ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'
          } text-white rounded`}
        >
          {editMode.description_image ? '완료' : '수정'}
        </button>
      </div>
      </div> */}

      {/* Price */}
      <div className="flex border items-center">
      <div className='border-r w-2/6 p-3'>Price</div>
      <div className='w-3/6 p-3'>
        {editMode.price ? (
          <input
            type="text"
            value={tempData.price}
            onChange={(e) => handleChange('price', e.target.value)}
            className="w-full p-2 border rounded"
          />
        ) : (
          resumeData.price
        )}
      </div>
      <div className='w-1/6 p-3'>
        <button 
          onClick={() => toggleEditMode('price')}
          className={`px-4 py-1 ${
            editMode.price ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'
          } text-white rounded`}
        >
          {editMode.price ? '완료' : '수정'}
        </button>
      </div>
      </div>

      {/* Sales Quantity - 읽기 전용 */}
      <div className="flex border">
      <div className='border-r w-2/6 p-3'>Sales Quantity</div>
      <div className='w-4/6 p-3'>{resumeData.sales_quantity}</div>
      </div>

      {/* Description */}
      <div className="flex border items-center">
      <div className='border-r w-2/6 p-3'>Description</div>
      <div className='w-3/6 p-3'>
        {editMode.description ? (
          <textarea
            value={tempData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full p-2 border rounded min-h-[100px] resize-vertical"
          />
        ) : (
          resumeData.description
        )}
      </div>
      <div className='w-1/6 p-3'>
        <button 
          onClick={() => toggleEditMode('description')}
          className={`px-4 py-1 ${
            editMode.description ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'
          } text-white rounded`}
        >
          {editMode.description ? '완료' : '수정'}
        </button>
      </div>
      </div>

      {/* Status - 읽기 전용 */}
      <div className="flex border">
      <div className='border-r w-2/6 p-3'>Status</div>
      <div className='w-4/6 p-3'>{resumeData.status}</div>
      </div>
      
    </div>
  );
};

export default PendingResumeView;