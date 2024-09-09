import React, { useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentPage } from '../store/authSlice';

const ResourceUpdation = () => {
    const dispatch = useDispatch();

    useLayoutEffect(() => {
        dispatch(setCurrentPage('Resource Updation'))
        // eslint-disable-next-line
    }, [])

    return (
        <div>
            Resource Updation
        </div>
    );
}

export default ResourceUpdation;
