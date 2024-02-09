import React from "react";
import NavBar from "./NavBar";
import UserProfile from "./UserProfile";

export default function Header() {
    return (
        <div className="container-fluid header--wrapper">
            <div className="row align-items-center">
                <NavBar />
                <UserProfile/>
            </div>
        </div>
    );
}