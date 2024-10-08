
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
