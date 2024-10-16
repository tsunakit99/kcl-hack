import { UploadExamFormData } from "@/app/types";

export const getDepartments = async () => {
    const res = await fetch('/api/departments', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    if (res.ok) {
        const data = await res.json();
        return data;
    } else {
        const resError = await res.json();
        return resError.error;
    }

}

export const getLectureNames = async (query: string) => {
    const res = await fetch(`/api/exams/lectures?query=${encodeURIComponent(query)}`);
    const data = await res.json();
    return data.names;
}

export const submitExam = async (formData: UploadExamFormData) => {
  const data = new FormData();
  data.append('lectureName', formData.lectureName);
  data.append('departmentId', formData.departmentId);
  data.append('year', String(formData.year));
  if (formData.professor) {
    data.append('professor', formData.professor);
  }
  data.append('file', formData.file[0]);

  const res = await fetch('/api/exams/upload', {
    method: 'POST',
    body: data,
  });

  if (res.ok) {
    return { success: true };
  } else {
    const resError = await res.json();
    return { success: false, error: resError.message };
  }
};