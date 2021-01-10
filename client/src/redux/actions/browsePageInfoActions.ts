import { CourseTableData } from '../../components/CourseTable';
import { ProfTableData } from '../../components/ProfessorTable';
import { actionTypes } from './actionTypes';

interface ProfTabInfoLoading {
    type: actionTypes.PROF_TAB_INFO_LOADING
}
interface ProfTabInfoSucc {
    type: actionTypes.PROF_TAB_INFO_SUCC;
    payload: { items: ProfTableData[], pages: number, current: number };
}
interface ProfTabInfoErr {
    type: actionTypes.PROF_TAB_INFO_ERR
    payload: Error | undefined
}


export const loadingProfTabInfo = (): ProfTabInfoLoading => {
    return {
        type: actionTypes.PROF_TAB_INFO_LOADING
    }
}

export const successProfTabInfo = (response: { items: ProfTableData[], pages: number, current: number }): ProfTabInfoSucc => {
    return {
        type: actionTypes.PROF_TAB_INFO_SUCC,
        payload: response
    }
}

export const errorProfTabInfo = (error: Error | undefined): ProfTabInfoErr => {
    return {
        type: actionTypes.PROF_TAB_INFO_ERR,
        payload: error
    }
}

export type profTabInfoActions = ReturnType<typeof loadingProfTabInfo | typeof successProfTabInfo | typeof errorProfTabInfo>;



interface CourseTabInfoLoading {
    type: actionTypes.COURSE_TAB_INFO_LOADING
}
interface CourseTabInfoSucc {
    type: actionTypes.COURSE_TAB_INFO_SUCC;
    payload: { items: CourseTableData[], pages: number, current: number };
}
interface CourseTabInfoErr {
    type: actionTypes.COURSE_TAB_INFO_ERR
    payload: Error | undefined
}


export const loadingCourseTabInfo = (): CourseTabInfoLoading => {
    return {
        type: actionTypes.COURSE_TAB_INFO_LOADING
    }
}

export const successCourseTabInfo = (response: { items: CourseTableData[], pages: number, current: number }): CourseTabInfoSucc => {
    return {
        type: actionTypes.COURSE_TAB_INFO_SUCC,
        payload: response
    }
}

export const errorCourseTabInfo = (error: Error | undefined): CourseTabInfoErr => {
    return {
        type: actionTypes.COURSE_TAB_INFO_ERR,
        payload: error
    }
}

export type courseTabInfoActions = ReturnType<typeof loadingCourseTabInfo | typeof successCourseTabInfo | typeof errorCourseTabInfo>;