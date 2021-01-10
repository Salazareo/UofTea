import { Review } from '../../components/CourseReview';
import { getReviewActions } from '../actions/reviewActions';

export interface RatingGetState {
    getRatingsResults: Review[] | null | undefined;
    getRatingsLoading: boolean;
    getRatingsError: Error | undefined;
    more: boolean;
}

const initialState: RatingGetState = {
    getRatingsResults: [],
    getRatingsLoading: false,
    getRatingsError: undefined,
    more: false,
}

export const ratingsGetReducer = (state = initialState, action: getReviewActions): RatingGetState => {
    switch (action.type) {
        case 'GET_REVIEW_LOADING':
            return {
                ...state,
                getRatingsLoading: true,
                getRatingsError: undefined,
            }
        case 'GET_REVIEW_SUCC':
            return {
                getRatingsResults: action.payload.items,
                getRatingsLoading: false,
                getRatingsError: undefined,
                more: action.payload.more
            }
        case 'GET_REVIEW_ERR':
            return {
                getRatingsResults: [],
                more: false,
                getRatingsLoading: false,
                getRatingsError: action.payload,
            }
        case 'GET_REVIEW_APPEND':
            return {
                getRatingsResults: state.getRatingsResults!.concat(action.payload.items),
                getRatingsLoading: false,
                getRatingsError: undefined,
                more: action.payload.more
            }
        default:
            return state
    }
}