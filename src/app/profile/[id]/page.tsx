"use client";
import { ExamByIdData, UserData } from "@/app/types";
import { Box, Button, Card, CardContent, CircularProgress, List, ListItem, ListItemText, Stack, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getUserById, getYourExamByUploaderId } from "./actions";

interface UserProfileProps {
  params: { id: string, uploaderId: string };
}

const UserProfile = ({ params }: UserProfileProps ) => {
  const { id } = params;
  const { data: session } = useSession();
  const [user, setUser] = useState<UserData>();
  const [exams, setExams] = useState<ExamByIdData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const userResult = await getUserById(id);
      const examResult = await getYourExamByUploaderId(id);
      setUser(userResult);
      setExams(examResult);
       setIsLoading(false);
    };
    fetchUserData();
  }, []);


  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Card sx={{ width: "50%", margin: "auto", mt: 5 }}>
      <Card sx={{ width: "100%", margin: "auto" }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            プロフィール
          </Typography>
          <Box sx={{ maxWidth: "100%", margin: "auto", mt: 10 }}>
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
                  <Image
                    src={user?.imageUrl || '/icon/default-profile.png'} // デフォルト画像を設定
                    alt="プロフィール画像"
                    width={500}
                    height={500}
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
                    {user?.name}
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    学科
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    {user?.department?.name}
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    自己紹介
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    {user?.introduction || "なし"}
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    メールアドレス
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    {user?.email}
                  </Typography>
                </CardContent>
              </Stack>
            </Stack>
          </Box>
          <Box sx={{ maxWidth: "80%", margin: "auto" }}>
            {session?.user.id === user?.id && (
              <Link href={`/profile/${id}/edit`} passHref>
                <Button variant="contained" color="primary" fullWidth>
                  プロフィール編集
                </Button>
              </Link>
            )}
          </Box>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            あなたが投稿した過去問
          </Typography>
          {session?.user.id === user?.id && (
            <List>
              {exams?
                (exams.map((exam: ExamByIdData) => (
                  <ListItem key={exam.lectureName}>
                    <ListItemText primary={exam.lectureName} />
                    <ListItemText primary={exam.departmentName} />
                    <ListItemText primary={exam.professor} />
                    <ListItemText primary={exam.year} />
                  </ListItem>
                ))
              ) : (
                  <ListItem>
                    <ListItemText primary="過去問はまだありません。" />
                  </ListItem>
              )}
            </List>
          )}
        </CardContent>
      </Card>
    </Card>
  );
};

export default UserProfile;
