import React, { useState } from 'react';
import {
    Paper,
    Typography,
    Stepper,
    Step,
    StepLabel,
    Box,
    useTheme,
    alpha,
    Divider,
} from '@mui/material';
import {
    GitHub as GitHubIcon,
    Api as ApiIcon,
    List as ListIcon,
    Upload as UploadIcon,
} from '@mui/icons-material';
import GitHubIntegration from './GitHubIntegration';
import APIIntegration from './APIIntegration';
import ConfigurationList from './ConfigurationList';
import BackupProgress from './BackupProgress';
import StepActions from './StepActions';

const steps = [
    {
        label: 'GitHub Setup',
        description: 'Connect and configure GitHub repository',
        icon: GitHubIcon,
    },
    {
        label: 'API Configuration',
        description: 'Upload Uptycs API keys',
        icon: ApiIcon,
    },
    {
        label: 'Select Configurations',
        description: 'Choose configurations to back up',
        icon: ListIcon,
    },
    {
        label: 'Backup Process',
        description: 'Backing up selected configurations',
        icon: UploadIcon,
    },
];

const BackupStepper = () => {
    const theme = useTheme();
    const [activeStep, setActiveStep] = useState(0);
    const [backupState, setBackupState] = useState({
        githubConfig: null,
        apiKeys: null,
        selectedConfigs: [],
        isProcessing: false,
        processStatus: [],
    });

    const handleStepComplete = (stepData) => {
        switch (activeStep) {
            case 0:
                setBackupState(prev => ({ ...prev, githubConfig: stepData }));
                break;
            case 1:
                setBackupState(prev => ({ ...prev, apiKeys: stepData }));
                break;
            case 2:
                setBackupState(prev => ({ ...prev, selectedConfigs: stepData }));
                break;
            default:
                break;
        }
        setActiveStep(prev => prev + 1);
    };

    const handleBack = () => {
        setActiveStep(prev => prev - 1);
    };

    return (
        <Paper
            elevation={3}
            sx={{
                p: 4,
                background: `linear-gradient(to bottom right, ${alpha(
                    theme.palette.background.paper,
                    0.9
                )}, ${alpha(theme.palette.background.paper, 0.95)})`,
                backdropFilter: 'blur(10px)',
                borderRadius: 2,
            }}
        >
            <Typography
                variant="h4"
                component="h1"
                sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    backgroundClip: 'text',
                    textFillColor: 'transparent',
                    mb: 4,
                }}
            >
                Tenant Backup
            </Typography>

            <Stepper
                activeStep={activeStep}
                sx={{
                    mb: 4,
                    '& .MuiStepLabel-iconContainer': {
                        bgcolor: 'background.paper',
                        borderRadius: '50%',
                        p: 1,
                        boxShadow: 1,
                    },
                }}
            >
                {steps.map((step, index) => (
                    <Step key={step.label}>
                        <StepLabel
                            StepIconComponent={() => (
                                <step.icon
                                    color={activeStep >= index ? 'primary' : 'disabled'}
                                    sx={{ fontSize: 24 }}
                                />
                            )}
                        >
                            <Typography variant="subtitle1" fontWeight={600} ml={2}>
                                {step.label}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" ml={2}>
                                {step.description}
                            </Typography>
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>

            <Divider />

            <Box sx={{ mt: 4 }}>
                {/* GitHub Integration Step */}
                <Box sx={{
                    display: activeStep === 0 ? 'block' : 'none',
                    visibility: activeStep === 0 ? 'visible' : 'hidden',
                    position: activeStep === 0 ? 'relative' : 'absolute',
                    width: '100%'
                }}>
                    <GitHubIntegration
                        onComplete={handleStepComplete}
                        config={backupState.githubConfig}
                    />
                </Box>

                {/* API Integration Step */}
                <Box sx={{
                    display: activeStep === 1 ? 'block' : 'none',
                    visibility: activeStep === 1 ? 'visible' : 'hidden',
                    position: activeStep === 1 ? 'relative' : 'absolute',
                    width: '100%'
                }}>
                    <APIIntegration
                        onComplete={handleStepComplete}
                        apiKeys={backupState.apiKeys}
                    />
                </Box>

                {/* Configuration Selection Step */}
                <Box sx={{
                    display: activeStep === 2 ? 'block' : 'none',
                    visibility: activeStep === 2 ? 'visible' : 'hidden',
                    position: activeStep === 2 ? 'relative' : 'absolute',
                    width: '100%'
                }}>
                    <ConfigurationList
                        onComplete={handleStepComplete}
                        selectedConfigs={backupState.selectedConfigs}
                    />
                </Box>

                {/* Backup Progress Step */}
                <Box sx={{
                    display: activeStep === 3 ? 'block' : 'none',
                    visibility: activeStep === 3 ? 'visible' : 'hidden',
                    position: activeStep === 3 ? 'relative' : 'absolute',
                    width: '100%'
                }}>
                    <BackupProgress backupState={backupState} />
                </Box>

                <StepActions
                    activeStep={activeStep}
                    backupState={backupState}
                    onBack={handleBack}
                    onStartBackup={() => setActiveStep(3)}
                />
            </Box>
        </Paper>
    );
};

export default BackupStepper;