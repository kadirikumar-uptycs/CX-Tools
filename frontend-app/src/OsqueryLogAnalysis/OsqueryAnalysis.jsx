import React, { useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentPage } from '../store/authSlice';

const OsqueryAnalysis = () => {
    const dispatch = useDispatch();

    useLayoutEffect(() => {
        dispatch(setCurrentPage('Osquery Log Analysis'))
        // eslint-disable-next-line
    }, [])

    return (
        <div>

        </div>
    );
}

export default OsqueryAnalysis;
