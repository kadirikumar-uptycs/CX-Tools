import React, { useEffect } from 'react';
import { Box, Button, Typography, CircularProgress, Fade } from '@mui/material';
import { GitHub as GitHubIcon, CheckCircle as CheckIcon, Error as ErrorIcon } from '@mui/icons-material';
import { keyframes } from '@mui/system';
import { useGitHubAuth } from '../hooks/useGitHubAuth';

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const GitHubAuthButton = ({ onSuccess, setUser }) => {
    const { handleAuth, isAuthenticating, authStatus, isValidatingAccess, user } = useGitHubAuth(onSuccess);

    useEffect(() => {
        if (user) {
            setUser(user);
        }
    }, [user, setUser]);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
                py: 4
            }}
        >
            <Typography
                variant="h5"
                sx={{
                    fontWeight: 600,
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    backgroundClip: 'text',
                    textFillColor: 'transparent',
                    mb: 2
                }}
            >
                Connect Your GitHub Account
            </Typography>

            <Button
                variant="contained"
                size="large"
                startIcon={
                    isAuthenticating ? (
                        <CircularProgress size={20} color="inherit" />
                    ) : (
                        <GitHubIcon />
                    )
                }
                onClick={handleAuth}
                disabled={isAuthenticating}
                sx={{
                    minWidth: 250,
                    height: 48,
                    background: 'linear-gradient(45deg, #24292e 30%, #404448 90%)',
                    color: 'white !important',
                    boxShadow: '0 3px 5px 2px rgba(36, 41, 46, .3)',
                    transition: 'all 0.3s ease-in-out',
                    '&:not(:disabled):hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 10px 4px rgba(36, 41, 46, .2)',
                    },
                    animation: isAuthenticating ? 'none' : `${pulse} 2s infinite`
                }}
            >
                {isAuthenticating ? 'Connecting...' : 'Connect with GitHub'}
            </Button>

            {
                isValidatingAccess && <Box color={"orange"}>Validating Access...</Box>
            }

            <Fade in={authStatus !== null} timeout={500}>
                <Box
                    sx={{
                        display: authStatus ? 'flex' : 'none',
                        alignItems: 'center',
                        gap: 1,
                        mt: 2,
                        color: authStatus === 'success' ? 'success.main' : 'error.main'
                    }}
                >
                    {authStatus === 'success' ? (
                        <>
                            <CheckIcon color="inherit" />
                            <Typography>Successfully connected!</Typography>
                        </>
                    ) : (
                        <>
                            <ErrorIcon color="inherit" />
                            <Typography>Connection failed. Please try again.</Typography>
                        </>
                    )}
                </Box>
            </Fade>
        </Box>
    );
};

export default GitHubAuthButton;