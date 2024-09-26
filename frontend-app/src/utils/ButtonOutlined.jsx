import React from 'react';
import Button from '@mui/joy/Button';


const ButtonOutlined = ({ text, loading, onClick, icon, disabled, styles }) => {
    icon ??= <></>
    styles ??= {};
    return (
        <Button
            disabled={disabled}
            loading={loading}
            onClick={onClick}
            startDecorator={icon}
            size="lg"
            variant="outlined"
            sx={{
                ...styles,
                color: 'var(--primary-color)',
                borderColor: 'var(--primary-color)',
                transition: '0.3s background ease-out, 0.3s color ease-out',
                '&:hover': {
                    background: 'var(--primary-color)',
                    color: 'var(--bg-color)',
                    boxShadow: '0 0 5px var(--primary-color)'
                },
                '&:active': {
                    boxShadow: '0 0 15px var(--text-color)',
                    background: 'var(--primary-color)',
                    color: 'var(--bg-color)',
                    transform: 'scale(0.95)',
                }
            }}
        >
            {text}
        </Button>
    );
}

export default ButtonOutlined;
