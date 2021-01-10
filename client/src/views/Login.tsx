import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Redirect, useLocation } from 'react-router-dom';
import { Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react';
import { resetAuth } from '../redux/actions/authenticationAction';
import { RootState } from '../redux/reducers';
import { login } from '../redux/thunks/userThunks';


export const Login = () => {

    const { darkmode } = useSelector((state: RootState) => state.darkmodeReducer);

    const dispatch = useDispatch();
    const { authLoading, authError, messageHeader, messageBody, jwt } = useSelector((state: RootState) =>
        state.authReducer);

    useEffect(() => {
        dispatch(resetAuth())
    }, [dispatch]);
    const [values, setValues] = useState({
        email: '',
        password: '',
    });

    const location = useLocation();

    if (jwt) {
        return <Redirect to={(location.state as any)?.backTo || '/'} />
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();
        const userData = {
            email: values.email,
            password: values.password,
        };
        dispatch(login(userData));
    }

    const handleChange = (e: any) => {
        e.persist();
        setValues(newValues => ({
            ...newValues,
            [e.target.name]: e.target.value
        }));
    };
    return <div>
        <div className='empty-top'></div>
        <Grid className={`landing hideFooter ${darkmode ? 'header-bg-dark' : 'header-bg'}`}
            textAlign='center' verticalAlign='middle'>
            <Grid.Column mobile={14} tablet={12} computer={8} largeScreen={6} widescreen={5}>
                <div className={`${darkmode ? 'loginBox-dark' : 'loginBox'} `}>
                    <Header as='h1' color='blue' className='loginDescTitle' textAlign='center'>
                        Log In
            </Header>
                    {(!authLoading && !authError && (messageBody || messageHeader)) && <Message color='green'>
                        <Message.Header>{messageHeader}</Message.Header>
                        {messageBody}
                    </Message>}
                    {authLoading && <Message color='yellow'>
                        <Message.Header>Login you in...</Message.Header>
                Please wait...
            </Message>}
                    {authError && <Message color='red'>
                        <Message.Header>{messageHeader}</Message.Header>
                        {messageBody}
                    </Message>}
                    <Form inverted={darkmode} size='large'>
                        <Segment inverted={darkmode}>
                            <Form.Input variant='outlined' icon='at' iconPosition='left' placeholder='Email' margin='none'
                                id='email' label='Email' name='email' type='email' onChange={handleChange} />

                            <Form.Input variant='outlined' icon='lock' iconPosition='left' placeholder='Password' margin='none'
                                id='password' label='Password' name='password' type='password' onChange={handleChange} />

                            <Button loading={authLoading} type='submit' color='blue' fluid size='large' onClick={handleSubmit}>
                                Log In
                    </Button>
                            <br />
                            <NavLink to='/forgot' className='nav-link'>Forgot your password?</NavLink>
                        </Segment>
                    </Form>
                </div>
                <Message inverted={darkmode} className='underAuthBox' color={darkmode ? 'black' : 'blue'}>
                    Don't have an account yet? <NavLink to='/register' className='nav-link'>Register</NavLink>
                </Message>
                <div className='left'>
                    <NavLink className='whiteLink' to='/'>&larr; Return to Home</NavLink>
                </div>
                <br />
                <NavLink className='whiteLink' to='/privacy'>Privacy Policy </NavLink><span style={{ color: 'white' }}>|</span>
                <NavLink className='whiteLink' to='/terms-of-use' > Terms and Conditions</NavLink>
            </Grid.Column>
        </Grid>
    </div>
}