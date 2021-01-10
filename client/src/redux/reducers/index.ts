import { combineReducers } from 'redux';
import { authReducer } from './authenticationReducer';
import { courseInfoReducer } from './courseInfoReducer';
import { courseTabInfoReducer } from './courseTabInfoReducer';
import { darkmodeReducer } from './darkmodeReducer';
import { passwordResetReducer } from './passwordResetReducer';
import { ratingsPostProfReducer } from './postProfReviewReducer';
import { ratingsPostReducer } from './postReviewReducer';
import { profInfoReducer } from './profInfoReducer';
import { profTabInfoReducer } from './profTabInfoReducer';
import { ratingsGetReducer } from './ratingsGetReducer';
import { ratingsGetProfReducer } from './ratingsProfGetReducer';
import { searchCourseReducer } from './reviewCourseSearchReducer';
import { searchProfReducer } from './reviewProfSearchReducer';
import { searchReducer } from './searchReducer';
import { verifyReducer } from './verifyReducer';


export const rootReducer = combineReducers({
    courseInfoReducer,
    searchReducer,
    authReducer,
    ratingsGetReducer,
    ratingsPostReducer,
    searchProfReducer,
    profInfoReducer,
    ratingsGetProfReducer,
    ratingsPostProfReducer,
    profTabInfoReducer,
    courseTabInfoReducer,
    searchCourseReducer,
    darkmodeReducer,
    verifyReducer,
    passwordResetReducer,
})


export type RootState = ReturnType<typeof rootReducer>;