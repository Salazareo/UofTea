import { ProfInfo } from '../../views/ProfView';
import { profInfoActions } from '../actions/profInfoActions';

interface ProfInfoState {
    profInfo: ProfInfo | null | undefined;
    profInfoLoading: boolean;
    profInfoError: Error | undefined;
}

const initialState: ProfInfoState = {
    profInfo: undefined,
    profInfoLoading: true,
    profInfoError: undefined,
}

export const profInfoReducer = (state = initialState, action: profInfoActions) => {
    switch (action.type) {
        case 'PROF_INFO_LOADING':
            return {
                profInfo: undefined,
                profInfoLoading: true,
                profInfoError: undefined,
            }
        case 'PROF_INFO_SUCC':
            return {
                profInfo: action.payload,
                profInfoLoading: false,
                profInfoError: undefined,
            }
        case 'PROF_INFO_ERR':
            return {
                profInfo: undefined,
                profInfoLoading: false,
                profInfoError: action.payload,
            }
        default:
            return state
    }
}