import React from 'react';
import Lottie from 'lottie-react';
import LottieFile from '../assets/images/Lottie/no_data_2.json';

const NoData2 = () => {
    return (
        <div style={{
            display: 'flex',
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
                    width: '100%',
                    height: '100%'
                }}
            />
        </div>
    );
}

export default NoData2;