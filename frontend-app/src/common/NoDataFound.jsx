import React from 'react';
import Lottie from 'lottie-react';
import LottieFile from '../assets/images/Lottie/no_data_found.json';

const NoDataFound = () => {
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
                    width: '80%',
                    height: '80%'
                }}
            />
        </div>
    );
}

export default NoDataFound;
