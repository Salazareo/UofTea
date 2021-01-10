import { Dispatch } from 'redux';
import { CourseFilterQuery, parseUrlFromQueryObj } from '../../components/CourseFilters';
import { errorCourseTabInfo, loadingCourseTabInfo, successCourseTabInfo } from '../actions/browsePageInfoActions';

export const getCourseTabInfo = (query: CourseFilterQuery, page = 1, max = 15) => {
    return async (dispatch: Dispatch) => {
        dispatch(loadingCourseTabInfo());
        try {
            const uofTeaQueryStr = parseUrlFromQueryObj(query, true).replace(/(utm_distribution)|(arts_and_science_breadth)|(utsc_breadth)/g, 'breadth')
            const uofTeaQuery = await fetch(`/api/courses?limit=${max}&page=${page}&${uofTeaQueryStr}`);

            if (!uofTeaQuery.ok) {
                throw new Error(uofTeaQuery.statusText);
            }
            const res = (await uofTeaQuery.json())
            dispatch(successCourseTabInfo({
                current: res.current,
                items: res.items.map((course: { identifier: string, subject: string, ratings: any, campus: string, courseName: string }) => {
                    return {
                        courseCode: `${course.subject}${course.identifier}`.toUpperCase(),
                        courseName: course.courseName,
                        recommended: course.ratings && course.ratings.recommended.total ? course.ratings.recommended.avg * 100 : 'N/A',
                        workload: course.ratings && course.ratings.workload.total ? course.ratings.workload.avg * 100 / 5 : 'N/A',
                        difficulty: course.ratings && course.ratings.difficulty.total ? course.ratings.difficulty.avg * 100 / 5 : 'N/A'
                    }
                }),
                pages: res.pages
            }));

        } catch (error) {
            dispatch(errorCourseTabInfo(error));
        }
    }
}