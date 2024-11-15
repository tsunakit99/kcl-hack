"use client";

import { Department, EditExamFormData, Tag } from "@/app/types";
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
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Controller, useForm } from "react-hook-form";
import {
  EditExamInfo,
  getDepartments,
  getLectureNames,
  getTags,
} from "../actions";

interface EditExamFormProps {
  id: string;
  beforeLectureName: string;
  beforeDepartmentId: string;
  beforeTagId: string;
  beforeYear: number;
  beforeProfessor?: string;
  beforeFileUrl: string; // fileUrl
  originalFileName: string; // originalFileNameを追加
}

const EditExamForm = ({
  id,
  beforeLectureName,
  beforeDepartmentId,
  beforeTagId,
  beforeYear,
  beforeProfessor,
  beforeFileUrl,
  originalFileName,
}: EditExamFormProps) => {
  const [resError, setResError] = useState("");
  const router = useRouter();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [lectureNames, setLectureNames] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [fileName, setFileName] = useState<string>(originalFileName); // 初期値としてoriginalFileNameを設定
  const [isLoading, setIsLoading] = useState(false);

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
    defaultValues: {
      lectureName: beforeLectureName,
      departmentId: beforeDepartmentId,
      tagId: beforeTagId,
      year: Number(beforeYear),
      professor: beforeProfessor,
      file: undefined,
    },
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

  useEffect(() => {
    const fetchFile = async () => {
      if (beforeFileUrl) {
        try {
          const response = await fetch(beforeFileUrl);
          if (response.ok) {
            const blob = await response.blob();
            const existingFile = new File([blob], originalFileName, {
              type: "application/pdf",
            });
            setFiles([existingFile]);
            setValue("file", [existingFile]);
          } else {
            console.error("ファイルの取得に失敗しました:", response.statusText);
            setResError("ファイルの取得に失敗しました");
          }
        } catch (error) {
          console.error("ファイルの取得中にエラーが発生しました:", error);
          setResError("ファイルの取得に失敗しました");
        }
      }
    };
    fetchFile();
  }, [beforeFileUrl, originalFileName, setValue]);

  const onDrop = (acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    setValue("file", acceptedFiles);
    setFileName(acceptedFiles[0].name); // 新しいファイル名を設定
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [] },
    multiple: false,
  });

  const handleEdit = async (data: EditExamFormData) => {
    setIsLoading(true); // ローディング状態を開始
    const formData = new FormData();
    formData.append("lectureName", data.lectureName);
    formData.append("departmentId", data.departmentId);
    formData.append("tagId", data.tagId);
    formData.append("year", Number(data.year).toString());
    formData.append("professor", data.professor || "");
    if (data.file && data.file[0]) {
      formData.append("file", data.file[0]);
    }

    const result = await EditExamInfo(id, formData);

    if (result.success) {
      setIsLoading(false);
      router.push(`/`);
    } else {
      setIsLoading(false);
      setResError(result.error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleEdit)} noValidate>
      <Stack spacing={4}>
        {resError && <Alert severity="error">{resError}</Alert>}
        <Controller
          name="lectureName"
          control={control}
          render={({ field }) => (
            <Autocomplete
              freeSolo
              options={lectureNames}
              value={field.value}
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
                  {fileName}
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
            disabled={isLoading} // ローディング中はボタンを無効化
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
              <span>{isLoading ? "更新中..." : "更新"}</span>
            </div>
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default EditExamForm;
