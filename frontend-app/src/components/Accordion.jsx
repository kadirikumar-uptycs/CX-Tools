import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Checkbox from '@mui/material/Checkbox';

export default function AccordionComponent({ type, summary, details }) {

    const handleCheckboxClick = (event) => {
        event.stopPropagation();
    };

    return (
        <div>
            <Accordion sx={{
                borderBottom: '1px solid #234',
            }}
            >
                <AccordionSummary
                    expandIcon={<ArrowDropDownIcon />}
                    sx={{
                        height : '66px',
                    }}
                >
                    {type === 'source' ? <Checkbox onClick={handleCheckboxClick} /> : ''}
                    <Typography sx={{
                        alignSelf : 'center',
                    }}>{summary}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {details}
                </AccordionDetails>
            </Accordion>
        </div>
    );
}
