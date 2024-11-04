import React, { useState } from "react";
import { validateEmail, validatePassword } from "../../utils/validation"
import { FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import {useLogin} from '../../hooks/useUser';
export default function EmailLogin() {
  //const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  //const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [userInfo, setUserInfo] = useState({ email: "", password: "" }); 
  //const { login } = useAuth();
  // useLogin hook을 컴포넌트 최상위 레벨에서 호출
  const loginMutation = useLogin();
  const navigate = useNavigate();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //setEmail(e.target.value);
    const {name, value} = e.target;
    setUserInfo(prevState => ({ ...prevState, [name]: value }));
  };
  const handlePasswordBlur = () => {//e: React.FocusEvent<HTMLInputElement>
    //이것도 handleEmailBlur와 합칠수 있는지 확인해
    const validatePasswordResult = validatePassword(userInfo.password);
    if (validatePasswordResult !== true) {//유효성 검사 실패
      setPasswordError(true);//이거 true인데 일단 false로 걍 두고 테스트 한다. 테스트 끝나면 다시 true로 바꿔
    } else {//검증 성공
      setPasswordError(false);
    }
  };
  const handleEmailBlur = () => {//e: React.FocusEvent<HTMLInputElement>
    //이메일 유효성 검사(@기준 앞 구간이 알파벳 또는 숫자 조합, 뒷 구간이 알파벳 숫자 조합, @ 뒷구간에 . 뒷구간이 알파벳)
    const validateEmailResult = validateEmail(userInfo.email);
    if (validateEmailResult !== true) {//유효성 검사 실패
      setEmailError(true);
    } else {//검증 성공
      setEmailError(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (emailError || passwordError) {
      console.error("Form has errors. Please correct them before submitting.");
      return;
    }
    try {
      await loginMutation.mutateAsync({
        email: userInfo.email,
        password: userInfo.password
      });
      // 로그인 성공 시 페이지 이동
      navigate('/');
    } catch (error) {
      console.error("로그인 실패:", error);
      setUserInfo({ email: "", password: "" });
      setEmailError(false);
      setPasswordError(false);
    }
  };

  return (
    <form className="w-full h-full" onSubmit={handleSubmit}>
      <div className="flex justify-center items-center flex-col w-full h-full p-5">
        <FaLock size="24" color="skyblue" />
        <p className="m-6 text-2xl">이메일 로그인</p>
        <input
          type="email"
          name="email"
          value={userInfo.email}
          onChange={handleChange}
          onBlur={handleEmailBlur}
          required
          className="w-3/5 h-9 border rounded-md"
          placeholder="Email Address*"
          autoComplete="off"
        ></input>
        <div className="h-7">
          {emailError && (
            <span className="text-red-500 text-xs">아이디는 이메일 형식으로 입력해주세요.</span>
          )}
        </div>
        <input
          type="password"
          name="password"
          value={userInfo.password}
          onChange={handleChange}
          onBlur={handlePasswordBlur}
          required
          className="w-3/5 h-9 border rounded-md"
          placeholder="영문 대 또는 소문자, 숫자, 특수기호 포함 총 8자 이상"
          autoComplete="off"
        ></input>
        <div className="h-7">
          {passwordError && (
            <span className="text-red-500 text-xs">비밀 번호를 확인해 주세요</span>
          )}
        </div>
        <div className="flex justify-start w-3/5 m-2">
          <input className="mr-2" type="checkbox" />
          <span className="text-sm">자동로그인</span>
        </div>
        <button className="my-0.5 mb-3 w-3/5 h-9 rounded-md bg-sky-500 hover:bg-sky-700 text-white">
          SIGN IN
        </button>
        <div className="flex justify-between w-3/5 text-sm">
          <Link to="/users/password/new" className="cursor-grabbing underline">
            Forgot password?
          </Link>
          <Link to="/users/register" className="cursor-grabbing underline">
            Sign Up
          </Link>
        </div>
      </div>
    </form>
  );
}
