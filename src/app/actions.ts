import { ExamSearchData } from "./types";

export const getExams = async () => {
    const res = await fetch('/api/exams', {
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

export const searchExams = async (data: ExamSearchData) => {
    const res = await fetch('/api/exams/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            lectureName: data.lectureName || '',
            departmentId: data.departmentId || '',
            tagId: data.tagId || '',
            year: data.year || '',
            professor: data.professor || '',
        }),
    });
    
    if (res.ok) {
        const data = await res.json();
        return data;
    } else {
        const resError = await res.json();
        return resError.error;
    }
};