export const validatePassword = (value: string): boolean => {
    //비밀번호 유효성 검사(영문 대 또는 소문자, 숫자, 특수기호 포함 최소 1글자 이상 포함, 특수기호는 #?!@$%^&*-만 허용, 총 8-20자)
    const regex = /^(?=(.*[a-zA-Z]){1,})(?=(.*[0-9]){1,})(?=(.*[#?!@$%^&*-]){1,}).{8,20}$/;
    return regex.test(value);
};
export const validateConfirmPassword = (orgValue: string, newValue: string): boolean => {
    return orgValue === newValue;
};

export const validateEmail = (email: string): boolean => {
    const regex = /^[A-Za-z0-9_.-]+@[A-Za-z0-9-]+\.[A-Za-z0-9-]+/;
    return email.length > 0 && regex.test(email);
};

export const getTextLength = (text: string): number => {
    //모든 종류의 문자(한글, 영문, 숫자, 특수문자, 이모지 등)를 정확히 1글자로 계산
    return [...text].length;
};
export const validateMinLength = (text: string, minLength: number): boolean => {
    return minLength <= getTextLength(text);
};

export const validateMaxLength = (textLength: string, maxLength: string): boolean => {
    return textLength < maxLength;
};

export const validateBetweenLength = (value: number, minValue: number, maxValue: number): boolean => {
    return minValue <= value && value <= maxValue;
};

