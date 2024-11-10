import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyPassword } from '../../api/user';
import { useSecession } from '../../hooks/useUser';
const Secession: React.FC = () => {
  const [validCheck, setValidCheck] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const secessionMutation = useSecession();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setValidCheck(null);
  }
  const navigate = useNavigate();
  const handlePasswordCheck = async () => {
    try {
      const result = await verifyPassword(password);
      if (result && result.result_code === 200) {
        setValidCheck(true);
      }
    } catch (err) {
      setValidCheck(false);
      console.log("err:", err);
    }
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 회원탈퇴 로직 구현
    if (validCheck === true) {
      const result = await secessionMutation.mutateAsync();
      if (result && result.result_code === 200) {
        alert(`${result.result_message}`);
        navigate('/');
      }
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">회원 탈퇴</h1>

      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <p>회원님 서비스를 이용하시는데 불편함이 있으셨나요?</p>
        <p>이용 불편 및 각종 문의 사항은 고객센터를 통의 주시면 성실히 성의껏 답변 드리겠습니다.</p>
        <p className="mt-2">- 자주 묻는 질문 / 1:1 문의인 경우 / 전화 문의: 1577-7777 (365일 운영 9시~오후6시)</p>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">1. 회원탈퇴 전, 유의사항을 확인해 주시기 바랍니다.</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>회원탈퇴 시 회원정보는 폐 서비스 이용이 불가합니다.</li>
          <li>거래정보가 있는 경우, 전자상거래 등에서의 소비자 보호에 관한 법률에 따라 계약 또는 청약철회에 관한 기록, 대금결제 및 재화 등의 공급에 관한 기록은 5년간 보관됩니다.</li>
          <li>회원탈퇴 후 서비스에 입력하신 상품문의 및 후기, 댓글은 삭제되지 않으며, 회원정보 삭제로 인해 작성자 본인을 확인할 수 없어 편집 및 삭제처리가 원천적으로 불가능 합니다.</li>
          <li>상품문의 및 후기, 댓글 삭제를 원하시는 경우에는 먼저 해당 게시물을 삭제하신 후 탈퇴를 신청하시기 바랍니다.</li>
          <li>이미 결제가 완료된 건은 탈퇴로 취소되지 않습니다.</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">탈퇴를 위해 비밀번호를 확인해 주세요.</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="password" className="block mb-1">비밀번호:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handleChange}
              
              className="w-full p-2 border rounded"
              required
            />
            <button type="button" onClick={handlePasswordCheck} className="bg-slate-400 h-12 flex justify-center items-center text-white w-18 mt-6">
              비밀번호 확인
            </button>
            {validCheck !== null && (
            <span className={validCheck ? 'text-green-500' : 'text-red-500'}>
            {validCheck ? '비밀번호 일치' : '비밀번호 불일치'}
          </span>
           )}
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          disabled={!validCheck}
        >
          탈퇴
        </button>
      </form>
    </div>
  );
};

export default Secession;