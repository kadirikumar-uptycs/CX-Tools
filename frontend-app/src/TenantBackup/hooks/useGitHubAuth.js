import { useState, useCallback } from 'react';
import config from '../../config';
import axios from 'axios';

export const useGitHubAuth = (onSuccess) => {
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [isValidatingAccess, setIsValidatingAccess] = useState(false);
    const [authStatus, setAuthStatus] = useState(null);
    const [user, setUser] = useState(null);

    const verifyAuthStatus = async () => {
        setAuthStatus(null);
        setIsValidatingAccess(true);
        try {
            let response = await axios.get(`${config.SERVER_BASE_ADDRESS}/github/status`, {
                withCredentials: true,
            });

            setAuthStatus('success');
            setUser(response?.data);
            setIsValidatingAccess(false);
            setTimeout(() => {
                setAuthStatus(null);
                onSuccess?.();
            }, 500);
        } catch (error) {
            setIsValidatingAccess(false);
            setAuthStatus('error');
            setUser(null)
        }
    };

    const handleAuth = useCallback(() => {
        setIsAuthenticating(true);
        const width = 600;
        const height = 600;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;

        const popup = window.open(
            `${config.SERVER_BASE_ADDRESS}/auth/github`,
            'GitHub Authorization',
            `width=${width},height=${height},left=${left},top=${top}`
        );

        const checkPopup = setInterval(() => {
            if (popup.closed) {
                setIsAuthenticating(false);
                verifyAuthStatus();
                clearInterval(checkPopup);
            }
        }, 500);
        // eslint-disable-next-line
    }, [onSuccess]);

    return { handleAuth, isAuthenticating, authStatus, isValidatingAccess, user };
};