//이력서 등록 요청(판매 요청)
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTextLength } from '../../utils/validation';
import Select from '../../components/resume/Select'
import {ResumeRegister} from '../../api/resume';

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
interface resumeDataType {
  field: string;
  level: string;
  resume_url: string;
  price: string;
  description: string;
}
const MIN_DESCRIPTION_LENGTH = 100;
const Register: React.FC = () => {
  const [descriptionLength, setDescriptionLength] = useState<number>(0);
  const [resumeData, setResumeData] = useState<resumeDataType>({
    field: '',
    level: '',
    resume_url: '',
    price: '',
    description: ''
  });
  const [descriptionImageFile, setDescriptionImageFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string, field?: string) => {
    if (typeof e === 'string' && field) {
      // Select 컴포넌트의 변경 처리
      setResumeData(prevState => ({
        ...prevState,
        [field]: e
      }));
    } else if (typeof e !== 'string') {
      // input과 textarea의 변경 처리
      const { name, value } = e.target;
      setResumeData(prevState => ({
        ...prevState,
        [name]: value
      }));
      // description 필드의 경우 글자 수 업데이트
      if (name === 'description') {
        const length = getTextLength(value);
        setDescriptionLength(length);
      }
    }
    
  };
  const handleChangeImg = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDescriptionImageFile(file);
    }
  };
  
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (resumeData && descriptionImageFile) {
      try {
        // FormData 생성 및 데이터 추가
        const formData = new FormData();
        
        // JSON 데이터를 문자열로 변환하여 추가
        formData.append('resumeData', JSON.stringify(resumeData));
        
        // 파일 추가
        formData.append('descriptionImage', descriptionImageFile);
        const result = await ResumeRegister(formData);
        if (result && result.result_code === 201) {
          if (result.result_message) {
            alert(`${result.result_message}`);
          } else {
            alert(`이력서 등록 성공`);
          }
          navigate("/");
        }
      } catch (err) {
        console.log("err:", err);
      }
    }
  };
  const isDescValid = descriptionLength >= MIN_DESCRIPTION_LENGTH;
  return (
    <form onSubmit={handleSubmit} className='f-ulll w-full'>
      <div className="flex justify-center items-center flex-col w-7/12 mx-auto my-12">
        <p className="m-6 text-2xl">이력서 등록 요청</p>
        <div id="register_content" className="w-full h-full">

          <div id="register_wrap" className="mt-6 h-12 p-0 border border-stone-300 box-border flex">
            <div className='w-1/2 flex'>
              <span className=" w-2/6 h-full border-r flex items-center justify-center border-stone-300 box-border bg-slate-100">
                개발 직군
              </span>
              <div className=" w-4/6 m-0 h-full overflow-hidden box-border flex justify-center items-center">
                <Select 
                  options={fieldOptions}
                  value={resumeData.field}
                  onChange={(value: string) => handleChange(value, 'field')}
                  placeholder="개발 직군 선택"
                />
              </div>
            </div>
            <div className='w-1/2 flex'>
              <span className=" w-2/6 h-full border-r flex items-center justify-center border-stone-300 box-border bg-slate-100">
                등급
              </span>
              <div className="m-0 w-4/6 h-full overflow-hidden box-border flex justify-center items-center">
                <Select
                  options={levelOptions}
                  value={resumeData.level}
                  onChange={(value: string) => handleChange(value, 'level')}
                  placeholder="등급 선택"
                />
              </div>
            </div>
            
          </div>

          <div id="register_wrap" className="mt-6 flex p-0 border border-stone-300 box-border ">
            <span className="border-r w-1/6 flex items-center justify-center border-stone-300 box-border bg-slate-100">
              이력서 url
            </span>
            <div id="url_content" className="h-full w-5/6 bg-white">
                <input
                  id="resume_url"
                  className="m-0 h-full w-full overflow-hidden align-middle box-border p-4 text-sm focus:outline-none" 
                  type="text"
                  name="resume_url"
                  value={resumeData.resume_url}
                  onChange={handleChange}
                  required
                />
            </div>
          </div>

          <div id="register_wrap" className="mt-6 flex p-0 border border-stone-300 box-border ">
            <span className="border-r w-1/6 flex items-center justify-center border-stone-300 box-border bg-slate-100 ">
              price
            </span>
            <div id="price_content" className="h-full w-5/6 bg-white">
                <input
                  id="price"
                  className="m-0 h-full w-full overflow-hidden align-middle box-border p-4 text-sm focus:outline-none"
                  type="text"
                  name="price"
                  value={resumeData.price}
                  onChange={handleChange}
                  required
                />
            </div>
          </div>

          <div id="register_wrap" className="mt-6 flex p-0 border border-stone-300 box-border h-64">
            <span className="border-r w-1/6 flex items-center justify-center border-stone-300 box-border bg-slate-100">
              설명
            </span>
            <div id="description_content" className="h-full w-5/6 bg-white p-4">
                <textarea
                  id="description"
                  className={`m-0 h-5/6 w-full align-middle box-border text-sm focus:outline-none resize-none overflow-y-auto ${!isDescValid ? 'border border-red-500' : 'border border-stone-300'}`}
                  name="description"
                  value={resumeData.description}
                  onChange={handleChange}
                  placeholder={`이력서에 대해 자세히 설명해주세요.(최소 ${MIN_DESCRIPTION_LENGTH}자)`}
                ></textarea>
                <div className="mt-2 text-sm">
                  <span className={`${isDescValid ? 'text-green-600' : 'text-red-500'}`}>
                    {descriptionLength}/{MIN_DESCRIPTION_LENGTH}
                  </span>
                  {!isDescValid && <span className="ml-2 text-red-500">최소 {MIN_DESCRIPTION_LENGTH}자 이상 입력해 주세요!</span>}
                </div>
            </div>
          </div>

          <div id="register_wrap" className="mt-6 flex p-0 border border-stone-300 box-border ">
            <span className="border-r w-1/6 flex items-center justify-center border-stone-300 box-border bg-slate-100">
              descriptionImage
            </span>
            <div id="url_content" className="h-full w-5/6 bg-white">
                <input
                  id="descriptionImage"
                  className="m-0 h-full w-full overflow-hidden align-middle box-border p-4 text-sm focus:outline-none" 
                  type="file"
                  name="descriptionImage"
                  accept="image/*"
                  onChange={handleChangeImg}
                  required
                />
            </div>
          </div>
          

          
          
        </div>
        <div className='flex mt-4 text-xl w-full'>
            <button type="submit" className="bg-slate-400 h-14 flex justify-center items-center text-white w-full">
              이력서 등록
            </button>
        </div>
      </div>
    </form>
  );
};

export default Register;