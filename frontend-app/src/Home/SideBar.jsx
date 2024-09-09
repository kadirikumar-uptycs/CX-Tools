import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ChevronRightOutlined from '@mui/icons-material/ChevronRightOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import SyncAltOutlinedIcon from '@mui/icons-material/SyncAltOutlined';
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import UptycsTooltip from '../common/UptycsTooltip';
import logo from '../assets/images/image.png';
import './SideBar.css';

const SideBar = ({ onToggle }) => {

    const [sideBarOpen, setSideBarOpen] = useState(false);

    const handleToggle = () => {
        setSideBarOpen(value => !value);
        onToggle();
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
                                    <SendOutlinedIcon className='mui--icon' />
                                    <span className="text nav-text">Resource Migration</span>
                                </Link>
                            </li>
                        </UptycsTooltip>
                        <UptycsTooltip title={!sideBarOpen && "Resource Updation"}>
                            <li className="nav-link">
                                <Link to="resourceUpdations">
                                    <SyncAltOutlinedIcon className='mui--icon' />
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
                        <li className="">
                            <Link to="#">
                                <LogoutOutlinedIcon className='mui--icon' />
                                <span className="text nav-text">Logout</span>
                            </Link>
                        </li>
                    </UptycsTooltip>
                </div>
            </div>
        </nav>
    );
}

export default SideBar;
