import React, { useContext, useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import AccordionComponent from './Accordion';
import axios from 'axios';
import config from '../config';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';
import SnackBar from './SnackBar';
import { ContextProvider } from "./MigrateResources";
import Typography from '@mui/material/Typography';
import './css/TenantResources.css';

export default function TenantResources({ type }) {

    let { state, setState } = useContext(ContextProvider);


    /* 

    reloadControllerValue :-

    When targetReload is set to true, useEffect runs and inside that useEffect after reloading
    resources by calling API, targetReload is set to false which will again render the component and as 
    the targetReload is indirectly set as a dependency for useEffect, useEffect will also run for the 2nd time as 
    Object.keys(credentials).length > 0 is true. To avoid this we are using useRef hook to track the multiple reloads

    Thus setting this useRef's current value to true will signal to stop running the useEffect code. 
    Once the useEffect is run, useRef's current value is set to false.

    */
    let reloadControllerValue = useRef(false);


    let navigate = useNavigate();

    const sleep = time => new Promise(res => setTimeout(res, time));

    let setSnackBar;

    function setChildState(childStateSetter) {
        setSnackBar = childStateSetter;
    }

    let [isLoading, setIsLoading] = useState(false);

    let data = type === 'source' ? (state.sourceResources) : (state.targetResources);

    let accordionElements = data.map(item => (
        <AccordionComponent
            key={item.id}
            type={type}
            summary={item.name}
            details={item}
        />
    ));

    let [searchParams,] = useSearchParams();
    let resourceFromURL = searchParams.get('resource') || 'flagProfiles';

    let doReload = (type === 'target') ? state.targetReload : false;

    let credentials = type === 'source' ? (state.sourceCredentials) : (state.targetCredentials);

    useEffect(() => {
        const fetchData = async () => {
            if (credentials && Object.keys(credentials).length > 0 && (!reloadControllerValue.current)) {
                setIsLoading(true);
                const url = `${config.SERVER_BASE_ADDRESS}/get/${resourceFromURL}`;
                try {
                    const response = await axios.post(url, { 'credentials': credentials });
                    setIsLoading(false);
                    let responseData = response.data;
                    if (responseData.length === 0) {
                        setSnackBar({
                            open: true,
                            message: `No data found on ${type}`,
                            severity: 'warning',
                            duration: 4500,
                        });
                        setState(prev => ({
                            ...prev,
                            [type + 'Resources']: [],
                            targetReload: false,
                        }));
                    } else {
                        setState(prev => ({
                            ...prev,
                            [type + 'Resources']: responseData,
                            targetReload: false,
                        }));
                    }
                } catch (err) {
                    console.log(err);
                    setIsLoading(false);
                    setState(prev => ({
                        ...prev,
                        [type + 'FileName']: 'No File Choosen',
                        [type + 'Resources']: [],
                        [type + 'Credentials']: {},
                        targetReload: false,
                    }));
                    if (err.response && err.response.status === 401) {
                        if (err.response.data.Authorized === false) {
                            setSnackBar({
                                open: true,
                                message: 'Session Expired',
                                severity: 'error',
                                duration: 4500,
                            });
                            await sleep(2000);
                            throw navigate('/login');
                        } else {
                            setSnackBar({
                                open: true,
                                message: type + ': ' + err.response.data.message.details || 'API Key Unauthorized',
                                severity: 'error',
                                duration: 4500,
                            })
                        }
                    } else {
                        setSnackBar({
                            open: true,
                            message: type.toUpperCase() + ': Server is unavailable',
                            severity: 'error',
                            duration: 4500,
                        })
                    }
                }
            }
        };

        fetchData();
        reloadControllerValue.current = doReload;
    }, [credentials, resourceFromURL, doReload]);

    // Show Not Found Template if resources are empty else all resources
    function resourceTemplate() {
        const credentials = state[`${type}Credentials`];
        const resources = state[`${type}Resources`];

        if (credentials && Object.keys(credentials)?.length && (!resources || resources.length === 0)) {
            return (
                <dotlottie-player
                    src="https://lottie.host/f4c6e1c2-5c61-4d41-995c-15070bb2bd3b/lOMPC2KUK5.json"
                    background="transparent"
                    speed="1"
                    style={{ width: '300px', height: '300px' }}
                    loop
                    autoplay
                >
                </dotlottie-player>
            )
        }
        return accordionElements;
    }

    return (
        <>
            {isLoading ? (<>
                <CircularProgress />
                <Typography sx={{
                    marginTop: '5px',
                    fontSize: '31px',
                    color: '#999',
                }}>Loading...</Typography>
            </>) : (
                <div className="accordion">
                    { resourceTemplate() }
                </div>
            )}

            {/* SnackBar */}
            <SnackBar getChildState={setChildState} />
        </>
    );
}
