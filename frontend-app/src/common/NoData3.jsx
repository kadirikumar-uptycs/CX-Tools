import React from 'react';
import Lottie from 'lottie-react';
import LottieFile from '../assets/images/Lottie/no_data_3.json';

const NoData3 = () => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <Lottie
                animationData={LottieFile}
                loop={true}
                autoplay={true}
                style={{
                    width: '500px',
                    height: '400px'
                }}
            />
        </div>
    );
}

export default NoData3;