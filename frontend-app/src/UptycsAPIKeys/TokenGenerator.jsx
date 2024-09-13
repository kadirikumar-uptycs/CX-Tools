import React, { useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentPage } from '../store/authSlice';
import WorkInProgress from '../common/WorkInProgress';


const TokenGenerator = () => {
    const dispatch = useDispatch();

    useLayoutEffect(() => {
        dispatch(setCurrentPage('Uptycs API Auth Token Generator'))
        // eslint-disable-next-line
    }, [])

    return (
        <div>
            <WorkInProgress />
        </div>
    );
}

export default TokenGenerator;
