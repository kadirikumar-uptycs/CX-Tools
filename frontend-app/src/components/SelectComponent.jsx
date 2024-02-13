import React from 'react';
import './css/SelectComponent.css';

export default function SelectComponent() {

    const [resource, setResource] = React.useState('');

    const handleChange = (event) => {
        setResource(event.target.value);
    };

    return (
        <select name="Resource Type" onChange={handleChange} value={resource} id="select-element">
            <option value="Flag Profiles">Flag Profiles</option>
            <option value="Exceptions">Exceptions</option>
            <option value="Alerts">Alerts</option>
        </select>
    )
}