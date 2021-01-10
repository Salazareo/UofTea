import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Card, Grid, Header, Icon, Message } from 'semantic-ui-react';
import { RootState } from '../redux/reducers';
export interface Ratings {
    difficulty: number;
    recommended: number;
    useful: number;
    interesting: number;
    workload: number;
    total: number | undefined;
}
export interface Review {
    ratings: Ratings,
    courseCode: string,
    review: string,
    user: string;
    time: number;
    prof: string;
    isUofT: boolean;
}
export const CourseReview = (props: Review) => {
    const { darkmode } = useSelector((state: RootState) => state.darkmodeReducer);
    const names = props.prof.split(' ');
    let parsedName = '';
    names.forEach((name: string) => {
        parsedName += name.charAt(0).toUpperCase() + name.slice(1) + ' ';
    });
    return <Card
        fluid
        className={`review_post ${darkmode ? 'dark-bg-card' : ''}`}>
        <Grid stackable centered columns={2}>
            <Grid.Row>
                <Grid.Column>
                    <Header inverted={darkmode} textAlign='left' size='medium' >
                        {props.user} {props.isUofT && <Icon
                            style={{ fontSize: '1em' }}
                            name='checkmark' size='mini' color={props.isUofT ? 'blue' : 'grey'} />}
                    </Header>
                </Grid.Column>
                <Grid.Column>
                    <Header inverted={darkmode} textAlign='right' size='small'>{new Date(props.time).toLocaleDateString()}</Header>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row >
                <Grid.Column className='ratingsRow'>
                    <Grid columns={5} stackable>
                        <Grid.Column >
                            <Card className={`reviewPostBlock ${darkmode ? 'dark-bg-card' : ''}`}>
                                <Card.Content>
                                    <Card.Header content='Take it?' />
                                    <br />
                                    <Card.Description> {props.ratings.recommended ?
                                        <Icon color='green' name='checkmark' /> : <Icon color='red' name='x' />}</Card.Description>
                                </Card.Content>
                            </Card>
                        </Grid.Column>
                        <Grid.Column >
                            <Card className={`reviewPostBlock ${darkmode ? 'dark-bg-card' : ''}`}>
                                <Card.Content>
                                    <Card.Header content='Difficulty' />
                                    <br />
                                    <Card.Description>{props.ratings.difficulty}</Card.Description>
                                </Card.Content>
                            </Card>
                        </Grid.Column>
                        <Grid.Column >
                            <Card className={`reviewPostBlock ${darkmode ? 'dark-bg-card' : ''}`}>
                                <Card.Content>
                                    <Card.Header content='Usefulness' />
                                    <br />
                                    <Card.Description> {props.ratings.useful}</Card.Description>
                                </Card.Content>
                            </Card>
                        </Grid.Column>
                        <Grid.Column >
                            <Card className={`reviewPostBlock ${darkmode ? 'dark-bg-card' : ''}`}>
                                <Card.Content>
                                    <Card.Header content='Interesting' />
                                    <br />

                                    <Card.Description> {props.ratings.interesting}</Card.Description>
                                </Card.Content>
                            </Card>
                        </Grid.Column>
                        <Grid.Column >
                            <Card className={`reviewPostBlock ${darkmode ? 'dark-bg-card' : ''}`}>
                                <Card.Content>
                                    <Card.Header content='Workload' />
                                    <br />
                                    <Card.Description>{props.ratings.workload}</Card.Description>
                                </Card.Content>
                            </Card>
                        </Grid.Column>
                    </Grid>
                </Grid.Column>
                <Grid.Column textAlign='left'>
                    <div >
                        <b>Instructor: </b>
                        <NavLink className='courseLink'
                            style={{ color: darkmode ? '#6495ED' : 'navy' }}
                            to={`/browse/professors?name=${props.prof}`} >{parsedName}</NavLink></div>
                    <Message className={`${darkmode ? 'dark-bg' : ''} `} style={{ wordWrap: 'break-word' }}>
                        {props.review}
                    </Message>
                </Grid.Column>
            </Grid.Row>
        </Grid>

    </Card>
}