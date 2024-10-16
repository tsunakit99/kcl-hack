"use client";

import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import { signOut, useSession } from "next-auth/react";

const Header = () => {
    const { data: session } = useSession();

  if (!session) return null; // ログインしていない場合は表示しない
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    ログイン後の画面
                </Typography>
                <Button color="inherit" onClick={() => signOut()}>
                    ログアウト
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default Header;