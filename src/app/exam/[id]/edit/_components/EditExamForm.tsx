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
import { getDepartments, getLectureNames, EditExamInfo, deleteExam } from "../actions";
import { getExamById } from "../../actions";

interface EditExamFormProps {
  id: string;
  beforeLectureName: string;
  beforeDepartmentId: string;
  beforeYear: number;
  beforeProfessor?: string;
  beforeFile: File[];
}

const EditExamForm = ({
  id,
  beforeLectureName,
  beforeDepartmentId,
  beforeYear,
  beforeProfessor,
  beforeFile
}: EditExamFormProps) => {
  const [resError, setResError] = useState("");
  const router = useRouter();
  const { status } = useSession();
  const [exam, setExam] = useState<ExamByIdData>();
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
  } = useForm<EditExamFormData>({
    mode: "onBlur",
    resolver: zodResolver(validationUploadExamSchema),
    defaultValues: { // 取得したデータをデフォルト値として設定
      lectureName: beforeLectureName,
      departmentId: beforeDepartmentId,
      year: Number(beforeYear),
      professor: beforeProfessor,
      file: beforeFile
    }
  });

  // useEffect(() => {
  //   const fetchExamData = async () => {
  //     const examResult = await getExamById(id);
  //     setExam(examResult);
  //     setValue("lectureName", examResult.lectureName);
  //     setValue("file", examResult.file);
  //     setValue("departmentId", examResult.departmentId);
  //     setValue("year", examResult.year);
  //     setValue("professor", examResult.professor || "");
  //   };
  //   fetchExamData();
  // }, [id, setValue]);

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

  const handleEdit = async (data: EditExamFormData) => {
    if (errors.year) {
      console.log("エラー:", errors.year);  // `year`のエラーメッセージを確認
    }

    const formData = new FormData();
    formData.append("lectureName", data.lectureName);
    formData.append("departmentId", data.departmentId);
    formData.append("year", Number(data.year).toString());
    formData.append("professor", data.professor || "");
    if (data.file && data.file[0]) {
      formData.append("file", data.file[0]);
    }

    const result = await EditExamInfo(id, formData);

    if (result.success) {
      router.push(`/`);
    } else {
      setResError(result.error || '更新に失敗しました。');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('本当に削除しても良いですか？')) {
      const result = await deleteExam(id);

      if (result.success) {
        router.push(`/`);
      } else {
        setResError(result.error || '削除に失敗しました。');
      }
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit(handleEdit)} noValidate>
      <Stack spacing={6}>
        {resError && (
          <Alert severity="error">
            {Object.values(resError)
              .flat()
              .map((error, index) => (
                <p key={index}>{error}</p>
              ))}
          </Alert>
        )}
        <Controller
          name="lectureName"
          control={control}
          render={({ field }) => (
            <Autocomplete
              freeSolo
              options={lectureNames}
              // value={field.value}
              onInputChange={(e, value) => field.onChange(value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="講義名"
                  required
                  // {...register("lectureName")}
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
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            type="button"
            variant="contained"
            color="primary"
            sx={{
              position: "relative",
              width: "15vw",
              height: "6vh",
              borderRadius: 5,
              backgroundColor: "#B22222",
              "&:hover": {
                backgroundColor: "#8B0000",
              },
            }}
            onClick={handleSubmit(handleDelete)}
          >
            <div className="button-content" style={{ display: "flex", justifyContent: "center", alignItems: "center" , color: "white"}}>
              <Image src="/icon/delete.png" alt="icon" width={24} height={24} />
              <span>削除</span>
            </div>
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default EditExamForm;