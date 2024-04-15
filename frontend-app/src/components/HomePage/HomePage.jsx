import React from "react";
import Header from "./Header/Header";
import Intro from "./Hero/Intro";
import ToolCards from "./Hero/ToolCards";
import "./HomePage.css";


export default function HomePage() {
    return (
        <>
            <div className="homepage--wrapper">
                <Header />
                <Intro />
                <ToolCards />
            </div>
        </>
    )
}