// src/components/CircleIcon.tsx
import React from "react";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

// コンポーネントのプロパティの型定義
interface CircleIconProps {
  src: string; // 画像のパス
  alt?: string; // 画像の代替テキスト
  text?: string; // 表示するテキスト
  linkUrl?: string; // 遷移先のURL
}

const CircleIcon: React.FC<CircleIconProps> = ({
  src,
  alt = "icon",
  text = "",
  linkUrl = "", // URLのデフォルトを空文字に設定
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (linkUrl) {
      router.push(linkUrl); // URLが指定されていれば遷移する
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column", // 縦方向にアイコンとテキストを配置
        alignItems: "center", // 横方向の中央揃え
        justifyContent: "center", // 縦方向の中央揃え
        gap: 1, // アイコンとテキストの間の隙間
        width: "100%", // Boxの幅を100%に設定
        marginTop: 2,
        cursor: linkUrl ? "pointer" : "default", // URLが指定されている場合はカーソルをポインターに
      }}
      onClick={handleClick} // クリックイベントを追加
    >
      <Box
        sx={{
          width: "4vw", // アイコンの幅
          height: "4vw", // アイコンの高さ
          borderRadius: "50%", // 円形にするためのスタイル
          overflow: "hidden", // 円形の枠から画像がはみ出ないようにする
          display: "flex", // 中央揃えに必要
          justifyContent: "center", // 水平方向の中央揃え
          alignItems: "center", // 垂直方向の中央揃え
          backgroundColor: "#444f7c", // 背景色を設定
          boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.2)", // 軽い影をつける
          margin: "0 auto",
          transition: "background-color 0.3s ease",
          "&:hover": {
            backgroundColor: "#5a6aa1",
          },
        }}
      >
        <img
          src={src}
          alt={alt}
          style={{
            width: "50%",
            height: "50%",
            objectFit: "cover",
          }}
        />
      </Box>
      {text && (
        <Typography
          variant="body2"
          sx={{
            textAlign: "center", // テキストを中央揃え
            marginTop: 1, // テキストとアイコンの間にマージンを設定
            marginBottom: 2,
            color: "#c0d7d2",
            fontWeight: 550,
            fontSize: "15px",
          }}
        >
          {text}
        </Typography>
      )}
    </Box>
  );
};

export default CircleIcon;
