import { FormError, SignupFormData } from '../types';

// OTPを送信するための関数
export const sendOtp = async (data: SignupFormData): Promise<{ success: boolean; error?: FormError }> => {
    const { email, password, passwordConfirm } = data;
    
    const res = await fetch("/api/send-otp", {
        body: JSON.stringify({ email, password, passwordConfirm }),
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
