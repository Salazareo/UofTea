import { StatusCodes } from 'http-status-codes';
import { Dispatch } from 'redux';
import {
    errorGetReviews,
    errorPostReviews,
    loadingGetReviews,
    loadingPostReviews,
    successAppendReviews,
    successGetReviews,
    successPostReviews
} from '../actions/reviewActions';

export const getCourseReviews = (courseCode: string,
    ascending: boolean,
    lastItem?: { courseCode: string, time: number }) => {
    return async (dispatch: Dispatch) => {
        dispatch(loadingGetReviews());
        try {
            const response = await fetch(
                `/api/reviews/course/${courseCode.toLowerCase()}?ascending=${ascending}${lastItem ? `&lastItem=${JSON.stringify(lastItem)}` : ''}`);
            if (response.status === StatusCodes.OK) {
                lastItem ? dispatch(successAppendReviews(await response.json())) : dispatch(successGetReviews(await response.json()));
            } else {
                if (lastItem && response.status === StatusCodes.NOT_FOUND) {
                    dispatch(successAppendReviews(await response.json()))
                } else {
                    throw await response.text();
                }
            }
        } catch (error) {
            dispatch(errorGetReviews(error));
        }
    }
}

export interface CourseReviewValues {
    recommended: string;
    difficulty: number;
    usefulness: number;
    interesting: number;
    workload: number;
    review: string;
    prof: string;
}

export const postCourseReview = (courseCode: string, values: CourseReviewValues) => {
    return async (dispatch: Dispatch) => {
        dispatch(loadingPostReviews())
        if (courseCode === '') {
            throw (new Error('No course code'));
        };
        try {
            if (!(values.difficulty && values.usefulness && values.interesting && values.workload && values.review && values.prof)) {
                throw (new Error('Bad Request'));
            }
            const response = await fetch('/api/reviews/leave/course/' + courseCode, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ratings: {
                        recommended: values.recommended.toLowerCase() === 'yes' ? 1 : 0,
                        difficulty: values.difficulty,
                        useful: values.usefulness,
                        interesting: values.interesting,
                        workload: values.workload,
                    },
                    review: values.review,
                    prof: values.prof
                }),
            });
            if (response.status !== 200) {
                throw new Error(response.status.toString());
            }
            dispatch(successPostReviews(true));
        } catch (err) {
            dispatch(errorPostReviews(err, values));
        }
    }
}
