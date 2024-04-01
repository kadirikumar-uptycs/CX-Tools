import React from "react";
import Header from "./Header";
import Intro from "./Intro";
import ToolCards from "./ToolCards";
import "./css/HomePage.css";


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