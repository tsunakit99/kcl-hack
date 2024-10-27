import { CircularProgress } from "@mui/material";

const LoadingIndicator = () => {
    return (
        <CircularProgress
            size={24}
            sx={{ color: "white", }}
        />
    );
};

export default LoadingIndicator;