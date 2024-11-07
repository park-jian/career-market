import EmailLogin from "../../components/user/EmailLogin";
// import SNSLogin from "./SNSLogin";

export default function Login() {
  return (
    <div className="w-full h-full min-h-[600px] flex items-center justify-center px-4">
      <div className="w-full max-w-[400px] border rounded-lg shadow-md">
        <div className="tab-content w-full h-96 flex items-center justify-center focus:bg-orange-300">
          <EmailLogin></EmailLogin>
        </div>


      </div>
    </div>
  );
}