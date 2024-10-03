import { SigninFormData } from "../types";

// サインイン処理
export const logIn = async (data: SigninFormData) => {
  const res = await fetch("/api/signIn", {
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json",
    },
    method: "POST",
  });

  if (res.ok) {
    return { success: true };
  } else {
    const resError = await res.json();
    return { success: false, errors: resError };
  }
};
