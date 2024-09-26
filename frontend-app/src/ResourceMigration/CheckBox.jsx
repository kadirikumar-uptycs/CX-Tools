import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { pushMigrationResourceId, popMigrationResourceId } from '../store/migrationSlice';
import './CheckBox.css';


export default function CheckBox({ id }) {

    const { migrationResourceIds, migrating } = useSelector(state => state?.migration) || {};
    const [isChecked, setIsChecked] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        if (isChecked && migrating && Array.isArray(migrationResourceIds) && migrationResourceIds.includes(id)) {
            setIsChecked(false);
        }
    }, [isChecked, migrating, migrationResourceIds, id]);

    const handleChange = (event) => {
        setIsChecked(prevChecked => !prevChecked);
        if (event?.target?.checked) dispatch(pushMigrationResourceId(id));
        else dispatch(popMigrationResourceId(id));
    };


    return (
        <div className="checkbox-wrapper" style={{ margin: '0 11px' }}>
            <div className="cbx">
                <input id={id} checked={isChecked} type="checkbox" onChange={handleChange} />
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