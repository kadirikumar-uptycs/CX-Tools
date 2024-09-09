import React, { useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentPage } from '../store/authSlice';
const HomePage = () => {

    const dispatch = useDispatch();
    
    useLayoutEffect(() => {
        dispatch(setCurrentPage('Home'))
        // eslint-disable-next-line
    }, [])

    return (
        <div>
            Home Page
        </div>
    );
}

export default HomePage;
