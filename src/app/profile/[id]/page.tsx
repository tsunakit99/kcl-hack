import { getCurrentUserId } from "@/app/lib/auth";
import { Box, Button, CardContent, Stack, Typography } from "@mui/material";
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
    <Box sx={{ maxWidth: "80%", margin: "auto", mt: 10 }}>
      <Typography variant="h4" gutterBottom>
        プロフィール
      </Typography>
      <CardContent>
        <Stack direction="row" spacing={2}>
          <Stack>
            <Box
              sx={{
                width: 150,
                height: 150,
                borderRadius: "50%",
                overflow: "hidden",
                marginTop: "20px",
                marginLeft: "23px",
                border: "2px solid #000",
              }}
            >
              <img
                src={user.image || '/default-profile.png'} // デフォルト画像を設定
                alt="プロフィール画像"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>
          </Stack>
          <Stack>
            <CardContent>
              <Typography variant="subtitle1" color="textSecondary">
                名前
              </Typography>
              <Typography variant="h6" gutterBottom>
                {user.name}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                学科
              </Typography>
              <Typography variant="h6" gutterBottom>
                {user.department}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                自己紹介
              </Typography>
              <Typography variant="h6" gutterBottom>
                {user.introduction}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                メールアドレス
              </Typography>
              <Typography variant="h6" gutterBottom>
                {user.email}
              </Typography>
            </CardContent>
          </Stack>
        </Stack>
        {currentUserId === user.id && (
              <Link href={`/profile/${id}/edit`} passHref>
                <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                  プロフィール編集
                </Button>
              </Link>
          )}
      </CardContent>
    </Box>
  );
};

export default UserProfile;
