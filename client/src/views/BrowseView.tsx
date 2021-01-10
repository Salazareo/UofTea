import React, { useEffect } from 'react';
import { isMobile, isTablet } from 'react-device-detect';
import { useDispatch, useSelector } from 'react-redux';
import { Route, useLocation } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { Container, Grid, Header, Menu, Pagination } from 'semantic-ui-react';
import { CourseFilters, parseQueryFromUrl } from '../components/CourseFilters';
import { CourseTable } from '../components/CourseTable';
import { Loading } from '../components/Loading';
import { parseProfQueryFromUrl, ProfessorFilters } from '../components/ProfessorFilters';
import { ProfessorTable } from '../components/ProfessorTable';
import { RootState } from '../redux/reducers';
import { getCourseTabInfo } from '../redux/thunks/courseTabInfoThunks';
import { getProfTabInfo } from '../redux/thunks/profTabInfoThunks';

export const BrowseView = () => {

    const { darkmode } = useSelector((state: RootState) => state.darkmodeReducer);

    const CoursesBrowse = () => {
        const dispatch = useDispatch();
        const location = useLocation();
        useEffect(() => {
            dispatch(getCourseTabInfo(parseQueryFromUrl(location.search)));
        }, [dispatch, location]);
        const { courseTabInfo, courseTabInfoLoading, pages, current } = useSelector((state: RootState) => state.courseTabInfoReducer);

        return <div>
            <Header as='h2' inverted={darkmode}>Courses</Header>
            <Grid columns={2} divided={!isMobile && !isTablet}>
                <Grid.Row>
                    <Grid.Column mobile={16} tablet={16} computer={4} largeScreen={3} widescreen={3}>
                        <Header as='medium' inverted={darkmode}>Filters</Header>
                        <br /><br />
                        <CourseFilters />
                        <br />
                    </Grid.Column>

                    <Grid.Column mobile={16} tablet={16} computer={12} largeScreen={13} widescreen={13}>
                        <Header as='medium' inverted={darkmode}>Course List</Header>
                        {courseTabInfoLoading ? <Loading /> : <CourseTable courses={courseTabInfo || []} />}
                        <div className='center'>
                            <Pagination
                                inverted={darkmode}
                                onPageChange={(_e, data) => {
                                    dispatch(getCourseTabInfo(parseQueryFromUrl(location.search), data.activePage as number));
                                }}
                                size={(isMobile && !isTablet) ? 'mini' : undefined}
                                siblingRange={1}
                                prevItem={(isMobile && !isTablet) ? false : undefined}
                                nextItem={(isMobile && !isTablet) ? false : undefined}
                                firstItem={false}
                                lastItem={false}
                                totalPages={pages}
                                activePage={current}

                            />
                        </div>
                    </Grid.Column>

                </Grid.Row>

            </Grid>

        </div>
    }

    const ProfessorsBrowse = () => {
        const dispatch = useDispatch();
        const location = useLocation();

        const { profTabInfo, profTabInfoLoading, pages, current } = useSelector((state: RootState) => state.profTabInfoReducer);

        useEffect(() => {
            dispatch(getProfTabInfo(parseProfQueryFromUrl(location.search)));
        }, [dispatch, location]);

        return <div>
            <Header as='h2' inverted={darkmode} >Professors</Header>
            <Grid columns={2} divided={!isMobile && !isTablet}>
                <Grid.Row>
                    <Grid.Column mobile={16} tablet={16} computer={4} largeScreen={3} widescreen={3}>
                        <Header as='medium' inverted={darkmode}>Filters</Header>
                        <br /><br />
                        <ProfessorFilters />
                        <br />
                    </Grid.Column>
                    <Grid.Column mobile={16} tablet={16} computer={12} largeScreen={13} widescreen={13}>
                        <Header as='medium' inverted={darkmode}>Professor List</Header>
                        {profTabInfoLoading ? <Loading /> : <ProfessorTable professors={profTabInfo || []} />}
                        <div className='center'>
                            <Pagination
                                inverted={darkmode}
                                onPageChange={(_e, data) => {
                                    dispatch(getProfTabInfo(parseProfQueryFromUrl(location.search), data.activePage as number));
                                }}
                                size={(isMobile && !isTablet) ? 'mini' : undefined}
                                siblingRange={1}
                                prevItem={(isMobile && !isTablet) ? false : undefined}
                                nextItem={(isMobile && !isTablet) ? false : undefined}
                                firstItem={false}
                                lastItem={false}
                                totalPages={pages}
                                activePage={current}
                            />
                        </div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </div >
    }

    return <div >
        <Container textAlign='left' className={` boxshadow ${darkmode ? 'dark-bg' : ''} `}>
            <Menu stackable tabular>
                <Menu.Menu position='left' className='browse-table-tab'>
                    <Menu.Item
                        header
                        className={` ${darkmode ? 'BrowseTitle-dark' : 'BrowseTitle'} `}
                        inverted
                        position='left'
                    >
                        <strong> Browse All: </strong>
                    </Menu.Item>
                    <Menu.Item
                        name='Courses'
                        as={NavLink}
                        to={'/browse'}
                        className={` ${darkmode ? 'browseTabItem-dark' : 'browseTabItem'} `}
                        exact
                    />
                    <Menu.Item
                        name='Professors'
                        as={NavLink}
                        to={'/browse/professors'}
                        className={` ${darkmode ? 'browseTabItem-dark' : 'browseTabItem'} `}
                        exact
                    />
                </Menu.Menu>
            </Menu>
            <Route path='/browse' exact component={CoursesBrowse} />
            <Route path='/browse/professors' exact component={ProfessorsBrowse} />

        </Container>
    </div>
}