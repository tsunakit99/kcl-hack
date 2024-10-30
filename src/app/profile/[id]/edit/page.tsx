"use client";
import { UserData } from "@/app/types";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserById } from "../actions";
import EditUserForm from "./_components/EditUserForm";

interface EditUserPageProps {
  params: { id: string };
}

const EditUserPage = ({ params }: EditUserPageProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = params;
  const [user, setUser] = useState<UserData>();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status]);

  useEffect(() => {
    const fetchUserData = async () => {
      const result = await getUserById(id);
      setUser(result);
    };
    fetchUserData();
  }, []);

  if (!user) {
    return <Typography>ユーザーが見つかりません。</Typography>;
  }

  if (user.id !== session?.user.id) {
    return <Typography>このページにアクセスする権限がありません。</Typography>;
  }

  return (
    <Box
      style={{
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(45deg, #c0d7d2, #444f7c)",
        display: "flex",
      }}
    >
      <Card
        sx={{
          maxWidth: "60%",
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
            variant="h5"
            sx={{
              position: "relative",
              top: "10px",
              fontFamily: "Monospace",
              margin: "0 auto",
            }}
          >
            プロフィール編集
          </Typography>
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
