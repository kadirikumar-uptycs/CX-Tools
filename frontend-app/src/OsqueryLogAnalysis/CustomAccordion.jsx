import * as React from 'react';
import Accordion from '@mui/joy/Accordion';
import AccordionDetails from '@mui/joy/AccordionDetails';
import AccordionSummary from '@mui/joy/AccordionSummary';
import Typography from '@mui/joy/Typography';
import Avatar from '@mui/joy/Avatar';
import ListItemContent from '@mui/joy/ListItemContent';

export default function CustomAccordion({ title, description, icon, details }) {
    return (
        <Accordion>
            <AccordionSummary
                sx={{
                    background: 'var(--bg-color)',
                    borderRadius: '5px',
                }}
            >
                <Avatar color="primary">
                    {icon}
                </Avatar>
                <ListItemContent>
                    <Typography level="title-md">{title}</Typography>
                    <Typography level="body-sm">
                        {description}
                    </Typography>
                </ListItemContent>
            </AccordionSummary>
            <AccordionDetails
                sx={{
                    maxHeight: '90vh',
                    backgroundColor: 'rgba(0,0,0, 0.03)',
                    backdropFilter: 'blur(30px)',
                }}
            >
                {details}
            </AccordionDetails>
        </Accordion>
    );
}