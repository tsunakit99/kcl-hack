"use client";

import { Department, EditUserFormData } from "@/app/types";
import { validationEditSchema } from "@/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import LoadingIndicator from "../../../../components/LoadingIndicator";
import { getDepartments, UpdateUserInfo } from "../actions";

interface EditUserFormProps {
  id: string;
  currentName: string;
  currentDepartmentId: string;
  currentIntroduction: string;
  currentIcon?: string;
}

const EditUserForm = ({
  id,
  currentName,
  currentDepartmentId,
  currentIntroduction,
  currentIcon,
}: EditUserFormProps) => {
  const [resError, setResError] = useState<string | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string>(currentIcon || "");
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditUserFormData>({
    mode: "onBlur",
    resolver: zodResolver(validationEditSchema),
    defaultValues: {
      name: currentName,
      departmentId: currentDepartmentId,
      introduction: currentIntroduction,
      image: undefined,
    },
  });

  useEffect(() => {
    const loadDepartments = async () => {
      const data = await getDepartments();
      setDepartments(data);
    };
    loadDepartments();
  }, []);

  const handleEdit = async (data: EditUserFormData) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("departmentId", data.departmentId);
    formData.append("introduction", data.introduction);
    if (data.image) {
      formData.append("image", data.image);
    }

    const result = await UpdateUserInfo(id, formData);

    if (result.success) {
      setIsLoading(false);
      router.push(`/profile/${id}?success=true`);
    } else {
      setIsLoading(false);
      setResError(result.error);
    }
  };

  useEffect(() => {
    // imagePreview が変更されるたびに前回のプレビューURLを解放
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(handleEdit)}
      sx={{
        width: "80%",
        margin: "auto",
        mt: 5,
      }}
      noValidate
    >
      <Stack
        spacing={2}
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        {resError && <Alert severity="error">{resError}</Alert>}
        {imagePreview ? (
          <Box
            sx={{
              width: 150,
              height: 150,
              borderRadius: "50%",
              overflow: "hidden",
              mt: 5,
              mb: 5,
              border: "2px solid #000",
              "@media(max-width: 1000px)": {
                margin: "0 auto",
                width: 75,
                height: 75,
                mb: 5,
              },
            }}
          >
            <Image
              src={imagePreview}
              alt="プロフィール画像プレビュー"
              width={500}
              height={500}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Box>
        ) : (
          <Box
            sx={{
              width: 150,
              height: 150,
              borderRadius: "50%",
              overflow: "hidden",
              mt: 5,
              mb: 5,
              border: "2px solid #000",
              "@media(max-width: 1000px)": {
                margin: "0 auto",
                width: 75,
                height: 75,
                mb: 5,
              },
            }}
          >
            <Image
              src="/icon/default-profile.png"
              alt="プロフィール画像プレビュー"
              width={500}
              height={500}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Box>
        )}
        <Controller
          control={control}
          name="image"
          defaultValue={undefined}
          render={({ field }) => (
            <input
              type="file"
              accept="image/jpeg"
              onChange={(e) => {
                const file = e.target.files?.[0] || undefined;
                field.onChange(file);

                // 画像プレビューを更新
                if (file) {
                  const previewUrl = URL.createObjectURL(file);
                  setImagePreview(previewUrl);
                }
              }}
            />
          )}
        />
        {errors.image && (
          <FormHelperText error> {errors.image.message}</FormHelperText>
        )}
        <TextField
          label="名前"
          fullWidth
          {...register("name")}
          error={!!errors.name}
          helperText={errors.name?.message as React.ReactNode}
        />
        {/* 学科はセレクトボックス？を使いたい */}
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
        <TextField
          label="自己紹介"
          fullWidth
          multiline
          minRows={4}
          {...register("introduction")}
          error={!!errors.introduction}
          helperText={errors.introduction?.message as React.ReactNode}
        />
      </Stack>
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
            mt: 5,
            mb: 0,
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
              <Image src="/icon/entry.png" alt="icon" width={24} height={24} />
              <span>保存</span>
            </div>
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default EditUserForm;
