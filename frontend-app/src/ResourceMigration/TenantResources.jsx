import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { pushMigrationResourceId, popMigrationResourceId } from '../store/migrationSlice';
import Prism from 'prismjs';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism-okaidia.min.css'
import Card from '@mui/joy/Card';
import Typography from '@mui/joy/Typography';
import Tooltip from '@mui/joy/Tooltip';
import ListItemContent from '@mui/joy/ListItemContent';
import Stack from '@mui/joy/Stack';
import CheckBox from '../utils/CheckBox';
import BasicPopover from '../utils/Popover';
import Loading from '../common/Loading';
import Error2 from '../common/Error2';
import NoData from '../common/NoData';

const TenantResources = ({ type }) => {

    const dispatch = useDispatch();
    const state = useSelector(state => state?.migration?.[type]);
    const { loading, error, data, noData } = state

    async function highLightCode() {
        const wait = async (ms) => new Promise(resolve => setTimeout(resolve, ms));
        await wait(10);
        Prism.highlightAll();
    }

    const handleCheckboxClick = (event, resourceId) => {
        if (event?.target?.checked) dispatch(pushMigrationResourceId(resourceId));
        else dispatch(popMigrationResourceId(resourceId));
    }

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                height: '80%',
                overflowY: 'scroll',
                scrollbarWidth: 'none'
            }}
        >
            {loading && <div style={{ width: '100%', height: '95%' }}><Loading /></div>}
            {!loading && error && <div style={{ width: '100%', height: '95%' }}><Error2 errors={error} /></div>}
            {!loading && !error && noData && <div style={{ width: '100%', height: '95%' }}><NoData /></div>}
            {!loading && !error && !noData && Array.isArray(data) && (
                data.map(resource => (
                    <Card
                        key={`type-${resource?.id}`}
                        sx={{
                            width: '90%'
                        }}
                    >
                        <Stack
                            direction="row"
                            alignItems="center"
                            sx={{
                                width: '100%'
                            }}
                        >
                            {type === 'source' && <CheckBox handleCheckboxClick={(event) => handleCheckboxClick(event, resource?.id)} />}
                            <ListItemContent>
                                <Tooltip
                                    title={resource?.name?.length >= 43 && resource?.name}
                                    arrow
                                    color="primary"
                                    placement='right'
                                    variant='outlined'
                                    sx={{
                                        fontSize: '17px'
                                    }}
                                >
                                    <Typography
                                        level="title-md"
                                        sx={{
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            maxWidth: '97%',
                                        }}>
                                        {resource?.name}
                                    </Typography>
                                </Tooltip>
                                <Typography level="body-sm">
                                    {resource?.description}
                                </Typography>
                            </ListItemContent>
                            <BasicPopover onClick={highLightCode}>
                                <pre style={{ maxHeight: '350px', overflowY: 'auto', whiteSpace: 'pre-line', fontSize: '11px', margin: 0 }}>
                                    <code className='language-json'>{JSON.stringify(resource, null, 4)}</code>
                                </pre>
                            </BasicPopover>
                        </Stack>
                    </Card>
                ))
            )}
        </div>
    );
}

export default TenantResources;

