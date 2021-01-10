import { StatusCodes } from 'http-status-codes'
import { Dispatch } from 'redux';
import {
    errorGetProfReviews, errorPostProfReviews, loadingGetProfReviews,
    loadingPostProfReviews, successAppendProfReviews, successGetProfReviews, successPostProfReviews
} from '../actions/reviewProfActions';

export const getProfReviews = (professor: string, ascending: boolean, lastItem?: { professor: string, time: number }) => {
    return async (dispatch: Dispatch) => {
        dispatch(loadingGetProfReviews());
        try {
            const response = await fetch(
                `/api/reviews/professor/${professor.toLowerCase()}?ascending=${ascending}${lastItem ? `&lastItem=${JSON.stringify(lastItem)}` : ''}`);
            if (response.status === StatusCodes.OK) {
                lastItem ? dispatch(successAppendProfReviews(await response.json())) : dispatch(successGetProfReviews(await response.json()));
            } else {
                if (lastItem && response.status === StatusCodes.NOT_FOUND) {
                    dispatch(successAppendProfReviews(await response.json()))
                } else {
                    throw await response.text();
                }
            }
        } catch (error) {
            dispatch(errorGetProfReviews(error));
        }
    }
}
export interface ProfReviewValues {
    recommended: string;
    clarity: number;
    engaging: number;
    review: string;
    course: string;
}
export const postProfReview = (professor: string, values: ProfReviewValues) => {
    return async (dispatch: Dispatch) => {
        dispatch(loadingPostProfReviews())
        if (professor === '') {
            throw (new Error('No professor'));
        };
        try {
            if (!(values.clarity && values.engaging && values.course && values.recommended && values.review)) {
                throw (new Error('Bad Request'));
            }
            const response = await fetch('/api/reviews/leave/professor/' + professor, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ratings: {
                        recommended: values.recommended.toLowerCase() === 'yes' ? 1 : 0,
                        clarity: values.clarity,
                        engaging: values.engaging,
                    },
                    review: values.review,
                    course: values.course
                }),
            });
            if (response.status !== StatusCodes.OK) {
                throw new Error(response.status.toString())
            }
            dispatch(successPostProfReviews(response.status === 200));
        } catch (err) {
            dispatch(errorPostProfReviews(err, values));
        }
    }
}
