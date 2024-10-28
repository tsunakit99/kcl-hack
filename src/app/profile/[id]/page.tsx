"use client";
import { ExamByIdData } from "@/app/types";
import {
  Box,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserById, getYourExamByUploaderId } from "./actions";
import Image from "next/image";

interface UserProfileProps {
  params: { id: string; uploaderId: string };
}

const UserProfile = ({ params }: UserProfileProps) => {
  const { id } = params;
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [exams, setExams] = useState<ExamByIdData[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status]);

  useEffect(() => {
    const fetchUserData = async () => {
      const userResult = await getUserById(id);
      const examResult = await getYourExamByUploaderId(id);
      setUser(userResult);
      setExams(examResult);
    };
    fetchUserData();
  }, []);

  if (!user) {
    return <Typography>ユーザーが見つかりません。</Typography>;
  }

  if (exams) {
    //paramsがある場合にのみ過去問を取得
    const { uploaderId } = params;
  }

  return (
    <Box
      sx={{
        display: "flex",
        padding: "30px",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        margin: 0,
        background: "linear-gradient(45deg, #c0d7d2 47%, #fff 47%)",
        gap: "6vw",
        "@media(max-width: 1000px)": {
          gap: "2vw",
        },
      }}
    >
      <Box sx={{ display: "block", marginLeft: "8vw", mt: "20vh" }}>
        <Typography
          variant="h3"
          sx={{ color: "#444f7c", fontWeight: 550, mt: "-15vh" }}
        >
          Profile
        </Typography>
        <Card
          sx={{
            width: "40vw",
            borderRadius: 0,
            backgroundColor: "rgba(0,0,0,0)",
            boxShadow: 0,
          }}
        >
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
                spacing: 2,
                mt: 2,
                "@media(max-width: 1000px)": {
                  display: "block",
                },
              }}
            >
              <Box
                sx={{
                  width: "130px",
                  height: "130px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  marginTop: "20px",
                  border: "2px solid #000",
                  marginRight: "2vw",
                  "@media(max-width: 1000px)": {
                    width: "100px",
                    height: "100px",
                  },
                }}
              >
                <Image
                  src={user.image || "/default-profile.png"} // デフォルト画像を設定
                  alt="プロフィール画像"
                  width={500}
                  height={500}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>
              <Stack
                sx={{
                  overflow: "visble",
                  maxWidth: "100%",
                }}
              >
                <CardContent>
                  <Typography
                    className="profile-item-name"
                    color="textSecondary"
                  >
                    名前
                  </Typography>
                  <Typography className="profile-item" gutterBottom>
                    {user.name}
                  </Typography>
                  <Typography
                    className="profile-item-name"
                    color="textSecondary"
                  >
                    学科
                  </Typography>
                  <Typography className="profile-item" gutterBottom>
                    {user.department.name}
                  </Typography>
                  <Typography
                    className="profile-item-name"
                    color="textSecondary"
                  >
                    自己紹介
                  </Typography>
                  <Typography className="profile-item" gutterBottom>
                    {user.introduction || "なし"}
                  </Typography>
                  <Typography
                    className="profile-item-name"
                    color="textSecondary"
                  >
                    メールアドレス
                  </Typography>
                  <Typography className="profile-item" gutterBottom>
                    {user.email}
                  </Typography>
                </CardContent>
              </Stack>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              {session?.user.id === user.id && (
                <Link href={`/profile/${id}/edit`} passHref>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{
                      position: "relative",
                      width: "15vw",
                      height: "6vh", // ボタンの高さを調整
                      borderRadius: 5,
                      backgroundColor: "#444f7c",
                      "&:hover": {
                        backgroundColor: "#383f6a", // ホバー時の背景色
                      },
                    }}
                  >
                    <div
                      className="button-content"
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src="/icon/entry.png"
                        alt="icon"
                        style={{ width: "24px", height: "24px" }}
                      />
                      <span>プロフィール編集</span>
                    </div>
                  </Button>
                </Link>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>
      <Box
        sx={{
          width: "50vw",
          height: "50vh",
          marginTop: "-30vh",
          overflowY: "auto", // スクロール可能にする
          "&::-webkit-scrollbar": {
            display: "none",
          },
          scrollbarWidth: "none", // Firefox対応
        }}
      >
        <CardContent>
          <Typography
            gutterBottom
            color="#444f7c"
            sx={{
              fontWeight: 550,
              fontSize: "30px",
              "@media(max-width: 1000px)": {
                fontSize: "20px",
              },
            }}
          >
            あなたが投稿した過去問
          </Typography>
          {/* カラム名を表示する */}
          {session?.user.id === user.id && (
            <List>
              <ListItem
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ListItemText
                  primary="講義名"
                  sx={{ flexBasis: "6vw" }}
                  primaryTypographyProps={{
                    sx: {
                      "@media(max-width: 1000px)": { fontSize: "12px" },
                    },
                  }}
                />
                <ListItemText
                  primary="学科"
                  sx={{ flexBasis: "8vw" }}
                  primaryTypographyProps={{
                    sx: {
                      "@media(max-width: 1000px)": { fontSize: "12px" },
                    },
                  }}
                />
                <ListItemText
                  primary="担当教授"
                  sx={{ flexBasis: "6vw" }}
                  primaryTypographyProps={{
                    sx: {
                      "@media(max-width: 1000px)": { fontSize: "12px" },
                    },
                  }}
                />
                <ListItemText
                  primary="年数"
                  sx={{ flexBasis: "6vw" }}
                  primaryTypographyProps={{
                    sx: {
                      "@media(max-width: 1000px)": { fontSize: "12px" },
                    },
                  }}
                />
              </ListItem>
              <div
                style={{
                  width: "90%",
                  height: "1px",
                  backgroundColor: "#000",
                  position: "relative",
                  margin: "2px 0 4px 0",
                }}
              ></div>
              {exams ? (
                exams.map((exam: ExamByIdData) => (
                  <ListItem
                    key={exam.lectureName}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <ListItemText
                      primary={exam.lectureName}
                      sx={{
                        flexBasis: "6vw",
                      }}
                      primaryTypographyProps={{
                        sx: {
                          "@media(max-width: 1000px)": { fontSize: "12px" },
                        },
                      }}
                    />
                    <ListItemText
                      primary={exam.departmentName}
                      sx={{ flexBasis: "8vw" }}
                      primaryTypographyProps={{
                        sx: {
                          "@media(max-width: 1000px)": { fontSize: "12px" },
                        },
                      }}
                    />
                    <ListItemText
                      primary={exam.professor}
                      sx={{ flexBasis: "6vw" }}
                      primaryTypographyProps={{
                        sx: {
                          "@media(max-width: 1000px)": { fontSize: "12px" },
                        },
                      }}
                    />
                    <ListItemText
                      primary={exam.year}
                      sx={{ flexBasis: "6vw" }}
                      primaryTypographyProps={{
                        sx: {
                          "@media(max-width: 1000px)": { fontSize: "12px" },
                        },
                      }}
                    />
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
      </Box>
    </Box>
  );
};

export default UserProfile;
