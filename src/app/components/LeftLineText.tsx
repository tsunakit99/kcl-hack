import { Typography } from "@mui/material";

const LeftLineText = ({ title }: { title: string }) => {
    return (
        <Typography
                    variant="h5"
                    color="#fff"
                    position="relative"
                    top="40px"
                    fontFamily="monospace"
                    sx={{
                        zIndex: 1,
                        padding: '0 10px',
                        position: 'relative',
                        '&::before': {
                            background: 'linear-gradient(45deg, #8e44ad, #3498db)',
                            content: '""',
                            display: 'block',
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            left: 0,
                            bottom: 0,
                            margin: 'auto',
                            transform: 'scale(0, 1)',
                            transformOrigin: 'right top',
                            transition: 'transform .3s',
                            zIndex: -1,
                        },
                        '&:hover': {
                            color: '#fff',
                            '&::before': {
                                transformOrigin: 'left top',
                                transform: 'scale(1, 1)',
                            },
                        },
                    }}
                >
                    {title}
                </Typography>
    )
}

export default LeftLineText;