import React, { useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CodeHighlighter from './CodeHighlighter';
import { ContextProvider } from "./MigrateResources";
import SnackBar from "./SnackBar";
import CheckBox from './CheckBox';

export default function AccordionComponent({ type, summary, details }) {

    let { state, setState } = useContext(ContextProvider);
    let [searchParams,] = useSearchParams();
    let resourceFromURL = searchParams.get('resource') || 'flagProfiles';

    let setSnackBar;

    function setChildState(childStateSetter) {
        setSnackBar = childStateSetter;
    }
    function checkNameisUnique({ resourceId, targetData, ele }) {
        if (!targetData.some(resource => resource.name === summary)) {
            setState(prev => ({
                ...prev,
                migrationList: [...prev.migrationList, resourceId],
            }));
        } else {
            ele.checked = false;
            setSnackBar({
                open: true,
                message: 'Resource with same NAME already exists on target',
                severity: 'error',
                duration: 3000,
            })
        }
    }
    function checkNameAndPriorityAreUnique({ resourceId, targetData, ele }) {
        if (!targetData.some(resource => resource.priority === details.priority)) {
            if (!targetData.some(resource => resource.name === summary)) {
                setState(prev => ({
                    ...prev,
                    migrationList: [...prev.migrationList, resourceId],
                }));
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

    function validateAlertRules({ resourceId, targetData, ele }) {
        if (!targetData.some(alertRule => alertRule.code === details.code)) {
            if (!targetData.some(alertRule => alertRule.name === summary)) {
                setState(prev => ({
                    ...prev,
                    migrationList: [...prev.migrationList, resourceId],
                }));
            } else {
                ele.checked = false;
                setSnackBar({
                    open: true,
                    message: 'Resource with same NAME already exists on target',
                    severity: 'error',
                    duration: 3000,
                });
            }
        } else {
            ele.checked = false;
            setSnackBar({
                open: true,
                message: 'Resource with same CODE already exists on target',
                severity: 'error',
                duration: 3000,
            });
        }
    }


    function validateExceptions({ resourceId, targetData, ele }) {
        if (!targetData.some(exception => exception.name === summary)) {
            setState(prev => ({
                ...prev,
                migrationList: [...prev.migrationList, resourceId],
            }));
        } else {
            ele.checked = false;
            setSnackBar({
                open: true,
                message: 'Resource with same NAME already exists on target',
                severity: 'error',
                duration: 3000,
            });
        }
    }

    function handleCheckboxClick(event) {
        event.stopPropagation();
        let ele = event.target;
        let resourceId = ele.id;
        let targetData = state.targetResources;

        if (!ele.checked) {
            setState(prev => ({
                ...prev,
                migrationList: prev.migrationList.filter(id => id !== resourceId),
            }));
        } else {
            if (targetData.length === 0 && !state.noTargetDataFound) {
                setTimeout(() => {
                    ele.checked = false;
                }, 500);
            } else {
                if (['flagProfiles','eventExcludeProfiles', 'customProfiles'].includes(resourceFromURL)) {
                    checkNameAndPriorityAreUnique({ resourceId, targetData, ele });
                } else if (resourceFromURL === 'alertRules' || resourceFromURL === 'eventRules') {
                    validateAlertRules({ resourceId, targetData, ele });
                } else if(['filePathGroups', 'yaraGroupRules', 'roles'].includes(resourceFromURL)){
                    checkNameisUnique({ resourceId, targetData, ele });
                } else {
                    validateExceptions({ resourceId, targetData, ele });
                }
            }
        }
    }

    return (
        <div style={{
            width: '100%',
        }}>
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
