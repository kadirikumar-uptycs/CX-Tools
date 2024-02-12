import React, { useContext } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CodeHighlighter from './CodeHighlighter';
import { ContextProvider } from "./MigrateFlagProfiles";
import SnackBar from "./SnackBar";
import CheckBox from './CheckBox';

export default function AccordionComponent({ type, summary, details }) {

    let { setMigrationList, resourceData } = useContext(ContextProvider);

    let setSnackBar;

    function setChildState(childStateSetter) {
        setSnackBar = childStateSetter;
    }

    function handleCheckboxClick(event){
        event.stopPropagation();
        let ele = event.target;
        let flagId = ele.id;
        let targetData = resourceData.target;

        if(!ele.checked){
            setMigrationList(prev => prev.filter(id => id !== flagId));
        }else{
            if(targetData.length === 0){
                setTimeout(() => {
                    ele.checked = false;
                }, 500);
            }else{
                if (!targetData.some(flagProfile => flagProfile.priority === details.priority)) {
                    if (!targetData.some(flagProfile => flagProfile.name === summary)) {
                        ele.checked = true;
                        setMigrationList(prev => [...prev, flagId]);
                    } else {
                        ele.checked = false;
                        setSnackBar({
                            open: true,
                            message: 'Resource with same NAME already exists on target',
                            severity: 'error',
                            duration: 3000,
                        })
                    }
                } else {
                    ele.checked = false;
                    setSnackBar({
                        open: true,
                        message: 'Resource with same PRIORITY already exists on target',
                        severity: 'error',
                        duration: 3000,
                    })
                }
            }

        }
    }

    return (
        <div>
            <Accordion sx={{
                borderBottom: '1px solid #234',
            }}
                slotProps={{ transition: { unmountOnExit: true } }}
            >
                <AccordionSummary
                    expandIcon={<ArrowDropDownIcon />}
                    sx={{
                        height: '66px',
                    }}
                >
                    {type === 'source' ? <CheckBox handleCheckboxClick={handleCheckboxClick} id={details.id} /> : ''}
                    <Typography sx={{
                        alignSelf: 'center',
                    }}>{summary}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {<CodeHighlighter data={details} />}
                </AccordionDetails>
            </Accordion>

            {/* SnackBar */}
            <SnackBar getChildState={setChildState} />

        </div>
    );
}
