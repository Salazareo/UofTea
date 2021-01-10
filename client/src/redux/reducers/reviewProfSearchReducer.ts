import { ProfSearch, searchProfActions } from '../actions/searchReviewProfActions';


export interface ProfSearchState {
    profsResults: ProfSearch[] | null | undefined;
    profsLoading: boolean;
    profsError: Error | undefined;
}

const initialState: ProfSearchState = {
    profsResults: [],
    profsLoading: false,
    profsError: undefined,
}

export const searchProfReducer = (state = initialState, action: searchProfActions): ProfSearchState => {
    switch (action.type) {
        case 'SEARCH_PROF_REVIEW_LOADING':
            return {
                ...state,
                profsLoading: true,
                profsError: undefined,
            }
        case 'SEARCH_PROF_REVIEW_SUCC':
            return {
                profsResults: action.payload,
                profsLoading: true,
                profsError: undefined,
            }
        case 'SEARCH_PROF_REVIEW_ERR':
            return {
                ...state,
                profsLoading: false,
                profsError: action.payload,
            }
        case 'SEARCH_PROF_REVIEW_BREAK':
            return {
                ...state,
                profsLoading: false,
                profsError: undefined
            }
        default:
            return state
    }
}