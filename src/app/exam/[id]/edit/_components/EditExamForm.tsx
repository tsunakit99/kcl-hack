"use client";

import { EditExamFormData, ExamByIdData } from "@/app/types";
import Image from "next/image";
import { validationUploadExamSchema } from "@/validationSchema"; // ここは適宜修正
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Controller, useForm } from "react-hook-form";
import { getDepartments, getLectureNames, getExamById, submitExam } from "../actions";

const EditExamForm = () => {
  const [resError, setResError] = useState("");
  //const { examData: session, status } = useSession();
  const router = useRouter();
  //const { id } = params;
  //const [examData, setUser] = useState<ExamByIdData>();
  const [departments, setDepartments] = useState<{ id: string; name: string }[]>([]);
  const { status } = useSession();
  const [lectureNames, setLectureNames] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  //const [formData, setFormData] = useState<EditExamFormData | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status]);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<EditExamFormData>({
    mode: "onBlur",
    resolver: zodResolver(validationUploadExamSchema),
    //defaultValues: formData || {}, // 取得したデータをデフォルト値として設定
  });

  const watchLectureName = watch("lectureName", "");

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

  // // 過去問データを取得
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const exam = await getExamById(params.id);
  //     setFormData({
  //       lectureName: exam.lectureName,
  //       departmentName: exam.departmentName,
  //       year: exam.year,
  //       professor: exam.professor || '',
  //     });
  //   };
    
  //   fetchData();
  // }, [params.id]);

  // useEffect(() => {
  //   if (formData) {
  //     setValue("lectureName", formData.lectureName);
  //     setValue("year", formData.year);
  //     setValue("professor", formData.professor);
  //     // departmentIdも設定する場合は適宜追加
  //   }
  // }, [formData]);

  const onDrop = (acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    setValue("file", acceptedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [] },
    multiple: false,
  });

  const onSubmit = async (data: EditExamFormData) => {
    const result = await submitExam(data);
    if (result.success) {
      router.push("/");
    } else {
      setResError(result.error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={6}>
        {resError && <Alert severity="error">{resError}</Alert>}

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
        <div style={{ display: "flex", justifyContent: "space-between", gap: "30px" }}>
          <TextField
            label="年度"
            type="number"
            required
            {...register("year", { valueAsNumber: true })}
            error={!!errors.year}
            helperText={errors.year?.message as React.ReactNode}
          />
          <FormControl fullWidth required error={!!errors.departmentId}>
            <InputLabel id="department-label">学科</InputLabel>
            <Controller
              name="departmentId"
              control={control}
              defaultValue={departments[0]?.id || ""}
              render={({ field }) => (
                <Select
                  labelId="department-label"
                  label="学科"
                  {...field}
                  value={field.value || ""}
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.departmentId && (
              <FormHelperText>{errors.departmentId.message}</FormHelperText>
            )}
          </FormControl>
        </div>

        <TextField
          label="教授名（任意）"
          {...register("professor")}
          error={!!errors.professor}
          helperText={errors.professor?.message as React.ReactNode}
        />

        {/* ファイルアップロード */}
        <Box
          {...getRootProps()}
          sx={{
            border: "2px dashed #ccc",
            borderRadius: "10px",
            padding: "50px",
            cursor: "pointer",
            backgroundColor: isDragActive ? "#f0f0f0" : "transparent",
          }}
        >
          <input {...getInputProps()} />
          <Box>
            {files.length > 0 ? (
              <>
                <Typography variant="h4" align="center" color="blue">
                  <Image
                    src="/icon/pdf.png"
                    alt="PDF Icon"
                    width={30}
                    height={30}
                    style={{ marginRight: 8 }}
                  />
                  {files[0].name}
                </Typography>
              </>
            ) : (
              <Typography align="center">
                PDFファイルをドラッグ&ドロップまたはクリックして選択
              </Typography>
            )}
          </Box>

          {errors.file && (
            <FormHelperText error>{errors.file.message}</FormHelperText>
          )}
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{
              position: "relative",
              width: "15vw",
              height: "6vh",
              borderRadius: 5,
              backgroundColor: "#444f7c",
              "&:hover": {
                backgroundColor: "#383f6a",
              },
            }}
          >
            <div className="button-content" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Image src="/icon/paper-plane.png" alt="icon" width={24} height={24} />
              <span>更新</span>
            </div>
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default EditExamForm;