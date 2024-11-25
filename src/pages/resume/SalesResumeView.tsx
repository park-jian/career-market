import React, {useState} from 'react';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { useLocation, Link } from 'react-router-dom';
import { addCart } from '../../api/order';
// import { ResumeInfo } from '../../types/resume';
import {getListOne} from '../../api/resume';
// import axios from 'axios';
const SalesResumeListOne: React.FC = () => {
  const queryClient = useQueryClient();
  const location = useLocation();
  const [alertVisible, setAlertVisible] = useState(false);
  const resume_id = (location.state)?.resume_id;
  // const [resumeData, setResumeData] = useState<ResumeInfo>();
  // const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가
  // useEffect(() => {
  //   const fetchResumes = async () => {
  //     try {
  //       setIsLoading(true);
  //       const data = await getListOne(resume_id);
  //       if (data?.result?.result_code === 200) {
  //         setResumeData(data.body);
  //       } else {
  //         alert('데이터를 불러오는데 실패했습니다.');
  //       }
  //     } catch (err: unknown) {
  //       if (axios.isAxiosError(err)) {
  //           alert('오류가 발생했습니다');
  //       }
  //     } finally {
  //       setIsLoading(false); // 데이터 로딩 완료
  //     }
  //   };
  //   fetchResumes();
  // }, []);
  // Resume data fetching with React Query
  const { data: resumeData, isLoading } = useQuery({
    queryKey: ['resume', resume_id],
    queryFn: () => getListOne(resume_id),
    select: (data) => data?.body,
    enabled: !!resume_id,
  });
  const cartMutation = useMutation({
    mutationFn: addCart,
    onSuccess: (response) => {
      if (response?.result_code === 201) {
        queryClient.invalidateQueries({ queryKey: ['cart'] }); // 객체 형태로 변경
        setAlertVisible(true);
      } else {
        alert(`(${response.result_code})${response.result_message}`);
      }
    },
  });
  if (!resume_id || !resumeData) {
    return (
      <div className="p-6 text-center">
        <p>이력서 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <p>로딩 중...</p>
      </div>
    );
  }
  const handleCart = async () => {
    // const response = await addCart(resume_id);
    // if (response?.result_code === 201) {
    //   setAlertVisible(true)
    // } else {
    //   alert(`(${response.result_code})${response.result_message}`);
    // }
    cartMutation.mutate(resume_id);
  }
  const handleAlertVisible = () => {
    setAlertVisible(false)
  }
  return (
    <div className="max-w-6xl mx-auto p-6 pt-20">
      <header className="flex gap-8">
        {/* 왼쪽 이미지 영역 */}
        <div className="w-1/2">
          <img 
            src={resumeData.thumbnail_image_url || '/default-image.png'} 
            alt={resumeData.title}
            className="w-full h-auto border rounded"
          />
        </div>

        {/* 오른쪽 상품 정보 영역 */}
        <div className="w-1/2 space-y-6">
          <h1 className="text-2xl font-bold">{resumeData.title}</h1>
          
          <div className="space-y-4">
            {/* 상품 요약 정보 */}
            {/* <div className="text-gray-600">
              {resumeData.registered_at ? `${new Date(resumeData.registered_at).getFullYear()}년 ${new Date(resumeData.registered_at).getMonth() + 1}월` : null}
            </div> */}

            {/* 판매가 */}
            <div className="border-t border-b py-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">판매가</span>
                <span className="text-xl font-bold">{resumeData.price}원</span>
              </div>
            </div>

            {/* 추가 정보 */}
            <div className="space-y-2">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">판매량</span>
                <span>{resumeData.sales_quantity}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">분야</span>
                <span>{resumeData.field}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">등급</span>
                <span>{resumeData.level}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">상태</span>
                <span>{resumeData.status}</span>
              </div>
            </div>

            {/* 총 상품금액 */}
            <div className="border-t border-b py-4">
              <div className="flex justify-between items-center">
                <span className="font-bold">TOTAL<span className="text-sm text-gray-500 ml-2">(QUANTITY)</span></span>
                <span className="text-xl font-bold text-blue-600">
                  {resumeData.price.toLocaleString()}원 <span className="text-sm text-gray-500">(1개)</span>
                </span>
              </div>
            </div>

            {/* 버튼 그룹 */}
            <div className="relative">
              <div className="flex gap-2">
              <Link to="/transaction"
              state={{ 
                selectedProducts: [{
                  resume_id: resumeData.resume_id,
                  cart_resume_id: resumeData.resume_id,
                  price: resumeData.price,
                  title: resumeData.title
                }],
                totalQuantity: 1,
                totalPrice: resumeData.price
              }}>
                <button className="flex-1 bg-black text-white py-4">
                  BUY IT NOW
                </button>
              </Link>
                <div className="flex-1 relative">
                  <button onClick={handleCart} className="w-full border border-gray-300 py-4">CART</button>
                  
                  {/* Cart Alert */}
                  {alertVisible && (
                    <div className="absolute left-0 right-0 top-full mt-2 z-10">
                      {/* 말풍선 화살표 */}
                      <div className="absolute -top-2 right-1/2 translate-x-1/2 w-4 h-4 rotate-45 bg-white border-l border-t border-gray-200"></div>
                      
                      {/* 알림 컨텐츠 */}
                      <div className="relative bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                        <div className="text-center py-3 border-b border-gray-200 text-green-600 font-medium">
                          카트 담기 성공
                        </div>
                        <div className="flex divide-x">
                          <button
                            onClick={handleAlertVisible}
                            className="flex-1 py-3 bg-yellow-300 text-white text-sm hover:bg-gray-800 transition-colors"
                          >
                            쇼핑 계속
                          </button>
                          <Link to="/cart" className="flex-1">
                            <button className="w-full h-full py-3 text-sm hover:bg-gray-50 transition-colors">
                              장바구니로 이동
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content Section */}
      <div className="border-t pt-12 mt-12">
        <div className="flex flex-col items-center">
          {/* Description Image */}
          {resumeData.description_image_url && (
            <div className="mb-12 max-w-3xl mx-auto">
              <img 
                src={resumeData.description_image_url} 
                alt="상세 설명"
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          )}

          {/* Description Text */}
          <div className="w-full max-w-3xl mx-auto prose">
            <h2 className="text-xl font-bold mb-6 text-center">상세 설명</h2>
            <div className="whitespace-pre-wrap text-gray-700 text-center">
              {resumeData.description || "상세 설명이 없습니다."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesResumeListOne;