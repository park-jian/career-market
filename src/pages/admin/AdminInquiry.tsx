//이력서 등록 요청(판매 요청)
import React, { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTextLength } from '../../utils/validation';
import Select from '../../components/resume/Select'
import { setAdminInquiry } from '../../api/resume';
import { inquiryDataType } from '../../types/resume';
import { AxiosError } from 'axios';
const typeOptions = [
  { value: 'ORDER', label: '주문 문의' },
  { value: 'REFUND', label: '환불 문의' },
  { value: 'SALES', label: '판매 문의' },
  { value: 'ETC', label: '기타 문의' }
];

const MIN_CONTENT_LENGTH = 10;
const MAX_CONTENT_LENGTH = 500;
const AdminInquiry : React.FC = () => {
  const [contentLength, setContentLength] = useState<number>(0);
  const [inquiryData, setInquiryData] = useState<inquiryDataType>({
    inquiry_type: '',
    title: '',
    content: ''
  });
  const navigate = useNavigate();
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string, inquiry_type?: string) => {
    if (typeof e === 'string' && inquiry_type) {
      setInquiryData(prevState => ({
        ...prevState,
        [inquiry_type]: e
      }));
    } else if (typeof e !== 'string') {
      const { name, value } = e.target;
      setInquiryData(prevState => ({
        ...prevState,
        [name]: value
      }));
      if (name === 'content') {
        const length = getTextLength(value);
        setContentLength(length);
      }
    }
    
  };
  const handleInquiry = async () => {
    if (inquiryData) {
      try {
        const result = await setAdminInquiry(inquiryData);
        if (result?.result?.result_code === 200) {
          alert(result.result.result_message || '등록 성공');
        } else {
          alert(result.result_message || '등록 실패');
        }
      } catch (error: unknown) {
        if (error instanceof AxiosError && error.response?.data?.result) {
          const result = error.response.data.result;
          if (result.result_code === 400 && result.result_description) {
            alert(result.result_description);
            return;
          }
        } else {
          alert('알 수 없는 에러가 발생 하였습니다.');
        }
      } finally {
        navigate("/");
      }
    }
  };
  const isDescValid = contentLength >= MIN_CONTENT_LENGTH && contentLength <= MAX_CONTENT_LENGTH;
  return (
    <div className="flex justify-center items-center flex-col w-9/12 mx-auto my-12">
      <p className="m-6 text-2xl">문의 하기</p>
      <div id="register_content" className="w-full h-full">

        {/* 문의 유형 */}
        <div id="register_wrap" className="mt-6 h-12 p-0 border border-stone-300 box-border flex">
          <div className='w-1/2 flex'>
            <span className="w-1/2 h-full border-r flex items-center justify-center border-stone-300 box-border bg-slate-100">
              문의 유형
            </span>
            <div className="w-1/2 m-0 h-full overflow-hidden box-border flex justify-center items-center">
              <Select 
                options={typeOptions}
                value={inquiryData.inquiry_type}
                onChange={(value: string) => handleChange(value, 'inquiry_type')}
                placeholder="문의 유형 선택"
              />
            </div>
          </div>
        </div>
        {/* 제목 */}
        <div id="register_wrap" className="mt-6 flex p-0 border border-stone-300 box-border">
          <span className="border-r w-3/12 flex items-center justify-center border-stone-300 box-border bg-slate-100">
            제목
          </span>
          <div id="url_content" className="h-full w-9/12 bg-white">
            <input
              id="title"
              className="m-0 h-full w-full overflow-hidden align-middle box-border p-4 text-sm focus:outline-none" 
              type="text"
              name="title"
              value={inquiryData.title.replace(/\s/g, '')}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        {/* 설명 입력 */}
        <div id="register_wrap" className="mt-6 flex p-0 border border-stone-300 box-border h-64">
          <span className="border-r w-3/12 flex items-center justify-center border-stone-300 box-border bg-slate-100">
            설명
          </span>
          <div id="content" className="h-full w-9/12 bg-white p-4">
            <textarea
              id="content"
              className={`m-0 h-5/6 w-full align-middle box-border text-sm focus:outline-none resize-none overflow-y-auto ${
                contentLength > 0 && !isDescValid ? 'border border-red-500' : 'border-none'
              }`}
              name="content"
              value={inquiryData.content}
              onChange={handleChange}
              placeholder={`최소 ${MIN_CONTENT_LENGTH}자 ~ 최대 ${MAX_CONTENT_LENGTH}자`}
            ></textarea>
            <div className="mt-2 text-sm">
              {contentLength > 0 && (
                <>
                  <span className={`${isDescValid ? 'text-green-600' : 'text-red-500'}`}>
                    {contentLength}/{MAX_CONTENT_LENGTH}
                  </span>
                  {!isDescValid && (
                    <span className="ml-2 text-red-500">
                      최소 {MIN_CONTENT_LENGTH}자 이상 최대 {MAX_CONTENT_LENGTH}자 이하를 입력해 주세요!
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className='flex mt-4 text-xl w-full'>
        <button onClick={handleInquiry} className="bg-slate-400 h-14 flex justify-center items-center text-white w-full hover:bg-slate-500">
          등록 하기
        </button>
      </div>
    </div>
  );
};

export default AdminInquiry ;