import React from 'react';
import Backdrop from '@mui/material/Backdrop';
import { CircularProgress } from '@mui/material';

const BackdropEffect = ({isLoading=false, color="#ccc", message}) => {
    return (
        <Backdrop
            sx={{ color: color, zIndex: 11111, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
            open={isLoading}
        >
            <CircularProgress color="inherit" sx={{
                display: 'block',
                marginLeft: '50px'
            }} />
            <div style={{
                fontFamily: 'sans-serif',
                fontSize: '73px',
                marginLeft: '50px',
            }}>{message}</div>
        </Backdrop>
    );
}

export default BackdropEffect;
