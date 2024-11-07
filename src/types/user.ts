  export interface UserInfo {
    name: string;
    email: string;
    password: string;
  }
  export interface UserStatus {
    email: string;
    name: string;
    status: string;
  }
  export interface VerifyCodeResponse {
    result_code: number;
    result_message: string;
  }

  export interface MessageProps {
    keyword: string;
    message?: string;  // 옵셔널 속성으로 정의
    status?: boolean;  // 옵셔널 속성으로 정의
  }