import { CourseInfo } from '../../views/CourseView';
import { courseInfoActions } from '../actions/courseInfoActions';

interface CourseInfoState {
    courseInfo: CourseInfo | null | undefined;
    courseInfoLoading: boolean;
    courseInfoError: Error | undefined;
}

const initialState: CourseInfoState = {
    courseInfo: null,
    courseInfoLoading: true,
    courseInfoError: undefined,
}

export const courseInfoReducer = (state = initialState, action: courseInfoActions) => {
    switch (action.type) {
        case 'COURSE_INFO_LOADING':
            return {
                courseInfo: null,
                courseInfoLoading: true,
                courseInfoError: undefined,
            }
        case 'COURSE_INFO_SUCC':
            return {
                courseInfo: action.payload,
                courseInfoLoading: false,
                courseInfoError: undefined,
            }
        case 'COURSE_INFO_ERR':
            return {
                courseInfo: null,
                courseInfoLoading: false,
                courseInfoError: action.payload,
            }
        default:
            return state
    }
}