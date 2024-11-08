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

export const deleteExam = async (id: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/exams/${id}`, {
    method: 'DELETE',
  });

  if (res.ok) {
    return { success: true };
  } else {
    const resError = await res.json();
    return { success: false, error: resError.message || '削除に失敗しました。' };
  }
};










































////////////////////////////
//ユーザデータから過去問取得//
////////////////////////////
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

export const getYourExamByUploaderId = async (uploaderId: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/exams/${uploaderId}`, {
        method: 'GET',
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // //デバッグ用
    // console.log('getYourExamByUploaderIdの確認')
    // const text = await res.text();
    // console.log(text); //レスポンスの確認
    // console.log(res.status); // ステータスコードを出力

    if (res.ok) {
        const exam = await res.json(); // JSONデータを取得
        return exam;
    } else {
        const error = await res.json();
        return error.errors;
    }
};

///////////////////
//以下からスタート
///////////////////
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

//////////////
//過去問更新//
//////////////
export async function updateExamById(id: string, updatedExam: any) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/exams/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedExam),
    });

    if (!res.ok) {
      throw new Error('試験の更新に失敗しました。');
    }

    const updatedData = await res.json();
    return updatedData;
  } catch (error) {
    console.error('APIから試験を更新中にエラーが発生しました：', error);
    throw error;
  }
}