import { actionTypes } from './actionTypes';

export interface ProfSearch {
    title: string;
    description: string;
}

interface SearchProfLoading {
    type: actionTypes.SEARCH_PROF_REVIEW_LOADING
}
interface SearchProfSucc {
    type: actionTypes.SEARCH_PROF_REVIEW_SUCC;
    payload: ProfSearch[];
}
interface SearchProfErr {
    type: actionTypes.SEARCH_PROF_REVIEW_ERR
    payload: Error | undefined
}

interface SearchProffBreak {
    type: actionTypes.SEARCH_PROF_REVIEW_BREAK
}


export const loadingProfSearch = (): SearchProfLoading => {
    return {
        type: actionTypes.SEARCH_PROF_REVIEW_LOADING
    }
}

export const successProfSearch = (response: ProfSearch[]): SearchProfSucc => {
    return {
        type: actionTypes.SEARCH_PROF_REVIEW_SUCC,
        payload: response
    }
}

export const errorProfSearch = (error: Error | undefined): SearchProfErr => {
    return {
        type: actionTypes.SEARCH_PROF_REVIEW_ERR,
        payload: error
    }
}

export const breakProfSearch = (): SearchProffBreak => {
    return {
        type: actionTypes.SEARCH_PROF_REVIEW_BREAK,
    }
}

export type searchProfActions = ReturnType<typeof loadingProfSearch | typeof successProfSearch | typeof errorProfSearch | typeof breakProfSearch>;