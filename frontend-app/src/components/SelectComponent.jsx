import React, { useContext, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ContextProvider } from './MigrateResources';
import './css/SelectComponent.css';
import resourcesList from '../resourcesList';


export default function SelectComponent() {

    let { setState } = useContext(ContextProvider);
    let [searchParams, setSearchParams] = useSearchParams();
    let resourceValue = searchParams.get('resource');
    let resources = resourcesList;

    if (!(resources.some(obj => obj.endpoint))) {
        resourceValue = 'flagProfiles';
    }

    const handleChange = (event) => {
        setSearchParams({ resource: event?.target?.value });
        setState(prev => ({
            ...prev,
            sourceResources: [],
            targetResources: [],
            migrationList: [],
        }))
    };

    return (
        <select name="Resource Type" onChange={handleChange} value={resourceValue} id="select-element">
            {
                resources.map(resource => (
                    <option value={resource.endpoint} key={resource.endpoint}>{resource.name}</option>
                ))
            }
        </select>
    )
}