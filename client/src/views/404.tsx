import React from 'react'
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom'
import { Button, Container, Header, Icon, Segment } from 'semantic-ui-react';
import { RootState } from '../redux/reducers';

export const NotFound = () => {
    const { darkmode } = useSelector((state: RootState) => state.darkmodeReducer);
    return <div>
        <div className='empty-top'></div>
        <Segment
            className={`landing ${darkmode ? 'header-bg-dark' : 'header-bg'}`}
            inverted
            textAlign='left'
            padded='very'>
            <Container>
                <Header as='h1' inverted className='landing-heading'>
                    <b>Error 404</b> - Page Not Found
                    </Header>
                <Header style={{ display: 'inline-block' }} size='medium' inverted className='landing-subheading'>
                    The page you're looking for doesn't exist.
                    </Header>
                <br /><br />
                <Button size='huge' positive icon as={NavLink} to='/'>
                    <Icon name='home' /> Return to Home
                    </Button>
            </Container>
        </Segment>
    </div>
}