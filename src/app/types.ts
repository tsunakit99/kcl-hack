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

// 過去問登録フォームの型定義
export interface UploadExamFormData {
  title: string;
  departmentId: string;
  year: number;
  professor?: string;
  file: FileList;
}