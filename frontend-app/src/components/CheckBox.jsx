import React, { useContext, useEffect, useRef } from "react";
import { ContextProvider } from "./MigrateFlagProfiles";
import './css/CheckBox.css';

export default function CheckBox({handleCheckboxClick, id}) {

    let { migrationList } = useContext(ContextProvider);
    const inputRef = useRef(null);

    useEffect(() => {
        if(migrationList.length === 0){
            setTimeout(() => {
                inputRef.current.checked = false;
            }, 700);
        }
    }, [migrationList]);

    return (
        <div className="checkbox-wrapper" style={{ margin: '0 11px' }}>
            <div className="cbx">
                <input ref={inputRef} id={id} type="checkbox" onClick={(event) => handleCheckboxClick(event)} className="flag-checkbox" />
                <label htmlFor={id}></label>
                <svg width="15" height="14" viewBox="0 0 15 14" fill="none">
                    <path d="M2 8.36364L6.23077 12L13 2"></path>
                </svg>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                <defs>
                    <filter id="goo-12">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur"></feGaussianBlur>
                        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -7" result="goo-12"></feColorMatrix>
                        <feBlend in="SourceGraphic" in2="goo-12"></feBlend>
                    </filter>
                </defs>
            </svg>
        </div>
    )
}