import React, { useContext } from "react";
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SnackBar from "../utils/SnackBar";
import { ContextProvider } from "./MigrateResources";


const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});


async function handleInput(event) {
    const fileInput = event.currentTarget;
    const file = fileInput.files[0];

    return new Promise((resolve, reject) => {
        if (file) {
            const reader = new FileReader();

            reader.onload = function (e) {
                try {
                    const data = JSON.parse(e.target.result);
                    const fileName = file.name;
                    resolve({ data, fileName });
                } catch (error) {
                    reject('Error while parsing, provide JSON file');
                }
            };

            reader.readAsText(file);
        } else {
            reject('No file selected');
        }
    });
}




export default function FileInput({type}) {

    let { state, setState } = useContext(ContextProvider);

    let setSnackBar;

    function setChildState(childStateSetter) {
        setSnackBar = childStateSetter;
    }



    function validateFileData(credentials, fileName) {
        let requiredKeys = ["id", "customerId", "key", "secret", "domain", "domainSuffix"];
        let isValidCredentails = requiredKeys.every(key => key in credentials);
        if (isValidCredentails) {
            
            let otherType = (type === 'source') ? 'target' : 'source';
            let thisCredentials = credentials;
            let otherCredentials = (type === 'source')?state.targetCredentials:state.sourceCredentials;
    
            if (otherCredentials.id && thisCredentials.customerId === otherCredentials.customerId) {
                setSnackBar({
                    open: true,
                    message: `${type} should be different from ${otherType}`,
                    severity: 'error',
                    duration: 3000,
                });
            } else {
                // Set FileName and credentials to the state
                if(type === 'source'){
                    setState(prev => ({
                        ...prev,
                        sourceFileName: fileName,
                        sourceCredentials: credentials,
                    }));
                }else{
                    setState(prev => ({
                        ...prev,
                        targetFileName: fileName,
                        targetCredentials: credentials,
                    }));
                }
                setSnackBar({
                    open: true,
                    message: 'File uploaded successfully',
                    severity: 'success',
                    duration: 2000,
                });
            }
        } else {
            setSnackBar({
                open: true,
                message: 'File does not contain required keys',
                severity: 'error',
                duration: 3500,
            });
        }
    }

    let fileInputHandler = async (event) => {
        try {
            let response = await handleInput(event);
            let { data, fileName } = response;
            validateFileData(data, fileName);
        } catch (err) {
            setSnackBar({
                open: true,
                message: err,
                severity: 'error',
                duration: 4000,
            });
        } finally {
            event.target.value = null;
        }
    }


    return (
        <div className="file-upload">
            <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                Upload API Keys
                <VisuallyHiddenInput type="file" accept=".json" onInput={fileInputHandler} />
            </Button>
            <div className="file-name" id="file-name-source" style={{ color: "#AAAAAA" }}>{type === 'source'?(state.sourceFileName):(state.targetFileName)}</div>

            {/* SnackBar */}
            <SnackBar getChildState={setChildState} />
        </div>
    )
}