import React from 'react';
import Lottie from 'lottie-react';
import LottieFile from '../assets/images/Lottie/no_data.json';
import Typography from '@mui/joy/Typography';

const NoData = () => {
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
            <Typography component='h1' color='warning' fontSize={40} fontFamily='cursive' >No Data</Typography>
        </div>
    );
}

export default NoData;
