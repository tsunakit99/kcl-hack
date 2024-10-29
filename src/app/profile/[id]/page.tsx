"use client";
import { ExamByIdData, UserData } from "@/app/types";
import { Box, Button, Card, CardContent, CircularProgress, Fade, List, ListItem, ListItemText, Stack, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getUserById, getYourExamByUploaderId } from "./actions";

interface UserProfileProps {
  params: { id: string; uploaderId: string };
}

const UserProfile = ({ params }: UserProfileProps) => {
  const { id } = params;
  const { data: session } = useSession();
  const [user, setUser] = useState<UserData>();
  const [exams, setExams] = useState<ExamByIdData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 画面遷移後にフェードインを開始
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300); // 遅延を少し入れる場合

    return () => clearTimeout(timer); // クリーンアップ
  }, []);

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
    <Box
      sx={{
        display: "flex",
        padding: "30px",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        margin: 0,
        background: "linear-gradient(to right,  #c0d7d2 48%, #fff 48%)",
        gap: "6vw",
        "@media(max-width: 1000px)": {
          gap: "2vw",
        },
      }}
    >
      <div
        style={{
          width: "4vw",
          height: "4vw",
          backgroundColor: "#444f7c",
          borderRadius: "50%",
          position: "absolute",
          top: 5,
          left: "8vw",
          zIndex: 1000,
        }}
      />
      <div
        style={{
          width: "7vw",
          height: "7vw",
          backgroundColor: "#fff",
          borderRadius: "50%",
          position: "absolute",
          top: 6,
          left: "8vw",
          zIndex: 999,
        }}
      />
      <div
        style={{
          background: "#fff",
          position: "absolute",
          top: "2vw",
          left: "9vw",
          margin: 0,
          width: "38%",
          height: "2vw",
          borderRadius: 5,
        }}
      />
      <Box sx={{ display: "block", marginLeft: "8vw", mt: "12vh" }}>
        <Typography
          variant="h3"
          sx={{
            color: "#444f7c",
            fontWeight: 550,
            transition: "opacity 2s ease",
            opacity: isVisible ? 1 : 0,
          }}
        >
          Profile
        </Typography>
        <div
          style={{
            width: "60%",
            height: "2px",
            backgroundColor: "#444f7c",
            position: "relative",
            top: 0,
          }}
        ></div>
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
                  src={user?.imageUrl || "/default-profile.png"} // デフォルト画像を設定
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
                    {user?.name}
                  </Typography>
                  <Typography
                    className="profile-item-name"
                    color="textSecondary"
                  >
                    学科
                  </Typography>
                  <Typography className="profile-item" gutterBottom>
                    {user?.department.name}
                  </Typography>
                  <Typography
                    className="profile-item-name"
                    color="textSecondary"
                  >
                    自己紹介
                  </Typography>
                  <Typography className="profile-item" gutterBottom>
                    {user?.introduction || "なし"}
                  </Typography>
                  <Typography
                    className="profile-item-name"
                    color="textSecondary"
                  >
                    メールアドレス
                  </Typography>
                  <Typography className="profile-item" gutterBottom>
                    {user?.email}
                  </Typography>
                </CardContent>
              </Stack>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                marginTop: "1vh",
              }}
            >
              {session?.user.id === user?.id && (
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
          height: "80%",
          position: "relative",
          top: "-6vh",
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
          {session?.user.id === user?.id && (
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
                exams.map((exam: ExamByIdData, index) => (
                  <Fade
                    in={true}
                    timeout={500} // アニメーションの速度
                    style={{ transitionDelay: `${index * 200}ms` }} // 各行に遅延を追加
                    key={exam.lectureName}
                  >
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
                  </Fade>
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
      <div
        style={{
          width: "4vw",
          height: "4vw",
          backgroundColor: "#444f7c",
          borderRadius: "50%",
          position: "absolute",
          bottom: 5,
          right: 5,
          zIndex: 1000,
        }}
      />
      <div
        style={{
          width: "7vw",
          height: "7vw",
          backgroundColor: "#c0d7d2",
          borderRadius: "50%",
          position: "absolute",
          bottom: 6,
          right: 6,
          zIndex: 999,
        }}
      />
    </Box>
  );
};

export default UserProfile;
