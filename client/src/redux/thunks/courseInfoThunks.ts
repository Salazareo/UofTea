import { StatusCodes } from 'http-status-codes';
import { Dispatch } from 'redux';
import { CourseInfo } from '../../views/CourseView';
import { errorCourseInfo, loadingCourseInfo, successCourseInfo } from '../actions/courseInfoActions';

export const getCourseInfo = (courseCode: string) => {
    return async (dispatch: Dispatch) => {
        dispatch(loadingCourseInfo());
        try {
            const courseList = (await (await fetch(`https://nikel.ml/api/courses?code=${courseCode}`)).json()).response
            if (courseList.length <= 0 || courseList[0].code?.toLowerCase() !== courseCode.toLowerCase()) {
                throw (new Error('404'));
            }
            const courseInfo: CourseInfo = {
                code: courseCode,
                name: courseList[0].name,
                campus: courseList[0].campus,
                description: courseList[0].description,
                exclusions: courseList[0].exclusions,
                prereqs: courseList[0].prerequisites,
                coreqs: courseList[0].corequisites,
                recommendedPrep: courseList[0].recommended_preparation,
                utmBreath: courseList[0].utm_distribution,
                utscBreath: courseList[0].utsc_breadth,
                stgBreath: courseList[0].arts_and_science_breadth,
                level: courseList[0].level,
                offerings: courseList.map((offering: { term: string; meeting_sections: any[]; }) => {
                    return {
                        term: offering.term,
                        sections: offering.meeting_sections
                    }
                }).reduce((acc: any[], curr: { sections: any[]; }) => {
                    return curr.sections?.length ? [...acc, curr] : acc;
                }, [])
            }
            try {
                const response = await fetch(`/api/ratings/course/${courseCode.toLowerCase()}`)
                if (response.status === StatusCodes.OK || StatusCodes.NOT_FOUND) {
                    courseInfo.ratings = (await response.json());
                }
            }
            catch (serverOopsie) {
                courseInfo.ratings = undefined;
            }
            dispatch(successCourseInfo(courseInfo))
        } catch (error) {
            dispatch(errorCourseInfo(error));
        }
    }
}