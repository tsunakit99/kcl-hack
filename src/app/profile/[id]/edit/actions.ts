export const UpdateUserInfo = async (id: string, name: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name }),
    });

    if (res.ok) {
        return { success: true };
    } else {
        const resError = await res.json();
        return { success: false, error: resError };
    }
};