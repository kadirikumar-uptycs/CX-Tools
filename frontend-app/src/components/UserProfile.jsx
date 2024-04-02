import React, { useEffect, useState } from "react";
import axios from "axios";
import { redirect } from "react-router-dom";
import AccountMenu from "./AccountMenu";
import { Tooltip } from "@mui/material";


export default function UserProfile() {
    let [userInfo, setUserInfo] = useState({ 'name': '', 'email': '', 'picture': '' });
    const [anchorEl, setAnchorEl] = React.useState(null);
    useEffect(() => {
        async function fetchData() {
            try {
                let response = await axios.get(`${process.env.SERVER_BASE_ADDRESS}/userInfo`);
                if (response.status === 200) {
                    setUserInfo(response.data);
                } else {
                    throw redirect('/login');
                }
            } catch (err) {
                throw redirect('/login');
            }
        }

        fetchData();

    }, []);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    }

    return (
        <div className="col-md-3 d-flex align-items-center justify-content-end">
            <div className="profile-section d-flex justify-content-end align-items-center">
                <span className="lead mx-3">{userInfo.name}</span>
                <Tooltip title="Account Settings">
                    <img
                        src={userInfo.picture}
                        alt="User Profile"
                        className="img-fluid rounded-circle"
                        onClick={handleClick}
                        referrerPolicy="no-referrer"
                    />
                </Tooltip>

                <AccountMenu anchorElement={anchorEl} handleClose={handleClose} userInfo={userInfo} />
            </div>
        </div>
    );
}
