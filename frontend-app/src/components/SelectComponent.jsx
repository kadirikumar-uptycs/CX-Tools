import React, { useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ContextProvider } from './MigrateResources';
import './css/SelectComponent.css';


export default function SelectComponent() {

    let { setState } = useContext(ContextProvider);
    let [searchParams, setSearchParams] = useSearchParams();
    let resourceValue = searchParams.get('resource');

    if (!(['flagProfiles', 'exceptions', 'alertRules'].includes(resourceValue))) {
        resourceValue = 'flagProfiles';
    }

    const handleChange = (event) => {
        setState(prev => ({
            ...prev,
            sourceResources: [],
            targetResources: [],
            migrationList: [],
        }))
        setSearchParams({ resource: event.target.value });
    };

    return (
        <select name="Resource Type" onChange={handleChange} value={resourceValue} id="select-element">
            <option value="flagProfiles">Flag Profiles</option>
            <option value="exceptions">Exceptions</option>
            <option value="alertRules">Alerts</option>
        </select>
    )
}