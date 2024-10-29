"use client";
import { Box, Button } from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import CircleIcon from "./CircleIcon"; // CircleIconコンポーネントのインポート

const MenuSidebar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const {data: session } = useSession();

  // 初回レンダー時にローカルストレージからメニュー状態を読み取る
  useEffect(() => {
    const storedMenuState = localStorage.getItem("menuOpenState");
    if (storedMenuState) {
      setIsMenuOpen(storedMenuState === "true");
    }
  }, []);

  // メニュー状態の変更時にローカルストレージに保存する
  const toggleMenu = () => {
    const newMenuState = !isMenuOpen;
    setIsMenuOpen(newMenuState);
    localStorage.setItem("menuOpenState", newMenuState.toString()); // ローカルストレージに状態を保存
  };

   const handleProfileClick = () => {
    const userId = session?.user?.id;
    if (userId) {
      return `/profile/${userId}`;
    }
   };
  
  const handleLogOut = () => {
    signOut();
  }

  if (!session) return null;
  return (
    <Box
      sx={{
        width: "5%",
        top: 0,
        left: 0,
        position: "fixed",
        alignItems: "center",
        flexDirection: "column",
        backgroundColor: "#444f7c",
        padding: "10px",
        borderRadius: 0,
        zIndex: 1000,
        height: isMenuOpen ? "100%" : "12%",
        transition: "height 0.5s ease",
        overflow: "hidden",
      }}
    >
      <Button
        onClick={toggleMenu}
        sx={{
          display: "flex",
          textAlign: "center",
          justifyContent: "center",
          alignItems: "center",
          color: "#fff",
          marginBottom: 3,
          zIndex: 1001,
        }}
      >
        <Box
          sx={{
            width: "4vw",
            height: "4vw",
            borderRadius: 2,
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#c0d7d2",
            boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.2)",
            transition: "background-color 0.3s ease",
            "&:hover": {
              backgroundColor: "#5a6aa1",
            },
          }}
        >
          <Image
            src="/icon/menu.png"
            alt="menu"
            width={500}
            height={500}
            style={{
              width: "50%",
              height: "50%",
              objectFit: "cover",
            }}
          />
        </Box>
      </Button>

      {/* メニュー項目 */}
      {isMenuOpen && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <CircleIcon
            src="/icon/search-icon2.png"
            alt="Search-icon"
            text="検索"
            linkUrl="/"
          />
          <CircleIcon
            src="/icon/post.png"
            alt="post"
            text="投稿"
            linkUrl="/exam/upload"
          />
          {/* <CircleIcon
            src="/icon/note.png"
            alt="Note"
            text="Moodle"
            linkUrl="https://ict-i.el.kyutech.ac.jp/login/index.php"
          /> */}
            <CircleIcon
              src="/icon/person.png"
              alt="Person"
              text="プロフィール"
              linkUrl={handleProfileClick()}
            />
          <Box onClick={handleLogOut}>
            <CircleIcon
              src="/icon/logout.png"
              alt="Logout"
              text="ログアウト"
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default MenuSidebar;
