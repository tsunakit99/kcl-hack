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

export async function fetchComments(examId: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/exams/${examId}/comments`, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('コメントの取得に失敗しました。');
    }

    const comments = await res.json();
    return comments;
  } catch (error) {
    console.error('コメントの取得中にエラーが発生しました：', error);
    throw error;
  }
}

// コメントを投稿
export async function postComment(examId: string, content: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/exams/${examId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'コメントの投稿に失敗しました。');
    }

    const newComment = await res.json();
    return newComment;
  } catch (error) {
    console.error('コメントの投稿中にエラーが発生しました：', error);
    throw error;
  }
}

// コメントを削除
export async function deleteComment(examId: string, commentId: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/exams/${examId}/comments?commentId=${commentId}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      return { success: true };
    } else {
      const resError = await res.json();
      return { success: false, error: resError.message || 'エラーが発生しました。' };
    }
};
