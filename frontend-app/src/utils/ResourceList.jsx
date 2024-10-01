import * as React from 'react';
import Box from '@mui/joy/Box';
import Chip from '@mui/joy/Chip';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Typography from '@mui/joy/Typography';
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
import Stack from '@mui/joy/Stack';

export default function ResourceList({ defaultValue, onChange }) {
    const data = [
        { name: "Flag Profiles", endpoint: "flagProfiles", icon: <FlagRoundedIcon />, type: 'Simple' },
        { name: "Exceptions", endpoint: "exceptions", icon: <CallSplitRoundedIcon />, type: 'Simple' },
        { name: "Alert Rules", endpoint: "alertRules", icon: <AssignmentLateRoundedIcon />, type: 'Recursive' },
        { name: "Event Rules", endpoint: "eventRules", icon: <EventAvailableRoundedIcon />, type: 'Recursive' },
        { name: "Event Exclude Profiles", endpoint: "eventExcludeProfiles", icon: <IsoRoundedIcon />, type: 'Simple' },
        { name: "FIM Rules", endpoint: "filePathGroups", icon: <FolderRoundedIcon />, type: 'Recursive' },
        { name: 'Dashboards', endpoint: 'customdashboards', icon: <DashboardRoundedIcon />, type: 'Recursive' },
        { name: 'Yara Profiles', endpoint: 'yaraGroupRules', icon: <DataObjectRoundedIcon />, type: 'Simple' },
        { name: 'Roles', endpoint: 'roles', icon: <PeopleRoundedIcon />, type: 'Simple' },
        { name: 'Custom Profiles', endpoint: 'customProfiles', icon: <ImportExportRoundedIcon />, type: 'Simple' },
    ];

    const colors = {
        Recursive: 'warning',
        Simple: 'primary',
    };
    return (
        <Select
            defaultValue={defaultValue}
            size='lg'
            slotProps={{
                listbox: {
                    sx: {
                        '--ListItemDecorator-size': '48px',
                    },
                },
            }}
            sx={{
                minWidth: 150,
                background: 'transparent',
                border: 'none',
                borderBottom: '3px solid var(--text-color)'
            }}
            onChange={(_, newValue) => onChange(newValue)}
            renderValue={(option) => {
                let record = data.find(item => item.endpoint === option?.value);
                return (
                    <Stack
                        direction='row'
                        spacing={3}
                    >
                        <ListItemDecorator>
                            {record?.icon}
                        </ListItemDecorator>
                        <Box component="span" sx={{ display: 'block' }}>
                            <Typography component="span" level="title-sm">
                                {record?.name}
                            </Typography>
                        </Box>
                    </Stack>
                )
            }}
        >
            {data.map((data, index) => (
                <Option
                    key={data.endpoint}
                    value={data.endpoint}
                    label={data.name}
                >
                    <ListItemDecorator>
                        {data.icon}
                    </ListItemDecorator>
                    <Box component="span" sx={{ display: 'block' }}>
                        <Typography component="span" level="title-sm">
                            {data.name}
                        </Typography>
                    </Box>
                    <Chip
                        size="sm"
                        variant="outlined"
                        color={colors[data.type]}
                        sx={{
                            ml: 'auto',
                            borderRadius: '2px',
                            minHeight: '20px',
                            paddingInline: '4px',
                            fontSize: 'xs',
                            bgcolor: `${'var(--colors-role)'}.softBg`,
                        }}
                        style={{ '--colors-role': colors[data.type] }}
                    >
                        {data.type}
                    </Chip>
                </Option>
            ))}
        </Select>
    );
}