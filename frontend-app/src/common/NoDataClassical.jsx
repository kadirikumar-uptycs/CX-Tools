import React from 'react';
import Lottie from 'lottie-react';
import LottieFile from '../assets/images/Lottie/NoData_classical.json';

const NoDataClassical = () => {
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

export default NoDataClassical;