"use client";

import { ExamData } from "@/app/types";
import {
  Box,
  CircularProgress,
  Container,
  Divider,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getExamById } from "../actions";
import EditExamForm from "./_components/EditExamForm";

interface EditExamPageProps {
  params: { id: string };
}

const EditExamPage = ({ params }: EditExamPageProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const { id } = params;
  const [exam, setExam] = useState<ExamData>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 画面遷移後にフェードインを開始
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100); // 遅延を少し入れる場合

    return () => clearTimeout(timer); // クリーンアップ
  }, []);

  useEffect(() => {
    const fetchExamData = async () => {
      const result = await getExamById(id);
      setExam(result);
      setIsLoading(false);
    };
    fetchExamData();
  }, []);

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

  if (!exam) {
    return <Typography textAlign={"center"}>試験が見つかりません。</Typography>;
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
        background: "linear-gradient(80deg, #c0d7d2 27%, #fff 27%)",
      }}
    >
      <div
        style={{
          width: "35%",
          height: "3vw",
          backgroundColor: "#c0d7d2",
          position: "absolute",
          top: 0,
          left: "8vw",
          zIndex: 999,
          transform: "rotate(-45deg)",
        }}
      />
      <div
        style={{
          width: "40%",
          height: "4vw",
          backgroundColor: "#c0d7d2",
          position: "absolute",
          top: "10vw",
          left: "8vw",
          zIndex: 999,
          transform: "rotate(-65deg)",
        }}
      />
      <div
        style={{
          width: "4vw",
          height: "4vw",
          backgroundColor: "#444f7c",
          borderRadius: "50%",
          position: "absolute",
          top: 5,
          left: "36vw",
          zIndex: 1000,
        }}
      />
      <div
        style={{
          width: "5vw",
          height: "5vw",
          backgroundColor: "#444f7c",
          borderRadius: "50%",
          position: "absolute",
          top: "6vw",
          left: "26vw",
          zIndex: 1000,
        }}
      />
      <div
        style={{
          display: "flex",
          height: "95%",
          margin: "0 0 2% 4%",
          gap: 0, // 間隔を調整
        }}
      >
        <Box
          sx={{
            width: "40vw",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            className="post-icon"
            src="/icon/post2.png"
            alt="search"
            width={500}
            height={500}
            style={{
              transform: "rotate(-5deg)",
              transition: "opacity 2s ease",
              opacity: isVisible ? 1 : 0, // フェードインアニメーション
              marginTop: "40vh",
            }}
          />
          <Typography
            sx={{
              marginTop: "60vh",
              color: "#444f7c",
              fontSize: "50px",
              fontWeight: 550,
              transition: "opacity 2s ease",
              opacity: isVisible ? 1 : 0, // フェードインアニメーション
              "@media(max-width: 1000px)": {
                fontSize: "35px",
              },
            }}
          >
            過去問編集
          </Typography>
        </Box>
        <Container
          sx={{
            width: "50vw",
            height: "98%",
            borderRadius: "16px",
            boxShadow: 0,
            backgroundColor: "rgba(0,0,0,0)",
            overflowY: "auto", // スクロール可能にする
            "&::-webkit-scrollbar": {
              display: "none",
            },
            scrollbarWidth: "none", // Firefox対応
          }}
        >
          <Divider
            textAlign="center"
            sx={{
              margin: "1vw 0 2vw 0",
              color: "#444f7c",
              "@media(max-width: 1000px)": {
                fontSize: "12px",
                margin: "1vw",
              },
            }}
          >
            以下に過去問情報を入力してください
          </Divider>
          <EditExamForm
            id={exam.id}
            beforeLectureName={exam.lecture.name}
            beforeDepartmentId={exam.departmentId}
            beforeTagId={exam.tagId}
            beforeYear={exam.year}
            beforeProfessor={exam.professor || ""}
            originalFileName={exam.originalFileName}
            beforeFileUrl={exam.fileUrl}
          />
        </Container>
      </div>
    </Box>
  );
};

export default EditExamPage;
