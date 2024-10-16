"use client";
import { AccountCircle, Menu as MenuIcon, Search as SearchIcon } from '@mui/icons-material';
import { AppBar, Box, IconButton, InputBase, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import { useSession } from "next-auth/react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={menuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
            {/* <MenuItem onClick={handleMenuClose}>My account</MenuItem> */}
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
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            sx={{
              marginRight: 2,
              marginLeft: 2
            }}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
          <Link href="/" passHref style={{textDecoration: 'none', color: 'inherit'}}>
          <Typography
            variant="h6"
            noWrap
            sx={{ display: "block", cursor: "pointer" }}
          >
            過去問データベース
            </Typography>
            </Link>
          <Box
            sx={{
              position: "relative",
              borderRadius: 1,
              backgroundColor: "rgba(255,255,255,0.15)",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.25)",
              },
              marginLeft: 3,
              marginRight: 2,
              width: "auto",
            }}
          >
            <Box
              sx={{
                padding: "0 16px",
                height: "100%",
                position: "absolute",
                pointerEvents: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SearchIcon />
            </Box>
            <InputBase
              placeholder="Search…"
              sx={{
                color: "inherit",
                paddingLeft: `calc(1em + 32px)`,
                transition: "width 0.2s",
                width: "20ch",
              }}
            />
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Typography>
            {name || "Guest"} {/* APIから取得したユーザー名を表示。なければ"Guest"を表示 */}
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
};
