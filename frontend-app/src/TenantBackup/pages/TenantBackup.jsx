import React, { useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Container } from '@mui/material';
import BackupStepper from './BackupStepper';
import { setCurrentPage } from '../../store/authSlice';

const TenantBackup = () => {
    const dispatch = useDispatch();

    useLayoutEffect(() => {
        dispatch(setCurrentPage('Tenant Backup'));
    }, [dispatch]);

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <BackupStepper />
        </Container>
    );
};

export default TenantBackup;