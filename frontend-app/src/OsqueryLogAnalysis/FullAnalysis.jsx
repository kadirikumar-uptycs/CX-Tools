import * as React from 'react';
import AccordionGroup from '@mui/joy/AccordionGroup';
import Accordion from '@mui/joy/Accordion';
import AccordionDetails, {
    accordionDetailsClasses,
} from '@mui/joy/AccordionDetails';
import AccordionSummary, {
    accordionSummaryClasses,
} from '@mui/joy/AccordionSummary';
import Typography from '@mui/joy/Typography';
import Avatar from '@mui/joy/Avatar';
import ListItemContent from '@mui/joy/ListItemContent';
import InfoIcon from '@mui/icons-material/Info';
import VersionDetails from './VersionDetails';

export default function FullAnalysis({ obj }) {
    return (
        <AccordionGroup
            variant="plain"
            transition="0.2s"
            sx={{
                width: 'calc(100% - 50px)',
                borderRadius: 'md',
                [`& .${accordionDetailsClasses.content}.${accordionDetailsClasses.expanded}`]:
                {
                    paddingBlock: '1rem',
                },
                [`& .${accordionSummaryClasses.button}`]: {
                    paddingBlock: '1rem',
                },
            }}
        >
            <Accordion>
                <AccordionSummary
                    sx={{
                        background: 'var(--bg-color)',
                        borderRadius: '5px',
                    }}
                >
                    <Avatar color="primary">
                        <InfoIcon />
                    </Avatar>
                    <ListItemContent>
                        <Typography level="title-md">Version Details</Typography>
                        <Typography level="body-sm">
                        Details of the Operating System, Uptycs Osquery and Platform
                        </Typography>
                    </ListItemContent>
                </AccordionSummary>
                <AccordionDetails
                    sx={{
                        maxHeight: '500px',
                        backgroundColor: 'rgba(0,0,0, 0.03)',
                        backdropFilter: 'blur(30px)',
                    }}
                >
                    <VersionDetails versionDetails={obj?.versionDetails} />
                </AccordionDetails>
            </Accordion>
        </AccordionGroup>
    );
}