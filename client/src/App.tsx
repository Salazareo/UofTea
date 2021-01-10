import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import './App.css';
import { Footer } from './components/Footer';
import { LoggedOutMessage } from './components/LoggedOutMessage';
import { Navbar } from './components/Navbar';
import { NewVersionMessage } from './components/NewVersionMessage';
import { ScrollToTop } from './components/ScrollToTop';
import { RootState } from './redux/reducers';
import { obtainDarkmode } from './redux/thunks/darkmodeThunk';
import { validateJWT } from './redux/thunks/userThunks';
import { NotFound } from './views/404';
import { AboutUsView } from './views/AboutUsView';
import { BrowseView } from './views/BrowseView';
import { CourseView } from './views/CourseView';
import { ForgotPassword } from './views/ForgotPasssword';
import { LandingView } from './views/LandingView';
import { Login } from './views/Login';
import { PrivacyPolicy } from './views/PrivacyPolicy';
import { ProfView } from './views/ProfView';
import { Register } from './views/Register';
import { ResetPassword } from './views/ResetPasssword';
import { TermsOfUse } from './views/TermsOfUse';
import { Verified } from './views/Verified';


const App = () => {
  const { jwt } = useSelector((state: RootState) => state.authReducer);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(validateJWT())
  }, [dispatch]);
  useEffect(() => {
    dispatch(obtainDarkmode());
  }, [dispatch, jwt]);
  const { darkmode } = useSelector((state: RootState) => state.darkmodeReducer);
  return <Router>

    <Navbar />
    <ScrollToTop />
    <NewVersionMessage />
    <div className={`Content ${darkmode ? 'dark-bg' : ''} `}>
      <Switch>
        <Route exact path='/' component={LandingView} />
        <Route exact path='/browse/(professors)?' component={BrowseView} />
        <Route exact path='/courses/:courseId/(review)?' component={CourseView} />
        <Route exact path='/professors/:professor' component={ProfView} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/register' component={Register} />
        <Route exact path='/terms-of-use' component={TermsOfUse} />
        <Route exact path='/privacy' component={PrivacyPolicy} />
        <Route exact path='/about' component={AboutUsView} />
        <Route exact path='/verify/:secret' component={Verified} />
        <Route path='/404' exact component={NotFound} />
        <Route exact path='/forgot' component={ForgotPassword} />
        <Route exact path='/reset/:token' component={ResetPassword} />
        <Redirect from='*' to='/404' />
      </Switch>
    </div >
    <LoggedOutMessage />
    <Footer />
  </Router >
}

export default App;
