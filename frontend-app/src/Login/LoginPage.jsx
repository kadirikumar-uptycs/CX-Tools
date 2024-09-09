import React, { useEffect } from 'react';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import Lottie from 'lottie-react';
import LottieFile from '../assets/images/Lottie/robo.json';
import GoogleIcon from './google.svg';
import config from '../config';
import './Login.css';

const LoginPage = () => {
    function handleSignIn() {
        window.open(`${config.SERVER_BASE_ADDRESS}/auth/google`, '_self')
    }
    useEffect(() => {
        document.title = 'Login';
    }, []);
    return (
        <div className='page'>
            <Lottie
                animationData={LottieFile}
                loop={true}
                autoplay={true}
                className='robo'
            />
            <Sheet
                variant="outlined"
                className='sheet'
                sx={{ boxShadow: 'sm', borderRadius: 'sm' }}
            >
                <Typography className='tool-name'>CX Tools </Typography>
                <Typography className='tool-name'>Uptycs</Typography>
                <Button className='sign-in-btn' onClick={handleSignIn}>
                    <img
                        src={GoogleIcon}
                        alt=""
                        className='google-icon'
                    />
                    <Typography className='signin-text'>Sign in with Google</Typography>
                </Button>
            </Sheet>
        </div>
    );
}

export default LoginPage;
