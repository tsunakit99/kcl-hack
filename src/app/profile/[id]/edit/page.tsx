"use client";
import { UserData } from "@/app/types";
import { Card, CardContent, Typography } from "@mui/material";
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
    <Card sx={{ maxWidth: 600, margin: "auto", mt: 5 }}>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          プロフィール編集
        </Typography>
        <EditUserForm
          id={user.id}
          currentName={user.name || ""}
          currentDepartmentId={user.departmentId || ""}
          currentIntroduction={user.introduction || ""}
          currentIcon={user.image || ""}
        />
      </CardContent>
    </Card>
  );
};

export default EditUserPage;
