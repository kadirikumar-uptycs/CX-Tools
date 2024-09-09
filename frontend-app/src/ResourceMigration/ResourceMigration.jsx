import React, { useLayoutEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentPage } from '../store/authSlice';
import { fetchResources, migrateResources, setResourceType } from '../store/migrationSlice';
import { useSnackbar } from '../hooks/SnackBarProvider';
import Tenant from './Tenant';
import ShowErrors from './ShowErrors';
import ResourceList from './ResourceList';
import Stack from '@mui/joy/Stack';
import Button from '@mui/joy/Button';
import SendIcon from '@mui/icons-material/Send';
import ReportIcon from '@mui/icons-material/Report';
import Typography from '@mui/joy/Typography';
import IconButton from '@mui/joy/IconButton';

const ResourceMigration = () => {

    const dispatch = useDispatch();
    const openSnackbar = useSnackbar();
    const migrationInfo = useSelector(state => state.migration);
    const source = migrationInfo?.source;
    const target = migrationInfo?.target;
    const { migrationResourceIds, migrating, migrationErrors, resource } = migrationInfo || {};
    const { failed, total } = migrationErrors || {};
    const [showErrors, setShowErrors] = useState(false);
    const handleCloseErrorsDrawerComponent = () => setShowErrors(false);
    const handleClickShowErrors = () => setShowErrors(state => !state);

    const handleMigrationRequest = () => {
        if (typeof source?.credentials !== 'object' || !Object.keys(source?.credentials)?.length || source?.error) {
            openSnackbar('Provide SOURCE Credentials (LEFT SIDE)', 'warning');
        }
        else if (!Array.isArray(migrationResourceIds) || !migrationResourceIds?.length) {
            openSnackbar('Please Select atleast one source resource');
        }
        else if (typeof target?.credentials !== 'object' || !Object.keys(target?.credentials)?.length || target?.error) {
            openSnackbar('Provide TARGET Credentials (RIGHT SIDE)', 'warning');
        } else {
            dispatch(migrateResources());
        }
    }

    const handleResourceChange = (newResource) => {
        dispatch(setResourceType(newResource));
        if(Object.keys(source?.credentials)?.length && !source?.error) dispatch(fetchResources('source'));
        if(Object.keys(target?.credentials)?.length && !target?.error) dispatch(fetchResources('target'));
    }

    useLayoutEffect(() => {
        dispatch(setCurrentPage('Resource Migration'))
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
                    <Tenant type="source" />
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
                    <Button
                        disabled={false}
                        loading={migrating}
                        onClick={handleMigrationRequest}
                        startDecorator={<SendIcon />}
                        size="lg"
                        variant="outlined"
                        sx={{
                            position: 'fixed',
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
                    >Migrate</Button>
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
                        failed &&
                        <Typography
                            color='danger'
                            startDecorator={
                                <IconButton
                                    color='danger'
                                    onClick={handleClickShowErrors}
                                >
                                    <ReportIcon />
                                </IconButton>
                            }
                            sx={{
                                position: 'relative',
                                top: '100px',
                            }}
                        >{`${failed} out of ${total} failed`}
                        </Typography>
                    }
                    {
                        <ShowErrors open={showErrors} handleClose={handleCloseErrorsDrawerComponent} details={migrationErrors} />
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
                    <Tenant type="target" />
                </div>
            </div>
        </Stack>
    );
}

export default ResourceMigration;
