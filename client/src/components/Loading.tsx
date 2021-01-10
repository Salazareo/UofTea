import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/reducers';
import './css/loader.css';

export const Loading = () => {
    const { darkmode } = useSelector((state: RootState) => state.darkmodeReducer)
    return <div style={{ height: '80vh' }}>
        <div className={`loader ${darkmode ? 'dark' : ''}`}>Loading...</div>
    </div>
}