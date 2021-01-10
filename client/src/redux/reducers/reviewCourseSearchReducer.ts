import { CourseSearch, searchCourseActions } from '../actions/searchReviewCourseActions';


export interface CourseSearchState {
    coursesResults: CourseSearch[] | null | undefined;
    coursesLoading: boolean;
    coursesError: Error | undefined;
}

const initialState: CourseSearchState = {
    coursesResults: [],
    coursesLoading: false,
    coursesError: undefined,
}

export const searchCourseReducer = (state = initialState, action: searchCourseActions): CourseSearchState => {
    switch (action.type) {
        case 'SEARCH_COURSE_REVIEW_LOADING':
            return {
                ...state,
                coursesLoading: true,
                coursesError: undefined,
            }
        case 'SEARCH_COURSE_REVIEW_SUCC':
            return {
                coursesResults: action.payload,
                coursesLoading: true,
                coursesError: undefined,
            }
        case 'SEARCH_COURSE_REVIEW_ERR':
            return {
                ...state,
                coursesLoading: false,
                coursesError: action.payload,
            }
        case 'SEARCH_COURSE_REVIEW_BREAK':
            return {
                ...state,
                coursesLoading: false,
                coursesError: undefined
            }
        default:
            return state
    }
}