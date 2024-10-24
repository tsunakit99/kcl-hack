"use client";

import { EditUserFormData } from "@/app/types";
import { validationEditSchema } from "@/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Box, Button, CardContent, FormControl, FormHelperText, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { getDepartments, UpdateUserInfo } from "../actions";

interface EditUserFormProps {
  id: string;
  currentName: string;
  currentDepartmentId: string;
  currentIntroduction: string;
  currentIcon?: string;
}

const EditUserForm = ({ id, currentName, currentDepartmentId, currentIntroduction, currentIcon}: EditUserFormProps) => {
  const [resError, setResError] = useState<string | null>(null);
  const [departments, setDepartments] = useState<{ id: string; name: string }[]>([]);
  const router = useRouter();
  const { status } = useSession();
  const [imagePreview, setImagePreview] = useState<string>(currentIcon || "");

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
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("departmentId", data.departmentId);
  formData.append("introduction", data.introduction);
  if (data.image) {
    formData.append("image", data.image);
  }

  const result = await UpdateUserInfo(id, formData);

  if (result.success) {
    router.push(`/profile/${id}`);
  } else {
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
    <Box component="form" onSubmit={handleSubmit(handleEdit)} sx={{ maxWidth: "80%", margin: "auto", mt: 10 }} noValidate>
      <Stack direction="row" spacing={2}>
        {resError && (
          <Alert severity="error">
            {Object.values(resError)
              .flat()
              .map((error, index) => (
                <p key={index}>{error}</p>
              ))}
          </Alert>
        )}
        <Stack>
          {imagePreview && (
            <Box
              sx={{
                width: 150,
                height: 150,
                borderRadius: "50%",
                overflow: "hidden",
                marginTop: "20px",
                marginLeft: "23px",
                marginBottom: "20px",
                border: "2px solid #000",
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
          {errors.image && (<FormHelperText error> {errors.image.message}</FormHelperText>)}
        </Stack>
        <Stack>
          <CardContent>
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
                  <Select labelId="department-label" label="学科" {...field} value={field.value || ""}>
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
          </CardContent>
        </Stack>
      </Stack>
      <Box>
        <Button type="submit" variant="contained" color="primary" fullWidth>
          保存
        </Button>
      </Box>
    </Box>
  );
};

export default EditUserForm;
