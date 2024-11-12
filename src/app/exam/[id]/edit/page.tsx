"use client";

import { Box, Container, Divider, Typography } from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import EditExamForm from "./_components/EditExamForm";
import { ExamByIdData } from "@/app/types";
import { getExamById } from "../actions";
import { useForm } from "react-hook-form";

interface EditExamPageProps {
  params: { id: string };
}

const EditExamPage = ({ params }: EditExamPageProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = params;
  const [exam, setExam] = useState<ExamByIdData>();
  const { setValue } = useForm();

  useEffect(() => {
    // 画面遷移後にフェードインを開始
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100); // 遅延を少し入れる場合

    return () => clearTimeout(timer); // クリーンアップ
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/"); 
    }
  }, [status]);

  useEffect(() => {
    const fetchExamData = async () => {
      const examResult = await getExamById(id);
      setExam({
        id: examResult.id,
        lectureName: examResult.lecture.name, // lectureオブジェクトのnameをlectureNameとして設定
        departmentId: examResult.departmentId,
        year: examResult.year,
        professor: examResult.professor || "",
        file: examResult.fileUrl
      });
      setValue("lectureName", examResult.lecture.name);
      setValue("departmentId", examResult.departmentId);
      setValue("year", examResult.year);
      setValue("professor", examResult.professor || "");
      setValue("file", examResult.fileUrl);
    };
    fetchExamData();
  }, []);

  if (!exam) {
    return <Typography>試験が見つかりません。</Typography>;
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
        background: "linear-gradient(to right, #c0d7d2 47%, #fff 47%)",
      }}
    >
      <div
        style={{
          display: "flex",
          height: "95%",
          margin: "0 0 2% 4%",
          gap: "8vw", // 間隔を調整
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
              transition: "opacity 2s ease",
              opacity: isVisible ? 1 : 0, // フェードインアニメーション
              marginTop: "40vh",
            }}
          />
          <Typography
            variant="h2"
            sx={{
              marginTop: "60vh",
              color: "#444f7c",
              fontWeight: 550,
              transition: "opacity 2s ease",
              opacity: isVisible ? 1 : 0, // フェードインアニメーション
              "@media(max-width: 1000px)": {
                fontSize: "50px",
              },
            }}
          >
            過去問編集
          </Typography>
        </Box>
        <Container
          sx={{
            width: "40vw",
            height: "90%",
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
              margin: "2vw",
              color: "#444f7c",
              "@media(max-width: 1000px)": {
                fontSize: "12px",
              },
            }}
          >
            以下に過去問情報を入力してください
          </Divider>
          <EditExamForm
            id={exam.id}
            beforeLectureName={exam.lectureName}
            beforeDepartmentId={exam.departmentId}
            beforeYear={exam.year}
            beforeProfessor={exam.professor || ""}
            beforeFile={exam.file}
          />
        </Container>
      </div>
    </Box>
  );
};

export default EditExamPage;