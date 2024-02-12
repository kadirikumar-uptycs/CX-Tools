import React from "react";
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SnackBar from "./SnackBar";



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


function handleInput(event) {
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


export default function FileInput({ fileName, fileInputHandler }) {

    let setSnackBar;

    function setChildState(childStateSetter){
        setSnackBar = childStateSetter;
    }

    return (
        <div className="file-upload">
            <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                Upload API Keys
                <VisuallyHiddenInput type="file" accept=".json" onInput={async (event) => {
                    try {
                        let response = await handleInput(event);
                        let { data, fileName } = response;
                        fileInputHandler(data, fileName);
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
                }} />
            </Button>
            <div className="file-name" id="file-name-source" style={{ color: "#AAAAAA" }}>{fileName}</div>

            {/* SnackBar */}
            <SnackBar getChildState={setChildState} />
        </div>
    )
}