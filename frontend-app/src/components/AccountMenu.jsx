import React, { useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import axios from 'axios';
import Backdrop from '@mui/material/Backdrop';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

export default function AccountMenu({ anchorElement, handleClose, userInfo }) {

    let [isLoading, setIsLoading] = useState(false);
    const open = Boolean(anchorElement);
    const navigate = useNavigate();

    async function handleLogOut() {
        setIsLoading(true);
        let url = 'http://localhost:17291/destroySession';
        try {
            await axios.post(url);
            setTimeout(() => {
                setIsLoading(false);
                navigate('/login');
            }, 2000);
        } catch (err) {
            console.log(err);
        }
    }


    return (
        <React.Fragment>
            <Menu
                anchorEl={anchorElement}
                id="account-menu"
                open={open}
                onClose={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
                PaperProps={{
                    style: {
                        background: '#333',
                        color: '#ccc'
                    }
                }}
            >
                <MenuItem>
                    <AccountBoxIcon /> &nbsp;{userInfo.name}
                </MenuItem>
                <MenuItem>
                    <AlternateEmailIcon /> &nbsp;{userInfo.email}
                </MenuItem>
                <Divider sx={{
                    border: '2px solid #54a0e2',

                }}
                    variant='middle'
                />
                <MenuItem>
                    <ListItemIcon >
                        <Settings fontSize="small" sx={{
                            color: '#ccc'
                        }}
                        />
                    </ListItemIcon >
                    Settings
                </MenuItem>
                <MenuItem onClick={handleLogOut}>
                    <ListItemIcon>
                        <Logout fontSize="small" sx={{
                            color: '#ccc'
                        }} />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>
            <Backdrop
                sx={{ color: '#3498db', zIndex: 11111, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                open={isLoading}
            >
                <CircularProgress color="inherit" sx={{
                    display: 'block',
                    marginLeft: '50px'
                }}/>
                <div style={{
                    fontFamily: 'sans-serif',
                    fontSize: '73px',
                    marginLeft: '50px',
                }}>Logging out</div>
            </Backdrop>
        </React.Fragment>
    );
}
