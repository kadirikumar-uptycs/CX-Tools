import React from "react";
import fireVideo from '../../../assets/images/backgroundVideo.mp4';
export default function Intro() {
    return (
        <div id="home">
            <div className="video--wrapper">
                <video src={fireVideo} className="intro--video" loop autoPlay playsInline muted></video>
            </div>
            <div className="intro-text--wrapper">
                <div className="intro-text-div">
                    <h1 className="intro-heading">CX Tools</h1>
                    <h4 className="intro-description">
                    provides all the automation tools needed <br/>
                    for cx team for onboarding customers <br/> and analysing uptycs data.
                    </h4>
                </div>
            </div>
        </div>

    )
}