import { FormError, SignupFormData } from '../types';

// OTPを送信するための関数
export const sendOtp = async (data: SignupFormData): Promise<{ success: boolean; error?: FormError }> => {
    const { name, email, password, passwordConfirm } = data;
    
    const res = await fetch("/api/send-otp", {
        body: JSON.stringify({ name, email, password, passwordConfirm }),
        headers: {
            "Content-type": "application/json",
        },
        method: "POST",
    });

    if (res.ok) {
        return { success: true };
    } else {
        const resError = await res.json();
        return { success: false, error: resError.errors };
    }
};

// OTP検証とユーザ作成処理
export const verifyAndCreateUser = async (
    otp: string,
    name: string,
    email: string,
    password: string
): Promise<{ success: boolean; error?: string | null }> => {
    const res = await fetch("/api/verify-and-create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp, name, email, password }),
    });

    if (res.ok) {
        return { success: true };
    } else {
        const errorData = await res.json();
        return { success: false, error: errorData.error };
    }
};
