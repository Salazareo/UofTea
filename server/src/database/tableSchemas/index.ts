
import { CourseInfoSchema } from './CourseInfo';
import { CourseReviewSchema } from './CourseReviews';
import { ProfessorInfoSchema } from './ProfessorInfo';
import { ProfessorReviewsSchema } from './ProfessorReviews';
import { UserCredentialsSchema } from './UserCredentials';
import { UserInfoSchema } from './UserInfo';

const TableSchemas = [
    ProfessorInfoSchema,
    UserCredentialsSchema,
    CourseInfoSchema,
    CourseReviewSchema,
    ProfessorReviewsSchema,
    UserInfoSchema
]

export default TableSchemas;