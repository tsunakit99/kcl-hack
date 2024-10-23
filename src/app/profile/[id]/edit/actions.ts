export const UpdateUserInfo = async (id: string, formData: FormData) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`, {
    method: 'PUT',
    body: formData,
  });

  if (res.ok) {
    return { success: true };
  } else {
    const resError = await res.json();
    return { success: false, error: resError.message || 'エラーが発生しました。' };
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
