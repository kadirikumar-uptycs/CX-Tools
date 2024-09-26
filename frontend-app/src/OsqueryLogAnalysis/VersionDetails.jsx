import React from "react";
import { Box, Typography, Grid, Divider } from "@mui/material";
import SensorsIcon from '@mui/icons-material/Sensors';
import ComputerIcon from '@mui/icons-material/Computer';
import AndroidIcon from '@mui/icons-material/Android';

const VersionDetails = ({ versionDetails }) => {

    return (
        <Box sx={{ width: "100%", height: '100%', overflowY: 'scroll', padding: "20px", scrollbarWidth: 'thin' }}>
            <Box
                sx={{
                    display: 'flex'
                }}
            >
                <AndroidIcon color="primary" />
                <Typography
                    variant="subtitle1"
                    color="primary"
                    sx={{
                        fontWeight: "bold",
                        marginBottom: "20px",
                        marginLeft: '5px'
                    }}
                >
                    OS Version
                </Typography>
            </Box>
            <Grid container spacing={2}>
                {versionDetails?.osVersion[0] ?
                    Object.keys(versionDetails?.osVersion[0] || {})?.map((key, idx) => (
                        <Grid item xs={4} key={idx}>
                            <Typography variant="subtitle2" fontSize={17}>{key}</Typography>
                            <Typography variant="body2" sx={{ color: 'var(--text-color)' }}>{versionDetails.osVersion[0][key]}</Typography>
                        </Grid>
                    )) : (
                        <Typography
                            variant="body2"
                            sx={{
                                margin: '10px 0 0 100px',
                                color: 'var(--text-color)',
                                fontFamily: 'Hind-Regular',
                            }}
                        >
                            No Data Found
                        </Typography>
                    )
                }
            </Grid>

            <Divider sx={{ margin: "20px 0" }} />

            {/* Osquery Version Details */}
            <Box
                sx={{
                    display: 'flex'
                }}
            >
                <SensorsIcon color="secondary" />
                <Typography
                    variant="subtitle1"
                    color="secondary"
                    sx={{
                        fontWeight: "bold",
                        marginBottom: "20px",
                        marginLeft: '5px'
                    }}
                >
                    Osquery Version
                </Typography>
            </Box>
            <Grid container spacing={2}>
                {versionDetails?.osqueryVersion[0] ?
                    Object.keys(versionDetails?.osqueryVersion[0] || {})?.map((key, idx) => (
                        <Grid item xs={4} key={idx}>
                            <Typography variant="subtitle2" fontSize={17}>{key}</Typography>
                            <Typography variant="body2" sx={{ color: 'var(--text-color)' }}>{versionDetails.osqueryVersion[0][key]}</Typography>
                        </Grid>
                    )) : (
                        <Typography
                            variant="body2"
                            sx={{
                                margin: '10px 0 0 100px',
                                color: 'var(--text-color)',
                                fontFamily: 'Hind-Regular'
                            }}
                        >
                            No Data Found
                        </Typography>
                    )
                }
            </Grid>

            <Divider sx={{ margin: "20px 0" }} />

            {/* Platform Version Details */}
            <Box
                sx={{
                    display: 'flex'
                }}
            >
                <ComputerIcon color="success" />
                <Typography
                    variant="subtitle1"
                    color="success.main"
                    sx={{
                        fontWeight: "bold",
                        marginBottom: "20px",
                        marginLeft: '5px'
                    }}
                >
                    Platform Version
                </Typography>
            </Box>
            <Grid container spacing={2}>
                {versionDetails?.platformVersion[0] ?
                    Object.keys(versionDetails?.platformVersion[0] || {})?.map((key, idx) => (
                        <Grid item xs={4} key={idx}>
                            <Typography variant="subtitle2" fontSize={17}>{key}</Typography>
                            <Typography variant="body2" sx={{ color: 'var(--text-color)' }}>{versionDetails.platformVersion[0][key]}</Typography>
                        </Grid>
                    )) : (
                        <Typography
                            variant="body2"
                            sx={{
                                margin: '10px 0 0 100px',
                                color: 'var(--text-color)',
                                fontFamily: 'Hind-Regular'
                            }}
                        >
                            No Data Found
                        </Typography>
                    )
                }
            </Grid>
        </Box>
    );
};

export default VersionDetails;