import React, { useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import AccordionComponent from './Accordion';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';
import SnackBar from './SnackBar';
import { ContextProvider } from "./MigrateFlagProfiles";



export default function TenantResources({ type, credentials }) {

    let { setResourceData } = useContext(ContextProvider);
    

    let navigate = useNavigate();

    let setSnackBar;

    function setChildState(childStateSetter){
        setSnackBar = childStateSetter;
    }

    const [fetchData, setFetchData] = useState({
        isFetching: false,
        data: []
    })

    let accordionElements = fetchData.data.map(item => (
        <AccordionComponent
            key={item.id}
            type={type}
            summary={item.name}
            details={item}
        />
    ));

    let [searchParams, setSearchParams] = useSearchParams();
    let resourceFromURL = searchParams.get('resource');

    useEffect(() => {
        const fetchData = async () => {
            if (Object.keys(credentials).length > 0) {
                setFetchData(prev => ({
                    ...prev,
                    isFetching: true,
                }));
                const url = `http://localhost:17291/${resourceFromURL}`;
                try {
                    const response = await axios.post(url, { 'credentials': credentials });
                    setFetchData({
                        data: response.data,
                        isFetching: false,
                    });
                    setResourceData(prev => ({
                        ...prev,
                        [type] : response.data
                    }));
                } catch (err) {
                    console.log(err);
                    setFetchData(prev => ({
                        ...prev,
                        isFetching: false,
                    }));
                    if (err.response && err.response.status === 401) {
                        if (err.response.data.Authorized === false) {
                            throw navigate('/login');
                        } else {
                            setSnackBar({
                                open: true,
                                message: err.response.data.message.details || 'API Key Unauthorized',
                                severity: 'error',
                                duration: 4500,
                            })
                        }
                    }else{
                        setSnackBar({
                            open: true,
                            message: 'Server Error : Server is unavailable',
                            severity: 'error',
                            duration: 4500,
                        })
                    }
                }
            }
        };

        fetchData();
    }, [credentials, resourceFromURL]);

    return (
        <>
        {fetchData.isFetching ? <CircularProgress /> : (
            <div className="accordion" id="flag-profiles-source" style={{ width: "100%" }}>
                {accordionElements}
            </div>
        )}

        {/* SnackBar */}
        <SnackBar getChildState={setChildState}/>
        </>
    );
}
