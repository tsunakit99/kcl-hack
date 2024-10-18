import { getCurrentUserId } from "@/app/lib/auth";
import { Card, CardContent, Typography } from "@mui/material";
import { getUserById } from "../actions";
import EditUserForm from "./_components/EditUserForm";

interface EditUserPageProps {
  params: { id: string };
}

const EditUserPage = async ({ params }: EditUserPageProps) => {
  const { id } = params;
  const user = await getUserById(id);
  const currentUserId = await getCurrentUserId();

  if (!user) {
    return <Typography>ユーザーが見つかりません。</Typography>;
  }

  if (user.id !== currentUserId) {
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
