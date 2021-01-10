import { StatusCodes } from 'http-status-codes';
import { Dispatch } from 'redux';
import { loadingVerify, successVerify } from '../actions/verifyActions';

export const verifyUser = (secret: string) => {
    return async (dispatch: Dispatch) => {
        if (!secret) {
            return dispatch(successVerify(false));
        }
        dispatch(loadingVerify());
        try {
            const res = await fetch(`/api/user/verify/${secret}`);
            if (res.status === StatusCodes.OK) {
                dispatch(successVerify(true));
            } else {
                throw new Error(res.statusText);
            }
        } catch (err) {
            dispatch(successVerify(false));
        }
    }
}