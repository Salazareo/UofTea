import { ProfReview } from '../../components/ProfReview';
import { ProfReviewValues } from '../thunks/profReviewThunks';
import { actionTypes } from './actionTypes';


interface GetProfReviewLoading {
    type: actionTypes.GET_PROF_REVIEW_LOADING
}
interface GetProfReviewSucc {
    type: actionTypes.GET_PROF_REVIEW_SUCC;
    payload: { items: ProfReview[], more: boolean };
}
interface GetProfReviewErr {
    type: actionTypes.GET_PROF_REVIEW_ERR
    payload: Error | undefined
}
interface GetProfReviewAppend {
    type: actionTypes.GET_PROF_REVIEW_APPEND;
    payload: { items: ProfReview[], more: boolean };
}

export const loadingGetProfReviews = (): GetProfReviewLoading => {
    return {
        type: actionTypes.GET_PROF_REVIEW_LOADING
    }
}

export const successGetProfReviews = (response: { items: ProfReview[], more: boolean }): GetProfReviewSucc => {
    return {
        type: actionTypes.GET_PROF_REVIEW_SUCC,
        payload: response
    }
}

export const successAppendProfReviews = (response: { items: ProfReview[], more: boolean }): GetProfReviewAppend => {
    return {
        type: actionTypes.GET_PROF_REVIEW_APPEND,
        payload: response
    }
}

export const errorGetProfReviews = (error: Error | undefined): GetProfReviewErr => {
    return {
        type: actionTypes.GET_PROF_REVIEW_ERR,
        payload: error
    }
}


export type getProfReviewActions = ReturnType<typeof loadingGetProfReviews | typeof successGetProfReviews |
    typeof errorGetProfReviews | typeof successAppendProfReviews>;



interface PostProfReviewLoading {
    type: actionTypes.POST_PROF_REVIEW_LOADING
}
interface PostProfReviewSucc {
    type: actionTypes.POST_PROF_REVIEW_SUCC,
    succ: boolean,
}
interface PostProfReviewErr {
    toRestore: ProfReviewValues | undefined;
    type: actionTypes.POST_PROF_REVIEW_ERR,
    payload: Error | undefined
}
interface ResetProfReviewState {
    type: actionTypes.RESET_PROF_REVIEW_MODAL,
}

export const loadingPostProfReviews = (): PostProfReviewLoading => {
    return {
        type: actionTypes.POST_PROF_REVIEW_LOADING,
    }
}

export const successPostProfReviews = (succ: boolean): PostProfReviewSucc => {
    return {
        type: actionTypes.POST_PROF_REVIEW_SUCC,
        succ
    }
}

export const errorPostProfReviews = (error: Error | undefined, values?: ProfReviewValues): PostProfReviewErr => {
    return {
        type: actionTypes.POST_PROF_REVIEW_ERR,
        payload: error,
        toRestore: values
    }
}

export const resetReviewProfModal = (): ResetProfReviewState => {
    return { type: actionTypes.RESET_PROF_REVIEW_MODAL }
}

export type postProfReviewActions = ReturnType<typeof loadingPostProfReviews | typeof successPostProfReviews |
    typeof errorPostProfReviews | typeof resetReviewProfModal>;
