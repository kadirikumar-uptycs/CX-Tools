import React, { useLayoutEffect, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { setCurrentPage } from '../store/authSlice';
import { fetchResources, setResourceType, RESET } from '../store/updationSlice';
import Tenant from '../utils/Tenant';
import ShowErrors from '../utils/ShowErrors';
import ResourceList from '../utils/ResourceList';
import Stack from '@mui/joy/Stack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Sync from '@mui/icons-material/Sync';
import { Button } from '@mui/material';
import Typography from '@mui/joy/Typography';
import GitHubTooltip from '../utils/GitHubToolTip';

const ResourceUpdation = () => {

    const dispatch = useDispatch();
    const location = useLocation();
    const migrationInfo = useSelector(state => state.migration);
    const source = migrationInfo?.source;
    const target = migrationInfo?.target;
    const { migrating, migrationErrors, resource, success } = migrationInfo || {};
    const { failed } = migrationErrors || {};


    const handleResourceChange = (newResource) => {
        dispatch(setResourceType(newResource));
        if (Object.keys(source?.credentials)?.length && !source?.error) dispatch(fetchResources('source'));
        if (Object.keys(target?.credentials)?.length && !target?.error) dispatch(fetchResources('target'));
    }


    // Dispatch RESET when leaving this route
    useEffect(() => {
        return () => {
            dispatch(RESET());
        };
    }, [dispatch, location]);

    useLayoutEffect(() => {
        dispatch(setCurrentPage('Resource Updation'))
        // eslint-disable-next-line
    }, [])


    return (
        <Stack
            width="100%"
            justifyContent="center"
            alignItems="center"
            height="100%"
        >
            <div
                className='flex-center'
                style={{
                    height: '5%',
                    width: '100%'
                }}
            >
                <ResourceList defaultValue={resource} onChange={handleResourceChange} />
            </div>
            <div
                style={{
                    height: '95%',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingTop: '30px'
                }}
            >
                <div
                    style={{
                        paddingLeft: '10px',
                        width: '42%',
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    <Tenant type="source" storeName={"updation"} />
                </div>
                <div
                    style={{
                        height: '100%',
                        width: '16%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <GitHubTooltip heading={"Resource Updation"} link={'resourceUpdations'}>
                        <Button
                            startDecorator={<Sync/>}
                            size="lg"
                            variant="outlined"
                            sx={{
                                color: 'var(--primary-color)',
                                borderColor: 'var(--primary-color)',
                                transition: '0.3s background ease-out, 0.3s color ease-out',
                                '&:hover': {
                                    background: 'var(--primary-color)',
                                    color: 'var(--bg-color)',
                                    boxShadow: '0 0 5px var(--primary-color)'
                                },
                                '&:active': {
                                    boxShadow: '0 0 15px var(--text-color)',
                                    background: 'var(--primary-color)',
                                    color: 'var(--bg-color)',
                                    transform: 'scale(0.95)',
                                }
                            }}
                        >
                            Sync
                        </Button>
                    </GitHubTooltip>
                    {
                        migrating
                        &&
                        <Typography
                            component='h1'
                            sx={{
                                color: 'var(--primary-color)',
                                position: 'relative',
                                top: '30px',
                                '.MuiButton-loading': {
                                    color: 'red'
                                }
                            }}
                        >Migrating ...
                        </Typography>}
                    {
                        failed && !success &&
                        <ShowErrors details={migrationErrors} />
                    }
                    {
                        !failed && success &&
                        <Typography
                            color='success'
                            startDecorator={
                                <CheckCircleIcon color='success' />
                            }
                            sx={{
                                position: 'relative',
                                top: '100px',
                            }}
                        >Migrated Successfully!
                        </Typography>
                    }
                </div>
                <div
                    style={{
                        paddingRight: '10px',
                        width: '42%',
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    <Tenant type="target" storeName={"updation"} />
                </div>
            </div>
        </Stack>
    );
}

export default ResourceUpdation;