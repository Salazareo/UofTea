import { postReviewActions } from '../actions/reviewActions';
import { CourseReviewValues } from '../thunks/courseReviewThunks';

export interface PostReviewState {
    postReviewSucc: boolean;
    postReviewFlip: boolean;
    postReviewLoading: boolean;
    postReviewError: Error | undefined;
    dataToRestore: CourseReviewValues | undefined;
}

const initialState: PostReviewState = {
    postReviewSucc: false,
    postReviewFlip: false,
    postReviewLoading: false,
    postReviewError: undefined,
    dataToRestore: undefined,
}

export const ratingsPostReducer = (state = initialState, action: postReviewActions): PostReviewState => {
    switch (action.type) {
        case 'POST_REVIEW_LOADING':
            return {
                ...state,
                postReviewLoading: true,
                postReviewError: undefined,
                dataToRestore: undefined,
            }
        case 'POST_REVIEW_SUCC':
            return {
                postReviewFlip: !state.postReviewFlip,
                postReviewSucc: true,
                postReviewLoading: false,
                postReviewError: undefined,
                dataToRestore: undefined,
            }
        case 'POST_REVIEW_ERR':
            return {
                ...state,
                postReviewLoading: false,
                postReviewError: action.payload,
                postReviewSucc: false,
                dataToRestore: action.toRestore || undefined,
            }
        case 'RESET_REVIEW_MODAL':
            return initialState
        default:
            return state
    }
}