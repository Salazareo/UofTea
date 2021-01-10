import { StatusCodes } from 'http-status-codes';
import { Dispatch } from 'redux';
import { errorProfInfo, loadingProfInfo, successProfInfo } from '../actions/profInfoActions';


export const getprofInfo = (profName: string) => {
    return async (dispatch: Dispatch) => {
        dispatch(loadingProfInfo());
        try {
            const response = await fetch(`/api/professors/${profName.toLowerCase()}`)
            if (response.status === StatusCodes.OK) {
                dispatch(successProfInfo(await response.json()))
            } else if (response.status === StatusCodes.NOT_FOUND) {
                throw new Error('404')
            } else {
                throw new Error(response.statusText)
            }
        } catch (error) {
            dispatch(errorProfInfo(error));
        }
    }
}