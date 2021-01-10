import { ProfTableData } from '../../components/ProfessorTable';
import { profTabInfoActions } from '../actions/browsePageInfoActions';

interface ProfTabInfoState {
    profTabInfo: ProfTableData[] | null | undefined;
    profTabInfoLoading: boolean;
    pages: number;
    current: number;
    profTabInfoError: Error | undefined;
}

const initialState: ProfTabInfoState = {
    profTabInfo: [],
    pages: 1,
    current: 1,
    profTabInfoLoading: true,
    profTabInfoError: undefined,
}


export const profTabInfoReducer = (state = initialState, action: profTabInfoActions): ProfTabInfoState => {
    switch (action.type) {
        case 'PROF_TAB_INFO_LOADING':
            return {
                ...state,
                profTabInfo: null,
                profTabInfoLoading: true,
                profTabInfoError: undefined,
            }
        case 'PROF_TAB_INFO_SUCC':
            return {
                pages: action.payload.pages,
                current: action.payload.current,
                profTabInfo: action.payload.items,
                profTabInfoLoading: false,
                profTabInfoError: undefined,
            }
        case 'PROF_TAB_INFO_ERR':
            return {
                pages: 1,
                current: 1,
                profTabInfo: null,
                profTabInfoLoading: false,
                profTabInfoError: action.payload,
            }
        default:
            return state
    }
}