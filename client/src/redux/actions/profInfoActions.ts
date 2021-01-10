import { ProfInfo } from '../../views/ProfView';
import { actionTypes } from './actionTypes';

interface ProfInfoLoading {
    type: actionTypes.PROF_INFO_LOADING
}
interface ProfInfoSucc {
    type: actionTypes.PROF_INFO_SUCC;
    payload: ProfInfo | undefined;
}
interface ProfInfoErr {
    type: actionTypes.PROF_INFO_ERR
    payload: Error
}


export const loadingProfInfo = (): ProfInfoLoading => {
    return {
        type: actionTypes.PROF_INFO_LOADING
    }
}

export const successProfInfo = (response: ProfInfo | undefined): ProfInfoSucc => {
    return {
        type: actionTypes.PROF_INFO_SUCC,
        payload: response
    }
}

export const errorProfInfo = (error: Error): ProfInfoErr => {
    return {
        type: actionTypes.PROF_INFO_ERR,
        payload: error
    }
}

export type profInfoActions = ReturnType<typeof loadingProfInfo | typeof successProfInfo | typeof errorProfInfo>;