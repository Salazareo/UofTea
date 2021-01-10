import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Redirect, useLocation } from 'react-router-dom';
import { Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react';
import { resetPasswordDefault } from '../redux/actions/passwordResetAction';
import { RootState } from '../redux/reducers';
import { PasswordReset } from '../redux/thunks/passwordResetThunks';

export const ResetPassword = () => {

    const { darkmode } = useSelector((state: RootState) => state.darkmodeReducer);
    const { jwt } = useSelector((state: RootState) => state.authReducer);
    const passwordResetToken = useLocation().pathname.split('/').pop();
    const dispatch = useDispatch();
    const { messageHeader, messageBody, passwordResetError, passwordResetLoading } = useSelector((state: RootState) =>
        state.passwordResetReducer);

    useEffect(() => {
        dispatch(resetPasswordDefault())
    }, [dispatch]);
    const [values, setValues] = useState({
        password: '',
        confirmPassword: '',
    });

    const location = useLocation();

    if (jwt) {
        return <Redirect to={(location.state as any)?.backTo || '/'} />
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();
        const userData = {
            token: String(passwordResetToken),
            password: values.password,
            confirmPassword: values.confirmPassword,
        };
        dispatch(PasswordReset(userData));
    }

    const handleChange = (e: any) => {
        e.persist();
        setValues(newValues => ({
            ...newValues,
            [e.target.name]: e.target.value
        }));
    };
    return <div >
        <div className='empty-top'></div>
        <Grid className={`landing ${darkmode ? 'header-bg-dark' : 'header-bg'}`}
            textAlign='center' style={{ height: '100vh', backgroundColor: '#00204e' }} verticalAlign='middle'>
            <Grid.Column mobile={14} tablet={12} computer={8} largeScreen={6} widescreen={5}>
                <div className={`${darkmode ? 'loginBox-dark' : 'loginBox'} `}>
                    <Header as='h1' color='blue' className='loginDescTitle' textAlign='center'>
                        Reset your password
            </Header>
                    {(!passwordResetLoading && !passwordResetError && (messageBody || messageHeader)) && <Message color='green'>
                        <Message.Header>{messageHeader}</Message.Header>
                        {messageBody}
                    </Message>}
                    {passwordResetLoading && <Message color='yellow'>
                        <Message.Header>Resetting your password in...</Message.Header>
                Please wait...
            </Message>}
                    {passwordResetError && <Message color='red'>
                        <Message.Header>{messageHeader}</Message.Header>
                        {messageBody}
                    </Message>}
                    <Form inverted={darkmode} size='large'>
                        <Segment inverted={darkmode} stacked>
                            <Form.Input variant='outlined' icon='lock' iconPosition='left' placeholder='New Password' margin='none'
                                id='password' label='New Password' name='password' type='password' onChange={handleChange} />
                            <Form.Input variant='outlined' icon='lock' iconPosition='left' placeholder='Confirm New Password' margin='none'
                                id='confirmPassword' label='Confirm New Password' name='confirmPassword' type='password' onChange={handleChange} />

                            <Button disabled={!passwordResetLoading && !passwordResetError && (messageBody !== '' || messageHeader !== '')}
                                loading={passwordResetLoading} type='submit' color='blue' fluid size='large' onClick={handleSubmit}>
                                {(!passwordResetLoading && !passwordResetError && (messageBody || messageHeader)) ? 'Sucess!' : 'Submit'}
                            </Button>
                        </Segment>
                    </Form>
                </div>
                <br />
                <div className='left'>
                    <NavLink className='whiteLink' to='/login'>&larr; Return to Login</NavLink>
                </div>
                <br />
                <NavLink className='whiteLink' to='/privacy'>Privacy Policy </NavLink><span style={{ color: 'white' }}>|</span>
                <NavLink className='whiteLink' to='/terms-of-use' > Terms and Conditions</NavLink>
            </Grid.Column>
        </Grid>
    </div>
}