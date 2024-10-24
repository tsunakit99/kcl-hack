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
  departmentId: string;
  introduction: string;
  image: File;
}

// 過去問登録フォームの型定義
export interface UploadExamFormData {
  lectureName: string;
  departmentId: string;
  year: number;
  professor?: string;
  file: File[];
}

// 自身が投稿した過去問の表示の型定義
export interface ExamByIdData{
  lectureName: string;
  departmentName: string;
  year: number;
  professor?: string;
}

export interface Department {
  name: string;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  departmentId: string;
  introduction: string;
  image: string;
  department: Department;
}

export interface UploadedFile {
  name: string;
  size: number;
  type: string;
  arrayBuffer: () => Promise<ArrayBuffer>;
}
