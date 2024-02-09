import React, { useEffect, useState } from 'react';
import AccordionComponent from './Accordion';
import CodeHighlighter from './CodeHighlighter';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';

export default function TenantResources({ type, credentials, setSnackBar }) {

    let navigate = useNavigate();

    const [fetchData, setFetchData] = useState({
        isFetching: false,
        data: []
    })

    let accordionElements = fetchData.data.map(item => (
        <AccordionComponent
            key={item.id}
            type={type}
            summary={item.name}
            details={<CodeHighlighter data={item} />}
        />
    ));

    useEffect(() => {
        const fetchData = async () => {
            if (Object.keys(credentials).length > 0) {
                setFetchData(prev => ({
                    ...prev,
                    isFetching: true,
                }));
                const url = 'http://localhost:17291/flagProfiles';
                try {
                    const response = await axios.post(url, { 'credentials': credentials });
                    setFetchData({
                        data: response.data,
                        isFetching: false,
                    });
                } catch (err) {
                    console.log(err);
                    setFetchData(prev => ({
                        ...prev,
                        isFetching: false,
                    }));
                    if (err.response && err.response.status === 401) {
                        if (err.response.data.Authorized === false) {
                            navigate('/login');
                        } else {
                            setSnackBar({
                                open: true,
                                message: err.response.data.message.details || 'API Key Unauthorized',
                                severity: 'error'
                            })
                        }
                    }else{
                        setSnackBar({
                            open: true,
                            message: 'Server Error : Server is unavailable',
                            severity: 'error'
                        })
                    }
                }
            }
        };

        fetchData();
    }, [credentials]);

    return (
        fetchData.isFetching ? <CircularProgress /> : (
            <div className="accordion" id="flag-profiles-source" style={{ width: "100%" }}>
                {accordionElements}
            </div>
        )
    );
}
