import React from 'react';
import {
    Box,
    Button,
} from '@mui/material';
import {
    NavigateNext as NextIcon,
    NavigateBefore as BackIcon,
} from '@mui/icons-material';

const StepActions = ({ activeStep, backupState, onBack, onStartBackup }) => {
    const { isProcessing, selectedConfigs } = backupState;

    return (
        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
            {activeStep > 0 && !isProcessing && (
                <Button
                    startIcon={<BackIcon />}
                    onClick={onBack}
                    variant="outlined"
                >
                    Back
                </Button>
            )}

            {activeStep === 2 && selectedConfigs.length > 0 && (
                <Button
                    variant="contained"
                    onClick={onStartBackup}
                    endIcon={<NextIcon />}
                    sx={{
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        color: 'white',
                        '&:hover': {
                            background: 'linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)',
                        }
                    }}
                >
                    Start Backup
                </Button>
            )}
        </Box>
    );
};

export default StepActions;