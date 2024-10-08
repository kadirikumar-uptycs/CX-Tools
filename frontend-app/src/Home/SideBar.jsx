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
                        <UptycsTooltip title={!sideBarOpen && "Home Page"}
                        >
                            <li className="nav-link">
                                <Link to="/">
                                    <HomeOutlinedIcon className='mui--icon' />
                                    <span className="text nav-text">Home</span>
                                </Link>
                            </li>
                        </UptycsTooltip>
                        <UptycsTooltip title={!sideBarOpen && "Resource Migration"}>
                            <li className="nav-link">
                                <Link to="resourceMigrations">
                                    <CompareArrowsOutlinedIcon className='mui--icon' />
                                    <span className="text nav-text">Resource Migration</span>
                                </Link>
                            </li>
                        </UptycsTooltip>
                        <UptycsTooltip title={!sideBarOpen && "Resource Updation"}>
                            <li className="nav-link">
                                <Link to="resourceUpdations">
                                    <SyncOutlinedIcon className='mui--icon' />
                                    <span className="text nav-text">Resource Updation</span>
                                </Link>
                            </li>
                        </UptycsTooltip>
                        <UptycsTooltip title={!sideBarOpen && "Osquery Analysis"}>
                            <li className="nav-link">
                                <Link to="osqueryAnalysis">
                                    <InsertChartOutlinedIcon className='mui--icon' />
                                    <span className="text nav-text">Osquery Analysis</span>
                                </Link>
                            </li>
                        </UptycsTooltip>

                        <UptycsTooltip title={!sideBarOpen && "Uptycs API Token"}>
                            <li className="nav-link">
                                <Link to="tokenGenerator">
                                    <KeyOutlinedIcon className='mui--icon' />
                                    <span className="text nav-text">Uptycs API Token</span>
                                </Link>
                            </li>
                        </UptycsTooltip>
                        <UptycsTooltip title={!sideBarOpen && "Jira Zoho Integration"}
                        >
                            <li className="nav-link">
                                <Link to="/jirazoho">
                                    <IntegrationInstructionsRoundedIcon className='mui--icon' />
                                    <span className="text nav-text">Jira Zoho Integration</span>
                                </Link>
                            </li>
                        </UptycsTooltip>
                        <UptycsTooltip title={!sideBarOpen && "Users"}>
                            <li className="nav-link">
                                <Link to="users">
                                    <PeopleOutlinedIcon className='mui--icon' />
                                    <span className="text nav-text">Users</span>
                                </Link>
                            </li>
                        </UptycsTooltip>
                    </ul>
                </div>

                <div className="bottom-content">
                    <UptycsTooltip title={!sideBarOpen && "Logout"}>
                        <li className='logout-btn' onClick={() => setOpen(true)} style={{ cursor: 'pointer'}}>
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
