import React, { useState, useContext } from "react";
import FileInput from "./FileInput";
import SnackBar from "./SnackBar";
import TenantResources from "./TenantResources";
import { ContextProvider } from "./MigrateFlagProfiles";



export default function TenantComponent({ type }) {

    let { allCredentials, setAllCredentials } = useContext(ContextProvider);

    let [fileData, setFileData] = useState({ credentials: {}, fileName: 'No File Choosen' });

    let setSnackBar;

    function setChildState(childStateSetter) {
        setSnackBar = childStateSetter;
    }


    function captilize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function fileInputHandler(credentials, fileName) {
        let requiredKeys = ["id", "customerId", "key", "secret", "domain", "domainSuffix"];
        let isValidCredentails = requiredKeys.every(key => key in credentials);
        if (isValidCredentails) {

            let complementType = type === 'source' ? 'target' : 'source';
            let type1Credentials = credentials;
            let type2Credentials = allCredentials[complementType];

            if (type2Credentials.id && type1Credentials.customerId === type2Credentials.customerId) {
                setSnackBar({
                    open: true,
                    message: `${type} should be different from ${complementType}`,
                    severity: 'error',
                    duration: 3000,
                });
            } else {
                setFileData({ credentials: credentials || {}, fileName: fileName });
                setAllCredentials(prev => ({
                    ...prev,
                    [type] : credentials
                }));
                setSnackBar({
                    open: true,
                    message: 'File uploaded successfully',
                    severity: 'success',
                    duration: 2000,
                })
            }
        } else {
            setSnackBar({
                open: true,
                message: 'File does not contain required keys',
                severity: 'error',
                duration: 3000,
            })
        }
    }

    return (
        <div id={type}>
            <span className="Tenant-Heading">{Object.keys(fileData.credentials).length === 0 ? `${captilize(type)} Tenant` : captilize(fileData.credentials.domain)}</span>
            <FileInput fileName={fileData.fileName} fileInputHandler={fileInputHandler} />
            <TenantResources type={type} credentials={fileData.credentials} />

            {/* SnackBar */}
            <SnackBar getChildState={setChildState} />

        </div>
    )
}