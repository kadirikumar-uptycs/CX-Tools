import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import ChevronRightOutlined from '@mui/icons-material/ChevronRightOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import CompareArrowsOutlinedIcon from '@mui/icons-material/CompareArrowsOutlined';
import SyncOutlinedIcon from '@mui/icons-material/SyncOutlined';
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import IntegrationInstructionsRoundedIcon from '@mui/icons-material/IntegrationInstructionsRounded';
import BackupOutlinedIcon from '@mui/icons-material/BackupOutlined';
import UptycsTooltip from '../common/UptycsTooltip';
import logo from '../assets/images/image.png';
import { logout } from '../store/authSlice';
import { useSnackbar } from '../hooks/SnackBarProvider';
import ConfirmationSnackBar from '../common/ConfirmationSnackBar';
import axios from 'axios';
import config from '../config';
import './SideBar.css';


const SideBar = ({ onToggle }) => {

    const [sideBarOpen, setSideBarOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const openSnackBar = useSnackbar();
    const dispatch = useDispatch();

    const pages = [
        {
            name: 'Home',
            link: '/',
            icon: HomeOutlinedIcon,
            tooltip: 'Home Page'
        },
        {
            name: 'Resource Migration',
            link: 'resourceMigrations',
            icon: CompareArrowsOutlinedIcon,
            tooltip: 'Resource Migration'
        },
        {
            name: 'Resource Updation',
            link: 'resourceUpdations',
            icon: SyncOutlinedIcon,
            tooltip: 'Resource Updation'
        },
        {
            name: 'Osquery Analysis',
            link: 'osqueryAnalysis',
            icon: InsertChartOutlinedIcon,
            tooltip: 'Osquery Analysis'
        },
        {
            name: 'Uptycs API Token',
            link: 'tokenGenerator',
            icon: KeyOutlinedIcon,
            tooltip: 'Uptycs API Token'
        },
        {
            name: 'Jira Zoho Integration',
            link: '/jirazoho',
            icon: IntegrationInstructionsRoundedIcon,
            tooltip: 'Jira Zoho Integration'
        },
        {
            name: 'Tenant Backup',
            link: '/tenantBackup',
            icon: BackupOutlinedIcon,
            tooltip: 'Tenant Backup',
        },
        {
            name: 'Users',
            link: 'users',
            icon: PeopleOutlinedIcon,
            tooltip: 'Users'
        }
    ];


    const handleToggle = () => {
        setSideBarOpen(value => !value);
        onToggle();
    }

    const onLogoutResponse = async (wantLogout) => {
        setOpen(false);
        if (!wantLogout)
            return
        openSnackBar('Logging Out...');
        try {
            await axios.delete(`${config.SERVER_BASE_ADDRESS}/auth/logout`, { withCredentials: true });
            openSnackBar('Logged Out Successfully!', 'success');
            dispatch(logout());
            window.location.href = '/login';
        } catch (err) {
            console.log(err);
            openSnackBar('Error occurred while Logging Out, please try again', 'danger');
        }
    }

    return (
        <nav className={`sidebar ${sideBarOpen ? '' : 'close'}`}>
            <header>
                <div className="image-text">
                    <Link to='/' style={{
                        textDecoration: 'none'
                    }}>
                        <span className="image">
                            <img className="image" src={logo} alt='' />
                        </span>
                    </Link>
                    <div className="text logo-text">
                        <span className="name">CX Tools</span>
                        <span className="company">Uptycs</span>
                    </div>
                </div>
                <ChevronRightOutlined className='toggle' onClick={handleToggle} />
            </header>
            <div className="menu-bar">
                <div className="menu">
                    <ul className="menu-links">
                        {pages.map((page, index) => (
                            <UptycsTooltip key={index} title={!sideBarOpen && page.tooltip}>
                                <li className="nav-link">
                                    <Link to={page.link}>
                                        <page.icon className='mui--icon' />
                                        <span className="text nav-text">{page.name}</span>
                                    </Link>
                                </li>
                            </UptycsTooltip>
                        ))}
                    </ul>
                </div>

                <div className="bottom-content">
                    <UptycsTooltip title={!sideBarOpen && "Logout"}>
                        <li className='logout-btn' onClick={() => setOpen(true)} style={{ cursor: 'pointer' }}>
                            <LogoutOutlinedIcon className='mui--icon' />
                            <span className="text nav-text">Logout</span>
                        </li>
                    </UptycsTooltip>
                </div>
            </div>

            <ConfirmationSnackBar
                open={open}
                onClose={() => setOpen(false)}
                message='Do you want to Log out?'
                onResponse={onLogoutResponse}
            />
        </nav>
    );
}

export default SideBar;
