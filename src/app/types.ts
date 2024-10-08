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

// ユーザ情報編集の型定義
export interface EditUserFormData {
    name: string;
}
