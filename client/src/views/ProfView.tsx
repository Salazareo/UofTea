import React, { useEffect, useState } from 'react';
import 'react-circular-progressbar/dist/styles.css';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useLocation } from 'react-router-dom';
import { Button, Card, Container, DropdownProps, Grid, Header, Message } from 'semantic-ui-react';
import { HeaderBlock } from '../components/HeaderBlock';
import { Loading } from '../components/Loading';
import { ProfActionBar } from '../components/ProfActionBar';
import { Campuses } from '../components/ProfessorTable';
import { ProfRatingsBlock } from '../components/ProfRatingsBlock';
import { ProfessorReview, ProfRatings } from '../components/ProfReview';
import { resetReviewProfModal } from '../redux/actions/reviewProfActions';
import { RootState } from '../redux/reducers';
import { getprofInfo } from '../redux/thunks/profInfoThunks';
import { getProfReviews } from '../redux/thunks/profReviewThunks';

export interface ProfInfo {
	professor: string;
	campus: string[];
	departments: string[];
	divisions: string[];
	ratings?: ProfRatings,
}

export const ProfView = () => {
	const names = useLocation().pathname.split('/')[2];
	const { darkmode } = useSelector((state: RootState) => state.darkmodeReducer);
	let professor = '';
	names.split(' ').forEach((name) => {
		professor += name.charAt(0).toUpperCase() + name.slice(1) + ' ';
	});
	const dispatch = useDispatch();
	const { profInfoLoading, profInfo, profInfoError } = useSelector((state: RootState) => state.profInfoReducer);
	const { getProfRatingsResults, getProfRatingsLoading, more } = useSelector((state: RootState) => state.ratingsGetProfReducer);
	const { postProfReviewSucc } = useSelector((state: RootState) => state.ratingsPostProfReducer);

	const [currentSortOrder, setSortOrder] = useState({
		index: 0,
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
		dispatch(resetReviewProfModal());
	}, [dispatch, names]);
	useEffect(() => {
		dispatch(getprofInfo(professor));
		dispatch(getProfReviews(professor, sortOptions[currentSortOrder.index].ascending));
		// eslint-disable-next-line
	}, [dispatch, professor, currentSortOrder, postProfReviewSucc]);
	if (!profInfoLoading && profInfoError && profInfoError.message === '404') {
		return <Redirect to='/404' />
	}
	const OverviewInnerComponent = () => {
		if (profInfoLoading) {
			return <Loading />;
		}
		return <div>
			<br />
			{<ProfRatingsBlock
				overallstats={(profInfo && profInfo.ratings && profInfo.ratings.clarity) ? [
					{ header: 'Recommended', description: ((profInfo!.ratings?.recommended || 0) * 100).toFixed(1) + '%' },
					{ header: 'Clarity', description: `${profInfo!.ratings?.clarity.toFixed(1)}` },
					{ header: 'Engaging', description: `${profInfo!.ratings?.engaging.toFixed(1)}` }] : []}
				ratingExplanation={`Our course rating system asks to rate a professor’s clarity and engagement out of 5.
				Asking for a Yes/No on "would you recommend this professor".
				The numbers on the right are the overall rating average of all the users who have left a review.`}
				total={profInfo?.ratings?.total || 0} />}
			<Grid columns={2}>
				<Grid.Column>
					<Header as='h2' inverted={darkmode} textAlign='left'>Campus</Header>
					{profInfo?.campus.map((campus) => <p className='left-text'>{Campuses[campus.toLowerCase() as keyof typeof Campuses]}</p>) || 'N/A'}
				</Grid.Column>
				<Grid.Column>
					<Header as='h2' inverted={darkmode} textAlign='left'>Department(s)</Header>
					{profInfo?.departments.map((department) => <p className='left-text'>{department}</p>) || 'N/A'}
				</Grid.Column>
			</Grid>
			<br />
			<hr />
			<br />
			<ProfActionBar
				onChange={handleOrderChange}
				options={sortOptions}
				index={currentSortOrder.index}
				darkmode={darkmode}
				professor={professor} />
			{getProfRatingsResults && getProfRatingsResults.length > 0 ?
				getProfRatingsResults?.map((ProfReview) => {
					return ProfessorReview(ProfReview)
				}) : <Card fluid color='red'
					style={darkmode ? { color: 'white', backgroundColor: 'gray', borderColor: 'gray' } : {}}
					header='No reviews posted yet' />}
			<br />
			{more &&
				<Button
					fluid
					loading={getProfRatingsLoading}
					color='instagram'
					onClick={() => {
						dispatch(getProfReviews(professor,
							sortOptions[currentSortOrder.index].ascending,
							{
								professor: getProfRatingsResults![getProfRatingsResults!.length - 1].professor,
								time: getProfRatingsResults![getProfRatingsResults!.length - 1].time
							}))
					}}>
					Load More
			</Button>}
		</div >
	}
	return <Container className='boxshadow'>
		<HeaderBlock title={professor}
			subheading={'Professor'}
			darkmode={darkmode} />
		{postProfReviewSucc && <Message
			color='green'
			style={{ textAlign: 'center' }}
		>
			<Message.Header >Success!!!</Message.Header>
				Your review has been posted!
			</Message>}
		<OverviewInnerComponent />
	</Container>
}
