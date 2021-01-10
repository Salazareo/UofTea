import { darkmodeActionTypes } from '../actions/darkmodeAction';

interface DarkmodeState {
    darkmode: boolean;
    error: { message: string, messageHeader: string } | undefined;
}

const initialState: DarkmodeState = {
    darkmode: false,
    error: undefined
}

export const darkmodeReducer = (state = initialState, action: darkmodeActionTypes): DarkmodeState => {
    switch (action.type) {
        case 'DARK_SUCCESS':
            return {
                darkmode: action.payload.darkmode,
                error: undefined,
            }
        case 'DARK_ERROR':
            return {
                darkmode: false,
                error: action.payload
            }
        default:
            return state
    }
}