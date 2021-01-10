import React from 'react';
import { useSelector } from 'react-redux';
import { Card, Grid, Header, Icon } from 'semantic-ui-react';
import { RootState } from '../redux/reducers';

export const ProfRatingsBlock = (props: { overallstats: { header: string, description: string }[], ratingExplanation: string, total: number }) => {

    const { darkmode } = useSelector((state: RootState) => state.darkmodeReducer);

    return <Grid columns={2} stackable>
        <Grid.Row>
            <Grid.Column>
                <Header as='h1' inverted={darkmode} textAlign='left'>Rating System</Header>
                <p className='left-text'>{props.ratingExplanation}</p>
                <br />
                <p className='left-text'><b>{props.total} {props.total === 1 ? 'Review' : 'Reviews'}</b></p>
                <br />
                <p>
                    <Icon style={{ fontSize: '1em' }} name='checkmark' size='mini' color='blue' />
                    Indicates user is a verified UofT student, alumni, or faculty.
                </p>
            </Grid.Column>
            <Grid.Column>
                {props.overallstats && props.overallstats.length > 0 &&
                    props.overallstats[0].description !== '0%' && !props.overallstats[0].description.includes('undefined') ?
                    [<Card color='blue' className={`reviewBlock ${darkmode ? 'dark-bg-card' : ''}`}
                        fluid textAlign='center' header={props.overallstats[0].header}
                        description={props.overallstats[0].description} />,
                    <Card.Group className={`reviewBlock ${darkmode ? 'reviewBlockGroup-dark' : ''}`}
                        textAlign='center' itemsPerRow={2} items={props.overallstats.slice(1)} />] :
                    <Card fluid color='red'
                        style={darkmode ? { color: 'white', backgroundColor: 'gray', borderColor: 'gray' } : {}}
                        header='No available ratings yet' />}
            </Grid.Column>
        </Grid.Row>
    </Grid>

}