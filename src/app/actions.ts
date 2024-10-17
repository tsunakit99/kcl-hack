export const getExams = async () => {
    const res = await fetch('/api/exams/list', {
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