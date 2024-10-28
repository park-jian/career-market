import React, { useState, useEffect, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchUser, modifyPassword } from '../../api/user';
import { IoIosCloseCircleOutline, IoIosCheckmarkCircleOutline } from "react-icons/io";
import { validatePassword, validateConfirmPassword } from '../../utils/validation';
// import { useAuth } from '../../auth/AuthContext';
import { useUser } from '../../hooks/useUser';

// User 인터페이스 정의 추가
interface User {
  email: string;
  name: string;
  role_type: string;
}

interface PasswordState {
  value: string;
  isValid: boolean;
  messageVisible: boolean;
}

const Profile: React.FC = () => {
  const { data: user } = useUser();
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [password, setPassword] = useState<PasswordState>({ value: "", isValid: false, messageVisible: false });
  const [confirmPassword, setConfirmPassword] = useState<PasswordState>({ value: "", isValid: false, messageVisible: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const loadUser = async () => {
      if (!user) {
        setError('사용자 인증이 필요합니다.');
        setLoading(false);
        navigate('/users/login');
        return;
      }
      try {
        const userData = await fetchUser();
        const result = userData.result;
        const userInfo = userData.body;
        if (result.result_code === 200) {
          setUserInfo(userInfo);
        } else {
          console.warn('Unexpected result code:', result.result_code, result.result_message);
          alert(`Login Error: ${result.result_code}\n${result.result_message}`);
        }
      } catch (err) {
        setError('Failed to load user data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [user, navigate]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "password") {
      setPassword(prev => ({ ...prev, value, isValid: validatePassword(value) }));
    } else if (name === "confirmPassword") {
      setConfirmPassword(prev => ({ ...prev, value, isValid: validateConfirmPassword(value, password.value)}));
    }
  };

  const handlePasswordClick = (name: string) => {
    if (name === "password") {
      setPassword(prev => ({ ...prev, messageVisible: true }));
    } else if (name === "confirmPassword") {
      setConfirmPassword(prev => ({ ...prev, messageVisible: true }));
    }
  };

  const handlePasswordBlur = (name: string) => {
    if (name === "password") {
      if (password.value === "") {
        setPassword(prev => ({ ...prev, messageVisible: false }));
      }
    } else if (name === "confirmPassword") {
      if (confirmPassword.value === "") {
        setConfirmPassword(prev => ({ ...prev, messageVisible: false }));
      }
    }
  };
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (confirmPassword && confirmPassword.isValid === true) {
      try {
        const result = await modifyPassword(confirmPassword.value);
        if (result && result.result_code === 200) {
          if (result.result_message) {
            alert(`${result.result_message}`);
          } else {
            alert(`비밀번호 수정 성공`);
          }
          navigate(0);
        }
      } catch (err) {
        console.log("err:", err);
      }
    }
  };
  const PasswordMessage: React.FC<{ password: PasswordState, message: string }> = ({ password, message }) => (
    <div className='text-slate-400 text-sm mt-5 mb-5 mr-5'>
      <div className='flex'>
        <span className={`w-4 flex items-center justify-center mr-1 ${password.value.length > 0 ? (password.isValid ? 'text-green-500' : 'text-red-500') : 'text-slate-400'}`}>
          {password.value.length > 0 ? (password.isValid ? <IoIosCheckmarkCircleOutline /> : <IoIosCloseCircleOutline />) : <IoIosCloseCircleOutline />}
        </span>
        <span className={password.value.length > 0 ? (password.isValid ? 'text-green-500' : 'text-red-500') : 'text-slate-400'}>
          {message}
        </span>
      </div>
    </div>
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!userInfo) return <div>No user data available</div>;

  return (
    <div className="flex justify-center items-center flex-col w-11/12 h-3/5 mx-auto my-12">
    <form onSubmit={handleSubmit}>
      <p className="m-6 text-2xl">회원정보</p>
      <div id="join_content" className="w-full h-full">
        <div id="member_wrap" className="mt-6 h-12 p-0 border border-stone-300 box-border bg-slate-100">
          <span className="relative w-1/6 h-full border-r float-left flex items-center justify-center border-stone-300 box-border">
            이름
          </span>
          <div className="relative m-0 h-full overflow-hidden">
            <input
              type="text"
              name="name"
              value={userInfo.name}
              readOnly
              className="w-full h-full border rounded-md pl-2 outline-none border-0"
              autoComplete="on"
            />
          </div>
        </div>

        <div id="member_wrap" className="mt-6 h-12 p-0 border border-stone-300 box-border bg-slate-100">
          <span className="relative w-1/6 h-full border-r float-left flex items-center justify-center border-stone-300 box-border">
            이메일
          </span>
          <div className="relative m-0 h-full overflow-hidden">
            <input
              type="email"
              name="email"
              value={userInfo.email}
              readOnly
              className="w-full h-full border rounded-md pl-2 outline-none border-0"
            />
          </div>
        </div>

        <div id="member_wrap" className="mt-6 flex p-0 border border-stone-300 box-border ">
          <div id="password_label" className="flex bg-slate-100 w-1/6">
            <span className="border-r w-full flex items-center justify-center border-stone-300 box-border">
              비밀번호 변경
            </span>
          </div>
          <div id="password_content" className="h-full w-5/6 bg-white p-4">
            <div className="m-0 w-full flex h-10">
              <span className="w-1/5 h-full flex items-center box-border">
                새 비밀번호
              </span>
              <input
                id="new_password"
                className="m-0 h-full w-full overflow-hidden align-middle box-border border border-stone-300 pl-2 text-sm"
                type="password"
                name="password"
                value={password.value}
                onClick={() => handlePasswordClick("password")}
                onChange={handlePasswordChange}
                onBlur={() => handlePasswordBlur("password")}
                autoComplete="new-password"
              />
            </div>
            {password.messageVisible && (
              <PasswordMessage 
                password={password} 
                message="영문/숫자/특수문자 2가지 이상 조합 (8~20자)" 
              />
            )}

            <div className="mt-4 w-full flex h-10">
              <span className="w-1/5 h-full flex items-center box-border">
                새 비밀번호 확인
              </span>
              <input
                id="new_password_confirm"
                className="m-0 h-full w-full overflow-hidden align-middle box-border border border-stone-300 pl-2 text-sm"
                type="password"
                name="confirmPassword"
                value={confirmPassword.value}
                onClick={() => handlePasswordClick("confirmPassword")}
                onChange={handlePasswordChange}
                onBlur={() => handlePasswordBlur("confirmPassword")}
                autoComplete="new-password"
              />
            </div>
            {confirmPassword.messageVisible && (
              <PasswordMessage 
                password={confirmPassword} 
                message={confirmPassword.value.length > 0 
                  ? (confirmPassword.isValid ? "새 비밀번호가 일치합니다." : "새 비밀번호가 일치하지 않습니다.") 
                  : "확인을 위해 새 비밀번호를 다시 입력해주세요."} 
              />
            )}
            <button className="bg-slate-400 h-12 flex justify-center items-center text-white w-18 mt-6">
              비밀번호 변경
            </button>
          </div>
        </div>
        <div className='flex mt-4 text-xs justify-end'>
          <Link to="/">
            <button className="bg-slate-400 h-8 flex justify-center items-center text-white w-30">
              나가기
            </button>
          </Link>
          <Link to="/users/secession">
            <button className="bg-slate-400 h-8 flex justify-center items-center text-white w-30 ml-4">
              회원 탈퇴
            </button>
          </Link>
        </div>
      </div>
    </form>
    </div>
  );
};

export default Profile;