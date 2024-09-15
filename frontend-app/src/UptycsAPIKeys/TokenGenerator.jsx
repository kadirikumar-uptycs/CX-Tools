import React, { useLayoutEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentPage } from '../store/authSlice';
import { useSnackbar } from '../hooks/SnackBarProvider';
import FileUpload1 from '../utils/FileUpload1';
import Box from '@mui/joy/Box';
import * as constants from '../utils/constants';
import CodeTyping from '../utils/CodeTyping';
import Button from '@mui/joy/Button';
import KeyboardDoubleArrowRightRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowRightRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import axios from 'axios';
import config from '../config';
import '../common/loader1.css';

const TokenGenerator = () => {
    const dispatch = useDispatch();
    const openSnackbar = useSnackbar();
    const [fileName, setFileName] = useState('');
    const [credentials, setCredentials] = useState({});
    const [needMoreInfo, setNeedMoreInfo] = useState(false);
    const [showCmd, setShowCmd] = useState(false);
    const [apiInfo, setApiInfo] = useState({
        loading: false,
        token: '',
        error: ''
    });

    const fileUploadHandler = (data, fileName) => {
        let requiredKeys = constants.REQUIRED_KEYS;
        let doesRequiredKeysExists = requiredKeys.every(key => key in data);
        if (!doesRequiredKeysExists) {
            openSnackbar('File does not contain required keys', 'danger');
            return
        } else {
            openSnackbar('File uploaded successfully', 'success');
            setFileName(fileName);
            setCredentials(data);
        }
    }

    const handleSubmission = async () => {
        setApiInfo(prev => ({
            ...prev,
            loading: true,
        }))
        try {
            let response = await axios.post(`${config.SERVER_BASE_ADDRESS}/authToken`, credentials, { withCredentials: true });
            setApiInfo({
                loading: false,
                token: response?.data,
                error: '',
            });
            setTimeout(() => {
                setNeedMoreInfo(true);
            }, 2000);
        } catch (error) {
            setApiInfo({
                loading: false,
                token: '',
                error: error.message,
            })
        }
    }

    const handleReset = () => {
        setCredentials({});
        setFileName('');
        setApiInfo(prev => ({
            ...prev,
            token: '',
            error: ''
        }));
        setNeedMoreInfo(false);
        setShowCmd(false);
        openSnackbar('Form Reset Done🧹', 'success');
    }

    const handleMoreInfoBtnClick = () => {
        setNeedMoreInfo(false);
        setShowCmd(true);
    }


    const getCURLCommand = () => `curl -X {{{METHOD}}} -H "Authorization: ${apiInfo.token}" -d '{{{PAYLOAD}}}' "https://${credentials?.domain}${credentials?.domainSuffix}/public/api/customers/${credentials?.customerId}/{{{endpoint}}}"`;

    useLayoutEffect(() => {
        dispatch(setCurrentPage('Uptycs API Auth Token Generator'))
        // eslint-disable-next-line
    }, [])

    return (
        <Box>
            <FileUpload1 label={fileName || 'Click to upload credentials file'} uploadHandler={fileUploadHandler} />
            <Box sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                padding: '40px',
                gap: '70px'
            }}>
                <Button
                    endDecorator={<KeyboardDoubleArrowRightRoundedIcon />}
                    disabled={!fileName}
                    sx={{
                        borderColor: 'var(--primary-color)',
                        background: 'var(--primary-color)',
                        color: 'var(--bg-color)',
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
                    onClick={handleSubmission}
                >
                    Proceed
                </Button>
                <Button
                    variant='outlined'
                    endDecorator={<RestartAltRoundedIcon />}
                    disabled={!fileName}
                    sx={{
                        width: '117px',
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
                    onClick={handleReset}
                >
                    Reset
                </Button>
            </Box>
            <Box sx={{
                display: 'flex',
                justifyContent: 'center'
            }}>
                {
                    apiInfo.loading
                        ?
                        (<div className="loader"></div>)
                        :
                        (
                            apiInfo.token ?

                                <CodeTyping heading="Auth Token" language="textile" code={apiInfo?.token} speed={10} />
                                :
                                <Box>{apiInfo.error}</Box>
                        )
                }
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                {needMoreInfo
                    &&
                    <Button
                        disabled={!fileName}
                        sx={{
                            borderColor: 'var(--primary-color)',
                            background: 'var(--primary-color)',
                            color: 'var(--bg-color)',
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
                        onClick={handleMoreInfoBtnClick}
                    >
                        Need More Info ?
                    </Button>
                }
                {showCmd
                    &&
                    <CodeTyping heading="CURL Command" language="bash" code={getCURLCommand()} speed={10} />
                }



            </Box>
        </Box>
    );
}

export default TokenGenerator;
