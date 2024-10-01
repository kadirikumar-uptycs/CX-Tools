import React from 'react';
import { setCredentials } from '../store/migrationSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useSnackbar } from '../hooks/SnackBarProvider';
import { fetchResources } from '../store/migrationSlice';
import TenantResources from './TenantResources';
import * as constants from './constants';
import InputFileUpload from './FileUpload';


const Tenant = ({ type, storeName }) => {
    console.log(storeName, type);
    const dispatch = useDispatch();
    const openSnackbar = useSnackbar();
    const state = useSelector(state => state[storeName][type]);
    const { fileName } = state;

    const uploadHandler = (credentials, fileName) => {
        let requiredKeys = constants.REQUIRED_KEYS;
        let doesRequiredKeysExists = requiredKeys.every(key => key in credentials);
        if (!doesRequiredKeysExists) {
            openSnackbar('File does not contain required keys', 'danger');
            return
        }
        dispatch(setCredentials({ type, fileName, credentials }));
        openSnackbar('File uploaded successfully', 'success');
        dispatch(fetchResources(type));
    }

    return (
        <div
            style={{
                width: '100%'
            }}
        >
            <div
                style={{
                    paddingBottom: '50px'
                }}
            >
                <InputFileUpload label={fileName} uploadHandler={uploadHandler} />
            </div>
            <TenantResources type={type} storeName={storeName} />
        </div>
    );
}

export default Tenant;
