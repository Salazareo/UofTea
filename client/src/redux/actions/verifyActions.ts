import { actionTypes } from './actionTypes';

interface VerifyLoading {
    type: actionTypes.VERIFYING
}
interface VerifySucc {
    type: actionTypes.VERIFIED;
    payload: boolean;
}

export const loadingVerify = (): VerifyLoading => {
    return {
        type: actionTypes.VERIFYING
    }
}

export const successVerify = (response: boolean): VerifySucc => {
    return {
        type: actionTypes.VERIFIED,
        payload: response
    }
}

export type verifyActions = ReturnType<typeof loadingVerify | typeof successVerify>;
