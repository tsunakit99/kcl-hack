"use client";

import { EditUserFormData } from "@/app/types";
import { validationEditSchema } from "@/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, CardContent, Box, Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { UpdateUserInfo } from "../actions";
import { getDepartments } from "../actions";
import { Controller, useForm } from "react-hook-form";

interface EditUserFormProps {
  id: string;
  currentName: string;
  currentDepartmentId: string;
  currentIntroduction: string;
  currentIcon: File;
}

const EditUserForm = ({ id, currentName, currentDepartmentId, currentIntroduction, currentIcon}: EditUserFormProps) => {
  const [resError, setResError] = useState<string | null>(null);
  const [departments, setDepartments] = useState<{ id: string; name: string }[]>([]);
  const router = useRouter();

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
      departmentId: currentDepartmetId,
      introduction: currentIntroduction,
      image: currentIcon,
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
    const result = await UpdateUserInfo(id, data.name, data.departmentId, data.introduction, data.image);
    if (result.success) {
      router.push(`/profile/${id}`);
    } else {
      setResError(result.error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleEdit)} sx={{ maxWidth: "80%", margin: "auto", mt: 10 } } noValidate>
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
          <input
            type="file"
            {...register("image")}
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                console.log(file);
              }
            }}
          />
          {errors.image && (
            <p>{errors.image.message}</p>
          )}
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
              minRows={3}
              {...register("introduction")}
              error={!!errors.introduction}
              helperText={errors.introduction?.message as React.ReactNode}
            />
            {/* <TextField
              label="アイコン"
              fullWidth
              {...register("introduction")}
              error={!!errors.introduction}
              helperText={errors.introduction?.message as React.ReactNode}
            /> */}

            {/* 将来的にフィールドを追加する場合は、以下のようにStack内にコンポーネントを追加 */}
          </CardContent>
        </Stack>
      </Stack>
      <Button type="submit" variant="contained" color="primary" fullWidth>
        保存
      </Button>
    </Box>
  );
};

export default EditUserForm;
