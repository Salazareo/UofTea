import { actionTypes } from './actionTypes';

export interface CourseSearch {
    title: string;
    description: string;
}

interface SearchCourseLoading {
    type: actionTypes.SEARCH_COURSE_REVIEW_LOADING
}
interface SearchCourseSucc {
    type: actionTypes.SEARCH_COURSE_REVIEW_SUCC;
    payload: CourseSearch[];
}
interface SearchCourseErr {
    type: actionTypes.SEARCH_COURSE_REVIEW_ERR
    payload: Error | undefined
}

interface SearchCoursefBreak {
    type: actionTypes.SEARCH_COURSE_REVIEW_BREAK
}


export const loadingCourseSearch = (): SearchCourseLoading => {
    return {
        type: actionTypes.SEARCH_COURSE_REVIEW_LOADING
    }
}

export const successCourseSearch = (response: CourseSearch[]): SearchCourseSucc => {
    return {
        type: actionTypes.SEARCH_COURSE_REVIEW_SUCC,
        payload: response
    }
}

export const errorCourseSearch = (error: Error | undefined): SearchCourseErr => {
    return {
        type: actionTypes.SEARCH_COURSE_REVIEW_ERR,
        payload: error
    }
}

export const breakCourseSearch = (): SearchCoursefBreak => {
    return {
        type: actionTypes.SEARCH_COURSE_REVIEW_BREAK,
    }
}

export type searchCourseActions = ReturnType<typeof loadingCourseSearch | typeof successCourseSearch | typeof errorCourseSearch | typeof breakCourseSearch>;