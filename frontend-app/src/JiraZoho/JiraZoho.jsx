import React, { useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentPage } from '../store/authSlice';
import WorkInProgress from '../common/WorkInProgress';


const JiraZoho = () => {
    const dispatch = useDispatch();

    useLayoutEffect(() => {
        dispatch(setCurrentPage('Jira Zoho Integration'))
        // eslint-disable-next-line
    }, [])

    return (
        <div>
            <WorkInProgress />
        </div>
    );
}

export default JiraZoho;
