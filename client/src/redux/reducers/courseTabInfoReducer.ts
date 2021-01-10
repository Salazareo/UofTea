import { CourseTableData } from '../../components/CourseTable';
import { courseTabInfoActions } from '../actions/browsePageInfoActions';

interface CourseTabInfoState {
    courseTabInfo: CourseTableData[] | null | undefined;
    courseTabInfoLoading: boolean;
    pages: number;
    current: number;
    courseTabInfoError: Error | undefined;
}

const initialState: CourseTabInfoState = {
    courseTabInfo: [],
    pages: 1,
    current: 1,
    courseTabInfoLoading: true,
    courseTabInfoError: undefined,
}

export const courseTabInfoReducer = (state = initialState, action: courseTabInfoActions): CourseTabInfoState => {
    switch (action.type) {
        case 'COURSE_TAB_INFO_LOADING':
            return {
                ...state,
                courseTabInfo: null,
                courseTabInfoLoading: true,
                courseTabInfoError: undefined,
            }
        case 'COURSE_TAB_INFO_SUCC':
            return {
                pages: action.payload.pages,
                current: action.payload.current,
                courseTabInfo: action.payload.items,
                courseTabInfoLoading: false,
                courseTabInfoError: undefined,
            }
        case 'COURSE_TAB_INFO_ERR':
            return {
                pages: 1,
                current: 1,
                courseTabInfo: null,
                courseTabInfoLoading: false,
                courseTabInfoError: action.payload,
            }
        default:
            return state
    }
}