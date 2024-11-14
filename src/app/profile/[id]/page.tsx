"use client";
import { ExamByIdData, UserData } from "@/app/types";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Fade,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Popover,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import DeleteModal from "./_components/DeleteModal";
import { getExamByUploaderId, getUserById } from "./actions";

interface UserProfileProps {
  params: { id: string; uploaderId: string };
}

const UserProfile = ({ params }: UserProfileProps) => {
  const { id } = params;
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<UserData>();
  const [exams, setExams] = useState<ExamByIdData[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openDeleteSnackbar, setOpenDeleteSnackbar] = useState(false);
  const [openProfSnackbar, setOpenProfSnackbar] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const isSuccessful = searchParams.get("success") === "true";

  // メニュー関連の状態管理
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuExamId, setMenuExamId] = useState<string | null>(null);

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
      const examResult = await getExamByUploaderId(id);
      setUser(userResult);
      setExams(examResult);
      setIsLoading(false);
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    // クエリパラメータのisSuccessfulがtrueの場合にスナックバーを表示
    if (isSuccessful) {
      setOpenProfSnackbar(true);
      const params = new URLSearchParams(searchParams);
      params.delete("success");
      router.replace(`${window.location.pathname}?${params.toString()}`);
    }
  }, [isSuccessful]);

  const handleOpenDeleteModal = () => {
    setOpenDeleteModal(true);
  };

  const handleDeleteSuccess = () => {
    setOpenDeleteSnackbar(true); // 削除成功時にスナックバーを表示
    // 削除後、リストから削除された過去問を取り除く
    if (selectedExamId) {
      setExams(exams.filter((exam) => exam.id !== selectedExamId));
    }
  };

  // メニューを開く
  const handleOpenMenu = (
    event: React.MouseEvent<HTMLButtonElement>,
    examId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setMenuExamId(examId);
  };

  // メニューを閉じる
  const handleCloseMenu = () => {
    setAnchorEl(null);
    setMenuExamId(null);
  };

  // 削除ボタンの処理
  const handleDelete = () => {
    if (menuExamId) {
      setSelectedExamId(menuExamId);
      handleOpenDeleteModal();
      handleCloseMenu();
    }
  };

  // 編集ボタンの処理
  const handleEdit = () => {
    if (menuExamId) {
      router.push(`/exam/${menuExamId}/edit`);
      handleCloseMenu();
    }
  };

  // 詳細ボタンの処理
  const handleDetail = () => {
    if (menuExamId) {
      router.push(`/exam/${menuExamId}`);
      handleCloseMenu();
    }
  };

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
      <Box
        sx={{
          display: "block",
          marginLeft: "8vw",
          mt: 0,
          overflowY: "auto", // スクロール可能にする
          overflowX: "hidden",
          maxHeight: "70vh", // スクロールする高さの上限を設定
          "&::-webkit-scrollbar": {
            display: "none",
          },
          scrollbarWidth: "none", // Firefox対応
        }}
      >
        <Typography
          sx={{
            fontSize: "60px",
            color: "#444f7c",
            fontWeight: 550,
            transition: "opacity 2s ease",
            opacity: isVisible ? 1 : 0,
            "@media(max-width: 1000px)": {
              fontSize: "40px",
            },
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
            top: "-8px",
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
              <Box>
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
                      marginTop: "10px",
                    },
                  }}
                >
                  <Image
                    src={user?.imageUrl || "/icon/default-profile.png"} // デフォルト画像を設定
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
                <Box
                  sx={{
                    display: "flex",
                    marginTop: "5vh",
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
                          width: "10vw",
                          height: "6vh", // ボタンの高さを調整
                          borderRadius: 5,
                          backgroundColor: "#444f7c",
                          "&:hover": {
                            backgroundColor: "#383f6a", // ホバー時の背景色
                          },
                          "@media(max-width: 1000px)": {
                            width: "18vw",
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
                            style={{ width: "20px", height: "20px" }}
                          />
                          <span>プロフィール編集</span>
                        </div>
                      </Button>
                    </Link>
                  )}
                  {isSuccessful && (
                    <Snackbar
                      open={openProfSnackbar}
                      autoHideDuration={3000}
                      onClose={() => setOpenProfSnackbar(false)}
                      message="プロフィール編集が完了しました"
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center",
                      }}
                    />
                  )}
                </Box>
              </Box>
              <Stack
                sx={{
                  maxWidth: "65%",
                  "@media(max-width: 1000px)": {
                    maxWidth: "90%",
                  },
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
                    {user?.department?.name || "なし"}
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
            color="#444f7c"
            sx={{
              fontWeight: 550,
              fontSize: "30px",
              textDecoration: "underline dotted",
              "@media(max-width: 1000px)": {
                fontSize: "20px",
              },
            }}
          >
            投稿した過去問
          </Typography>
          <List>
            <Button
              disabled
              sx={{
                width: "100%",
              }}
            >
              <ListItem
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 1,
                  color: "black",
                }}
              >
                <ListItemText
                  primary="講義名"
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
                  sx={{ flexBasis: "8vw" }}
                  primaryTypographyProps={{
                    sx: {
                      "@media(max-width: 1000px)": { fontSize: "12px" },
                    },
                  }}
                />
                <ListItemText
                  primary="年度"
                  sx={{ flexBasis: "6vw" }}
                  primaryTypographyProps={{
                    sx: {
                      "@media(max-width: 1000px)": { fontSize: "12px" },
                    },
                  }}
                />
              </ListItem>
            </Button>
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
              <List>
                {exams.map((exam: ExamByIdData, index) => (
                  <Fade
                    in={true}
                    timeout={500}
                    style={{ transitionDelay: `${index * 200}ms` }}
                    key={exam.id}
                  >
                    <ListItem
                      disablePadding
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        paddingY: 1,
                      }}
                    >
                      {/* リスト項目のクリック処理 */}
                      <Button
                        onClick={(event) => {
                          if (session?.user.id === user?.id) {
                            handleOpenMenu(event, exam.id);
                          } else {
                            router.push(`/exam/${exam.id}`);
                          }
                        }}
                        sx={{
                          width: "100%",
                          display: "flex",
                          textAlign: "left",
                          color: "inherit",
                          textDecoration: "none",
                          borderRadius: 0,
                          backgroundColor: "#fff",
                          "&:hover": {
                            backgroundColor: "#f0f0f0",
                          },
                        }}
                      >
                        <ListItemText
                          primary={exam.lectureName}
                          sx={{ flexBasis: "6vw" }}
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
                          sx={{ flexBasis: "8vw" }}
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
                      </Button>

                      {/* メニュー */}
                      <Popover
                        open={Boolean(anchorEl) && menuExamId === exam.id}
                        anchorEl={anchorEl}
                        onClose={handleCloseMenu}
                        anchorOrigin={{
                          vertical: "top",
                          horizontal: "center",
                        }}
                        transformOrigin={{
                          vertical: "bottom",
                          horizontal: "center",
                        }}
                        PaperProps={{
                          sx: {
                            padding: "8px",
                            display: "flex",
                            alignItems: "center",
                            borderRadius: "12px",
                            backgroundColor: "#fff",
                            boxShadow: "0px 3px 6px rgba(0,0,0,0.1)",
                          },
                        }}
                      >
                        <IconButton
                          onClick={handleDetail}
                          sx={{ margin: "0 8px" }}
                        >
                          <Image
                            src="/icon/post2.png"
                            alt="detail icon"
                            width="24"
                            height="24"
                          />
                        </IconButton>
                        <IconButton
                          onClick={handleEdit}
                          sx={{ margin: "0 8px" }}
                        >
                          <Image
                            src="/icon/pen2.png"
                            alt="edit icon"
                            width="24"
                            height="24"
                          />
                        </IconButton>
                        <IconButton
                          onClick={handleDelete}
                          sx={{ margin: "0 8px" }}
                        >
                          <Image
                            src="/icon/delete2.png"
                            alt="delete icon"
                            width="24"
                            height="24"
                          />
                        </IconButton>
                      </Popover>

                      <Divider
                        sx={{
                          width: "90%",
                          position: "absolute",
                          bottom: 0,
                          backgroundColor: "#ddd",
                        }}
                      />
                    </ListItem>
                  </Fade>
                ))}
              </List>
            ) : (
              <ListItem>
                <ListItemText primary="投稿した過去問はまだありません。" />
              </ListItem>
            )}
          </List>
        </CardContent>
      </Box>
      {/* 削除モーダル */}
      {openDeleteModal && selectedExamId && (
        <DeleteModal
          examId={selectedExamId}
          open={openDeleteModal}
          onClose={() => setOpenDeleteModal(false)}
          onDeleteSuccess={handleDeleteSuccess}
        />
      )}
      {/* 削除スナックバー */}
      <Snackbar
        open={openDeleteSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenDeleteSnackbar(false)}
        message="過去問削除が完了しました"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
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
