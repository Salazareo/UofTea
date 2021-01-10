import React from 'react';
import { isMobile, isTablet } from 'react-device-detect';
import { useSelector } from 'react-redux';
import { Container, Header, Segment } from 'semantic-ui-react';
import { SearchBar } from '../components/SearchBar';
import { RootState } from '../redux/reducers';

export interface SearchResult {
    title: string,
    description: string,
    type: string,
}

export const LandingView = () => {

    const { darkmode } = useSelector((state: RootState) => state.darkmodeReducer);

    return <div >
        <div className='empty-top'></div>
        <Segment
            className={`landing ${darkmode ? 'header-bg-dark' : 'header-bg'}`}
            inverted
            textAlign='left'
            padded='very'>
            <Container className='noshadow'>
                <Header as='h1' inverted className='landing-heading'>
                    Explore student reviews for thousands of courses and professors at UofT
                </Header>
                <SearchBar
                    maxCap={(isMobile || isTablet) ? 2 : 4}
                    inverted={true}
                    input={{ fluid: true }}
                    fluid={true}
                    className={` main-search ${darkmode ? 'main-search-dark' : ''} `}
                    placeholder='Search for courses or professors' />
                <Header style={{ display: 'inline-block' }} size='medium' inverted className='landing-subheading'>
                    e.g. CSC490H5F, BIO, Introduction to Management, Joe Ligma
                    </Header>
            </Container>
        </Segment>
    </div >
}