import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { getExamById, getImageById } from "./actions";

interface ExamPageProps {
  params: { id: string };
}

const ExamPage = async ({ params }: ExamPageProps) => {
  try {
    const exam = await getExamById(params.id);

    if (!exam) {
      return (
        <Typography textAlign={"center"}>
          過去問情報が見つかりませんでした。もう一度お試しください。
        </Typography>
      );
    }

    const imageUrl = await getImageById(exam.uploaderId);

    return (
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          background: "linear-gradient(45deg, #c0d7d2, #444f7c)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Card
          sx={{
            width: "40%",
            height: "95vh",
            margin: "auto",
            borderRadius: 2,
            overflowY: "auto",
            mt: 5,
            mb: 5,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.7)",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            scrollbarWidth: "none", // Firefox対応
            "@media(max-width: 1300px)": {
              width: "50%",
            },
          }}
        >
          <CardContent sx={{ textAlign: "center", p: 4 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography
                gutterBottom
                sx={{
                  fontSize: "40px",
                  fontWeight: "bold",
                  textAlign: "left",
                  "@media(max-width: 1000px)": {
                    fontSize: "20px",
                  },
                }}
              >
                過去問詳細
              </Typography>
              <Link
                href={`/profile/${exam.uploaderId}`}
                passHref
                style={{
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "right",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{
                      color: "gray",
                      fontSize: "18px",
                      "@media(max-width: 1000px)": {
                        fontSize: "10px",
                      },
                    }}
                  >
                    投稿者:
                  </Typography>
                  <Box
                    sx={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      overflow: "hidden",
                      ml: 2,
                      border: "2px solid #000",
                      "@media(max-width: 1300px)": {
                        width: "20px",
                        height: "20px",
                        ml: 1,
                      },
                    }}
                  >
                    <Image
                      src={imageUrl || "/icon/default-profile.png"}
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
                  <Typography
                    sx={{
                      fontSize: "20px",
                      "@media(max-width: 1000px)": {
                        fontSize: "10px",
                      },
                    }}
                  >
                    {exam.uploader.name}
                  </Typography>
                </Box>
              </Link>
            </Box>
            <Divider sx={{ my: 2 }} />

            <Stack direction="column" spacing={2} sx={{ textAlign: "left" }}>
              <Box>
                <Typography variant="subtitle1" color="textSecondary">
                  講義名
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {exam.lecture.name}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle1" color="textSecondary">
                  学科
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {exam.department.name}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle1" color="textSecondary">
                  年度
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {exam.year}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle1" color="textSecondary">
                  教授名
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {exam.professor || "不明"}
                </Typography>
              </Box>

              <Link href={exam.fileUrl} passHref>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    mt: 1,
                    fontWeight: "bold",
                    width: "80%",
                    minWidth: "130px",
                  }}
                >
                  {exam.originalFileName}を閲覧
                </Button>
              </Link>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    );
  } catch (error) {
    console.error("試験情報の取得中にエラーが発生しました：", error);
    return (
      <Typography textAlign={"center"}>
        過去問情報取得中にエラーが発生しました。もう一度お試しください。
      </Typography>
    );
  }
};

export default ExamPage;
