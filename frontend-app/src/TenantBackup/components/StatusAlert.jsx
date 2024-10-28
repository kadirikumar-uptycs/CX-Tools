import React from 'react';
import { Alert, AlertTitle, Collapse, LinearProgress } from '@mui/material';
import { Error as ErrorIcon, CheckCircle as CheckIcon } from '@mui/icons-material';

const StatusAlert = ({ status, message, showProgress = false }) => (
    <Collapse in={!!status} sx={{ mb: 2 }}>
        <Alert
            severity={status === 'success' ? 'success' : 'error'}
            icon={status === 'success' ? <CheckIcon /> : <ErrorIcon />}
            sx={{
                '& .MuiAlert-icon': {
                    fontSize: '24px'
                }
            }}
        >
            <AlertTitle>{status === 'success' ? 'Success' : 'Error'}</AlertTitle>
            {message}
            {showProgress && (
                <LinearProgress
                    color={status === 'success' ? 'success' : 'error'}
                    sx={{ mt: 1 }}
                />
            )}
        </Alert>
    </Collapse>
);
export default StatusAlert;