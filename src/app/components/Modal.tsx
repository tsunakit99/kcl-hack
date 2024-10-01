import { Box, Modal as MuiModal } from "@mui/material";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal = ({ open, onClose, children }: ModalProps) => {
    return (
        <MuiModal open={open} onClose={onClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'white',
                padding: 4,
                borderRadius: "16px",
                boxShadow: 24,
                width: "100%",  // 幅を100%に設定
                maxWidth: 400,  // 最大幅を400pxに設定
                overflow: 'hidden',
                outline: 'none',
            }}>
                {children}
            </Box>
        </MuiModal>
    );
};

export default Modal;