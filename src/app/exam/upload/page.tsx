"use client";

import { Box, Container, Divider, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import UploadExamForm from "./_components/UploadExamForm";
import Image from "next/image";

const UploadExam = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 画面遷移後にフェードインを開始
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100); // 遅延を少し入れる場合

    return () => clearTimeout(timer); // クリーンアップ
  }, []);

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
            過去問投稿
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
          <UploadExamForm />
        </Container>
      </div>
    </Box>
  );
};

export default UploadExam;
