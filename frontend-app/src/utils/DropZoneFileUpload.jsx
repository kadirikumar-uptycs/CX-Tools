import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Box, Typography, Alert } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import parseInputFileData from '../utils/parseJsonFileInput';
import ButtonOutlined from "./ButtonOutlined";
import { useSnackbar } from "../hooks/SnackBarProvider";

const DropZoneFileUpload = ({ handleFileUploadSuccess, acceptedFileFormats, MAX_SIZE }) => {
    const [file, setFile] = useState(null);
    const [error, setError] = useState("");
    const openSnackbar = useSnackbar();

    const sizeInUnits = (size) => {
        if (size < 1024) return `${size} B`;
        else if (size >= 1024 && size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
        else if (size >= 1024 * 1024 && size < 1024 * 1024 * 1024) return `${(size / 1024 / 1024).toFixed(2)} MB`;
        else return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }


    const onSubmit = (event) => {
        event.stopPropagation();
        handleFileUploadSuccess(file?.data);
        setFile(null);
        setError('');
    }

    const onDrop = async (acceptedFiles, fileRejections) => {

        if (fileRejections?.length > 0) {
            let errorCode = Array.isArray(fileRejections[0]?.errors) && fileRejections[0]?.errors[0]?.code;
            let errorMessage = errorCode === 'file-too-large' ?
                `File is too large. Please upload a file less than ${sizeInUnits(MAX_SIZE)}.` :
                (errorCode === 'file-invalid-type') ? 'Invalid File Type. Please upload .log, .txt or .text only' : errorCode;
            setFile({
                size: fileRejections[0]?.file?.size,
                name: fileRejections[0]?.file?.name,
                data: null,
            });
            setError(errorMessage);
            return;
        }

        const uploadedFile = acceptedFiles[0];
        try {
            let { data } = await parseInputFileData(uploadedFile);
            setFile({
                size: uploadedFile?.size,
                name: uploadedFile?.name,
                data,
            });
        } catch (error) {
            openSnackbar(error?.message || error, 'danger');
        }
        setError("");
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxSize: MAX_SIZE,
        accept: acceptedFileFormats,
        maxFiles: 1,
    });

    return (
        <Box
            sx={{
                width: 500,
                minHeight: '60%',
                margin: "50px auto",
                padding: "40px",
                border: "3px dashed var(--primary-color)",
                borderRadius: "10px",
                backgroundColor: "var(--bg-color)",
                textAlign: "center",
                cursor: 'pointer',
                transition: "border 0.2s ease-in-out",
                marginBottom: '150px',
                "&:hover": {
                    borderColor: "#4c49f5",
                },
            }}
            {...getRootProps()}
        >
            <input {...getInputProps()} />
            <CloudUploadIcon
                sx={{
                    fontSize: 60,
                    color: isDragActive ? "#4c49f5" : "var(--primary-color)",
                    transition: "color 0.2s ease-in-out",
                }}
            />
            <Typography
                variant="h6"
                sx={{
                    margin: "20px 0",
                    color: isDragActive ? "#4c49f5" : "var(--primary-color)",
                    fontWeight: "bold",
                    transition: "color 0.2s ease-in-out",
                }}
            >
                {isDragActive ? "Drop the file here..." : "Drag and drop worker log file here, or click to select"}
            </Typography>
            {file ? (
                <Typography variant="body1" sx={{ margin: "10px 0", color: "#4caf50" }}>
                    {file?.name} - {sizeInUnits(file?.size)}
                </Typography>
            ) : (
                <Typography variant="body2" sx={{ marginBottom: "10px" }}>
                    Maximum file size: 50MB
                </Typography>
            )}
            {error && <Alert severity="error" sx={{ marginTop: '30px' }}>{error}</Alert>}
            <ButtonOutlined
                text={"Upload"}
                disabled={!file || Boolean(error)}
                onClick={onSubmit}
                styles={{
                    marginTop: '29px',
                }}
            />

        </Box>
    );
};

export default DropZoneFileUpload;