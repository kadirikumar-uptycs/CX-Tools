import React from 'react';
import Lottie from 'lottie-react';
import LottieFile from '../assets/images/Lottie/loading_2.json';
import Typography from '@mui/joy/Typography';
const Loading2 = () => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '70%'
        }}>
            <Lottie
                animationData={LottieFile}
                loop={true}
                autoplay={true}
                style={{
                    width: '30%',
                    height: '30%'
                }}
            />
            <Typography color='primary' component="h1" fontSize="29px" marginLeft="30px">Loading...</Typography>
        </div>
    );
}

export default Loading2;
