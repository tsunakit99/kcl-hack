'use client';

import { UploadExamFormData } from "@/app/types";
import { validationUploadExamSchema } from "@/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getDepartments } from "../actions";
import "../page.css"

export const UploadExamForm = () => {
    const [resError, setResError] = useState('');
    const router = useRouter();
    const [fileName, setFileName] = useState('ファイルを選択');
    const [departments, setDepartments] = useState<{ id: string; name: string }[]>([]);
    const [titles, setTitles] = useState<string[]>([]);
    const [file, setFile] = useState<File | null>(null);

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

    //教科名
    const watchTitle = watch('title', '');

    useEffect(() => {
        const loadTitles = async () => {
            if (watchTitle.length > 1) {
                const data = await fetch(`api/exams/titles?query=${watchTitle}`);
                const result = await data.json();
                setTitles(result.titles);
            } else {
                setTitles([]);
            }
        };
        loadTitles();
    }, [watchTitle]);

    //学科名
    const watchDepartment = watch('departmentId', '');

    useEffect(() => {
        const loadDepartments = async () => {
            const data = await getDepartments();
            setDepartments(data);
        };
        loadDepartments();
    }, [watchDepartment]);

    //教授名
    // const watchProfessor = watch('professor', '');

    // useEffect(() => {
    //     const loadProfessors = async () => {
    //         const data = await getProfessors();
    //         setProfessors(data);
    //     };
    //     loadProfessors();
    // }, [watchProfessor]);

    //年度
    const currentYear = new Date().getFullYear();

    //ファイル選択
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setFileName(selectedFile.name);
        }
    };

    //提出ボタン
    const onSubmit = async (data: UploadExamFormData) => {
        const result = await UploadExam(data);
        if (result.success) {
            router.push('/');
        } else {
            setResError(result.error);
        }
    };

    const UploadExam = async (data: UploadExamFormData) => {
        try {
            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('departmentId', data.departmentId);
            if (data.professor) {
                formData.append('professor', data.professor);
            }
            formData.append('year', data.year.toString());
            if (file) {
                formData.append('file', file);
                //data.file[0]
            } else {
                throw new Error("ファイルが選択されていません");
            }

            const response = await fetch('/api/titles/exams', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                // サーバーからのエラーメッセージを取得
                const errorData = await response.json();
                return { success: false, error: errorData.message || 'エラーが発生しました' };
            }

            return { success: true };
        } catch (error) {
            console.error('Error submitting exam:', error);
            return { success: false, error: '送信中にエラーが発生しました' };
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div id="exam-information">
                <input
                    id="exam-title"
                    type="text"
                    {...register("title")}
                    placeholder="教科名を入力してください"
                />
                <ul>
                    {titles.map((title, index) => (
                        <li key={index}>{title}</li>
                    ))}
                </ul>
                <input
                    id="exam-department"
                    type="text"
                    {...register("departmentId")}
                    placeholder="学科名を入力してください"
                />
                <ul>
                    {titles.map((department, index) => (
                        <li key={index}>{department}</li>
                    ))}
                </ul>
                <input
                    id="exam-professor"
                    type="text"
                    {...register("professor")}
                    placeholder="教授名を入力してください"
                />
                <ul>
                    {titles.map((professor, index) => (
                        <li key={index}>{professor}</li>
                    ))}
                </ul>
                <select id="exam-year" {...register("year")}>
                    <option value="">年度を選択してください</option>
                    {Array.from({ length: 50 }, (_, index) => currentYear - index).map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
                <input
                    id="exam-file"
                    type='file'
                    onChange={handleFileChange}
                />
            </div>
            <button type="submit">過去問を投稿する</button>
            {resError && <p style={{ color: 'red' }}>{resError}</p>}
        </form>
    );

}