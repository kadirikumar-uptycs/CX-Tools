import React, { useLayoutEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentPage } from '../store/authSlice';
import DropZoneFileUpload from '../utils/DropZoneFileUpload';
import OsqueryLogAnalyser from './OsqueryLogAnalyser';
import Typography from '@mui/joy/Typography';
import Box from '@mui/joy/Box';
import ActionButtons from './ActionButtons';
import FullAnalysis from './FullAnalysis';
import '../common/loader2.css';


const OsqueryAnalysis = () => {
    const dispatch = useDispatch();
    let [obj, setObj] = useState(null);
    let [loading, setLoading] = useState(false);
    const MAX_SIZE = 55 * 1024 * 1024;


    const handleFileUploadSuccess = async (data) => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        let workerLogs = data?.split('\n');
        let OsqueryStartObj = new OsqueryLogAnalyser(workerLogs);
        await new Promise(resolve => setTimeout(resolve, 500));
        setLoading(false);
        setObj(OsqueryStartObj);
    }

    const resetState = () => {
        setLoading(false);
        setObj(null);
    }

    useLayoutEffect(() => {
        dispatch(setCurrentPage('Osquery Log Analysis'))
        // eslint-disable-next-line
    }, [])

    return (
        <>
            {!obj &&
                <Box sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    {!loading &&
                        (
                            <DropZoneFileUpload
                                handleFileUploadSuccess={handleFileUploadSuccess}
                                MAX_SIZE={MAX_SIZE}
                                acceptedFileFormats={{
                                    "text/plain": [".log"],
                                }}
                            />
                        )
                    }
                    {loading &&
                        (
                            <>
                                <div className="loader2"></div>
                                <Typography
                                    marginLeft={3}
                                    fontSize={31}
                                    sx={{
                                        color: 'var(--primary-color)',
                                        fontFamily: 'monospace',
                                        textShadow: '0 0 3px var(--primary-color)',
                                        animation: 'fade-in-out 0.8s ease-in-out infinite alternate',
                                    }}
                                >
                                    Analyzing...
                                </Typography>
                                <style>
                                    {`
                                    @keyframes fade-in-out {
                                        0% {
                                            opacity: 0.2;
                                        }
                                        25% {
                                            opacity: 0.4;
                                        }
                                        50% {
                                            opacity: 0.6;
                                        }
                                        75% {
                                            opacity: 0.8;
                                        }
                                        100% {
                                            opacity: 1;
                                        }
                                    }
                                `}
                                </style>
                            </>

                        )
                    }
                </Box>
            }
            {obj && <ActionButtons handleClear={resetState} />}
            {obj && <FullAnalysis obj={obj} />}

        </>
    );
}

export default OsqueryAnalysis;
