import { getCurrentUserId } from "@/app/lib/auth";
import { Button, Card, CardContent, Typography } from "@mui/material";
import Link from "next/link";
import { getUserById } from "./actions";

interface UserProfileProps {
  params: { id: string };
}

const UserProfile = async ({ params }: UserProfileProps) => {
  const { id } = params;
  const user = await getUserById(id);
  const currentUserId = await getCurrentUserId();

  if (!user) {
    return <Typography>ユーザーが見つかりません。</Typography>;
  }

  return (
    <Card sx={{ maxWidth: "80%", margin: "auto", mt: 10 }}>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          プロフィール
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          名前
        </Typography>
        <Typography variant="h6" gutterBottom>
          {user.name}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          メールアドレス
        </Typography>
        <Typography variant="h6" gutterBottom>
          {user.email}
        </Typography>
        {currentUserId === user.id && (
          <Link href={`/profile/${id}/edit`} passHref>
            <Button variant="contained" color="primary" sx={{ mt: 2 }}>
              プロフィール編集
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
};

export default UserProfile;
