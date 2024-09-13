import React from 'react';
import Lottie from 'lottie-react';
import LottieFile from '../assets/images/Lottie/WorkInProgress.json';
import Typography from '@mui/joy/Typography';

const WorkInProgress = () => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column'
        }}>
            <Lottie
                animationData={LottieFile}
                loop={true}
                autoplay={true}
                style={{
                    width: '400px',
                    height: '300px'
                }}
            />
            <Typography component='h1' color='primary' fontSize={40} fontFamily='cursive' >Feature In Progress</Typography>
        </div>
    );
}

export default WorkInProgress;