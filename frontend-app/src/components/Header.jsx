import React, { useEffect } from "react";
import NavBar from "./NavBar";
import UserProfile from "./UserProfile";

export default function Header() {

    const stickHeader = () => {
        let ele = document.getElementById('header');
        if(window.scrollY > 10){
            ele.classList.add('fixed--header');
        }else{
            ele.classList.remove('fixed--header');
        }
    }

    useEffect(() => {
        window.addEventListener('scroll', stickHeader);
        return () => window.removeEventListener('scroll', stickHeader);
    }, []);
    return (
        <div id="header" className="header--wrapper">
            <img src="images/uptycs-logo.png" width='70' className="uptycs--logo"/>
            <div className="row align-items-center">
                <NavBar />
                <UserProfile />
            </div>
        </div>
    );
}