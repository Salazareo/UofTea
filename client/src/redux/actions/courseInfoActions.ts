import { CourseInfo } from '../../views/CourseView';
import { actionTypes } from './actionTypes';

interface CourseInfoLoading {
    type: actionTypes.COURSE_INFO_LOADING
}
interface CourseInfoSucc {
    type: actionTypes.COURSE_INFO_SUCC;
    payload: CourseInfo;
}
interface CourseInfoErr {
    type: actionTypes.COURSE_INFO_ERR
    payload: Error | undefined
}


export const loadingCourseInfo = (): CourseInfoLoading => {
    return {
        type: actionTypes.COURSE_INFO_LOADING
    }
}

export const successCourseInfo = (response: CourseInfo): CourseInfoSucc => {
    return {
        type: actionTypes.COURSE_INFO_SUCC,
        payload: response
    }
}

export const errorCourseInfo = (error: Error | undefined): CourseInfoErr => {
    return {
        type: actionTypes.COURSE_INFO_ERR,
        payload: error
    }
}

export type courseInfoActions = ReturnType<typeof loadingCourseInfo | typeof successCourseInfo | typeof errorCourseInfo>;