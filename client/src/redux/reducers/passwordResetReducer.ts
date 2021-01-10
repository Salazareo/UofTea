import { passwordResetActionTypes } from '../actions/passwordResetAction';

interface PasswordResetState {
    passwordResetLoading: boolean;
    passwordResetError: boolean;
    messageHeader: string;
    messageBody: string;
}

const initialState: PasswordResetState = {
    passwordResetLoading: false,
    passwordResetError: false,
    messageHeader: '',
    messageBody: '',
}

export const passwordResetReducer = (state = initialState, action: passwordResetActionTypes): PasswordResetState => {
    switch (action.type) {
        case 'RESET_PASS_LOADING':
            return {
                ...state,
                passwordResetLoading: true,
                passwordResetError: false,
                messageBody: '',
                messageHeader: '',
            }
        case 'RESET_PASS_SUCCESS':
            return {
                ...state,
                passwordResetLoading: false,
                passwordResetError: false,
                messageBody: action.payload.message as string,
                messageHeader: action.payload.messageHeader as string,
            }
        case 'RESET_PASS_ERROR':
            return {
                ...state,
                passwordResetLoading: false,
                passwordResetError: true,
                messageHeader: action.payload!.messageHeader as string,
                messageBody: action.payload!.message as string,
            }
        case 'RESET_PASS_DEFAULT':
            return initialState;
        default:
            return state
    }
}