import { actionTypes } from './actionTypes';

interface AuthPayload {
    messageHeader: string;
    message: string;
    username: string;
}
interface AuthErrors {
    messageHeader: string;
    message: string
}
interface LoadingAction {
    type: actionTypes.AUTH_LOADING
}
interface SuccessAction {
    type: actionTypes.AUTH_SUCCESS
    payload: AuthPayload
}
interface ErrorAction {
    type: actionTypes.AUTH_ERROR
    payload: AuthErrors | undefined
}
interface ResetAction {
    type: actionTypes.RESET_AUTH
}

interface LogOutAction {
    type: actionTypes.LOG_OUT,
    payload: { header: string, content: string },
}
interface ClearLogOutAction {
    type: actionTypes.AUTH_DISPLAY_CLEAR
}


export const authLoading = (): LoadingAction => {
    return {
        type: actionTypes.AUTH_LOADING
    }
}

export const authSuccess = (response: AuthPayload): SuccessAction => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        payload: response
    }
}

export const authError = (error: AuthErrors): ErrorAction => {
    return {
        type: actionTypes.AUTH_ERROR,
        payload: error
    }
}
export const resetAuth = (): ResetAction => {
    return {
        type: actionTypes.RESET_AUTH
    }
}
export const logOut = (message: { header: string, content: string }): LogOutAction => {
    return {
        type: actionTypes.LOG_OUT,
        payload: message,
    }
}
export const logOutClear = (): ClearLogOutAction => {
    return {
        type: actionTypes.AUTH_DISPLAY_CLEAR
    }
}

export type authActionTypes = ReturnType<typeof authLoading | typeof authSuccess |
    typeof authError | typeof resetAuth | typeof logOut | typeof logOutClear>
