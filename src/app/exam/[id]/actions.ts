export async function getExamById(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/exams/${id}`, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('試験の取得に失敗しました。');
    }

    const exam = await res.json();
    return exam;
  } catch (error) {
    console.error('APIから試験を取得中にエラーが発生しました：', error);
    throw error;
  }
}

export async function getImageById(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('画像の取得に失敗しました。');
    }

    const exam = await res.json();
    return exam.imageUrl;
  } catch (error) {
    console.error('APIから試験を取得中にエラーが発生しました：', error);
    throw error;
  }
}
