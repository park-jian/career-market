import { useState } from "react";
import EmailLogin from "../../components/user/EmailLogin";
// import SNSLogin from "./SNSLogin";

export default function Login() {
  const [activeTab, setActiveTab] = useState(1);

  const handleTabClick = (tabNumber: number) => {
    setActiveTab(tabNumber);
  };

  return (
    <div className="w-full h-full min-h-[600px] flex items-center justify-center px-4">
      <div className="w-full max-w-[400px] bg-white rounded-lg shadow-md">

        {/* 탭 버튼 영역 */}
        <div className="flex border-b">
          <button
            onClick={() => handleTabClick(1)}
            className={`flex-1 py-4 text-sm font-medium relative
              ${activeTab === 1 
                ? 'text-sky-500 border-b-2 border-sky-500' 
                : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            이메일 로그인
          </button>
          <button
            onClick={() => handleTabClick(2)}
            className={`flex-1 py-4 text-sm font-medium relative
              ${activeTab === 2 
                ? 'text-sky-500 border-b-2 border-sky-500' 
                : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            SNS 로그인
          </button>
        </div>

        <div className="tab-content w-full h-96 flex items-center justify-center focus:bg-orange-300">
          {activeTab === 1 && <EmailLogin></EmailLogin>}
          {/* {activeTab === 2 && <SNSLogin></SNSLogin>} */}
        </div>


      </div>
    </div>
  );
}