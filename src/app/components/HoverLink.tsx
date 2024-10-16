import { Typography, Link } from "@mui/material";
import React from "react";

// 型定義 (必要に応じて修正)
interface HoverLinkProps {
  href: string;
  text: string;
  underlineColor?: string; // 下線の色をオプションで指定可能
  fontSize?: string; // フォントサイズをオプションで指定可能
}

const HoverLink: React.FC<HoverLinkProps> = ({
  href,
  text,
  underlineColor = "#ffffff", // デフォルトの下線色
  fontSize = "20px", // デフォルトのフォントサイズ
}) => {
  return (
    <Link
      style={{
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <Typography
        variant="h6"
        noWrap
        sx={{
          display: "block",
          cursor: "pointer",
          fontSize: fontSize,
          padding: "30px",
          position: "relative",
          "&:hover::after": {
            content: '""',
            position: "absolute",
            left: "10%",
            bottom: 0,
            width: "80%",
            height: "5px", // 下線の高さ
            backgroundColor: underlineColor, // 下線の色をプロップで指定
          },
        }}
      >
        {text}
      </Typography>
    </Link>
  );
};

export default HoverLink;
