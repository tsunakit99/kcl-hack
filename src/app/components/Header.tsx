"use client";
import { AccountCircle, Menu as MenuIcon, Search as SearchIcon } from '@mui/icons-material';
import { AppBar, Box, IconButton, InputBase, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import { useSession } from "next-auth/react";
import { useState } from 'react';

export default function Header() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { data: session } = useSession();

    const isMenuOpen = Boolean(anchorEl);

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
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
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>My account</MenuItem>
        </Menu>
    );

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
          <Typography
            variant="h6"
            noWrap
            sx={{ display: "block" }}
          >
            過去問データベース
          </Typography>
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
            {session?.user?.name}
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
