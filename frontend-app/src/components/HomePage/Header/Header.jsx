import React, { useEffect } from "react";
import NavBar from "../NavBar/NavBar";
import UserProfile from "./UserProfile";
import uptycsLogo from '../../../assets/images/uptycs-logo.png';

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
            <img src={uptycsLogo} width='70' className="uptycs--logo" alt=""/>
            <div className="row align-items-center">
                <NavBar />
                <UserProfile />
            </div>
        </div>
    );
}