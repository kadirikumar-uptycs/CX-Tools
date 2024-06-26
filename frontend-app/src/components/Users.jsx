import React, { useEffect, useState } from "react";
import axios from 'axios';
import HomeLink from "./Home-Link";
import UsersPageSkeleton from "./usersPageSkeleton";
import AddUser from "./AddUser";
import './css/Users.css';
import config from "../config";

export default function Users() {
    let [users, setUsers] = useState([]);
    useEffect(() => {
        let callUsersAPI = async () => {
            const url = `${config.SERVER_BASE_ADDRESS}/users`;
            try {
                let response = await axios.get(url, { withCredentials: true });
                setUsers(response?.data);
            } catch (err) {
                console.log(err);
                if(err?.response?.data?.Authorized === false || err?.response?.status === 401){
                    window.location.href = '/login';
                }
                alert('Error while retrieving data');
            }
        }
        callUsersAPI();
    }, [])

    function usersTemplate(data) {
        return data.map(user => (
            <div className="profile-card" key={user?.email}>
                <div className="profile-header">
                    <h2 className="profile-name">{user?.name}</h2>
                    <div className="profile-role">{user?.role || 'User'}</div>
                </div>
                <div className="profile-body">
                    <p className="profile-email">{user?.email}</p>
                    <img className="profile-icon" src={user?.profile || ''} alt=""/>
                </div>
            </div>
        )
        )
    }
    return (
        <>
            <div className="header">
                <HomeLink />
                <AddUser/>
            </div>
            <div className="heading">Users</div>
            {
                users.length === 0 ? (<UsersPageSkeleton />) :
                    (<div className="profile-grid">
                        {usersTemplate(users)}
                    </div>
                    )
            }


        </>
    )
}