import React, { useEffect } from 'react';
import Lottie from 'lottie-react';
import LottieFile from '../assets/images/Lottie/page_not_found.json';
import { useSnackbar } from '../hooks/SnackBarProvider';
const PageNotFound = () => {
    const openSnackbar = useSnackbar();
    useEffect(() => {
        openSnackbar('Requested Page Not Found', 'warning')
        // eslint-disable-next-line
    }, [])
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            marginLeft: '30px'
        }}>
            <Lottie
                animationData={LottieFile}
                loop={true}
                autoplay={true}
                style={{
                    width: '85%',
                    height: '100%'
                }}
            />
        </div>
    );
}

export default PageNotFound;
