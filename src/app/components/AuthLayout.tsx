import { Box, Container, Typography } from "@mui/material";
import React from "react";

const AuthLayout = ({
  title,
  children1,
  children2,
}: {
  title: string;
  children1: React.ReactNode;
  children2: React.ReactNode;
}) => {
  return (
    <Box
      sx={{
        background: "linear-gradient(45deg, #c0d7d2, #444f7c)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px",
      }}
    >
      <Typography
        variant="h1"
        color="white"
        sx={{
          position: "relative",
          top: 0,
          fontFamily: "Monospace",
          paddingBottom: "5px",
          "&::before": {
            background: "#fff",
            content: '""',
            width: "100%",
            height: "5px",
            position: "absolute",
            left: 0,
            bottom: 0,
            margin: "auto",
            transformOrigin: "right top",
            transform: "scale(0, 1)",
            transition: "transform .3s",
          },
          "&:hover::before": {
            transformOrigin: "center top",
            transform: "scale(1, 1)",
          },
        }}
      >
        {title}
      </Typography>
      <Container
        maxWidth="xs"
        sx={{
          borderRadius: 0,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.7)",
          padding: "16px",
          backgroundColor: "white",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            mt: 8,
          }}
        >
          {children1}
        </Box>
      </Container>
      {children2}
    </Box>
  );
};

export default AuthLayout;
