import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { Button, Container, Header, Icon, Segment } from 'semantic-ui-react';
import { RootState } from '../redux/reducers';
import { verifyUser } from '../redux/thunks/verifyThunks';

export const Verified = () => {
    const { darkmode } = useSelector((state: RootState) => state.darkmodeReducer);
    const { verified, verifying } = useSelector((state: RootState) => state.verifyReducer);
    const secret = useLocation().pathname.split('/').pop();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(verifyUser(secret as string));
    }, [dispatch, secret])
    return <div>
        <div className='empty-top'></div>
        <Segment
            className={`landing ${darkmode ? 'header-bg-dark' : 'header-bg'}`}
            inverted
            textAlign='left'
            padded='very'>
            <Container>
                {verifying ? <>
                    <Header as='h1' inverted className='landing-heading'>
                        <b>Verifying your account...</b>
                    </Header>
                    <Header style={{ display: 'inline-block' }} size='medium' inverted className='landing-subheading'>
                        Please wait... <Icon name='wait' />
                    </Header>
                </> :
                    <>
                        <Header as='h1' inverted className='landing-heading'>
                            {verified ? <b>You're account is now verified!</b> :
                                <b>Could not verify your account <Icon name='frown' /></b>}
                        </Header>
                        <Header style={{ display: 'inline-block' }} size='medium' inverted className='landing-subheading'>
                            {verified ? 'If your account is an utoronto email, your reviews will get a checkmark 👀' : 'Please try again later.'}
                        </Header>
                        <br /><br />
                        <Button size='huge' positive icon as={NavLink} to='/'>
                            <Icon name='home' /> Return to Home
                    </Button>
                    </>}
            </Container>
        </Segment>
    </div>
}

