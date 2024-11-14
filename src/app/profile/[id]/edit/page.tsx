"use client";
import ErrorMessage from "@/app/components/ErrorMessage";
import { UserData } from "@/app/types";
import { Box, Card, CardContent, CircularProgress, Divider, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getUserById } from "../actions";
import EditUserForm from "./_components/EditUserForm";

interface EditUserPageProps {
  params: { id: string };
}

const EditUserPage = ({ params }: EditUserPageProps) => {
  const { data: session } = useSession();
  const { id } = params;
  const [user, setUser] = useState<UserData>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const result = await getUserById(id);
      setUser(result);
      setIsLoading(false);
    };
    fetchUserData();
  }, []);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
    }

  if (!user) {
  return (
    <ErrorMessage
      title="ユーザーが見つかりません。"
      description="お探しのユーザーが存在しないか、既に削除されています。"
    />
  );
}

// アクセス権がない場合のエラーメッセージ
if (user.id !== session?.user.id) {
  return (
    <ErrorMessage
      title="アクセス権限がありません。"
      description="このページにアクセスする権限がありません。"
    />
  );
}

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(45deg, #c0d7d2, #444f7c)",
        display: "flex",
      }}
    >
      <Card
        sx={{
          width: "50%",
          maxWidth: "100%",
          margin: "auto",
          overflowY: "auto",
          mt: 5,
          mb: 5,
          borderRadius: 0,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.7)",
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            gutterBottom
            sx={{
              fontSize: "40px",
              fontWeight: "bold",
              mt: 4,
              mb: 1,
              "@media(max-width: 1000px)": {
                fontSize: "25px",
              },
            }}
          >
            プロフィール編集
          </Typography>
          <Divider sx={{ width: "100%" }} />
          <EditUserForm
            id={user.id}
            currentName={user.name || ""}
            currentDepartmentId={user.departmentId || ""}
            currentIntroduction={user.introduction || ""}
            currentIcon={user.imageUrl || ""}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default EditUserPage;
