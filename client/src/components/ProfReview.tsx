import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Card, Grid, Header, Icon, Message } from 'semantic-ui-react';
import { RootState } from '../redux/reducers';
export interface ProfRatings {
    recommended: number;
    clarity: number;
    engaging: number;
    total?: number;
}
export interface ProfReview {
    ratings: ProfRatings,
    professor: string,
    review: string,
    user: string;
    time: number;
    course: string;
    isUofT: boolean;
}
export const ProfessorReview = (props: ProfReview) => {
    const { darkmode } = useSelector((state: RootState) => state.darkmodeReducer);
    return <Card fluid className={`review_post ${darkmode ? 'dark-bg-card' : ''}`}>
        <Grid stackable centered columns={2}>
            <Grid.Row stackable>
                <Grid.Column>
                    <Header textAlign='left' inverted={darkmode} size='medium'>
                        {props.user} {props.isUofT && <Icon
                            style={{ fontSize: '1em' }}
                            name='checkmark' size='mini' color={props.isUofT ? 'blue' : 'grey'} />}
                    </Header>
                </Grid.Column>
                <Grid.Column>
                    <Header textAlign='right' inverted={darkmode} size='small'>{new Date(props.time).toLocaleDateString()}</Header>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column className='ratingsRow' stackable>
                    <Grid columns={3} stackable>
                        <Grid.Column>
                            <Card className={`reviewPostBlock ${darkmode ? 'dark-bg-card' : ''}`}>
                                <Card.Content>
                                    <Card.Header content='Great Prof?' />
                                    <br />
                                    <Card.Description> {props.ratings.recommended ?
                                        <Icon color='green' name='checkmark' /> : <Icon color='red' name='x' />}</Card.Description>
                                </Card.Content>
                            </Card>
                        </Grid.Column>
                        <Grid.Column>
                            <Card className={`reviewPostBlock ${darkmode ? 'dark-bg-card' : ''}`}>
                                <Card.Content>
                                    <Card.Header content='Teaching Clarity' />
                                    <br />
                                    <Card.Description>{props.ratings.clarity}</Card.Description>
                                </Card.Content>
                            </Card>
                        </Grid.Column>
                        <Grid.Column>
                            <Card className={`reviewPostBlock ${darkmode ? 'dark-bg-card' : ''}`}>
                                <Card.Content>
                                    <Card.Header content='Engaging' />
                                    <br />
                                    <Card.Description> {props.ratings.engaging}</Card.Description>
                                </Card.Content>
                            </Card>
                        </Grid.Column>
                    </Grid>
                </Grid.Column>
                <Grid.Column textAlign='left'>
                    <div >
                        <b>Course: </b>
                        <NavLink className='courseLink' style={{ color: darkmode ? '#6495ED' : 'navy' }}
                            to={`/browse?course=${props.course}`} >{props.course.toUpperCase()}</NavLink>
                    </div>
                    <Message className={`${darkmode ? 'dark-bg' : ''} `} style={{ wordWrap: 'break-word' }}>
                        {props.review}
                    </Message>
                </Grid.Column>
            </Grid.Row>
        </Grid>

    </Card>
}