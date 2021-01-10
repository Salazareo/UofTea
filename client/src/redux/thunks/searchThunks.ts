import { Dispatch } from 'redux'
import { SearchResult } from '../../views/LandingView';
import { breakSearch, errorSearch, loadingSearch, successSearch } from '../actions/searchActions';

export const search = (queryString: string) => {
    return async (dispatch: Dispatch) => {
        if (queryString.length < 3 || queryString.length > 30) {
            dispatch(successSearch([]));
            return dispatch(breakSearch())
        }

        dispatch(loadingSearch());
        try {
            const courseCodePromise = (await fetch(`https://nikel.ml/api/courses?code=${queryString}&limit=5`)).json()
            const courseNamePromise = (await fetch(`https://nikel.ml/api/courses?name=${queryString}&limit=5`)).json()
            const profPromise = (await fetch(`/api/professors?name=${queryString}&limit=5`)).json()
            const allResponses = await Promise.all([courseCodePromise, courseNamePromise, profPromise]);
            const allResults: any[] = [];
            allResponses.forEach((res) => {
                allResults.push(res.response || res);
            });
            let nulled = true;
            for (const res of allResults) {
                if (res.length > 0) {
                    nulled = false;
                    break;
                }
            }
            if (nulled) {
                dispatch(successSearch([]));
            }
            const parsedResults: SearchResult[] = [];
            const added: string[] = [];
            allResults.slice(0, 2).forEach((courseList) => {
                courseList.forEach((course: { code: string; name: string; }) => {
                    const parsedCourse: SearchResult = {
                        title: course.code as string,
                        description: course.name,
                        type: 'Courses'
                    }
                    if (added.indexOf(parsedCourse.title) < 0) {
                        parsedResults.push(parsedCourse);
                        added.push(parsedCourse.title);
                    }
                });
            });
            allResults[2].items.forEach((prof: { professor: string, divisions: string[], departments: string[], campus: string[] }) => {
                const names = prof.professor.split(' ');
                let parsedName = '';
                names.forEach((name) => {
                    parsedName += name.charAt(0).toUpperCase() + name.slice(1) + ' ';
                });
                parsedResults.push({
                    title: parsedName.trimEnd(),
                    description: `${prof.campus[0].toUpperCase()} - ${prof.departments[0]}`,
                    type: 'Professors'
                });
            });

            dispatch(successSearch(parsedResults));
            setTimeout(() => dispatch(breakSearch()), 100);
        } catch (error) {
            dispatch(errorSearch(error));
        }
    }
}