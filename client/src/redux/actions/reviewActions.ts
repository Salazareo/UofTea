import { Review } from '../../components/CourseReview';
import { CourseReviewValues } from '../thunks/courseReviewThunks';
import { actionTypes } from './actionTypes';


interface GetReviewLoading {
    type: actionTypes.GET_REVIEW_LOADING
}
interface GetReviewSucc {
    type: actionTypes.GET_REVIEW_SUCC;
    payload: { items: Review[], more: boolean };
}
interface GetReviewAppend {
    type: actionTypes.GET_REVIEW_APPEND;
    payload: { items: Review[], more: boolean };
}
interface GetReviewErr {
    type: actionTypes.GET_REVIEW_ERR
    payload: Error | undefined
}

export const loadingGetReviews = (): GetReviewLoading => {
    return {
        type: actionTypes.GET_REVIEW_LOADING
    }
}

export const successGetReviews = (response: { items: Review[], more: boolean }): GetReviewSucc => {
    return {
        type: actionTypes.GET_REVIEW_SUCC,
        payload: response
    }
}

export const successAppendReviews = (response: { items: Review[], more: boolean }): GetReviewAppend => {
    return {
        type: actionTypes.GET_REVIEW_APPEND,
        payload: response
    }
}

export const errorGetReviews = (error: Error | undefined): GetReviewErr => {
    return {
        type: actionTypes.GET_REVIEW_ERR,
        payload: error
    }
}


export type getReviewActions = ReturnType<typeof loadingGetReviews | typeof successGetReviews | typeof errorGetReviews | typeof successAppendReviews>;



interface PostReviewLoading {
    type: actionTypes.POST_REVIEW_LOADING
}
interface PostReviewSucc {
    type: actionTypes.POST_REVIEW_SUCC,
    succ: boolean,
}
interface PostReviewErr {
    toRestore: CourseReviewValues | undefined;
    type: actionTypes.POST_REVIEW_ERR,
    payload: Error | undefined
}
interface ResetReviewState {
    type: actionTypes.RESET_REVIEW_MODAL,
}

export const loadingPostReviews = (): PostReviewLoading => {
    return {
        type: actionTypes.POST_REVIEW_LOADING,
    }
}

export const successPostReviews = (succ: boolean): PostReviewSucc => {
    return {
        type: actionTypes.POST_REVIEW_SUCC,
        succ
    }
}

export const errorPostReviews = (error: Error | undefined, values?: CourseReviewValues): PostReviewErr => {
    return {
        toRestore: values,
        type: actionTypes.POST_REVIEW_ERR,
        payload: error
    }
}

export const resetReviewModal = (): ResetReviewState => {
    return { type: actionTypes.RESET_REVIEW_MODAL }
}

export type postReviewActions = ReturnType<typeof loadingPostReviews | typeof successPostReviews | typeof errorPostReviews | typeof resetReviewModal>;
