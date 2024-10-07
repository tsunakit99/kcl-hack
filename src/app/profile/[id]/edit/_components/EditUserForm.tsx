"use client";

import { EditUserFormData } from "@/app/types";
import { validationEditSchema } from "@/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Alert,
    Box,
    Button,
    Stack,
    TextField,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { UpdateUserInfo } from "../actions";

interface EditUserFormProps {
  id: string;
  currentName: string;
}

const EditUserForm = ({ id, currentName }: EditUserFormProps) => {
  const [resError, setResError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditUserFormData>({
    mode: "onBlur",
    resolver: zodResolver(validationEditSchema),
    defaultValues: {
      name: currentName,
    },
  });

  const handleEdit = async (data: EditUserFormData) => {
    const result = await UpdateUserInfo(id, data.name);
    if (result.success) {
      router.push(`/profile/${id}`);
    } else {
      setResError(result.error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleEdit)} noValidate>
      <Stack spacing={2}>
        {resError && (
          <Alert severity="error">
            {Object.values(resError)
              .flat()
              .map((error, index) => (
                <p key={index}>{error}</p>
              ))}
          </Alert>
        )}
        <TextField
          label="名前"
          fullWidth
          {...register("name")}
          error={!!errors.name}
          helperText={errors.name?.message as React.ReactNode}
        />
        {/* 将来的にフィールドを追加する場合は、以下のようにStack内にコンポーネントを追加 */}
        {/* <TextField
          label="新しいフィールド"
          fullWidth
          {...register("newField")}
          error={!!errors.newField}
          helperText={errors.newField?.message as React.ReactNode}
        /> */}
        <Button type="submit" variant="contained" color="primary" fullWidth>
          保存
        </Button>
      </Stack>
    </Box>
  );
};

export default EditUserForm;
