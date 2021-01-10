import { SHA256 } from 'crypto-js';
import { Dispatch } from 'redux';
import { resetPasswordError, resetPasswordLoading, resetPasswordSuccess } from '../actions/passwordResetAction';

export const requestPasswordReset = (payload: { email: string }) => {
    return async (dispatch: Dispatch) => {
        dispatch(resetPasswordLoading());

        if (payload.email === '') {
            dispatch(resetPasswordError({ messageHeader: 'Invalid Email', message: 'Please provide an email' }));
            return;
        }
        try {
            const response = await fetch('/api/user/forgot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 'email': payload.email }),
            });
            const responseText = String(await response.text());

            switch (response.status) {
                case 200: {
                    dispatch(resetPasswordSuccess({
                        messageHeader: 'Password reset request Successful!',
                        message: 'Please check your inbox and spam folders for a password reset request',
                    }));
                    return;
                }

                case 401: {
                    dispatch(resetPasswordError({
                        messageHeader: 'Email not found',
                        message: 'There are no accounts associated with this email'
                    }));
                    return;
                }

                case 405: {
                    dispatch(resetPasswordError({
                        messageHeader: 'Email not found',
                        message: 'There are no accounts associated with this email'
                    }));
                    return;
                }

                case 400: {
                    dispatch(resetPasswordError({
                        messageHeader: 'Invalid Email',
                        message: 'Please provide your Email'
                    }));
                    return;
                }
            }
            dispatch(resetPasswordError({
                messageHeader: 'Internal Server Error',
                message: responseText
            }));
        } catch (err) {
            dispatch(resetPasswordError({
                messageHeader: 'Internal Server Error',
                message: err
            }));
        }
    }
}

export const PasswordReset = (payload: { token: string, password: string, confirmPassword: string }) => {
    return async (dispatch: Dispatch) => {
        dispatch(resetPasswordLoading());

        if (payload.password === '') {
            dispatch(resetPasswordError({ messageHeader: 'Invalid password', message: 'Please provide a password' }));
            return;
        }
        if ((payload.password).match(payload.confirmPassword) === null) {
            dispatch(resetPasswordError({ messageHeader: 'Invalid password', message: 'Passwords do not match' }));
            return;
        }

        const hashedPassword = SHA256(payload.password).toString();

        try {
            const response = await fetch('/api/user/resetPassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 'token': payload.token, 'password': hashedPassword }),
            });
            const responseText = String(await response.text());

            switch (response.status) {
                case 200: {
                    dispatch(resetPasswordSuccess({
                        messageHeader: 'Password reset successful',
                        message: 'You\'re password has been changed :)',
                    }));
                    return;
                }

                case 401: {
                    dispatch(resetPasswordError({
                        messageHeader: 'Request not found',
                        message: responseText
                    }));
                    return;
                }

                case 400: {
                    dispatch(resetPasswordError({
                        messageHeader: 'Bad Request',
                        message: 'Your password reset link may have expired. Please obtain a new one.'
                    }));
                    return;
                }
            }
            dispatch(resetPasswordError({
                messageHeader: 'Internal Server Error',
                message: responseText
            }));
        } catch (err) {
            dispatch(resetPasswordError({
                messageHeader: 'Internal Server Error',
                message: err
            }));
        }
    }
}