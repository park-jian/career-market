import { Link } from 'react-router-dom';
import { FaUserCircle } from "react-icons/fa";
import { useUser } from '../../hooks/useUser';

function RegisterSuccess() {
  const { data: user } = useUser();

  return (
    <div className="container mx-auto px-4">
      {/* 상단 여백 추가 및 전체 레이아웃 중앙 정렬 */}
      <div className='mt-20 flex justify-center'>
        <div className='w-full max-w-2xl border rounded-lg shadow-md p-8'>
          <div className='flex flex-col justify-center items-center'>
            <div className='mb-4'>
              <FaUserCircle className="w-16 h-16 text-slate-400"/>
            </div>
            
            <p className='font-bold mb-2'>회원가입이 완료 되었습니다.</p>
            <div className='mb-8'>
              {user?.name} 님은 [{user?.role_type === "USER" ? '일반회원' : '회원'}] 이십니다.
            </div>

            <div className="w-full border-y-2 border-stone-300 py-8 space-y-4">
              {/* 이름 입력 필드 */}
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <span className="w-full sm:w-1/4 text-center sm:text-right">
                  이름
                </span>
                <div className="w-full sm:w-3/4">
                  <input
                    type="text"
                    name="name"
                    value={user?.name}
                    readOnly
                    required
                    className="w-full p-2 bg-gray-50 rounded-md"
                    autoComplete="on"
                  />
                </div>
              </div>

              {/* 이메일 입력 필드 */}
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <span className="w-full sm:w-1/4 text-center sm:text-right">
                  이메일
                </span>
                <div className="w-full sm:w-3/4">
                  <input
                    type="email"
                    name="email"
                    value={user?.email}
                    readOnly
                    required
                    className="w-full p-2 bg-gray-50 rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className='mt-8'>
            <Link to="/">
              <button className="w-full bg-slate-400 hover:bg-slate-500 text-white py-3 rounded-md transition-colors">
                메인으로 이동
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterSuccess;