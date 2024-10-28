import React, { useState } from 'react';
import {
    Box,
    Typography,
    LinearProgress,
    Alert,
    Link,
    Button
} from '@mui/material';
import axios from 'axios';
import cfg from '../../config';

const BackupProgress = ({ backupState }) => {
    const [progress, setProgress] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const processBackups = async () => {
        if (backupState?.selectedConfigs?.length === 0) {
            return;
        }

        setIsProcessing(true);
        setProgress([]);

        const { githubConfig, apiKeys, selectedConfigs } = backupState;
        const { branch, repoName, owner } = githubConfig;

        for (const config of selectedConfigs) {
            try {
                setProgress(prev => [...prev, {
                    config: config.name,
                    status: 'processing',
                    message: `Fetching ${config.name} configuration...`
                }]);

                // Fetch configuration data
                const configResponse = await axios.post(
                    `${cfg.SERVER_BASE_ADDRESS}/getResources/${config?.apiName}`,
                    { credentials: apiKeys },
                    { withCredentials: true }
                );

                setProgress(prev =>
                    prev.map(p =>
                        p.config === config.name
                            ? { ...p, message: `Pushing ${config.name} to GitHub...` }
                            : p
                    )
                );

                // Push to GitHub
                const pushResponse = await axios.post(
                    `${cfg.SERVER_BASE_ADDRESS}/github/pushCode/${owner}/${repoName}/${branch}`,
                    {
                        configData: configResponse?.data,
                        configName: config.name,
                    },
                    { withCredentials: true }
                );

                // Create GitHub file URL
                const githubUrl = `https://github.com/${owner}/${repoName}/blob/${branch}/${pushResponse?.data?.filePath}`;

                // Update progress to show completion
                setProgress(prev =>
                    prev.map(p =>
                        p.config === config.name
                            ? {
                                ...p,
                                status: 'complete',
                                message: `${config.name} backed up successfully`,
                                githubUrl
                            }
                            : p
                    )
                );
            } catch (error) {
                console.error(`Error backing up ${config.name}:`, error);
                setProgress(prev =>
                    prev.map(p =>
                        p.config === config.name
                            ? {
                                ...p,
                                status: 'error',
                                message: `Error backing up ${config.name}: ${error.response?.data?.message || error.message}`,
                            }
                            : p
                    )
                );
            }
        }
        setIsProcessing(false);
    };

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">
                    Backup Progress
                </Typography>
                <Button 
                    variant="contained" 
                    onClick={processBackups}
                    disabled={isProcessing || backupState.selectedConfigs.length === 0}
                >
                    {isProcessing ? 'Backing Up...' : 'Start Backup'}
                </Button>
            </Box>

            {progress.map((item, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                    <Alert
                        severity={
                            item.status === 'error' ? 'error' :
                                item.status === 'complete' ? 'success' :
                                    'info'
                        }
                    >
                        {item?.message}
                        {item?.githubUrl && (
                            <Box mt={1}>
                                <Link
                                    href={item.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    View on GitHub
                                </Link>
                            </Box>
                        )}
                    </Alert>
                    {item.status === 'processing' && (
                        <LinearProgress sx={{ mt: 1 }} />
                    )}
                </Box>
            ))}
        </Box>
    );
};

export default BackupProgress;