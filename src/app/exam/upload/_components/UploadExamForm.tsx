"use client";

import { UploadExamFormData } from "@/app/types";
import { validationUploadExamSchema } from "@/validationSchema";
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
import { getDepartments, getLectureNames, submitExam } from "../actions";

const UploadExamForm = () => {
  const [resError, setResError] = useState("");
  const router = useRouter();
  const [departments, setDepartments] = useState<
    { id: string; name: string }[]
    >([]);
  const { data: session } = useSession();
  const [lectureNames, setLectureNames] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  if (!session) {
    router.push("/");
  }

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<UploadExamFormData>({
    mode: "onBlur",
    resolver: zodResolver(validationUploadExamSchema),
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

  const onDrop = (acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    setValue("file", acceptedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [] },
    multiple: false,
  });

  const onSubmit = async (data: UploadExamFormData) => {
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "30px",
          }}
        >
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
                  <img
                    src="/icon/pdf.png"
                    alt="PDF Icon"
                    style={{ width: 30, height: 30, marginRight: 8 }}
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
              height: "6vh", // ボタンの高さを調整
              borderRadius: 5,
              backgroundColor: "#444f7c",
              "&:hover": {
                backgroundColor: "#383f6a", // ホバー時の背景色
              },
            }}
          >
            <div
              className="button-content"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src="/icon/paper-plane.png"
                alt="icon"
                style={{ width: "24px", height: "24px" }}
              />
              <span>投稿</span>
            </div>
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default UploadExamForm;
