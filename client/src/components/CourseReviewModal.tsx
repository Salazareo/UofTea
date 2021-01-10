import React, { useState } from 'react';
import { isMobileOnly } from 'react-device-detect';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useHistory } from 'react-router-dom';
import { Button, ButtonProps, Form, Grid, Icon, Message, Modal, Popup, Search, TextArea } from 'semantic-ui-react';
import { resetReviewModal } from '../redux/actions/reviewActions';
import { RootState } from '../redux/reducers';
import { postCourseReview } from '../redux/thunks/courseReviewThunks';
import { searchProf } from '../redux/thunks/searchProfThunks';
import { ConfirmModalClose } from './ConfirmModalClose';


export const CourseReviewModal = () => {
  const dispatch = useDispatch();

  const { darkmode } = useSelector((state: RootState) => state.darkmodeReducer);
  const { jwt } = useSelector((state: RootState) => state.authReducer);
  const { courseInfo } = useSelector((state: RootState) => state.courseInfoReducer);
  const { profsLoading, profsResults } = useSelector((state: RootState) => state.searchProfReducer);
  const { postReviewError, postReviewLoading, dataToRestore } = useSelector((state: RootState) => (state.ratingsPostReducer))

  const [modalState, setModalState] = useState({
    open: (postReviewLoading || postReviewError) ? true : false
  });

  const openModal = () => {
    setModalState(() => ({ open: true }));
  }
  const closeModal = () => {
    dispatch(resetReviewModal());
    setModalState(() => ({ open: false }));
  }

  const [values, setValues] = useState(dataToRestore ? dataToRestore : {
    recommended: '',
    difficulty: 0,
    usefulness: 0,
    interesting: 0,
    workload: 0,
    review: '',
    prof: '',
  });
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement> | any) => {
    e.persist();
    setValues(valueChange => ({
      ...valueChange,
      [e.target.name]: parseInt(e.target.value, 10) || (e.target.name === 'review' ?
        e.target.value.slice(0, 300) : (e.target.value.slice(0, 30) || e.target.value))
    }));
  };

  const history = useHistory();
  const submitReview = () => {
    if (jwt) {
      const courseCode = courseInfo?.code || '';
      dispatch(postCourseReview(courseCode.toLowerCase(), values));
    } else {
      history.push('/login', { backTo: history.location.pathname });
    }
  }
  const { open } = modalState;
  const createButtons = (name: string,
    OnClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, data: ButtonProps) => void,
    buttonValues: { [key: string]: any }, options: number[] | string[] = [1, 2, 3, 4, 5]) => {
    const buttons = [];
    for (const option of options) {
      buttons.push(<Button value={option}
        name={name}
        onClick={OnClick}
        active={buttonValues[name] === option}
        color={darkmode ? 'grey' : undefined}
        inverted={darkmode}
      >
        {option}
      </Button>);
    }
    return buttons;
  };

  return !jwt ?
    <div className='left-text'>
      <Button disabled
        color='facebook'
        icon
        inverted={darkmode}
        as={NavLink}
        to='/login'
        size='large'>
        Login to write a review <Icon name='write' />
      </Button>
    </div> :
    <Modal
      inverted={darkmode}
      closeOnEscape={false}
      closeOnDimmerClick={isMobileOnly}
      open={open}
      onOpen={openModal}
      onClose={closeModal}
      trigger={
        <Button
          color='facebook'
          icon
          inverted={darkmode}
          size='large'>
          Write a Review <Icon name='write' />
        </Button>}
      className={`${darkmode ? 'dark-modal' : ''} `}
    >
      <Modal.Header>{`Write a Review for ${courseInfo?.code || ''}: ${courseInfo?.name || ''}`}</Modal.Header>
      <Modal.Content>
        <Form>
          <Grid stackable columns={2}>
            <Grid.Row>
              <Grid.Column>
                <p><label><b>Do you recommend the course?</b></label><br />
                  <Button.Group>
                    {createButtons('recommended', handleChange, values, ['Yes', 'No'])};
                    </Button.Group>
                </p>
                <p>
                  <label>
                    <b>Difficulty  <Popup
                      trigger={<Icon name='help circle' inverted={darkmode} />}
                      content='1: Not Difficult | 5: Very Difficult'
                      size='tiny'
                    /></b>
                  </label>
                  <br />
                  <Button.Group>
                    {createButtons('difficulty', handleChange, values)};
                    </Button.Group>
                </p>
                <p>
                  <label>
                    <b>Usefulness  <Popup
                      trigger={<Icon name='help circle' inverted={darkmode} />}
                      content='1: Not Useful | 5: Very Useful'
                      size='tiny'
                    /></b>
                  </label>
                  <br />
                  <Button.Group>
                    {createButtons('usefulness', handleChange, values)};
                    </Button.Group>
                </p>
                <p>
                  <label>
                    <b>Interesting  <Popup
                      trigger={<Icon name='help circle' inverted={darkmode} />}
                      content='1: Not Interesting | 5: Very Interesting'
                      size='tiny'
                    /></b>
                  </label>
                  <br />
                  <Button.Group>
                    {createButtons('interesting', handleChange, values)};
                    </Button.Group>
                </p>
                <p>
                  <label>
                    <b>Workload  <Popup
                      trigger={<Icon name='help circle' inverted={darkmode} />}
                      content='1: Not Much Work | 5: Lots of Work'
                      size='tiny'
                    /></b>
                  </label>
                  <br />
                  <Button.Group>
                    {createButtons('workload', handleChange, values)};
                    </Button.Group>
                </p>
              </Grid.Column>
              <Grid.Column >
                <label><b>Professor Name</b></label><br />
                <Search
                  onSearchChange={(e, data) => {
                    handleChange({ persist: e.persist, target: { name: 'prof', value: data.value } });
                    if (!profsLoading) {
                      dispatch(searchProf(data.value as string))
                    } else {
                      setTimeout(() => dispatch(searchProf(data.value as string)), 100);
                    }
                  }}
                  loading={profsLoading}
                  onResultSelect={(e, data) => {
                    handleChange({ persist: e.persist, target: { name: 'prof', value: data.result.title } });
                  }}
                  input={{ fluid: true }}
                  fluid={true}
                  inverted={true}
                  value={values.prof || undefined}
                  results={profsResults || []}
                  className={`${darkmode ? 'main-search-dark' : ''} `}
                />
                <br />
                <label><b>Your Review</b></label><br />
                <TextArea
                  placeholder='Your Course Review (Max. 300 characters)'
                  className={`comments ${darkmode ? 'comments-dark' : ''} `}
                  value={values.review || undefined}
                  rows={12}
                  name='review'
                  onChange={handleChange}
                />
              </Grid.Column>
            </Grid.Row>

          </Grid>
          {postReviewError &&
            <Message
              color='red'
              style={{ textAlign: 'center' }}
            >
              <Message.Header >{postReviewError.message === '401' ? 'Unauthorized' : 'Error'}</Message.Header>
              {postReviewError.message === 'Bad Request' ? 'Please fill in all of the fields' :
                postReviewError.message === '401' ? 'Please verify your account before leaving reviews' :
                  'Please try again later :('}
            </Message>}
        </Form>
        <hr />
        <p>By submitting this review, you agree to the <NavLink target='_blank'
          to='/terms-of-use' >terms and conditions</NavLink> of this site.</p>
        <p>Repeated course/professor reviews within the same term period will replace old review.</p>
      </Modal.Content>
      <Modal.Actions>
        <ConfirmModalClose
          onAccept={closeModal}
          content='Are you sure? Your review will be lost.'
          buttonLabel='Cancel'
        />
        <Button loading={postReviewLoading}
          onClick={submitReview}
          positive>
          Submit Review
                </Button>
      </Modal.Actions>
    </Modal>
}
