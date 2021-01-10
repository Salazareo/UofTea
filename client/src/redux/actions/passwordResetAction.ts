import { actionTypes } from './actionTypes';

interface ResetPasswordPayload {
    messageHeader: string;
    message: string;
}
interface ResetPasswordErrors {
    messageHeader: string;
    message: string
}
interface LoadingAction {
    type: actionTypes.RESET_PASS_LOADING
}
interface SuccessAction {
    type: actionTypes.RESET_PASS_SUCCESS
    payload: ResetPasswordPayload
}
interface ErrorAction {
    type: actionTypes.RESET_PASS_ERROR
    payload: ResetPasswordErrors | undefined
}
interface ResetAction {
    type: actionTypes.RESET_PASS_DEFAULT
}

export const resetPasswordLoading = (): LoadingAction => {
    return {
        type: actionTypes.RESET_PASS_LOADING
    }
}

export const resetPasswordSuccess = (response: ResetPasswordPayload): SuccessAction => {
    return {
        type: actionTypes.RESET_PASS_SUCCESS,
        payload: response
    }
}

export const resetPasswordError = (error: ResetPasswordErrors): ErrorAction => {
    return {
        type: actionTypes.RESET_PASS_ERROR,
        payload: error
    }
}

export const resetPasswordDefault = (): ResetAction => {
    return {
        type: actionTypes.RESET_PASS_DEFAULT
    }
}

export type passwordResetActionTypes = ReturnType<typeof resetPasswordLoading | typeof resetPasswordSuccess |
    typeof resetPasswordError | typeof resetPasswordDefault>;
