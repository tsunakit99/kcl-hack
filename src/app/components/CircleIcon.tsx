// src/components/CircleIcon.tsx
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

// コンポーネントのプロパティの型定義
interface CircleIconProps {
  src: string; // 画像のパス
  alt?: string; // 画像の代替テキスト
  text?: string; // 表示するテキスト
  linkUrl?: string; // 遷移先のURL
  fontSize: string;
}

const CircleIcon: React.FC<CircleIconProps> = ({
  src,
  alt = "icon",
  text = "",
  linkUrl = "", // URLのデフォルトを空文字に設定
  fontSize = "12px",
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
        cursor: "pointer",
      }}
      onClick={handleClick} // クリックイベントを追加
    >
      <Box
        sx={{
          width: "3.5vw", // アイコンの幅
          height: "3.5vw", // アイコンの高さ
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
        <Image
          src={src}
          alt={alt}
          width={500} // 必須のwidthを指定 (任意の値)
          height={500} // 必須のheightを指定 (任意の値)
          style={{
            width: "50%", // スタイルとして幅を50%に
            height: "50%", // スタイルとして高さを50%に
            objectFit: "cover",
          }}
        />
      </Box>
      {text && (
        <Typography
          sx={{
            textAlign: "center", // テキストを中央揃え
            marginTop: 1, // テキストとアイコンの間にマージンを設定
            color: "#c0d7d2",
            fontWeight: 550,
            fontSize: { fontSize },
          }}
        >
          {text}
        </Typography>
      )}
    </Box>
  );
};

export default CircleIcon;
