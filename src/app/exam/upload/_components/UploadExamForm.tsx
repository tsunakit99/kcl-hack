'use client';

import { UploadExamFormData } from "@/app/types";
import { validationUploadExamSchema } from "@/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Autocomplete, Box, Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDropzone } from 'react-dropzone';
import { Controller, useForm } from "react-hook-form";
import { getDepartments, getLectureNames, submitExam } from "../actions";

const UploadExamForm = () => {
    const [resError, setResError] = useState('');
    const router = useRouter();
    const [departments, setDepartments] = useState<{ id: string; name: string }[]>([]);
    const [lectureNames, setLectureNames] = useState<string[]>([]);
    const [files, setFiles] = useState<File[]>([]);

    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
    } = useForm<UploadExamFormData>({
        mode: 'onBlur',
        resolver: zodResolver(validationUploadExamSchema),
    });

    const watchLectureName = watch('lectureName', '');

    useEffect(() => {
        const loadDepartments = async () => {
            const data = await getDepartments();
            setDepartments(data);
        };
        loadDepartments();
    }, []);

    useEffect(() => {
        const fetchLectureSuggestions = async () => {
            if (watchLectureName.length > 0) {
                const data = await getLectureNames(watchLectureName);
                setLectureNames(data);
            }
        };
        fetchLectureSuggestions();
    }, [watchLectureName]);

    // Dropzoneの設定
    const onDrop = (acceptedFiles: File[]) => {
        setFiles(acceptedFiles); // ドロップされたファイルをstateに保存
        setValue('file', acceptedFiles); // React Hook Formにセット
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': [] }, // PDFのみを受け付ける
        multiple: false, // 一度に1ファイルのみ
    });

    const onSubmit = async (data: UploadExamFormData) => {
        const result = await submitExam(data);
        if (result.success) {
            router.push('/');
        } else {
            setResError(result.error);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack spacing={10}>
                {resError && <Alert severity="error">{resError}</Alert>}

                <FormControl fullWidth required error={!!errors.departmentId}>
                    <InputLabel id="department-label">学科</InputLabel>
                    <Controller
                        name="departmentId"
                        control={control}
                        render={({ field }) => (
                            <Select labelId="department-label" label="学科" {...field} value={field.value || ""}>
                                {departments.map((dept) => (
                                    <MenuItem key={dept.id} value={dept.id}>
                                        {dept.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        )}
                    />
                    {errors.departmentId && <p style={{ color: 'red' }}>{errors.departmentId.message}</p>}
                </FormControl>

                <Controller
                    name="lectureName"
                    control={control}
                    render={({ field }) => (
                        <Autocomplete
                            freeSolo
                            options={lectureNames}
                            onInputChange={(e, value) => field.onChange(value)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="講義名"
                                    required
                                    error={!!errors.lectureName}
                                    helperText={errors.lectureName?.message as React.ReactNode}
                                />
                            )}
                        />
                    )}
                />

                <TextField
                    label="年度"
                    type="number"
                    required
                    {...register('year', { valueAsNumber: true })}
                    error={!!errors.year}
                    helperText={errors.year?.message as React.ReactNode}
                />

                <TextField
                    label="教授名（任意）"
                    {...register('professor')}
                    error={!!errors.professor}
                    helperText={errors.professor?.message as React.ReactNode}
                />

                {/* ファイルアップロード */}
                <Box
                    {...getRootProps()}
                    sx={{
                        border: '2px dashed #ccc',
                        padding: '20px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        backgroundColor: isDragActive ? '#f0f0f0' : 'transparent',
                    }}
                >
                    <input {...getInputProps()} />
                    <Typography>{files.length > 0 ? files[0].name : 'PDFファイルをドラッグ＆ドロップまたはクリックして選択'}</Typography>
                </Box>
                {errors.file && <p style={{ color: 'red' }}>{errors.file.message}</p>}

                <Button type="submit" variant="contained" color="primary">
                    アップロード
                </Button>
            </Stack>
        </Box>
    );
};

export default UploadExamForm;
