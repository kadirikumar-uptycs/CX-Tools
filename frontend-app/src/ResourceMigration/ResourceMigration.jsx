import React, { useLayoutEffect, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { setCurrentPage } from '../store/authSlice';
import { fetchResources, migrateResources, setResourceType, RESET } from '../store/migrationSlice';
import { useSnackbar } from '../hooks/SnackBarProvider';
import Tenant from './Tenant';
import ShowErrors from './ShowErrors';
import ResourceList from './ResourceList';
import Stack from '@mui/joy/Stack';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ButtonOutlined from '../utils/ButtonOutlined';
import Typography from '@mui/joy/Typography';

const ResourceMigration = () => {

    const dispatch = useDispatch();
    const location = useLocation();
    const openSnackbar = useSnackbar();
    const migrationInfo = useSelector(state => state.migration);
    const source = migrationInfo?.source;
    const target = migrationInfo?.target;
    const { migrationResourceIds, migrating, migrationErrors, resource, success } = migrationInfo || {};
    const { failed } = migrationErrors || {};

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
                    <ButtonOutlined
                        text={"Migrate"}
                        loading={migrating}
                        onClick={handleMigrationRequest}
                        icon={<SendIcon />}
                        styles={{ position: 'fixed' }}
                    />
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
                    <Tenant type="target" />
                </div>
            </div>
        </Stack>
    );
}

export default ResourceMigration;
