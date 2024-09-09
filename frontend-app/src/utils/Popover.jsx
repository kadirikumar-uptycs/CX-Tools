import * as React from 'react';
import Popover from '@mui/material/Popover';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import IconButton from '@mui/joy/IconButton';

export default function BasicPopover({ onClick, children }) {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        onClick();
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <div>
            <IconButton color='primary' onClick={handleClick}>
                <ZoomOutMapIcon />
            </IconButton>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                {children}
            </Popover>
        </div>
    );
}