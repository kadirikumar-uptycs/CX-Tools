import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Checkbox,
    Button,
} from '@mui/material';
import FlagRoundedIcon from '@mui/icons-material/FlagRounded';
import CallSplitRoundedIcon from '@mui/icons-material/CallSplitRounded';
import AssignmentLateRoundedIcon from '@mui/icons-material/AssignmentLateRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import IsoRoundedIcon from '@mui/icons-material/IsoRounded';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import DataObjectRoundedIcon from '@mui/icons-material/DataObjectRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import ImportExportRoundedIcon from '@mui/icons-material/ImportExportRounded';

const configurations = [
    {
        id: 0,
        name: "Flag Profiles",
        description: "Flag profile configurations",
        apiName: "flagProfiles",
        icon: <FlagRoundedIcon />,
        type: 'Simple'
    },
    {
        id: 1,
        name: "Exceptions",
        description: "Exception rules and configurations",
        apiName: "exceptions",
        icon: <CallSplitRoundedIcon />,
        type: 'Simple'
    },
    {
        id: 2,
        name: "Alert Rules",
        description: "Alert rule configurations",
        apiName: "alertRules",
        icon: <AssignmentLateRoundedIcon />,
        type: 'Recursive'
    },
    {
        id: 3,
        name: "Event Rules",
        description: "Event rule configurations",
        apiName: "eventRules",
        icon: <EventAvailableRoundedIcon />,
        type: 'Recursive'
    },
    {
        id: 4,
        name: "Event Exclude Profiles",
        description: "Event exclusion configurations",
        apiName: "eventExcludeProfiles",
        icon: <IsoRoundedIcon />,
        type: 'Simple'
    },
    {
        id: 5,
        name: "FIM Rules",
        description: "File Integrity Monitoring rules",
        apiName: "filePathGroups",
        icon: <FolderRoundedIcon />,
        type: 'Recursive'
    },
    {
        id: 6,
        name: "Dashboards",
        description: "Custom dashboard configurations",
        apiName: "customdashboards",
        icon: <DashboardRoundedIcon />,
        type: 'Recursive'
    },
    {
        id: 7,
        name: "Yara Profiles",
        description: "Yara rule configurations",
        apiName: "yaraGroupRules",
        icon: <DataObjectRoundedIcon />,
        type: 'Simple'
    },
    {
        id: 8,
        name: "Roles",
        description: "Role configurations",
        apiName: "roles",
        icon: <PeopleRoundedIcon />,
        type: 'Simple'
    },
    {
        id: 9,
        name: "Custom Profiles",
        description: "Custom profile configurations",
        apiName: "customProfiles",
        icon: <ImportExportRoundedIcon />,
        type: 'Simple'
    }
];

const ConfigurationList = ({ onComplete }) => {
    const [selected, setSelected] = useState([]);

    const handleToggle = (configId) => {
        const currentIndex = selected.indexOf(configId);
        const newSelected = [...selected];

        if (currentIndex === -1) {
            newSelected.push(configId);
        } else {
            newSelected.splice(currentIndex, 1);
        }

        setSelected(newSelected);
    };

    const handleSubmit = () => {
        const selectedConfigs = configurations.filter(config =>
            selected.includes(config.id)
        );
        onComplete(selectedConfigs);
    };

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
                Select Configurations to Backup
            </Typography>

            <Paper 
                sx={{ 
                    mb: 3,
                    maxHeight: '400px',
                    overflow: 'auto'
                }}
            >
                <List>
                    {configurations.map((config) => (
                        <ListItem
                            key={config.id}
                            button
                            onClick={() => handleToggle(config.id)}
                            sx={{
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                }
                            }}
                        >
                            <ListItemIcon>
                                <Checkbox
                                    edge="start"
                                    checked={selected.includes(config.id)}
                                    tabIndex={-1}
                                    disableRipple
                                />
                            </ListItemIcon>
                            <ListItemIcon 
                                sx={{ 
                                    minWidth: '40px',
                                    color: 'primary.main'
                                }}
                            >
                                {config.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={config.name}
                                secondary={config.description}
                            />
                        </ListItem>
                    ))}
                </List>
            </Paper>

            {selected.length > 0 && (
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    sx={{ mt: 2 }}
                >
                    Continue with Selected ({selected.length})
                </Button>
            )}
        </Box>
    );
};

export default ConfigurationList;