import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
} from '@mui/material';
import { Upload as UploadIcon } from '@mui/icons-material';
import * as constants from '../../utils/constants';
import { useSnackbar } from '../../hooks/SnackBarProvider';

const APIIntegration = ({ onComplete }) => {
    const [file, setFile] = useState(null);
    const [apiKeys, setApiKeys] = useState(null);
    const openSnackbar = useSnackbar();

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const keys = JSON.parse(e.target.result);
                let requiredKeys = constants.REQUIRED_KEYS;
                let doesRequiredKeysExists = requiredKeys.every(key => key in keys);
                if (!doesRequiredKeysExists) {
                    openSnackbar('File does not contain required keys', 'danger');
                    return
                }
                openSnackbar('File uploaded successfully', 'success');
                setApiKeys(keys);
            } catch (error) {
                openSnackbar('Error while parsing the provided file', 'danger')
                console.error('Error parsing API keys:', error);
            }
        };

        reader.readAsText(file);
        setFile(file);
    };

    const handleSubmit = () => {
        if (apiKeys) {
            onComplete(apiKeys);
        }
    };

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
                Upload API Keys
            </Typography>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Box sx={{ mb: 3 }}>
                    <Button
                        variant="outlined"
                        component="label"
                        startIcon={<UploadIcon />}
                        fullWidth
                    >
                        Upload API Keys File
                        <input
                            type="file"
                            hidden
                            accept=".json"
                            onChange={handleFileUpload}
                        />
                    </Button>
                </Box>

                {file && (
                    <Typography variant="body2" color="text.secondary">
                        File uploaded: {file.name}
                    </Typography>
                )}

                {apiKeys && (
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        sx={{ mt: 2 }}
                    >
                        Continue
                    </Button>
                )}
            </Paper>
        </Box>
    );
};

export default APIIntegration;