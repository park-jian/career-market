import React, { useState, FormEvent  } from "react";
import axios, {AxiosError } from "axios";
import { useNavigate } from 'react-router-dom';
import { MdOutlineEmail } from "react-icons/md";
import { TbLock, TbLockCheck } from "react-icons/tb";
import { GiCharacter } from "react-icons/gi";
import { IconContext } from "react-icons";
import { validateEmail, validatePassword, validateConfirmPassword } from "../../utils/validation"
import api from '../../api/axiosConfig';
import {verifyCode} from '../../api/user';
import {useSignup} from '../../hooks/useUser';
import {UserInfo, VerifyCodeResponse, MessageProps} from '../../types/user';
function Register() {
  //비밀번호, 비밀번호 확인 저장
  const [confirmPassword, setConfirmPassword] = useState("");
    //user 정보
    const [userInfo, setUserInfo] = useState<UserInfo>({
      name: "",
      email: "",
      password: ""
    });
    //인증번호 저장
    const [authNumber, setAuthNumber] = useState("");
    //인증번호 코드와 message
    const [authNumberResultObj, setAuthNumberResultObj] = useState<VerifyCodeResponse | null>(null);
  //유효성 검사를 위한 state
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [authError, setAuthError] = useState(false);
  //인증번호를 위한 state
  const [countdown, setCountdown] = useState<number | null>(null);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const signup = useSignup();
  const navigate = useNavigate();

  //input 입력시 값을 userInfo 저장
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo({
      ...userInfo,
      [event.target.name]: event.target.value,
    });
  };
  //인증번호 저장
  const handleAuthNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAuthNumber(event.target.value);
  };

  //이메일 유효성 체크
  const handleEmailBlur = () => {//e: React.FocusEvent<HTMLInputElement>
    //이메일 유효성 검사(@기준 앞 구간이 알파벳 또는 숫자 조합, 뒷 구간이 알파벳 숫자 조합, @ 뒷구간에 . 뒷구간이 알파벳)
    const validateEmailResult = validateEmail(userInfo.email);
    console.log("validateEmailResult:",validateEmailResult !== true )
    setEmailError(validateEmailResult !== true);
  };
  //비밀번호 유효성 체크
  const handlePasswordBlur = (name: 'password' | 'confirmPassword') => {//e: React.FocusEvent<HTMLInputElement>
    if (name === "password") {
      //이것도 handleEmailBlur와 합칠수 있는지 확인해
      const validatePasswordResult = validatePassword(userInfo.password);
      // if (validatePasswordResult !== true) {//유효성 검사 실패
      //   setPasswordError(true);//이거 true인데 일단 false로 걍 두고 테스트 한다. 테스트 끝나면 다시 true로 바꿔
      // } else {//검증 성공
      //   setPasswordError(false);
      // }
      setPasswordError(!(validatePasswordResult === true));
    } else if (name === "confirmPassword") {
      if (confirmPassword === "") {
        setConfirmPasswordError(!(validateConfirmPassword(userInfo.password, confirmPassword)));
      }
    }
  };
  
  //인증메일 보내기
  const handleAuthEmail = async (email: string) => {
    try {
      const response = await api.post(`/open-api/v1/users/code/send?email=${encodeURIComponent(email)}`);
      // API 성공 시 5분 카운트다운 시작
      if (response.status === 200) {
        setCountdown(300); // 5분 = 300초

        // 기존의 interval이 있다면 정리
        if (intervalId) {
          clearInterval(intervalId);
        }

        const id = setInterval(() => {
          setCountdown((prev) => {
            if (prev === 1) {
              clearInterval(id);
              return null; // 카운트다운이 끝났으면 null로 설정
            }
            return (prev || 0) - 1; // 1초씩 감소
          });
        }, 1000); // 1초마다 호출

        setIntervalId(id); // interval ID 저장
      }
    } catch(error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          // 서버가 2xx 범위를 벗어나는 상태 코드로 응답한 경우
          console.error("서버 응답 에러:", axiosError);
        } else if (axiosError.request) {
          // 요청이 이루어졌으나 응답을 받지 못한 경우
          console.error("네트워크 에러:", axiosError.request);
        } else {
          // 요청을 만드는 중에 오류가 발생한 경우
          console.error("에러 메시지:", axiosError.message);
        }
      } else {
        // Axios 에러가 아닌 경우
        console.error("알 수 없는 에러:", error);
        alert("알 수 없는 오류가 발생했습니다.");
      }
    }
    

  }
  
  //인증번호 유효성 체크
  const handleAuthNumberCheck = async () => {
      try {
        const resultObj = await verifyCode(userInfo.email, authNumber);
        console.log("handleAuthNumberCheck:",resultObj );
        if (resultObj.result_message === '성공') {
          setAuthError(false);
        } else {
          setAuthError(true);
        }
        
        setAuthNumberResultObj(resultObj);
      } catch (error) {
        console.error("인증번호 확인 실패:", error);
        setAuthError(true);
      }
  };
  //회원 가입 버튼
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("submit_userInfo:", userInfo, emailError, passwordError, confirmPasswordError, authError);
    
    if (emailError !== true && passwordError !== true && confirmPasswordError !== true && authError !== true) {
      // const resultObj = await fetchSignup(userInfo);
      // try {
      //   console.log("회원가입성공:", resultObj);
      // } catch (err) {
      //   // console.log(err.response.data);
      //   console.log("회원가입실패:", err);
      // }
      try {
        await signup.mutateAsync({
          email: userInfo.email,
          name: userInfo.name,
          password: userInfo.password
        });

        // 회원가입 성공 시 페이지 이동
        navigate('/users/join_success');
      } catch (error) {
        console.error("회원가입 실패:", error);
      }
    }
  };
  const Message: React.FC<MessageProps> = ({ keyword, message, status }) => {
    if (!message) return null;
    if (keyword === 'password') {
      return (
        <div className='text-slate-400 text-sm m-5'>
          <div className='flex'>
            <span className={`${status === true ? 'text-green-500' : 'text-red-500'}`}>
              {message}
            </span>
          </div>
        </div>
      );
    } else {
      return (
        <span className={`text-sm ${status === true ? 'text-green-500' : 'text-red-500' }`}>
          {message}
        </span>
      );
    }
  };
  return (
    <IconContext.Provider
      value={{
        className: "signupIcon",
      }}
    >
      <div className="flex justify-center items-center flex-col w-6/12 h-3/5 mx-auto my-12">
        <form onSubmit={handleSubmit} className="w-full h-full">
          <div id="section_title" className="border-sky-400 h-12 flex justify-center items-center">
            <strong>회원정보</strong>를 입력해주세요
          </div>
          <div id="join_content" className="w-full h-full">
            <div id="member_wrap" className="mt-4">
              <div id="member_input_field" className="relative">
                <label
                  htmlFor="join_name"
                  className="relative cursor-pointer block h-12 p-0 border border-stone-300 box-border"
                >
                  <span className="relative h-full min-w-11 border-r float-left flex items-center justify-center border-stone-300 box-border">
                    <GiCharacter />
                  </span>
                  <div className="relative m-0 overflow-hidden">
                    <input
                      className="m-0 h-full w-full align-middle box-border pl-2 pt-3 pb-3 text-sm"
                      id="join_name"
                      type="text"
                      name="name"
                      value={userInfo.name}
                      onChange={handleChange}
                      placeholder="이름"
                      required
                    />
                  </div>
                </label>
              </div>
            </div>
            <div id="member_wrap">
              <div id="member_input_field" className="relative">
                <label
                  htmlFor="join_inputEmail"
                  className="relative cursor-pointer block h-12 p-0 border border-stone-300 box-border"
                >
                  <span className="relative h-full min-w-11 border-r float-left flex items-center justify-center border-stone-300 box-border">
                    <MdOutlineEmail />
                  </span>
                  <div className="relative m-0 overflow-hidden">
                    <input
                      className="m-0 h-full w-full align-middle box-border pl-2 pt-3 pb-3 text-sm"
                      id="join_inputEmail"
                      type="text"
                      name="email"
                      value={userInfo.email}
                      onChange={handleChange}
                      placeholder="이메일 입력"
                      onBlur={handleEmailBlur}
                      required
                    />
                  </div>
                </label>
              </div>
              {userInfo.email.length > 0 && emailError && (
                <Message 
                  keyword="email"
                  message='이메일 형식이 아닙니다.'
                  status={!emailError}
                />
              )}
              
            </div>
            <div>
              <button type="button" id="btnCheck" onClick={() => handleAuthEmail(userInfo.email)}>인증메일 받기</button>
              <span style={{ color: 'red' }}>
                {countdown !== null ? `${Math.floor(countdown / 60)}:${String(countdown % 60).padStart(2, '0')}` : ''}
              </span>
            </div>
            <div id="member_wrap">
              <div id="member_input_field" className="relative">
                <label
                  htmlFor="join_authNumber"
                  className="relative cursor-pointer block h-12 p-0 border border-stone-300 box-border"
                >
                  <span className="relative h-full min-w-11 border-r float-left flex items-center justify-center border-stone-300 box-border">
                    <MdOutlineEmail />
                  </span>
                  <div className="relative m-0 overflow-hidden">
                    <input
                      id="join_authNumber"
                      className="m-0 h-full w-full align-middle box-border pl-2 pt-3 pb-3 text-sm"
                      type="text"
                      placeholder="인증번호를 입력하세요"
                      onChange={handleAuthNumberChange}
                      onBlur={handleAuthNumberCheck}
                      name=""
                    />
                  </div>
                </label>
              </div>
              {(authNumber.length > 0 && 
              <Message 
                keyword="authNumber"
                message = {authNumberResultObj?.result_message}
                status = {authNumberResultObj?.result_code === 200}
              />
              )}
            </div>
            <div id="member_wrap">
              <div id="member_input_field" className="relative">
                <label
                  htmlFor="join_password"
                  className="relative cursor-pointer block h-12 p-0 border border-stone-300 box-border"
                >
                  <span className="relative h-full min-w-11 border-r float-left flex items-center justify-center border-stone-300 box-border">
                    <TbLock />
                  </span>
                  <div className="relative m-0 overflow-hidden">
                    <input
                      id="join_password"
                      className="m-0 h-full w-full align-middle box-border pl-2 pt-3 pb-3 text-sm"
                      type="password"
                      name="password"
                      value={userInfo.password}
                      onChange={handleChange}
                      onBlur={() => handlePasswordBlur("password")}
                      placeholder="비밀번호 입력"
                      required
                      autoComplete="on"
                    />
                  </div>
                </label>
              </div>
              {userInfo.password.length > 0 && passwordError && (
              <Message 
                keyword="password"
                status = {!passwordError}
                message="영문/숫자/특수문자 2가지 이상 조합 (8~20자)" 
              />
            )}
              {/* {!passwordSuccess && <span style={{ color: "red" }}>✖️</span>}
            {passwordSuccess && userInfo.password && <span>✅</span>} */}
            </div>
            <div id="member_wrap">
              <div id="member_input_field" className="relative">
                <label
                  htmlFor="join_checkPassword"
                  className="relative cursor-pointer block h-12 p-0 border border-stone-300 box-border"
                >
                  <span className="relative h-full min-w-11 border-r float-left flex items-center justify-center border-stone-300 box-border">
                    <TbLockCheck />
                  </span>
                  <div className="relative m-0 overflow-hidden">
                    <input
                      id="join_checkPassword"
                      className="m-0 h-full w-full align-middle box-border pl-2 pt-3 pb-3 text-sm"
                      type="password"
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onBlur={() => handlePasswordBlur("confirmPassword")}
                      placeholder="비밀번호 확인"
                      required
                      autoComplete="on"
                    />
                  </div>
                </label>
              </div>
              {confirmPassword.length > 0 && confirmPasswordError && (
              <Message 
                keyword='confirmPassword' 
                message= '입력하신 비밀번호와 일치하지 않습니다.'
                status = {!confirmPasswordError} 
              />
            )}
            </div>
            <button
              className="bg-sky-400 h-12 flex justify-center items-center text-white w-full"
              type="submit"
            >
              가입하기
            </button>
          </div>
        </form>
      </div>
    </IconContext.Provider>
  );
}

export default Register;
