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
import { useNavigate } from 'react-router-dom';
import BackdropEffect from '../../utils/BackdropEffect';
import config from '../../../config';


export default function AccountMenu({ anchorElement, handleClose, userInfo }) {

    let [isLoading, setIsLoading] = useState(false);
    const open = Boolean(anchorElement);
    const navigate = useNavigate();

    async function handleLogOut() {
        setIsLoading(true);
        let url = `${config.SERVER_BASE_ADDRESS}/destroySession`;
        try {
            await axios.post(url, { withCredentials: true });
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
                        background: '#171e4bb3',
                        color: '#ffffffb3'
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
            <BackdropEffect isLoading={isLoading} color='#F3F3F3' message='Loggging out' />
        </React.Fragment>
    );
}
