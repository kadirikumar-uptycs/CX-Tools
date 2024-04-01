import React from 'react';
import ReplyAllIcon from '@mui/icons-material/ReplyAll';
import './css/Home-Link.css';
const HomeLink = () => {
    return (
        <div>
            <a href="/" className="home-link">
                <ReplyAllIcon /> Home
            </a>
        </div>
    );
}

export default HomeLink;
