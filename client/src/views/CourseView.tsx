import React, { useEffect, useState } from 'react';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Redirect, useLocation } from 'react-router-dom';
import { Route } from 'react-router-dom';
import { Button, Card, Container, Dropdown, DropdownProps, Grid, Header, Menu, Message, Progress, Table } from 'semantic-ui-react';
import { ActionBar } from '../components/ActionBar';
import { CourseRatingsBlock } from '../components/CourseRatingsBlock';
import { CourseReview, Ratings } from '../components/CourseReview';
import { CourseReviewModal } from '../components/CourseReviewModal';
import { HeaderBlock } from '../components/HeaderBlock';
import { Loading } from '../components/Loading';
import { resetReviewModal } from '../redux/actions/reviewActions';
import { RootState } from '../redux/reducers';
import { getCourseInfo } from '../redux/thunks/courseInfoThunks';
import { getCourseReviews } from '../redux/thunks/courseReviewThunks';


const deliveryTranslation = (delivery: string) => {
	switch (delivery) {
		case 'inper':
			return 'In-Person'
		case 'sync':
			return 'Online Synchronous'
		case 'async':
			return 'Online Asynchronous'
		default:
			return 'N/A'
	}
}

export interface Semester {
	key: number,
	text: string,
	value: string
}




export interface CourseInfo {
	code: string;
	name: string;
	campus: string;
	description: string;
	exclusions: string | null | undefined;
	prereqs: string | null | undefined;
	coreqs: string | null | undefined;
	recommendedPrep: string | null | undefined;
	utmBreath: string | null | undefined;
	utscBreath: string | null | undefined;
	stgBreath: string | null | undefined;
	level: string;
	ratings?: Ratings,
	offerings: {
		term: string;
		sections: {
			code: string;
			instructors: string[];
			times: {
				day: string;
				start: number;
				end: number;
				location: string | null | undefined;
			}[];
			size: number;
			enrollment: number | null | undefined;
			waitlist_option: boolean;
			delivery: string;
		}[]
	}[]
}

export const CourseView = () => {
	const { darkmode } = useSelector((state: RootState) => state.darkmodeReducer);
	const courseCode = useLocation().pathname.split('/')[2];
	const dispatch = useDispatch();
	const { courseInfoLoading, courseInfo, courseInfoError } = useSelector((state: RootState) => state.courseInfoReducer);
	const { getRatingsLoading, getRatingsResults, more } = useSelector((state: RootState) => state.ratingsGetReducer);
	const { postReviewSucc, postReviewFlip } = useSelector((state: RootState) => state.ratingsPostReducer);

	const [currentSortOrder, setSortOrder] = useState({
		index: 0,
	});
	const semesters = courseInfo?.offerings.map((semTerm, i) => {
		return { value: String(i), text: semTerm.term }
	}) || [];
	const [currentSemester, setSemester] = useState({
		semester: '',
		semesterIndex: 0,
	});

	const sortOptions = [
		{ orderBy: 'Date', ascending: false },
		{ orderBy: 'Date', ascending: true }
	]

	const handleOrderChange = (e: React.SyntheticEvent<HTMLElement, Event>,
		data: DropdownProps) => {
		e.persist();
		const stringOptions = sortOptions.map((opt) => JSON.stringify(opt));
		setSortOrder(() => ({
			index: stringOptions.indexOf(data.value as string)
		}));
	};
	useEffect(() => {
		dispatch(resetReviewModal());
	}, [dispatch, courseCode]);
	useEffect(() => {
		dispatch(getCourseInfo(courseCode));
		dispatch(getCourseReviews(courseCode, sortOptions[currentSortOrder.index].ascending));
		// eslint-disable-next-line
	}, [dispatch, courseCode, currentSortOrder, postReviewFlip]);



	const handleChange = (e: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
		e.persist();
		setSemester(() => ({
			semester: data.text as string,
			semesterIndex: parseInt(data.value as string, 10),
		}));
	};

	if (!courseInfoLoading && courseInfoError && courseInfoError.message === '404') {
		return <Redirect to='/404' />
	}
	const OverviewInnerComponent = () => {
		if (courseInfoLoading) {
			return <Loading />;
		}
		const courseRegex = /\b[a-z]{3,4}[a-d1-7]\d{2,3}[hy][135]\b/gi;
		let tempCourses = courseInfo?.prereqs?.match(courseRegex);
		let tempOther = courseInfo?.prereqs?.split(courseRegex)
		const parsedPrereqs: (string | JSX.Element)[] = [];
		if ((tempCourses && tempOther)) {

			tempCourses.forEach((text, index) => {
				parsedPrereqs.push(tempOther![index])
				parsedPrereqs.push(<NavLink className={`${darkmode ? 'courseLink-dark' : 'courseLink'} `}
					to={`/courses/${text}`}>{text}</NavLink >);
			});
			parsedPrereqs.push(tempOther![tempCourses?.length || 0]);

		} else {
			parsedPrereqs.concat(tempOther || []);
		}
		tempCourses = courseInfo?.coreqs?.match(courseRegex);
		tempOther = courseInfo?.coreqs?.split(courseRegex)
		const parsedCoreqs: (string | JSX.Element)[] = [];
		if ((tempCourses && tempOther)) {

			tempCourses.forEach((text, index) => {
				parsedCoreqs.push(tempOther![index])
				parsedCoreqs.push(<NavLink className={`${darkmode ? 'courseLink-dark' : 'courseLink'} `}
					to={`/courses/${text}`}>{text}</NavLink >);
			});
			parsedCoreqs.push(tempOther![tempCourses?.length || 0]);

		} else {
			parsedCoreqs.concat(tempOther || []);
		}
		tempCourses = courseInfo?.exclusions?.match(courseRegex);
		tempOther = courseInfo?.exclusions?.split(courseRegex)
		const parsedExclusions: (string | JSX.Element)[] = [];
		if ((tempCourses && tempOther)) {

			tempCourses.forEach((text, index) => {
				parsedExclusions.push(tempOther![index])
				parsedExclusions.push(<NavLink className={`${darkmode ? 'courseLink-dark' : 'courseLink'} `}
					to={`/courses/${text}`}>{text}</NavLink >);
			});
			parsedExclusions.push(tempOther![tempCourses?.length || 0]);

		} else {
			parsedExclusions.concat(tempOther || []);
		}
		tempCourses = courseInfo?.recommendedPrep?.match(courseRegex);
		tempOther = courseInfo?.recommendedPrep?.split(courseRegex)
		const parsedRecommended: (string | JSX.Element)[] = [];
		if ((tempCourses && tempOther)) {

			tempCourses.forEach((text, index) => {
				parsedRecommended.push(tempOther![index])
				parsedRecommended.push(<NavLink className={`${darkmode ? 'courseLink-dark' : 'courseLink'} `} to={`/courses/${text}`}>{text}</NavLink >);
			});
			parsedRecommended.push(tempOther![tempCourses?.length || 0]);

		} else {
			parsedRecommended.concat(tempOther || []);
		}

		return <div>
			{courseInfo?.ratings && courseInfo.ratings.difficulty && courseInfo.ratings.difficulty !== 0 ?
				<Card.Group className='review-cards' stackable centered>
					<Card style={{ width: '32%' }} className={`progress-card ${darkmode ? 'dark-bg-card' : ''} `}>
						<Card.Content >
							<Grid columns={2} verticalAlign='middle' >
								<Grid.Row>
									<Grid.Column verticalAlign='middle'>
										<CircularProgressbar
											styles={buildStyles({
												pathColor: darkmode ? '#00204e' : '#1257b8',
												textColor: darkmode ? '#d0def2' : '#00204e',
												trailColor: darkmode ? 'rgba(255,255,255,.2)' : 'rgba(0,0,0,.1)'
											})}
											value={(courseInfo?.ratings.difficulty / 5) * 100}
											text={`${(courseInfo?.ratings.difficulty / 5 * 100).toFixed(1)}%`} />
									</Grid.Column>
									<Grid.Column verticalAlign='middle' textAlign='left'>
										Average course difficulty from: <br /> <b >{courseInfo.ratings.total} {courseInfo.ratings.total === 1 ? 'Review' : 'Reviews'}</b>
									</Grid.Column>
								</Grid.Row>
							</Grid>
						</Card.Content>
					</Card>
					<Card style={{ width: '32%' }} className={`${darkmode ? 'dark-bg-card' : ''} `}>
						<Card.Content>
							<Grid columns={2} verticalAlign='middle'>
								<Grid.Row>
									<Grid.Column verticalAlign='middle'>
										<CircularProgressbar
											styles={buildStyles({
												pathColor: darkmode ? '#00204e' : '#1257b8',
												textColor: darkmode ? '#d0def2' : '#00204e',
												trailColor: darkmode ? 'rgba(255,255,255,.2)' : 'rgba(0,0,0,.1)'
											})}
											value={courseInfo?.ratings.recommended * 100}
											text={`${(courseInfo?.ratings.recommended * 100).toFixed(1)}%`} />
									</Grid.Column>
									<Grid.Column verticalAlign='middle' textAlign='left'>
										of <b>{courseInfo.ratings.total} {courseInfo.ratings.total === 1 ? 'Review' : 'Reviews'}</b> recommend taking this course.
									</Grid.Column>
								</Grid.Row>
							</Grid>
						</Card.Content>
					</Card >
					<Card style={{ width: '32%' }} className={`${darkmode ? 'dark-bg-card' : ''} `}>
						<Card.Content textAlign='left'>
							<label><b>Useful for their career:</b> {courseInfo?.ratings.useful.toFixed(1)}/5</label>
							<Progress color='blue'
								className={`progress-content ${darkmode ? 'darkbar' : ''}`}
								size='small'
								percent={courseInfo?.ratings.useful / 5 * 100} />
							<label><b>Interesting:</b> {courseInfo?.ratings.interesting.toFixed(1)}/5</label>
							<Progress
								className={`progress-content ${darkmode ? 'darkbar' : ''}`}
								size='small'
								percent={courseInfo?.ratings.interesting / 5 * 100} />
							<label><b>Workload:</b> {courseInfo?.ratings.workload.toFixed(1)}/5</label>
							<Progress color='blue'
								className={`progress-content ${darkmode ? 'darkbar' : ''}`}
								size='small'
								percent={courseInfo?.ratings.workload / 5 * 100} />
						</Card.Content>
					</Card>
				</Card.Group> :
				<Card fluid color='red'
					style={darkmode ? { color: 'white', backgroundColor: 'gray', borderColor: 'gray' } : {}}
					header='No available ratings yet' />}
			<Header as='h1' textAlign='left' inverted={darkmode}>Course Description</Header>
			<p className='left-text'>{courseInfo?.description}</p>
			<br />
			<Grid columns={2}>
				<Grid.Row>
					<Grid.Column>
						<Header as='h2' textAlign='left' inverted={darkmode}>Prerequisites</Header>
						<p className='left-text'>{parsedPrereqs.length ? parsedPrereqs : 'N/A'}</p>
					</Grid.Column>
					<Grid.Column>
						<Header as='h2' textAlign='left' inverted={darkmode}>Corequisites</Header>
						<p className='left-text'>{parsedCoreqs.length ? parsedCoreqs : 'N/A'}</p>
					</Grid.Column>
				</Grid.Row>
				<Grid.Row>
					<Grid.Column>
						<Header as='h2' textAlign='left' inverted={darkmode}>Exclusion</Header>
						<p className='left-text'>{parsedExclusions.length ? parsedExclusions : 'N/A'}</p>
					</Grid.Column>
					<Grid.Column>
						<Header as='h2' textAlign='left' inverted={darkmode}>Recommended Preparation</Header>
						<p className='left-text'>{parsedRecommended.length ? parsedRecommended : 'N/A'}</p>
					</Grid.Column>
				</Grid.Row>
			</Grid>
			<br />
			<span className='left-text'>
				<CourseReviewModal />
			</span>
			<hr style={{ marginTop: '20px' }} />
			<br />
			<Grid columns={2} stackable>
				<Grid.Row>
					<Grid.Column>
						<Header as='h1' textAlign='left' inverted={darkmode}>Course Offerings</Header>
					</Grid.Column>
					<Grid.Column textAlign='right'>
						<Dropdown inverted={darkmode} selection name='currentSemester'
							style={darkmode ? { color: 'white', backgroundColor: 'gray' } : {}}
							options={semesters}
							text={semesters[currentSemester.semesterIndex]?.text || 'Fall'}
							value={currentSemester.semesterIndex}
							onChange={handleChange} />
					</Grid.Column>
				</Grid.Row>
			</Grid>
			<Table columns={5} inverted={darkmode}>
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell>Section</Table.HeaderCell>
						<Table.HeaderCell>Instructor</Table.HeaderCell>
						<Table.HeaderCell>Enrolled</Table.HeaderCell>
						<Table.HeaderCell>Times and Location</Table.HeaderCell>
						<Table.HeaderCell>Delivery Method</Table.HeaderCell>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{courseInfo?.offerings[currentSemester ?
						currentSemester.semesterIndex : 0]?.sections.sort((a, b) => a.code > b.code ? 1 : -1).map((section) => {
							return <Table.Row>
								<Table.Cell>{section.code.toUpperCase().replace(/ /g, '')}</Table.Cell>
								<Table.Cell>{section.instructors.length > 0 ?
									section.instructors.map((instructor, index) => <> {index !== 0 && <br />}
										{instructor.split(/\s[A-Z]{1}\s/g).map((names, nameIndex) => <> {nameIndex !== 0 && <br />}
											<NavLink style={{ color: darkmode ? '#6495ED' : 'navy' }}
												className='courseLink'
												to={`/browse/professors?name=${nameIndex ? instructor.match(/\s[A-Z]{1}\s/g)![nameIndex - 1] + names : names}`}>
												{nameIndex ? instructor.match(/\s[A-Z]{1}\s/g)![nameIndex - 1] + names : names}
											</NavLink></>
										)}
									</>)
									: 'TBA'}
								</Table.Cell>
								<Table.Cell>{(section.enrollment || '?') + '/' + section.size}</Table.Cell>
								<Table.Cell>{section.times.map((times) => {
									return [`${times.day.charAt(0).toUpperCase() + times.day.slice(1)}: ${times.start / 3600}:00 - ${times.end / 3600}:00`,
									`${times.location?.replace(/ /g, '') || ''}`, section.times.indexOf(times) === section.times.length - 1 ? '' : <br />,]
								})}</Table.Cell>
								<Table.Cell>{deliveryTranslation(section.delivery)}</Table.Cell>
							</Table.Row>
						}) || <Table.Row>
							<Table.Cell >
								No info available <span role='img' aria-label=':('>😥</span>
							</Table.Cell>
							<Table.Cell >N/A</Table.Cell>
							<Table.Cell >N/A</Table.Cell>
							<Table.Cell >N/A</Table.Cell>
							<Table.Cell >N/A</Table.Cell>
						</Table.Row>}
				</Table.Body>
			</Table>
			<br />
		</div >
	}
	const ReviewComponents = () => {
		if ((!getRatingsResults || !getRatingsResults.length) && (courseInfoLoading || getRatingsLoading)) {
			return <Loading />
		}
		return <div>
			<CourseRatingsBlock overallstats={(courseInfo && courseInfo.ratings && courseInfo.ratings.difficulty) ? [
				{ header: 'Recommended', description: ((courseInfo!.ratings?.recommended || 0) * 100).toFixed(1) + '%' },
				{ header: 'Difficulty', description: `${courseInfo!.ratings?.difficulty.toFixed(1)}` },
				{ header: 'Useful', description: `${courseInfo!.ratings?.useful.toFixed(1)}` },
				{ header: 'Interesting', description: `${courseInfo!.ratings?.interesting.toFixed(1)}` },
				{ header: 'Workload', description: `${courseInfo!.ratings?.workload.toFixed(1)}` }] : []}
				ratingExplanation={`Our course rating system asks to rate a courses' difficulty,
					usefulness for career, how interesting it was, and the workload all out of 5,
					finally asking for a Yes/No on "would you recommend this course".
					The numbers on the right are the overall rating average of all the users who have left a review.`}
				total={courseInfo?.ratings?.total || 0} />
			<br />
			<hr />
			<br />
			<ActionBar
				onChange={handleOrderChange}
				options={sortOptions}
				index={currentSortOrder.index}
				darkmode={darkmode} />
			{getRatingsResults && getRatingsResults.length > 0 ? getRatingsResults?.map((review) => {
				return CourseReview(review)
			}) : <Card fluid color='red'
				style={darkmode ? { color: 'white', backgroundColor: 'gray', borderColor: 'gray' } : {}}
				header='No reviews posted yet' />}
			<br />
			{more &&
				<Button
					fluid
					loading={getRatingsLoading}
					color='instagram'
					onClick={() => {
						dispatch(getCourseReviews(courseCode,
							sortOptions[currentSortOrder.index].ascending,
							{
								courseCode: getRatingsResults![getRatingsResults!.length - 1].courseCode,
								time: getRatingsResults![getRatingsResults!.length - 1].time
							}))
					}}>
					Load More
			</Button>}
		</div>
	}

	return <Container className='boxshadow'>
		<HeaderBlock title={courseCode.toUpperCase()}
			subheading={courseInfo?.name as string}
			darkmode={darkmode} />
		<Menu pointing
			secondary
			className={`${darkmode ? 'page-menu-tab-dark' : 'page-menu-tab'} `}>
			<Menu.Item
				name='Overview'
				as={NavLink}
				to={'/courses/' + courseCode}
				exact
			/>
			<Menu.Item
				name='Reviews'
				as={NavLink}
				to={'/courses/' + courseCode + '/review'}
				exact
			/>
		</Menu>
		{postReviewSucc &&
			<Message
				color='green'
				style={{ textAlign: 'center' }}
			>
				<Message.Header >Success!!!</Message.Header>
				Your review has been posted!
			</Message>}
		<Route path='/courses/:id' exact component={OverviewInnerComponent} />
		<Route path='/courses/:id/review' exact component={ReviewComponents} />

	</Container>
}