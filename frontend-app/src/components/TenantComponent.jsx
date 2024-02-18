import React, { useContext } from "react";
import FileInput from "./FileInput";
import TenantResources from "./TenantResources";
import { ContextProvider } from "./MigrateResources";



export default function TenantComponent({ type }) {

    let { state } = useContext(ContextProvider);


    function captilize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    let credentials = (type === 'source')?state.sourceCredentials:state.targetCredentials;

    return (
        <div id={type}>
            <span className="Tenant-Heading">{Object.keys(credentials).length === 0 ? `${captilize(type)} Tenant` : captilize(credentials.domain)}</span>
            <FileInput type={type} />
            <TenantResources type={type} />
        </div>
    )
}