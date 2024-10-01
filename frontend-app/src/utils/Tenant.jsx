import React from 'react';
import { setCredentials as setMigrationCredentials } from '../store/migrationSlice';
import { setCredentials as setUpdationCredentials } from '../store/updationSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useSnackbar } from '../hooks/SnackBarProvider';
import { fetchResources as fetchMigrationResources } from '../store/migrationSlice';
import { fetchResources as fetchUpdationResources } from '../store/updationSlice';
import TenantResources from './TenantResources';
import * as constants from './constants';
import InputFileUpload from './FileUpload';


const Tenant = ({ type, storeName }) => {
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
        openSnackbar('File uploaded successfully', 'success');
        if(storeName === 'migration'){
            dispatch(setMigrationCredentials({ type, fileName, credentials }));
            dispatch(fetchMigrationResources(type));
        }else{
            dispatch(setUpdationCredentials({ type, fileName, credentials }));
            dispatch(fetchUpdationResources(type));
        }
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
