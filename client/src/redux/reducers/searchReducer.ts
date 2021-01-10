import { SearchResult } from '../../views/LandingView';
import { searchActions } from '../actions/searchActions';

export interface SearchState {
    searchResults: SearchResult[] | null | undefined;
    searchLoading: boolean;
    searchError: Error | undefined;
}

const initialState: SearchState = {
    searchResults: [],
    searchLoading: false,
    searchError: undefined,
}

export const searchReducer = (state = initialState, action: searchActions): SearchState => {
    switch (action.type) {
        case 'SEARCH_LOADING':
            return {
                ...state,
                searchLoading: true,
                searchError: undefined,
            }
        case 'SEARCH_SUCC':
            return {
                searchResults: action.payload,
                searchLoading: true,
                searchError: undefined,
            }
        case 'SEARCH_ERR':
            return {
                ...state,
                searchLoading: false,
                searchError: action.payload,
            }
        case 'SEARCH_BREAK':
            return {
                ...state,
                searchLoading: false,
                searchError: undefined
            }
        default:
            return state
    }
}