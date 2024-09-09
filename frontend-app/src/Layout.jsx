import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useSnackbar } from './hooks/SnackBarProvider';
import { login, logout } from './store/authSlice';
import SideBar from './Home/SideBar';
import Header from './Home/Header';
import Loading2 from './common/Loading2';
import ServerError from './common/ServerError';
import axios from 'axios';
import config from './config';
import './App.css';



const Layout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const openSnackbar = useSnackbar();
    let [loading, setLoading] = useState(true);
    let [errors, setErrors] = useState('');
    let isLoggedIn = useSelector(state => state?.auth?.loggedIn);

    const [sideBarOpen, setSideBarOpen] = useState(false);

    useLayoutEffect(() => {
        document.title = "CX Tools"
    })
    useEffect(() => {
        let TRIES_LEFT = 5;
        async function isAuthenticated() {
            setLoading(true);
            try {
                let response = await axios.get(`${config.SERVER_BASE_ADDRESS}/api`, { withCredentials: true });
                dispatch(login(response?.data));
                setLoading(false);
                setErrors('');
            } catch (err) {
                TRIES_LEFT--;
                if (err?.response?.status === 401) {
                    setTimeout(() => {
                        openSnackbar('UnAuthorized User! Please SIGN IN', 'danger');
                    }, 2000);
                    setTimeout(() => {
                        dispatch(logout());
                        navigate('/login');
                    }, 3000);
                } else {
                    if (TRIES_LEFT) {
                        await isAuthenticated();
                    } else {
                        setLoading(false);
                        setErrors(err?.message);
                    }
                }
            }
        }
        if (!isLoggedIn) {
            isAuthenticated();
        }
        // eslint-disable-next-line
    }, [])
    return (
        <div className='layout-container'>
            {loading && <Loading2 />}
            {!loading && errors && <ServerError errors={errors} />}
            {!loading && !errors && (
                <>
                    <SideBar onToggle={() => setSideBarOpen(value => !value)}/>
                    <div className={`main ${sideBarOpen?'':'sideBarClosed'}`}>
                        <Header />
                        <div className="content">
                            <Outlet />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Layout;