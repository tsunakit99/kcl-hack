'use client';

import { UploadExamFormData } from "@/app/types";
import { validationUploadExamSchema } from "@/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getDepartments } from ".//actions";

export default function UploadExam() {
    const [resError, setResError] = useState('');
    const router = useRouter();
    const [fileName, setFileName] = useState('ファイルを選択');
    const [departments, setDepartments] = useState<{ id: string; name: string }[]>([]);
    const [titles, setTitles] = useState<string[]>([]);

    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<UploadExamFormData>({
        mode: 'onBlur',
        resolver: zodResolver(validationUploadExamSchema),
    });

    const watchTitle = watch('title', '');

    useEffect(() => {
        const loadDepartments = async () => {
            const data = await getDepartments();
            setDepartments(data);
        };
        loadDepartments();
    }, []);

    useEffect(() => {
        const loadTitles = async () => {
            if (watchTitle.length > 1) {
                const data = await fetch(`api/exams/titles?query=${watchTitle}`);
                const result = await data.json();
                setTitles(result.titles);
            }
        };
    }, [watchTitle]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setFileName(e.target.files[0].name);
        }
    };

    // const onSubmit = async (data: UploadExamFormData) => {
    //     const result = await submitExam(data);
    //     if (result.success) {
    //         router.push('/');
    //     } else {
    //         setResError(result.error);
    //     }
    // };

    return (
        <>
            <div>
                <h1>過去問登録</h1>
                <div></div>
            </div>
        </>
    )
}