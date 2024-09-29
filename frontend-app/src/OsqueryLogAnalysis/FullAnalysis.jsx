import * as React from 'react';
import AccordionGroup from '@mui/joy/AccordionGroup';
import {
    accordionDetailsClasses,
} from '@mui/joy/AccordionDetails';
import {
    accordionSummaryClasses,
} from '@mui/joy/AccordionSummary';
import InfoIcon from '@mui/icons-material/Info';
import EventNoteIcon from '@mui/icons-material/EventNote';
import HiveRoundedIcon from '@mui/icons-material/HiveRounded';
import CustomAccordion from './CustomAccordion';
import VersionDetails from './VersionDetails';
import Box from '@mui/joy/Box';
import IndividualEventsCharts from './IndividualEventsCharts';
import CombinedEventsCharts from './CombinedEventsCharts';

export default function FullAnalysis({ obj }) {
    return (
        <Box>
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
                    marginBottom: '300px',
                    gap: '21px'
                }}
            >
                <CustomAccordion
                    icon={<InfoIcon />}
                    title={"Version Details"}
                    description={"Details of the Operating System, Uptycs Osquery and Platform"}
                    details={<VersionDetails versionDetails={obj?.versionDetails} />}
                />
                <CustomAccordion
                    icon={<EventNoteIcon />}
                    title={"Individual Events Details"}
                    description={"Individual details of the different events like process_file_events, registry_events, socket_events etc.."}
                    details={<IndividualEventsCharts eventDetails={obj?.eventDetails} />}
                />
                <CustomAccordion
                    icon={<HiveRoundedIcon />}
                    title={"Combined Events Details"}
                    description={"Combined Events Analysis"}
                    details={<CombinedEventsCharts eventDetails={obj?.eventDetails} />}
                />
            </AccordionGroup>
        </Box>
    );
}