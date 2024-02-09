import React from "react";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from "./Card";

let toolsData = [
    {
        'name': 'Migrate Flag Profiles',
        'description': 'Migrates flag profiles from one tenant to other.',
        'imageURL': 'images/output-onlinegiftools.gif',
    },
    {
        'name': 'Migrate Flag Profiles',
        'description': 'Migrates flag profiles from one tenant to other.',
        'imageURL': 'images/output-onlinegiftools.gif',
    },
    {
        'name': 'Migrate Flag Profiles',
        'description': 'Migrates flag profiles from one tenant to other.',
        'imageURL': 'images/output-onlinegiftools.gif',
    },
    {
        'name': 'Migrate Flag Profiles',
        'description': 'Migrates flag profiles from one tenant to other.',
        'imageURL': 'images/output-onlinegiftools.gif',
    },
    {
        'name': 'Migrate Flag Profiles',
        'description': 'Migrates flag profiles from one tenant to other.',
        'imageURL': 'images/output-onlinegiftools.gif',
    }
]

export default function ToolCards() {

    return (
        <div id="migrate" className="page-section">
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