import { StatusCodes } from 'http-status-codes';
import { Dispatch } from 'redux';
import { darkmodeError, darkmodeSuccess } from '../actions/darkmodeAction';

export const darkmodeToggle = (darkmodeStatus: boolean) => {
    return async (dispatch: Dispatch) => {
        try {
            const res = await fetch('/api/user/darkmode', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    darkmode: darkmodeStatus
                }),
            });
            if (res.status === StatusCodes.OK) {
                dispatch(darkmodeSuccess({ darkmode: darkmodeStatus }));
                darkmodeStatus ?
                    document.body.classList.add('dark-bg-footer') :
                    document.body.classList.remove('dark-bg-footer');
            } else {
                throw new Error(res.statusText);
            }
        } catch (err) {
            dispatch(darkmodeError({
                messageHeader: 'Internal Server Error',
                message: err
            }));
        }
    }
}

export const obtainDarkmode = () => {
    return async (dispatch: Dispatch) => {
        try {
            const res = await fetch(`/api/user/darkmode`)
            if (res.status === StatusCodes.OK) {
                const resJson = await res.json()
                dispatch(darkmodeSuccess({
                    darkmode: resJson.darkmode
                }));
                resJson.darkmode ?
                    document.body.classList.add('dark-bg-footer') :
                    document.body.classList.remove('dark-bg-footer');
            } else {
                dispatch(darkmodeSuccess({
                    darkmode: false
                }));
                document.body.classList.remove('dark-bg-footer')
            }
        } catch (err) {
            dispatch(darkmodeError({
                messageHeader: 'Internal Server Error',
                message: err
            }));
            document.body.classList.remove('dark-bg-footer');
        }
    }
}