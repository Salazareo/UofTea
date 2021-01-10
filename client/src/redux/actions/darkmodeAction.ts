import { actionTypes } from './actionTypes';

interface DarkmodePayload {
    darkmode: boolean,
}
interface DarkmodeErrors {
    messageHeader: string
    message: string
}
interface LoadingAction {
    type: actionTypes.DARK_LOADING
}
interface SuccessAction {
    type: actionTypes.DARK_SUCCESS
    payload: DarkmodePayload
}
interface ErrorAction {
    type: actionTypes.DARK_ERROR
    payload: DarkmodeErrors | undefined
}

export const darkmodeLoading = (): LoadingAction => {
    return {
        type: actionTypes.DARK_LOADING
    }
}

export const darkmodeSuccess = (response: DarkmodePayload): SuccessAction => {
    return {
        type: actionTypes.DARK_SUCCESS,
        payload: response
    }
}

export const darkmodeError = (error: DarkmodeErrors): ErrorAction => {
    return {
        type: actionTypes.DARK_ERROR,
        payload: error
    }
}

export type darkmodeActionTypes = ReturnType<typeof darkmodeLoading | typeof darkmodeSuccess | typeof darkmodeError>;