import { SHA256 } from 'crypto-js';
import { Dispatch } from 'redux';
import { authError, authLoading, authSuccess, logOut, logOutClear } from '../actions/authenticationAction';

export const login = (payload: { email: string; password: string; }) => {
    return async (dispatch: Dispatch) => {
        dispatch(authLoading());

        if (payload.email === '' || payload.password === '') {
            dispatch(authError({ messageHeader: 'Invalid Login', message: 'Please fill out all the fields' }));
            return;
        }
        const hashedPassword = SHA256(payload.password).toString();
        try {
            const response = await fetch('/api/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 'email': payload.email, 'password': hashedPassword }),
            });
            const responseText = String(await response.text());
            switch (response.status) {
                case 200: {
                    dispatch(authSuccess({
                        messageHeader: 'Login Successful!',
                        message: 'You\'re logged in :)',
                        username: responseText
                    }));
                    setTimeout(() => dispatch(logOutClear()), 2000);
                    return;
                }

                case 403: {
                    dispatch(authError({
                        messageHeader: 'Invalid Password',
                        message: 'Email and password does not match'
                    }));
                    return;
                }

                case 404: {
                    dispatch(authError({
                        messageHeader: 'Invalid Login',
                        message: 'Email does not exist'
                    }));
                    return;
                }

                case 400: {
                    dispatch(authError({
                        messageHeader: 'Invalid Login',
                        message: 'Please provide your Email and Password'
                    }));
                    return;
                }
            }
            dispatch(authError({
                messageHeader: 'Internal Server Error',
                message: responseText
            }));
        } catch (err) {
            dispatch(authError({
                messageHeader: 'Internal Server Error',
                message: err
            }));
        }
    }
}

export const register = (payload: { username: string, password: string, confirmPassword: string, email: string }) => {

    return async (dispatch: Dispatch) => {
        dispatch(authLoading());

        const passwordregex = new RegExp(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,}$/);
        // eslint-disable-next-line
        const emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        const usernameRegex = new RegExp(/^(\d|\w){4,12}$/);

        const emailTest = emailRegex.test(payload.email);
        const passwordTest = passwordregex.test(payload.password);
        const usernameTest = usernameRegex.test(payload.username);
        const hashedPassword = SHA256(payload.password).toString();


        if (payload.email === '' || payload.username === '' || payload.password === '' || payload.confirmPassword === '') {
            dispatch(authError({
                messageHeader: 'Invalid Register',
                message: 'Please fill out all the fields'
            }));
            return;
        }
        if (payload.password !== payload.confirmPassword) {
            dispatch(authError({
                messageHeader: 'Invalid Register',
                message: 'Password and Confirm Password does not match'
            }));
            return;
        }
        if (!passwordTest) {
            dispatch(authError({
                messageHeader: 'Invalid Register',
                message: 'Password be at least 6 characters long and must contain at least one digit, one lowercase character and one uppercase character '
            }));
            return;
        }
        if (!emailTest) {
            dispatch(authError({
                messageHeader: 'Invalid Register',
                message: 'Email must be in a valid format e.g. name@email.ca'
            }));
            return;
        }
        if (!usernameTest) {
            dispatch(authError({
                messageHeader: 'Invalid Register',
                message: 'Username cannot be longer than 12 characters and must contain only alphanumeric characters (A-Z and 0-9)'
            }));
            return;
        }
        try {
            const response = await fetch('/api/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'thisIsCuzImAngry': 'funny Haha'
                },
                body: JSON.stringify({
                    email: payload.email,
                    password: hashedPassword,
                    username: payload.username
                }),
            });
            const responseText = String(await response.text());
            switch (response.status) {
                case 200: {
                    dispatch(authSuccess({
                        messageHeader: 'Register Successful!',
                        message: 'Please authenticate your account',
                        username: payload.username,
                    }));
                    setTimeout(() => dispatch(logOutClear()), 3000);
                    return;
                }

                case 409: {
                    dispatch(authError({
                        messageHeader: 'Invalid User',
                        message: responseText
                    }));
                    return;
                }

                case 400: {
                    dispatch(authError({
                        messageHeader: 'Invalid Register',
                        message: 'Please fill out all the fields'
                    }));
                    return;
                }
            }
            dispatch(authError({
                messageHeader: 'Internal Server Error',
                message: responseText
            }));
        } catch (err) {
            dispatch(authError({
                messageHeader: 'Internal Server Error',
                message: err
            }));
        }
    }
}

export const validateJWT = () => {
    return async (dispatch: Dispatch) => {
        try {
            const response = await fetch(`/api/user/validateJWT`);
            if (response.status === 200) {
                const username = await response.text();
                dispatch(authSuccess({
                    messageHeader: '',
                    message: '',
                    username
                }));
                dispatch(logOutClear())
            }
        } catch (err) {
            dispatch(authError({
                messageHeader: '',
                message: ''
            }));
            dispatch(logOutClear())
        }
    }
}

export const logout = () => {
    return async (dispatch: Dispatch) => {
        const response = await fetch(`/api/user/logout`);
        if (response.status === 200) {
            dispatch(logOut({
                header: 'Success!',
                content: 'You\'re logged out!'
            }));
            setTimeout(() => dispatch(logOutClear()), 3000);
        }
        else {
            dispatch(logOut({
                header: 'Error :(',
                content: 'We had an issue... sorry'
            }));
            setTimeout(() => dispatch(logOutClear()), 3000);
        }
    }
}
