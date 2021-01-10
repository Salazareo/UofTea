import { authActionTypes } from '../actions/authenticationAction';

interface AuthState {
    authLoading: boolean;
    authError: boolean;
    messageHeader: string;
    messageBody: string;
    username: string;
    jwt: boolean;
    displayMessage: { header: string, content: string } | undefined;
}

const initialState: AuthState = {
    authLoading: false,
    authError: false,
    messageHeader: '',
    messageBody: '',
    username: '',
    jwt: false,
    displayMessage: undefined,
}

export const authReducer = (state = initialState, action: authActionTypes): AuthState => {
    switch (action.type) {
        case 'AUTH_LOADING':
            return {
                ...state,
                authLoading: true,
                authError: false,
                messageBody: '',
                messageHeader: '',
                username: '',
                jwt: false,
            }
        case 'AUTH_SUCCESS':
            return {
                ...state,
                authLoading: false,
                authError: false,
                messageBody: action.payload.message as string,
                messageHeader: action.payload.messageHeader as string,
                username: action.payload.username,
                displayMessage: {
                    header: action.payload.messageHeader,
                    content: action.payload.message
                },
                jwt: true,
            }
        case 'AUTH_ERROR':
            return {
                ...state,
                authLoading: false,
                authError: true,
                messageHeader: action.payload!.messageHeader as string,
                messageBody: action.payload!.message as string,
                username: '',
                jwt: false,
            }
        case 'RESET_AUTH':
            return {
                ...state,
                authLoading: false,
                authError: false,
                messageHeader: '',
                messageBody: '',
            }
        case 'LOG_OUT':
            return {
                ...initialState,
                displayMessage: action.payload,
            }
        case 'AUTH_DISPLAY_CLEAR':
            return { ...state, displayMessage: undefined };
        default:
            return state
    }
}