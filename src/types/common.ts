  export interface VerifyCodeResponse {
    result_code: number;
    result_message: string;
  }
  
  export interface MessageProps {
    keyword: string;
    message?: string;  // 옵셔널 속성으로 정의
    status?: boolean;  // 옵셔널 속성으로 정의
  }

  export interface ApiResponse<T> {
    result: {
      result_code: number;
      result_message?: string;
    };
    body: T;
  }

  export interface ApiResponseProp {
    result: {
      result_code: number;
      result_message: string;
    };
    body?: string;
  }




  //개별 컴포넌트
  //헤더

  //select
  export interface Option {
    value: string;
    label: string;
  }
  
  export interface SelectProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
  }

  //pagination
  export interface PaginationProps {
    onPageChange: (pageStep: string) => void;
    hasResumes: boolean;
  }

  //Navbar
  export interface NavbarProps {
    isHovered: boolean;
    setIsHovered: React.Dispatch<React.SetStateAction<boolean>>;
  }

  // export type PageStep = 'FIRST' | 'NEXT' | 'PREVIOUS' | 'LAST';