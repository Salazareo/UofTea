import { Dispatch } from 'redux';
import { parseUrlFromProfQueryObj, ProfFilterQuery } from '../../components/ProfessorFilters';
import { errorProfTabInfo, loadingProfTabInfo, successProfTabInfo } from '../actions/browsePageInfoActions';

export const getProfTabInfo = (query: ProfFilterQuery, page = 1, limit = 15) => {
    return async (dispatch: Dispatch) => {
        dispatch(loadingProfTabInfo());
        try {
            const queryString = parseUrlFromProfQueryObj(query);
            const res = await (await fetch(`/api/professors?page=${page}&limit=${limit}&${queryString}`)).json();
            const parsedItems = res.items.map((item: any) => {
                const names = item.professor.split(' ');
                let parsedName = '';
                names.forEach((name: string) => {
                    parsedName += name.charAt(0).toUpperCase() + name.slice(1) + ' ';
                });
                return {
                    professor: parsedName,
                    campus: item.campus[0],
                    recommended: item.ratings?.recommended.total !== undefined ? item.ratings.recommended.avg * 100 : 'N/A',
                    clarity: item.ratings?.clarity.total !== undefined ? 100 * item.ratings.clarity.avg / 5 : 'N/A',
                    engaging: item.ratings?.engaging.total !== undefined ? 100 * item.ratings.engaging.avg / 5 : 'N/A',
                }
            })
            dispatch(successProfTabInfo({ ...res, items: parsedItems }));
        } catch (error) {
            dispatch(errorProfTabInfo(error));
        }
    }
}