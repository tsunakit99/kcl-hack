"use client";

import LoadingIndicator from "@/app/components/LoadingIndicator";
import { Department, Tag, UploadExamFormData } from "@/app/types";
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
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Controller, useForm } from "react-hook-form";
import { getDepartments, getLectureNames, getTags, submitExam } from "../actions";

const UploadExamForm = () => {
  const [resError, setResError] = useState("");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const router = useRouter();
  const [lectureNames, setLectureNames] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

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
    const loadTags = async () => {
      const data = await getTags();
      setTags(data);
    };
    loadTags();
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
    console.log(data);
    setIsLoading(true);
    const result = await submitExam(data);
    if (result.success) {
      setIsLoading(false);
      setOpenSnackbar(true);
      router.push("/");
    } else {
      setIsLoading(false);
      setResError(result.error);
    };
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
          message="過去問投稿が完了しました"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
      <Stack spacing={4}>
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
          <FormControl fullWidth required error={!!errors.tagId}>
            <InputLabel id="tag-label">タグ</InputLabel>
            <Controller
              name="tagId"
              control={control}
              defaultValue={tags[0]?.id || ""}
              render={({ field }) => (
                <Select
                  labelId="tag-label"
                  label="タグ"
                  {...field}
                  value={field.value || ""}
                >
                  {tags.map((tag) => (
                    <MenuItem key={tag.id} value={tag.id}>
                      {tag.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.tagId && (
              <FormHelperText>{errors.tagId.message}</FormHelperText>
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
                <Typography variant="h4" align="center" color="blue"
                  sx={{
                    whiteSpace: "nowrap", // テキストを1行に制限
                    overflow: "hidden", // 表示範囲外を隠す
                    textOverflow: "ellipsis" // 省略記号を表示
                  }}>
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
            disabled={isLoading}
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
            {isLoading ? (
              <LoadingIndicator />
            ) : (
              <div
                className="button-content"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  src="/icon/paper-plane.png"
                  alt="icon"
                  width={24}
                  height={24}
                />
                <span>投稿</span>
              </div>
            )}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default UploadExamForm;
