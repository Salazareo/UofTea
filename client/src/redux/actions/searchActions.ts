import { SearchResult } from '../../views/LandingView';
import { actionTypes } from './actionTypes';

interface SearchLoading {
    type: actionTypes.SEARCH_LOADING
}
interface SearchSucc {
    type: actionTypes.SEARCH_SUCC;
    payload: SearchResult[];
}
interface SearchErr {
    type: actionTypes.SEARCH_ERR
    payload: Error | undefined
}

interface SearchBreak {
    type: actionTypes.SEARCH_BREAK
}


export const loadingSearch = (): SearchLoading => {
    return {
        type: actionTypes.SEARCH_LOADING
    }
}

export const successSearch = (response: SearchResult[]): SearchSucc => {
    return {
        type: actionTypes.SEARCH_SUCC,
        payload: response
    }
}

export const errorSearch = (error: Error | undefined): SearchErr => {
    return {
        type: actionTypes.SEARCH_ERR,
        payload: error
    }
}

export const breakSearch = (): SearchBreak => {
    return {
        type: actionTypes.SEARCH_BREAK,
    }
}

export type searchActions = ReturnType<typeof loadingSearch | typeof successSearch | typeof errorSearch | typeof breakSearch>;