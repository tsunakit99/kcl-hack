// ErrorMessage.tsx
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Box, Typography } from "@mui/material";

interface ErrorMessageProps {
  title: string;
  description?: string;
}

const ErrorMessage = ({ title, description }: ErrorMessageProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "linear-gradient(45deg, #f5f5f5, #cfd8dc)",
        color: "#555",
      }}
    >
      <ErrorOutlineIcon sx={{ fontSize: 60, color: "#ff5722", mb: 2 }} />
      <Typography variant="h5" textAlign="center" sx={{ fontWeight: "bold" }}>
        {title}
      </Typography>
      {description && (
        <Typography variant="body1" textAlign="center" sx={{ mt: 1 }}>
          {description}
        </Typography>
      )}
    </Box>
  );
};

export default ErrorMessage;
