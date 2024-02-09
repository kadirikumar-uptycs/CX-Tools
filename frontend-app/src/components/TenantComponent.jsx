import React, { useState } from "react";
import FileInput from "./FileInput";
import Snackbar from '@mui/material/Snackbar';
import Slide from '@mui/material/Slide';
import { Alert } from "@mui/material";
import TenantResources from "./TenantResources";

export default function TenantComponent({type}) {
    let [credentials, setCredentials] = useState({})
    const [snackBar, setSnackBar] = React.useState({
        open: false,
        message: '',
        severity: ''
    });

    let closeSnackBar = () => {
        setSnackBar({
            message: '',
            open: false,
            severity: ''
        })
    }

    function fileInputHandler(credentials) {
        let requiredKeys = ["id", "customerId", "key", "secret", "domain", "domainSuffix"];
        let isValidCredentails = requiredKeys.every(key => key in credentials);
        if (isValidCredentails) {
            setCredentials(credentials || {});
            setSnackBar({
                open : true,
                message : 'File uploaded successfully',
                severity : 'success'
            })
        } else {
            setSnackBar({
                open : true,
                message : 'File does not contain required keys',
                severity : 'error'
            })
        }
    }

    return (
        <div id={type}>
            <span className="Tenant-Heading">{Object.keys(credentials).length === 0 ? `${type.charAt(0).toUpperCase() + type.slice(1)} Tenant` : credentials.domain}</span>
            <FileInput fileInputHandler={fileInputHandler} setSnackBar={setSnackBar}/>
            <TenantResources type={type} credentials={credentials} setSnackBar={setSnackBar}/>

            {/* SnackBar */}
            <Snackbar
                open={snackBar.open}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                TransitionComponent={Slide}
                autoHideDuration={4500}
                onClose={closeSnackBar}
            >
                <Alert
                    severity={snackBar.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackBar.message}
                </Alert>
            </Snackbar>
        </div>
    )
}