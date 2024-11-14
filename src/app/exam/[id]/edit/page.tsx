"use client";

import ErrorMessage from "@/app/components/ErrorMessage";
import { ExamData } from "@/app/types";
import { Box, CircularProgress, Container, Divider, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
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
    const { data: session } = useSession();
    const [isLoading, setIsLoading] = useState(true);
    const [resError, setResError] = useState<string | null>(null);

    useEffect(() => {
        // 画面遷移後にフェードインを開始
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 100); // 遅延を少し入れる場合

        return () => clearTimeout(timer); // クリーンアップ
    }, []);

    useEffect(() => {
        const fetchExamData = async () => {
            try {
                const result = await getExamById(id);
                if (!result) {
                    setResError("過去問が見つかりません。")
                }
                setExam(result);
            } catch (err: unknown) {
                console.error("試験情報の取得中にエラーが発生しました：", err);
                setResError("過去問情報の取得中にエラーが発生しました。もう一度お試しください。");
            } finally {
                setIsLoading(false);
            };
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

    if (resError) {
    return (
      <ErrorMessage
        title="エラー"
        description={resError}
      />
    );
  }
    
    if (!exam) {
        return (
            <ErrorMessage
                title="過去問が見つかりません。"
                description="お探しの過去問が存在しないか、既に削除されています。"
            />
        );
    }
    
    // アクセス権がない場合のエラーメッセージ
    if (exam.uploader.id !== session?.user.id) {
        return (
            <ErrorMessage
                title="アクセス権限がありません。"
                description="このページにアクセスする権限がありません。"
            />
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
                        beforeLectureName={exam.lecture.name}
                        beforeDepartmentId={exam.departmentId}
                        beforeTagId={exam.tag.id}
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