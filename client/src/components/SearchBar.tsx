import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useLocation } from 'react-router-dom';
import { Search } from 'semantic-ui-react';
import { RootState } from '../redux/reducers';
import { search } from '../redux/thunks/searchThunks';

export interface SearchBarProps {
    maxCap: number,
    [key: string]: any,
}

export const SearchBar = (props: SearchBarProps) => {
    const dispatch = useDispatch();
    const { searchLoading, searchResults } = useSelector((state: RootState) => state.searchReducer);
    const parsedResults = [];
    const [searchResult, changeSearch] = useState({
        location: '/'
    })
    const location = useLocation()
    if (location.pathname === searchResult.location && searchResult.location !== '/') {
        changeSearch(() => {
            return { location: '/' }
        })
    }
    if (searchResult.location !== '/') {
        return <Redirect to={searchResult.location} />
    }
    searchResults?.forEach((res) => {
        if (parsedResults.length < props.maxCap) {
            parsedResults.push({
                ...res,
                to: `/${res.type.toLowerCase()}/${res.title}`,
            });
        }
    });
    if (!location.pathname.toLowerCase().startsWith('/browse')) {
        parsedResults.push({ title: 'Browse all courses and professors', to: `/browse` })
    }
    return <Search
        {...props}
        loading={searchLoading}
        onSearchChange={(e, data) => {
            e.persist();
            if (!searchLoading) {
                dispatch(search(data.value as string))
            } else {
                setTimeout(() => dispatch(search(data.value as string)), 100);
            }
        }}
        onResultSelect={(e, data) => {
            changeSearch(() => {
                return { location: data.result.to }
            })
        }}
        results={parsedResults}
    />
}