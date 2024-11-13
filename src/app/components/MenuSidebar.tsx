"use client";
import { Box } from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import React from "react";
import CircleIcon from "./CircleIcon"; // CircleIconコンポーネントのインポート

const MenuSidebar: React.FC = () => {
  const { data: session } = useSession();

  const handleProfileClick = () => {
    const userId = session?.user?.id;
    if (userId) {
      return `/profile/${userId}`;
    }
  };

  const handleLogOut = () => {
    signOut();
  };

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
        height: "100%",
        transition: "height 0.5s ease",
        overflow: "hidden",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <CircleIcon
          src="/icon/search-icon2.png"
          alt="Search-icon"
          text="検索"
          linkUrl="/"
          fontSize="12px"
        />
        <CircleIcon
          src="/icon/post.png"
          alt="post"
          text="投稿"
          linkUrl="/exam/upload"
          fontSize="12px"
        />
        <CircleIcon
          src="/icon/person.png"
          alt="Person"
          text="プロフィール"
          linkUrl={handleProfileClick()}
          fontSize="10px"
        />
        <Box onClick={handleLogOut}>
          <CircleIcon
            src="/icon/logout.png"
            alt="Logout"
            text="ログアウト"
            fontSize="10px"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default MenuSidebar;
