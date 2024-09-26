import React from 'react';
import Button from '@mui/joy/Button';

const ButtonSolid = ({ text, onClick, icon, disabled, styles }) => {
    icon ??= <></>
    styles ??= {};
    return (
        <Button
            endDecorator={icon}
            disabled={disabled}
            onClick={onClick}
            sx={{
                ...styles,
                borderColor: 'var(--primary-color)',
                background: 'var(--primary-color)',
                color: 'var(--bg-color)',
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

export default ButtonSolid;
