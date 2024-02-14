import React from 'react';
import { useSearchParams } from 'react-router-dom';
import './css/SelectComponent.css';

export default function SelectComponent() {

    let [searchParams, setSearchParams] = useSearchParams();
    let resourceValue = searchParams.get('resource');

    if(!(['flagProfiles', 'exceptions', 'alertRules'].includes(resourceValue))){
        resourceValue = 'flagProfiles';
    }

    const handleChange = (event) => {
        setSearchParams({resource : event.target.value});
    };

    return (
        <select name="Resource Type" onChange={handleChange} value={resourceValue} id="select-element">
            <option value="flagProfiles">Flag Profiles</option>
            <option value="exceptions">Exceptions</option>
            <option value="alertRules">Alerts</option>
        </select>
    )
}