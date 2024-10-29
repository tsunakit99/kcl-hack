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
        minHeight: "85vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px",
      }}
    >
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
