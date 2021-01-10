import { Dispatch } from 'redux';
import { breakProfSearch, errorProfSearch, loadingProfSearch, ProfSearch, successProfSearch } from '../actions/searchReviewProfActions';

export interface ProfResult {
    professor: string;
    divisions: string[];
    campus: string[];
    departments: string[];
}

export const searchProf = (queryString: string) => {
    return async (dispatch: Dispatch) => {
        if (queryString.length < 3 || queryString.length > 30) {
            dispatch(successProfSearch([]));
            return dispatch(breakProfSearch())
        }

        dispatch(loadingProfSearch());
        try {
            const profPromise = (await (await fetch(`/api/professors?name=${queryString}&limit=3`)).json()).items;
            const parsedResults: ProfSearch[] = [];
            profPromise.forEach((prof: ProfResult) => {
                const names = prof.professor.split(' ');
                let parsedName = '';
                names.forEach((name) => {
                    parsedName += name.charAt(0).toUpperCase() + name.slice(1) + ' ';
                });
                parsedResults.push({ title: parsedName, description: `${prof.campus[0].toUpperCase()} - ${prof.departments[0]}` })
            })
            dispatch(successProfSearch(parsedResults));
            setTimeout(() => dispatch(breakProfSearch()), 100);
        } catch (error) {
            dispatch(errorProfSearch(error));
        }
    }
}