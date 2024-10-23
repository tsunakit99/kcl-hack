"use client";
import { AccountCircle } from "@mui/icons-material";
import {
  AppBar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import HoverLink from "./HoverLink";

import PostAddIcon from "@mui/icons-material/PostAdd";
import HoverIconLink from "./HoverIconLink";

export default function Header() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [name, setName] = useState<string | null>(null);
  const { data: session } = useSession();
  const router = useRouter();

  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    const userId = session?.user?.id;
    if (userId) {
      router.push(`/profile/${userId}`); // ユーザーのプロフィールページに遷移
    }
    handleMenuClose(); // メニューを閉じる
  };

  const handleLogOut = () => {
    signOut();
    handleMenuClose();
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
      <MenuItem onClick={handleLogOut}>LogOut</MenuItem>
    </Menu>
  );

  // APIから最新のユーザー情報を取得する関数
  const fetchUpdatedUser = async () => {
    if (!session?.user?.id) return; // ユーザーがログインしていない場合、何もしない
    try {
      const response = await fetch(`/api/users/${session.user.id}`);
      const data = await response.json();
      setName(data.name);
    } catch (error) {
      console.error("ユーザー情報の取得に失敗しました", error);
    }
  };

  // コンポーネントがマウントされた時、もしくはセッションが変更された時にAPIを呼び出す
  useEffect(() => {
    if (session?.user?.id) {
      fetchUpdatedUser(); // APIを呼び出してユーザー名を取得
    }
  }, [session]);

  if (!session) return null; // ログインしていない場合は表示しない
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ height: "90px" }}>
        <Toolbar style={{ backgroundColor: "#444f7c" }}>
          {/* <IconButton
              edge="start"
              sx={{
                marginRight: 2,
                marginLeft: 2,
              }}
              color="inherit"
            >
              <MenuIcon />
            </IconButton> */}
          <Link
            href="/"
            passHref
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Typography
              variant="h6"
              noWrap
              sx={{
                display: "block",
                cursor: "pointer",
                fontSize: "25px",
                padding: "30px",
              }}
            >
              過去問データベース
            </Typography>
          </Link>
          <HoverLink href="/" text="検索" underlineColor="#ffffff" />
          <HoverIconLink
            href="/exam/upload"
            icon={PostAddIcon}
            underlineColor="#ffffff"
          ></HoverIconLink>
          <HoverLink href="/" text="修正・削除" underlineColor="#ffffff" />

          <Box sx={{ flexGrow: 1 }} />
          <Typography sx={{ fontSize: "25px" }}>
            {name || "Guest"}{" "}
            {/* APIから取得したユーザー名を表示。なければ"Guest"を表示 */}
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleProfileMenuOpen}
            sx={{ marginRight: 2 }}
          >
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>
      {renderMenu}
    </Box>
  );
}
