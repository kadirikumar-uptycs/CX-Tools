import React, { useLayoutEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentPage } from '../store/authSlice';
import { Typography, Box, Grid, Container, Fade, Button } from '@mui/material';
import Typewriter from 'typewriter-effect';
import { CompareArrows, Sync, Analytics, VpnKey, IntegrationInstructions } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const HomePage = () => {
    const dispatch = useDispatch();
    const [showFeatures, setShowFeatures] = useState(false);

    useLayoutEffect(() => {
        dispatch(setCurrentPage('Home'));
        // eslint-disable-next-line
    }, []);

    const features = [
        {
            title: 'Resource Migration',
            description: 'Effortlessly transfer resources from one uptycs tenant to other.',
            icon: CompareArrows,
            link: 'resourceMigrations'
        },
        {
            title: 'Resource Updation/Synchronization',
            description: 'Maintain sync between the transfered resources.',
            icon: Sync,
            link: 'resourceUpdations'
        },
        {
            title: 'Osquery Log Analytics',
            description: 'Analysis the insights of osquery worker logs.',
            icon: Analytics,
            link: 'osqueryAnalysis'
        },
        {
            title: 'Secure API Token Generation',
            description: 'Generate a Bearer Auth Token with your Uptycs API Keys',
            icon: VpnKey,
            link: 'tokenGenerator'
        },
        {
            title: 'Jira & Zoho Integration',
            description: 'Filter for the tickets based on Jira and Zoho fields combinely.',
            icon: IntegrationInstructions,
            link: 'jirazoho'
        },
    ];

    return (
        <Container
            maxWidth="lg"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                backgroundColor: 'var(--body-color)',
                color: 'var(--text-color)',
                padding: 4,
                textAlign: 'center',
            }}
        >
            <Box sx={{ mb: 6 }}>
                <Typography
                    variant="h2"
                    component="h1"
                    sx={{
                        fontWeight: 800,
                        color: 'var(--primary-color)',
                        textShadow: '2px 2px 4px var(--shadow-color)',
                        mb: 2,
                    }}
                >
                    Welcome to
                </Typography>
                <Typography
                    variant="h1"
                    component="span"
                    sx={{
                        fontWeight: 900,
                        color: 'var(--primary-color)',
                        textShadow: '3px 3px 6px var(--shadow-color)',
                        letterSpacing: '0.1em',
                        fontFamily: 'sans-serif !important'
                    }}
                >
                    <Typewriter
                        options={{
                            strings: ['CX-TOOLS'],
                            autoStart: true,
                            loop: true,
                            delay: 150,
                            deleteSpeed: 100,
                        }}
                    />
                </Typography>
            </Box>

            <Fade in={true} timeout={1000} onEntered={() => setShowFeatures(true)}>
                <Typography
                    variant="h6"
                    sx={{ fontWeight: 400, mb: 6, maxWidth: '800px', color: 'var(--text-color)', fontFamily:'hind' }}
                >
                    Improve your workflow and enhance team collaboration with these advanced tools.
                    Experience the benefits of CX-TOOLS, designed specifically for the Uptycs CX Team.
                </Typography>
            </Fade>

            <Fade in={showFeatures} timeout={1000}>
                <Grid container spacing={4} sx={{ maxWidth: '1000px', mx: 'auto' }}>
                    {features.map((feature, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    height: '100%',
                                    padding: 2,
                                    transition: 'all 0.3s ease-in-out',
                                    '&:hover': {
                                        transform: 'translateY(-5px)',
                                    },
                                }}
                            >
                                <feature.icon sx={{ fontSize: 60, color: 'var(--primary-color)', mb: 2 }} />
                                <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--primary-color)', mb: 1 }}>
                                    {feature.title}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'var(--text-color)', mb: 2, flexGrow: 1 }}>
                                    {feature.description}
                                </Typography>
                                <Button
                                    component={Link}
                                    to={feature.link}
                                    variant="contained"
                                    sx={{
                                        backgroundColor: 'var(--primary-color)',
                                        color: 'var(--bg-color)',
                                        '&:hover': {
                                            backgroundColor: 'var(--primary-color-light)',
                                        },
                                    }}
                                >
                                    Try This
                                </Button>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Fade>
        </Container>
    );
};

export default HomePage;