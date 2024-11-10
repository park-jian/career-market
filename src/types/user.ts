  export interface UserInfo {
    name: string;
    email: string;
    password: string;
  }

  export interface User {
    email: string;
    name: string;
    status: string;
  }

  export interface PasswordState {
    value: string;
    isValid: boolean;
    messageVisible: boolean;
  }

  export interface userResultType {
    result_code: number,
    result_description: string,
    result_message: string
  }
  export interface MyInfo {
    body: User,
    result: userResultType
  }