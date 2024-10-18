import { Box, Container, Divider, Typography } from "@mui/material";
import UploadExamForm from "./_components/UploadExamForm";

const UploadExam = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: "30px",
        alignItems: "center",
        height: "100%",
        width: "60%",
        backgroundColor: "#c0d7d2",
        borderRadius: "20px",
        margin: "20px auto",
      }}
    >
      <Typography
        variant="h2"
        align="center"
        sx={{ color: "#444f7c", fontWeight: 550 }}
      >
        過去問投稿
      </Typography>
      <Divider
        textAlign="center"
        flexItem
        sx={{
          margin: "30px",
          color: "#444f7c",
        }}
      >
        以下に過去問情報を入力してください
      </Divider>
      <Container
        maxWidth="md"
        sx={{
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.7)",
          padding: "50px",
          backgroundColor: "white",
        }}
      >
        <UploadExamForm />
      </Container>
    </Box>
  );
};

export default UploadExam;
