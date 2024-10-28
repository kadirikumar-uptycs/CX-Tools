import React, { useState, useCallback } from 'react';
import {
    Container,
    Paper,
    Typography,
    Stepper,
    Step,
    StepLabel,
    Box,
    Button,
    StepContent,
    useTheme,
    alpha,
    Avatar,
    Chip,
} from '@mui/material';
import {
    GitHub as GitHubIcon,
    Source as RepoIcon,
    AccountTree as BranchIcon,
    NavigateNext as NextIcon,
    NavigateBefore as BackIcon,
} from '@mui/icons-material';
import GitHubAuthButton from '../components/GitHubAuthButton';
import RepositoryList from '../components/RepositoryList';
import BranchSelector from '../components/BranchSelector';
import StatusAlert from '../components/StatusAlert';
import { useGitHubData } from '../hooks/useGitHubData';

const steps = [
    {
        label: 'Connect GitHub',
        description: 'Connect your GitHub account to get started',
        icon: GitHubIcon,
    },
    {
        label: 'Select Repository',
        description: 'Choose a repository to store your backups',
        icon: RepoIcon,
    },
    {
        label: 'Choose Branch',
        description: 'Select or create a branch for your backups',
        icon: BranchIcon,
    },
];

const GitHubIntegration = ({ onComplete }) => {
    const theme = useTheme();
    const [activeStep, setActiveStep] = useState(0);
    const [selectedRepo, setSelectedRepo] = useState(null);
    const [selectedBranch, setSelectedBranch] = useState('');
    const [status, setStatus] = useState(null);
    const [user, setUser] = useState(null);

    const {
        repositories,
        branches,
        loading,
        // error,
        fetchRepositories,
        fetchBranches,
        createBranch,
    } = useGitHubData();

    const handleAuthSuccess = useCallback(() => {
        setStatus({ type: 'success', message: 'GitHub connection successful!' });
        setTimeout(() => {
            setActiveStep(1);
            setStatus(null);
        }, 500);
        fetchRepositories();
    }, [fetchRepositories]);

    const handleRepoSelect = async (repo) => {
        setSelectedRepo(repo);
        setStatus({ type: 'success', message: 'Fetching repository branches...' });
        try {
            await fetchBranches(user?.login, repo?.name);
            setTimeout(() => {
                setActiveStep(2);
                setStatus(null);
            }, 500);
        } catch (err) {
            setStatus({
                type: 'error',
                message: 'Failed to fetch branches. Please try again.'
            });
        }
    };

    const handleNext = () => {
        setActiveStep((prevStep) => prevStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    const handleBranchSelect = async (branchName) => {
        setSelectedBranch(branchName);
        setStatus({
            type: 'success',
            message: `GitHub configuration done for ${selectedRepo.name}:${branchName}`
        });
    };

    const handleFinish = () => {
        onComplete({
            repoName: selectedRepo?.name,
            branch: selectedBranch,
            owner: selectedRepo?.owner?.login,
        })
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    background: `linear-gradient(to bottom right, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.paper, 0.95)})`,
                    backdropFilter: 'blur(10px)',
                    borderRadius: 2,
                }}
            >
                <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                        <Box>
                            <Typography
                                variant="h4"
                                component="h1"
                                sx={{
                                    fontWeight: 700,
                                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                    backgroundClip: 'text',
                                    textFillColor: 'transparent',
                                    mb: 1,
                                }}
                            >
                                GitHub Integration
                            </Typography>
                            <Typography
                                variant="body1"
                                color="text.secondary"
                                sx={{ maxWidth: 600 }}
                            >
                                Grant Access to your GitHub Account to push back configurations to the specified repository. Follow the below steps to set up the integration.
                            </Typography>
                        </Box>
                        {user && (
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                p: 2,
                                borderRadius: 2,
                            }}>
                                <Avatar
                                    src={user.avatar_url}
                                    alt={user.login}
                                    sx={{ width: 64, height: 64, mb: 1 }}
                                />
                                <Typography variant="subtitle1" fontWeight={600}>
                                    {user.name || user.login}
                                </Typography>
                                <Chip
                                    icon={<GitHubIcon sx={{ fontSize: 16 }} />}
                                    label={`@${user.login}`}
                                    size="small"
                                    sx={{ mt: 0.5 }}
                                    component="a"
                                    href={user.html_url}
                                    target="_blank"
                                    clickable
                                />
                            </Box>
                        )}
                    </Box>

                </Box>

                <Stepper
                    activeStep={activeStep}
                    orientation="vertical"
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
                                <Typography variant="subtitle1" fontWeight={600} marginLeft={1}>
                                    {step.label}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" marginLeft={1}>
                                    {step.description}
                                </Typography>
                            </StepLabel>
                            <StepContent
                                TransitionProps={{ unmountOnExit: false }}
                                sx={{ mt: 2, mb: 4 }}
                            >
                                <Box sx={{ py: 2 }}>
                                    <StatusAlert
                                        status={status?.type}
                                        message={status?.message}
                                        showProgress={status?.type === 'success' && activeStep < 2}
                                    />
                                    {index === 0 && (
                                        <GitHubAuthButton onSuccess={handleAuthSuccess} setUser={setUser} />
                                    )}

                                    {index === 1 && (
                                        <RepositoryList
                                            repositories={repositories}
                                            loading={loading}
                                            onSelect={handleRepoSelect}
                                            selectedRepo={selectedRepo}
                                        />
                                    )}

                                    {index === 2 && (
                                        <BranchSelector
                                            branches={branches}
                                            selectedBranch={selectedBranch}
                                            onBranchChange={handleBranchSelect}
                                            onCreateBranch={(branchName) =>
                                                createBranch(user?.login, selectedRepo.name, branchName)
                                            }
                                        />
                                    )}
                                </Box>

                                <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
                                    {index > 0 && (
                                        <Button
                                            startIcon={<BackIcon />}
                                            onClick={handleBack}
                                            variant="outlined"
                                        >
                                            Back
                                        </Button>
                                    )}
                                    {index < steps.length - 1 && (
                                        <Button
                                            startIcon={<NextIcon />}
                                            onClick={handleNext}
                                            variant="outlined"
                                        >
                                            Next
                                        </Button>
                                    )}
                                    {index === 2 && selectedBranch && (
                                        <Button
                                            variant="contained"
                                            endIcon={<NextIcon />}
                                            onClick={handleFinish}
                                            sx={{
                                                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                                color: 'white',
                                                '&:hover': {
                                                    background: 'linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)',
                                                }
                                            }}
                                        >
                                            Finish
                                        </Button>
                                    )}
                                </Box>
                            </StepContent>
                        </Step>
                    ))}
                </Stepper>
            </Paper>
        </Container>
    );
};

export default GitHubIntegration;