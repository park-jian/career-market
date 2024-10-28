import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { searchPassword } from "../../api/user";

export default function PasswordSearch() {
    const [formData, setFormData] = useState({
        email: "",
        name: ""
    });
    const [emailError, setEmailError] = useState("");
    const [resultMessage, setResultMessage] = useState<{type: 'success' | 'error', message: string} | null>(null);
    const navigate = useNavigate();
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
        // 이메일 입력 시 에러 메시지 초기화
        if (name === 'email') {
            setEmailError("");
        }
    };

    const handleEmailBlur = () => {
        const emailRegex = /^[A-Za-z0-9_.-]+@[A-Za-z0-9-]+\.[A-Za-z0-9-]+/;
        if (formData.email.length > 0 && !emailRegex.test(formData.email)) {
            setEmailError("아이디는 이메일 형식으로 입력해주세요.");
        } else {
            setEmailError("");
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // 입력값 유효성 검사
        if (formData.name.trim() === "") {
            return setResultMessage({ type: 'error', message: '이름을 입력해주세요.' });
        }

        if (formData.email.trim() === "") {
            return setResultMessage({ type: 'error', message: '이메일을 입력해주세요.' });
        }

        // 이메일 에러가 있으면 제출하지 않음
        if (emailError) {
            return;
        }

        try {
            const result = await searchPassword(formData.name, formData.email);
            if (result.result_code === 200) {
                setResultMessage({ 
                    type: 'success', 
                    message: '임시 비밀번호가 이메일로 발송되었습니다.' 
                });
                // 폼 초기화
                setFormData({ email: "", name: "" });
                navigate('/users/login');
            } else {
                setResultMessage({ 
                    type: 'error', 
                    message: result.result_message || '비밀번호 찾기에 실패했습니다.' 
                });
            }
        } catch (error) {
            setResultMessage({ 
                type: 'error', 
                message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' 
            });
        }
    };

    return (
        <form className="w-full h-full" onSubmit={handleSubmit}>
            <div className="flex justify-center items-center flex-col w-full h-full p-5">
                <p className="m-6 text-2xl">비밀번호 찾기</p>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-3/5 h-9 border rounded-md mt-12 mb-8 pl-2"
                    placeholder="Name*"
                    autoComplete="on"
                />
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleEmailBlur}
                    required
                    className="w-3/5 h-9 border rounded-md pl-2"
                    placeholder="Email Address*"
                />
                <div className="h-7">
                    {emailError && (
                        <span className="text-red-500 text-xs">{emailError}</span>
                    )}
                </div>
                
                {/* 결과 메시지 표시 */}
                {resultMessage && (
                    <div className={`w-3/5 p-2 rounded mb-2 text-center ${
                        resultMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                        {resultMessage.message}
                    </div>
                )}

                <button 
                    type='submit' 
                    className="my-0.5 mb-3 w-3/5 h-9 rounded-md bg-sky-500 hover:bg-sky-700 text-white transition-colors"
                    disabled={!!emailError}
                >
                    임시 비밀번호 발급
                </button>

                <div className="flex justify-between w-3/5 text-sm mt-2 mb-4 border-2 p-2">
                    등록된 이메일로 임시 비밀번호가 발급 됩니다. 
                    임시 비밀번호 메일이 오지 않을 경우 
                    career-support@gamil.com으로 신청 메일을 보내주세요.
                    한메일(hanmail.net)의 경우 메일이 정상적으로 발송되지 않을 수 있습니다.
                </div>

                <div className="flex justify-between w-3/5 text-sm">
                    <Link to="/users/login" className="hover:underline text-blue-600">
                        로그인 페이지로 이동
                    </Link>
                </div>
            </div>
        </form>
    );
}