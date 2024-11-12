
export const getUserById = async (id: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`, {
        method: 'GET',
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (res.ok) {
        const data = await res.json(); // JSONデータを取得
        return data;
    } else {
        const error = await res.json();
        return error.errors;
    }
};

export const deleteExamById = async (examId: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/exams/${examId}`, {
        method: 'DELETE',
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (res.ok) {
        return { success: true };
    } else {
        const resError = await res.json();
        return { success: false, error: resError.message || 'エラーが発生しました。' };
    }
};

export const getYourExamByUploaderId = async (uploaderId: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/exams/${uploaderId}`, {
        method: 'GET',
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (res.ok) {
        const data = await res.json(); // JSONデータを取得
        return data;
    } else {
        const error = await res.json();
        return error.errors;
    }
};
