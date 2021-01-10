import { verifyActions } from '../actions/verifyActions';

interface VerifyState {
    verifying: boolean;
    verified: boolean;
}

const initialState: VerifyState = {
    verifying: false,
    verified: false,
}



export const verifyReducer = (state = initialState, action: verifyActions): VerifyState => {
    switch (action.type) {
        case 'VERIFYING':
            return {
                verifying: true,
                verified: false,
            }
        case 'VERIFIED':
            return {
                verifying: false,
                verified: action.payload,
            }
        default:
            return state
    }
}