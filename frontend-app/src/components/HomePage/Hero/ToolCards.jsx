import React from "react";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Card from "./Card";

let migartionsHeading = `
  ▄▄▄▄███▄▄▄▄    ▄█     ▄██████▄     ▄████████    ▄████████     ███      ▄█   ▄██████▄  ███▄▄▄▄      ▄████████ 
▄██▀▀▀███▀▀▀██▄ ███    ███    ███   ███    ███   ███    ███ ▀█████████▄ ███  ███    ███ ███▀▀▀██▄   ███    ███ 
███   ███   ███ ███▌   ███    █▀    ███    ███   ███    ███    ▀███▀▀██ ███▌ ███    ███ ███   ███   ███    █▀  
███   ███   ███ ███▌  ▄███         ▄███▄▄▄▄██▀   ███    ███     ███   ▀ ███▌ ███    ███ ███   ███   ███        
███   ███   ███ ███▌ ▀▀███ ████▄  ▀▀███▀▀▀▀▀   ▀███████████     ███     ███▌ ███    ███ ███   ███ ▀███████████ 
███   ███   ███ ███    ███    ███ ▀███████████   ███    ███     ███     ███  ███    ███ ███   ███          ███ 
███   ███   ███ ███    ███    ███   ███    ███   ███    ███     ███     ███  ███    ███ ███   ███    ▄█    ███ 
 ▀█   ███   █▀  █▀     ████████▀    ███    ███   ███    █▀     ▄████▀   █▀    ▀██████▀   ▀█   █▀   ▄████████▀  
                                    ███    ███                                                                 `

let toolsData = [
    {
        'name': 'Flag Profiles',
        'description': 'Migrates flag profiles from one tenant to other.',
        'imageURL': 'images/Resources/flag.gif',
        'URL': 'migrateResources?resource=flagProfiles',
    },
    {
        'name': 'Alert Rules',
        'description': 'Migrates Alert Rules from one tenant to other.',
        'imageURL': 'images/Resources/Alert.gif',
        'URL': 'migrateResources?resource=alertRules',
    },
    {
        'name': 'Exceptions',
        'description': 'Migrates Exceptions from one tenant to other.',
        'imageURL': 'images/Resources/exception.gif',
        'URL': 'migrateResources?resource=exceptions',
    },
    {
        'name': 'Event Rules',
        'description': 'Migrates event rules from one tenant to other.',
        'imageURL': 'images/Resources/event.gif',
        'URL': 'migrateResources?resource=eventRules',
    },
    {
        'name': 'FIM Rules',
        'description': 'Migrate FIM Rules from one tenant to other.',
        'imageURL': 'images/Resources/FIM.gif',
        'URL': 'migrateResources?resource=filePathGroups',
    },
    {
        'name': 'Event Exclude Profiles',
        'description': 'Migrates Event Exclusion Profiles from one tenant to other.',
        'imageURL': 'images/Resources/eventExclusion.gif',
        'URL': 'migrateResources?resource=eventExcludeProfiles',
    },
    {
        'name': 'Dashboards',
        'description': 'Migrates Bulk dashboards from one tenant to other.',
        'imageURL': 'images/Resources/dashboard.gif',
        'URL': 'migrateResources?resource=customdashboards',
    },
    {
        'name': 'Yara Rules',
        'description': 'Migrates Yara Rules from one tenant to other.',
        'imageURL': 'images/Resources/yara.gif',
        'URL': 'migrateResources?resource=yaraGroupRules',
    },
    {
        'name': 'Roles',
        'description': 'Migrates Roles from one tenant to other.',
        'imageURL': 'images/Resources/role.gif',
        'URL': 'migrateResources?resource=roles',
    },
    {
        'name': 'Custom Profiles',
        'description': 'Migrates Custom Profiles from one tenant to other.',
        'imageURL': 'images/Resources/customProfile.gif',
        'URL': 'migrateResources?resource=customProfiles',
    },
]

export default function ToolCards() {

    return (
        <div id="migrate" className="page-section">
            <Box>
                <Paper sx={{
                    background: 'transparent',
                    display: 'grid',
                    placeItems: 'center',
                }}>
                    <pre className="ascii-heading">{migartionsHeading}</pre>
                </Paper>
            </Box>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                    {toolsData.map((tool, index) => {
                        return (
                            <Grid item xs={2} sm={4} md={4} key={index}>
                                <Card
                                    index={index % 3 + 1}
                                    name={tool.name}
                                    description={tool.description}
                                    imageURL={tool.imageURL}
                                    URL={tool.URL}
                                    key={index}
                                />
                            </Grid>
                        )
                    })}
                </Grid>
            </Box>


        </div>
    )
}