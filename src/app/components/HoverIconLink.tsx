import { Box, Link } from "@mui/material";
import { SvgIconProps } from '@mui/material/SvgIcon';
import React from "react";

interface HoverIconLinkProps {
  href: string;
  icon: React.ElementType<SvgIconProps>; // アイコンの型を指定
  underlineColor?: string; // 下線の色をオプションで指定可能
  iconSize?: string; // アイコンのサイズをオプションで指定可能
}

const HoverIconLink = ({
  href,
  icon: IconComponent, // アイコンコンポーネントを受け取る
  underlineColor = "#ffffff", // デフォルトの下線色
  iconSize = "40px", // デフォルトのアイコンサイズ
}: HoverIconLinkProps) => {
  return (
    <Link
      href={href}
      style={{
        textDecoration: "none",
        color: "inherit",
        display: "inline-block",
      }}
    >
      <Box
        sx={{
          display: "inline-block",
          position: "relative",
          cursor: "pointer",
          padding: "20px", // アイコンの周りのパディング
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
        <IconComponent sx={{ fontSize: iconSize }} /> {/* アイコンのサイズ */}
      </Box>
    </Link>
  );
};

export default HoverIconLink;
