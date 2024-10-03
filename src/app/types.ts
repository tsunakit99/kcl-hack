// types.ts

// エラーメッセージの型定義
export interface FormError {
    name?: string[];
    email?: string[];
    password?: string[];
    passwordConfirm?: string[];
}

// サインアップフォームの型定義
export interface SignupFormData {
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
}

// サインインフォームの型定義
export interface SigninFormData {
  email: string;
  password: string;
}
