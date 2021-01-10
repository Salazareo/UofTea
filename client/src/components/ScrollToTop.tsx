import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './css/loader.css';

export const ScrollToTop = () => {
    const location = useLocation();
    const [{ path }, setpath] = useState({
        path: ''
    });

    if (path !== location.pathname) {
        window.scrollTo(0, 0);
        setpath(() => ({ path: location.pathname }))
    }
    return null;
}