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

export const getTags = async () => {
    const res = await fetch('/api/exams/tags', {
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

export const EditExamInfo = async (id: string, formData: FormData) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/exams/${id}`, {
    method: 'PUT',
    body: formData,
  });

  if (res.ok) {
    const data = await res.json();
    return { success: true, data};
  } else {
    const resError = await res.json();
    return { success: false, error: resError.message || 'エラーが発生しました。' };
  }
};