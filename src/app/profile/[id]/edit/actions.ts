export const UpdateUserInfo = async (id: string, name: string, departmentId: string, introduction: string, image: File) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, departmentId, introduction, image}),
    });

    if (res.ok) {
        return { success: true };
    } else {
        const resError = await res.json();
        return { success: false, error: resError };
    }
};

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
