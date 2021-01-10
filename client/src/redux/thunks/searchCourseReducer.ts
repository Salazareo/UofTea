import { Dispatch } from 'redux';
import { breakCourseSearch, CourseSearch, errorCourseSearch, loadingCourseSearch, successCourseSearch } from '../actions/searchReviewCourseActions';

export interface CourseResult {
    code: string;
    title: string;
}

export const searchCourse = (queryString: string) => {
    return async (dispatch: Dispatch) => {
        if (queryString.length < 3 || queryString.length > 10) {
            dispatch(successCourseSearch([]));
            return dispatch(breakCourseSearch())
        }

        dispatch(loadingCourseSearch());
        try {
            const courseList = (await (await fetch(`https://nikel.ml/api/courses?code=${queryString}`)).json()).response;

            const parsedResults: CourseSearch[] = [];

            if (courseList.length <= 0) {
                dispatch(successCourseSearch([]));
            }
            const added: string[] = [];
            courseList.forEach((course: { code: string; name: string; }) => {
                const parsedCourse: CourseSearch = {
                    title: course.code as string,
                    description: course.name,
                }
                if (added.indexOf(course.code) < 0 && parsedResults.length < 3) {
                    parsedResults.push(parsedCourse);
                    added.push(course.code);
                }
            });

            dispatch(successCourseSearch(parsedResults));
            setTimeout(() => dispatch(breakCourseSearch()), 100);
        } catch (error) {
            dispatch(errorCourseSearch(error));
        }
    }
}