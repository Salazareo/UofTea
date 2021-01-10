import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useHistory } from 'react-router-dom';
import { Button, ButtonProps, Form, Grid, Icon, Message, Modal, Popup, Search, TextArea } from 'semantic-ui-react';
import { resetReviewProfModal } from '../redux/actions/reviewProfActions';
import { RootState } from '../redux/reducers';
import { postProfReview } from '../redux/thunks/profReviewThunks';
import { searchCourse } from '../redux/thunks/searchCourseReducer';
import { ConfirmModalClose } from './ConfirmModalClose';


export const ProfReviewModal = (props: { professor: string }) => {
  const dispatch = useDispatch();

  const { darkmode } = useSelector((state: RootState) => state.darkmodeReducer);
  const { jwt } = useSelector((state: RootState) => state.authReducer);
  const { coursesLoading, coursesResults } = useSelector((state: RootState) => state.searchCourseReducer);

  const { postProfReviewLoading, postProfReviewError, dataToRestore } = useSelector((state: RootState) => state.ratingsPostProfReducer);

  const [modalState, setModalState] = useState({
    open: (postProfReviewLoading || postProfReviewError) ? true : false
  });

  const openModal = () => {
    setModalState(() => ({ open: true }));
  }
  const closeModal = () => {
    dispatch(resetReviewProfModal());
    setModalState(() => ({ open: false }));
  }

  const [values, setValues] = useState(dataToRestore ? dataToRestore : {
    recommended: '',
    clarity: 0,
    engaging: 0,
    review: '',
    course: ''
  });
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement> | any) => {
    e.persist();
    setValues(valueChange => ({
      ...valueChange,
      [e.target.name]: parseInt(e.target.value, 10) || (e.target.name === 'review' ?
        e.target.value.slice(0, 300) : e.target.value.slice(0, 10))
    }));
  };

  const history = useHistory();
  const submitReview = () => {
    if (jwt) {
      const professor = props.professor;
      dispatch(postProfReview(professor.toLowerCase(), values));
    } else {
      history.push('/login', { backTo: history.location.pathname });
    }
  }
  const { open } = modalState;

  const createButtons = (name: string, OnClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, data: ButtonProps) => void,
    buttonValues: { [key: string]: any }, options: number[] | string[] = [1, 2, 3, 4, 5]) => {
    const buttons = [];
    for (const option of options) {
      buttons.push(<Button value={option}
        name={name}
        onClick={OnClick}
        active={buttonValues[name] === option}
        color={darkmode ? 'grey' : undefined}
        inverted={darkmode}>
        {option}
      </Button>);
    }
    return buttons;
  };


  return !jwt ?
    <div className='left-text'>
      <Button
        disabled
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
      closeOnEscape={false}
      closeOnDimmerClick={false}
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
      <Modal.Header>{`Write a Review for: ${props.professor}`}</Modal.Header>
      <Modal.Content>
        <Form>
          <Grid stackable columns={2}>
            <Grid.Row>
              <Grid.Column>
                <p><label><b>Do you recommend this professor?</b></label><br />
                  <Button.Group>
                    {createButtons('recommended', handleChange, values, ['Yes', 'No'])};
                    </Button.Group>
                </p>
                <p>
                  <label>
                    <b>Clarity  <Popup
                      trigger={<Icon name='help circle' inverted={darkmode} />}
                      content='1: Not Clear | 5: Very Clear'
                      size='tiny'
                    /></b>
                  </label>
                  <br />
                  <Button.Group>
                    {createButtons('clarity', handleChange, values)};
                    </Button.Group>
                </p>
                <p>
                  <label>
                    <b>Engagement <Popup
                      trigger={<Icon name='help circle' inverted={darkmode} />}
                      content='1: Not Engaging | 5: Very Engaging'
                      size='tiny'
                    /></b>
                  </label>
                  <br />
                  <Button.Group style={{ display: 'inline-block' }}>
                    {createButtons('engaging', handleChange, values)};
                    </Button.Group>
                </p>
              </Grid.Column>
              <Grid.Column >
                <label><b>Course Code</b></label><br />
                <Search
                  onSearchChange={(e, data) => {
                    handleChange({ persist: e.persist, target: { name: 'course', value: data.value } });
                    if (!coursesLoading) {
                      dispatch(searchCourse(data.value as string))
                    } else {
                      setTimeout(() => dispatch(searchCourse(data.value as string)), 100);
                    }
                  }}
                  loading={coursesLoading}
                  onResultSelect={(e, data) => {
                    handleChange({ persist: e.persist, target: { name: 'course', value: data.result.title } });
                  }}
                  input={{ fluid: true }}
                  fluid={true}
                  inverted={true}
                  value={values.course || undefined}
                  results={coursesResults || []}
                  className={`${darkmode ? 'main-search-dark' : ''} `}
                />
                <br />
                <label>
                  <b>Your Review</b>
                </label>
                <br />
                <TextArea
                  placeholder='Your Professor Review (Max. 300 characters)'
                  className={`comments ${darkmode ? 'comments-dark' : ''} `}
                  rows={5}
                  value={values.review || undefined}
                  name='review'
                  onChange={handleChange} />

              </Grid.Column>
            </Grid.Row>
          </Grid>
          {postProfReviewError &&
            <Message
              color='red'
              style={{ textAlign: 'center' }}
            >
              <Message.Header >{postProfReviewError.message === '401' ? 'Unauthorized' : 'Error'}</Message.Header>
              {postProfReviewError.message === 'Bad Request' ? 'Please fill in all of the fields' :
                postProfReviewError.message === '401' ? 'Please verify your account before leaving reviews' :
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
          buttonLabel='Cancel' />
        <Button loading={postProfReviewLoading}
          onClick={submitReview}
          positive>
          Submit Review
                </Button>
      </Modal.Actions>
    </Modal>
}