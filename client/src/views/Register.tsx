import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Redirect, useLocation } from 'react-router-dom';
import { Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react';
import { resetAuth } from '../redux/actions/authenticationAction';
import { RootState } from '../redux/reducers';
import { register } from '../redux/thunks/userThunks';


export const Register = () => {
    const dispatch = useDispatch();

    const { darkmode } = useSelector((state: RootState) => state.darkmodeReducer);

    const { authLoading, authError, messageHeader, messageBody, jwt } = useSelector((state: RootState) => state.authReducer);
    useEffect(() => {
        dispatch(resetAuth())
    }, [dispatch]);
    const [values, setValues] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    });
    const location = useLocation();
    if (jwt) {
        return <Redirect to={(location.state as any)?.backTo || '/'} />
    }

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        const userData = {
            email: values.email,
            username: values.username,
            password: values.password,
            confirmPassword: values.confirmPassword
        };
        dispatch(register(userData));
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.persist();
        setValues(newValues => ({
            ...newValues,
            [e.target.name]: e.target.value
        }));
    };
    return <div>
        <div className='empty-top'></div>
        <Grid className={`landing hideFooter ${darkmode ? 'header-bg-dark' : 'header-bg'}`}
            textAlign='center' style={{ height: '100vh', backgroundColor: '#00204e' }} verticalAlign='middle'>
            <Grid.Column mobile={14} tablet={12} computer={8} largeScreen={6} widescreen={5} style={{}}>
                <div className={`${darkmode ? 'loginBox-dark' : 'loginBox'} `}>
                    <Header as='h1' color='blue' className='loginDescTitle' textAlign='center'>
                        Register
                </Header>
                    {(!authLoading && !authError && (messageBody || messageHeader)) &&
                        <Message color='green'>
                            <Message.Header >{messageHeader}</Message.Header>
                            {messageBody}
                        </Message>}
                    {authLoading &&
                        <Message color='yellow'>
                            <Message.Header >Login you in...</Message.Header>
                    Please wait...
                </Message>}
                    {authError &&
                        <Message color='red'>
                            <Message.Header >{messageHeader}</Message.Header>
                            {messageBody}
                        </Message>}
                    <Form size='large' inverted={darkmode}>
                        <Segment inverted={darkmode}>
                            <Form.Input variant='outlined' icon='at' iconPosition='left' placeholder='Email'
                                margin='none'
                                id='email' label='Email' name='email' type='username' onChange={handleChange} />

                            <Form.Input variant='outlined' icon='user' iconPosition='left' placeholder='Username'
                                margin='none'
                                id='username' label='Username' name='username' type='email' onChange={handleChange} />

                            <Form.Input variant='outlined' icon='lock' iconPosition='left' placeholder='Password'
                                margin='none'
                                id='password' label='Password' name='password' type='password' onChange={handleChange} />

                            <Form.Input variant='outlined' icon='lock' iconPosition='left' placeholder='Confirm Password'
                                margin='none'
                                id='confirmPassword' label='Confirm Password' name='confirmPassword' type='password' onChange={handleChange} />

                            <Button type='submit' color='blue' fluid size='large' onClick={handleSubmit}>
                                Register
                    </Button>
                        </Segment>
                    </Form>
                </div>
                <Message className='underAuthBox' color={darkmode ? 'black' : 'blue'}>
                    Already have an account? <NavLink to='/login' className='nav-link'>Log in</NavLink>
                </Message>
                <div className='left'>
                    <NavLink className='whiteLink' to='/' >&larr; Return to Home</NavLink>
                </div>
                <br />
                <NavLink className='whiteLink' to='/privacy'>Privacy Policy </NavLink><span style={{ color: 'white' }}>|</span>
                <NavLink className='whiteLink' to='/terms-of-use' > Terms and Conditions</NavLink>
            </Grid.Column>
        </Grid>
    </div>
}