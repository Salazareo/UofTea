import { ProfReview } from '../../components/ProfReview';
import { getProfReviewActions } from '../actions/reviewProfActions';

export interface RatingProfGetState {
    getProfRatingsResults: ProfReview[] | null | undefined;
    getProfRatingsLoading: boolean;
    getProfRatingsError: Error | undefined;
    more: boolean;
}

const initialState: RatingProfGetState = {
    getProfRatingsResults: [],
    getProfRatingsLoading: false,
    getProfRatingsError: undefined,
    more: false,
}

export const ratingsGetProfReducer = (state = initialState, action: getProfReviewActions): RatingProfGetState => {
    switch (action.type) {
        case 'GET_PROF_REVIEW_LOADING':
            return {
                ...state,
                getProfRatingsLoading: true,
                getProfRatingsError: undefined,
            }
        case 'GET_PROF_REVIEW_SUCC':
            return {
                getProfRatingsResults: action.payload.items,
                getProfRatingsLoading: false,
                getProfRatingsError: undefined,
                more: action.payload.more
            }
        case 'GET_PROF_REVIEW_ERR':
            return {
                getProfRatingsResults: [],
                getProfRatingsLoading: false,
                more: false,
                getProfRatingsError: action.payload,
            }
        case 'GET_PROF_REVIEW_APPEND':
            return {
                getProfRatingsResults: state.getProfRatingsResults!.concat(action.payload.items),
                getProfRatingsLoading: false,
                getProfRatingsError: undefined,
                more: action.payload.more,
            }
        default:
            return state
    }
}