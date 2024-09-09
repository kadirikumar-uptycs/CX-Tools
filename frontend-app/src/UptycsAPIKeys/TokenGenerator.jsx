import React, { useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentPage } from '../store/authSlice';

const TokenGenerator = () => {
    const dispatch = useDispatch();

    useLayoutEffect(() => {
        dispatch(setCurrentPage('Uptycs API Auth Token Generator'))
        // eslint-disable-next-line
    }, [])

    return (
        <div>
            Uptycs API Token Generator
        </div>
    );
}

export default TokenGenerator;
