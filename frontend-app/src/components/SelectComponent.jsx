import React from 'react';
import { useSearchParams } from 'react-router-dom';
import './css/SelectComponent.css';

export default function SelectComponent() {

    const [resource, setResource] = React.useState('');
    let [searchParams, setSearchParams] = useSearchParams();

    const handleChange = (event) => {
        setResource(event.target.value);
        setSearchParams({'resource' : event.target.value});
    };

    return (
        <select name="Resource Type" onChange={handleChange} value={resource} id="select-element">
            <option value="flagProfiles">Flag Profiles</option>
            <option value="exceptions">Exceptions</option>
            <option value="alertRules">Alerts</option>
        </select>
    )
}