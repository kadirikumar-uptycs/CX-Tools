import React, { useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ContextProvider } from './MigrateResources';
import './css/SelectComponent.css';


export default function SelectComponent() {

    let { setState } = useContext(ContextProvider);
    let [searchParams, setSearchParams] = useSearchParams();
    let resourceValue = searchParams.get('resource');
    let resources = [
        { name: "Flag Profiles", endpoint: "flagProfiles" },
        { name: "Exceptions", endpoint: "exceptions" },
        { name: "Alert Rules", endpoint: "alertRules" },
        { name: "Event Rules", endpoint: "eventRules" },
        { name: "Event Exclude Profiles", endpoint: "eventExcludeProfiles" },
        { name: "FIM Rules", endpoint: "filePathGroups" },
        { name: 'Dashboards', endpoint: 'customdashboards'},
        { name: 'Yara Profiles', endpoint: 'yaraGroupRules'},
        { name: 'Roles', endpoint: 'roles'},
        { name: 'Custom Profiles', endpoint: 'customProfiles'},
    ];

    if (!(resources.some(obj => obj.endpoint))) {
        resourceValue = 'flagProfiles';
    }

    const handleChange = (event) => {
        setSearchParams({ resource: event.target.value });
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