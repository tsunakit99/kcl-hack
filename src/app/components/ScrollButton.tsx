import React from "react";
import { Button } from "@mui/material";

// ScrollButton コンポーネント
const ScrollButton = ({
  text,
  scroll,
  color = "#444f7c",
  hoverColor = "#5a6aa1",
}) => {
  return (
    <Button
      onClick={scroll}
      sx={{
        transform: "translateY(-50%)",
        backgroundColor: color, // 背景色をプロパティで設定
        color: "#fff",
        borderRadius: "50%", // 円形にする
        width: "40px",
        height: "40px",
        minWidth: "40px", // ボタンの幅を固定
        "&:hover": {
          backgroundColor: hoverColor, // ホバー時の色
        },
      }}
    >
      {text}
    </Button>
  );
};

export default ScrollButton;
