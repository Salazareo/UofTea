import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Grid, Image, List, Segment } from 'semantic-ui-react';


export const Footer = () => {

    const pathName = useLocation().pathname;

    return pathName !== '/login' && pathName !== '/register' && pathName !== '/forgot' ? <div className='Footer'>
        <Segment inverted vertical >
            <Grid divided inverted centered style={{ width: '100vw', marginBottom: '0px', paddingBottom: '0px' }}>
                <Grid.Row >
                    <Grid.Column mobile={6} tablet={6} computer={7} largeScreen={7} widescreen={7} verticalAlign='middle' textAlign='left'>
                        <Image
                            alt='UofTea'
                            style={{
                                borderWidth: '4px', borderStyle: 'solid', borderColor: 'black',
                                backgroundColor: 'white', padding: '3px', borderRadius: '15%', width: '42px', marginBottom: '0'
                            }} src='/logo192.png' floated='left' className='footer-logo' verticalAlign='top' />
                        <p><b>UofTea</b>  <br /> &copy; 2020 UofTea
                    </p>
                    </Grid.Column>
                    <Grid.Column mobile={4} tablet={4} computer={3} largeScreen={3} widescreen={3} verticalAlign='top' textAlign='left' >
                        <List link inverted>
                            <List.Item as='a' className='mobile-foot-links'><NavLink to='/privacy' >Privacy Policy</NavLink></List.Item>
                            <List.Item as='a' className='mobile-foot-links'><NavLink to='/terms-of-use' >Terms and Conditions</NavLink></List.Item>
                        </List>
                    </Grid.Column>
                    <Grid.Column mobile={4} tablet={4} computer={3} largeScreen={3} widescreen={3} verticalAlign='top' textAlign='left' >
                        <List link inverted>
                            <List.Item as='a' className='mobile-foot-links'><NavLink to='/' >Home</NavLink></List.Item>
                            <List.Item as='a' className='mobile-foot-links'><NavLink to='/about' >About Us</NavLink></List.Item>
                        </List>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Segment>
    </div> : null;

}