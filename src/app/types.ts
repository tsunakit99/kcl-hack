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
  tagId: string;
  year: number;
  professor?: string;
  file: File[];
}

export interface EditExamFormData {
  lectureName: string;
  departmentId: string;
  tagId: string;
  year: number;
  professor?: string;
  file: File[];
}

export interface UpdateExamData {
  lectureId: string;
  departmentId: string;
  tagId: string;
  year: number;
  professor?: string;
  fileUrl?: string;
  originalFileName?: string;
}


// 自身が投稿した過去問の表示の型定義
export interface ExamByIdData{
  id: string;
  lectureName: string;
  departmentName: string;
  year: number;
  professor?: string;
  fileUrl: string;
}

export interface Department {
  id: string;
  name: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  departmentId: string;
  introduction: string;
  imageUrl: string;
  department: { name: string };
}

// Examデータの型定義
export interface ExamData {
  id: string;
  lectureName: string;
  lecture: { name: string };
  departmentId: string;
  department: { name: string };
  tag: {
    id: string;
    name: string;   
  };
  year: number;
  professor?: string;
  uploader: { id: string, name: string };
  originalFileName: string;
  fileUrl: string;
}

export interface ExamSearchData {
  lectureName?: string;
  departmentId?: string;
  tagId?: string;
  year?: number;
  professor?: string;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    imageUrl: string;
  };
}

export interface CommentFormData{
  content: string;
}
