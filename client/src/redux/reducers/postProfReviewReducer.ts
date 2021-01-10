import { postProfReviewActions } from '../actions/reviewProfActions';
import { ProfReviewValues } from '../thunks/profReviewThunks';

export interface PostProfReviewState {
    postProfReviewSucc: boolean;
    postProfReviewLoading: boolean;
    postProfReviewError: Error | undefined;
    dataToRestore: ProfReviewValues | undefined;

}

const initialState: PostProfReviewState = {
    postProfReviewSucc: false,
    postProfReviewLoading: false,
    postProfReviewError: undefined,
    dataToRestore: undefined,
}

export const ratingsPostProfReducer = (state = initialState, action: postProfReviewActions): PostProfReviewState => {
    switch (action.type) {
        case 'POST_PROF_REVIEW_LOADING':
            return {
                ...state,
                postProfReviewLoading: true,
                postProfReviewError: undefined,
            }
        case 'POST_PROF_REVIEW_SUCC':
            return {
                postProfReviewSucc: !state.postProfReviewSucc,
                postProfReviewLoading: false,
                postProfReviewError: undefined,
                dataToRestore: undefined,
            }
        case 'POST_PROF_REVIEW_ERR':
            return {
                ...state,
                postProfReviewLoading: false,
                postProfReviewError: action.payload,
                dataToRestore: action.toRestore
            }
        case 'RESET_PROF_REVIEW_MODAL':
            return initialState
        default:
            return state
    }
}