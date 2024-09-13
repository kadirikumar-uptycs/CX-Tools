import React, { useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentPage } from '../store/authSlice';
import WorkInProgress from '../common/WorkInProgress';


const ResourceUpdation = () => {
    const dispatch = useDispatch();

    useLayoutEffect(() => {
        dispatch(setCurrentPage('Resource Updation'))
        // eslint-disable-next-line
    }, [])

    return (
        <div>
            <WorkInProgress />
        </div>
    );
}

export default ResourceUpdation;
