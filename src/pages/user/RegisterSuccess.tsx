import { Link } from 'react-router-dom';
import { FaUserCircle } from "react-icons/fa";
import { useUser } from '../../hooks/useUser';

function RegisterSuccess() {
  const { data: user } = useUser();

  return (
    <div className="container mx-auto px-4">
      <div className='mt-20 flex justify-center'>
        <div className='w-full max-w-2xl border rounded-lg shadow-md p-4 sm:p-8'>
          <div className='flex flex-col justify-center items-center'>
            <div className='mb-4'>
              <FaUserCircle className="w-12 h-12 sm:w-16 sm:h-16 text-slate-400"/>
            </div>
            
            <p className='font-bold mb-2 text-sm sm:text-base'>회원가입이 완료 되었습니다.</p>
            <div className='mb-8 text-sm sm:text-base'>
              {user?.name}님은 [{user?.status === "USER" ? '일반회원' : '회원'}] 이십니다.
            </div>

            <div className="w-full border-y-2 border-stone-300 py-4 sm:py-8 space-y-4">
              {/* 이름 입력 필드 */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                <span className="hidden sm:block text-right text-base">
                  이름
                </span>
                <div className="col-span-1 sm:col-span-3">
                  <input
                    type="text"
                    name="name"
                    value={user?.name}
                    readOnly
                    required
                    className="w-full p-2 bg-gray-50 rounded-md text-sm sm:text-base text-center"
                    autoComplete="on"
                  />
                </div>
              </div>

              {/* 이메일 입력 필드 */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                <span className="hidden sm:block text-right text-base">
                  이메일
                </span>
                <div className="col-span-1 sm:col-span-3">
                  <input
                    type="email"
                    name="email"
                    value={user?.email}
                    readOnly
                    required
                    className="w-full p-2 bg-gray-50 rounded-md text-sm sm:text-base text-center"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className='mt-6 sm:mt-8'>
            <Link to="/">
              <button className="w-full bg-slate-400 hover:bg-slate-500 text-white py-2 sm:py-3 rounded-md transition-colors text-sm sm:text-base">
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