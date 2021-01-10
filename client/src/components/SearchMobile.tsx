import React, { useState } from 'react';
import { isMobile, isTablet } from 'react-device-detect';
import { useSelector } from 'react-redux';
import { Icon } from 'semantic-ui-react';
import { RootState } from '../redux/reducers';
import { SearchBar } from './SearchBar';

export const SearchMobile = () => {

    const { darkmode } = useSelector((state: RootState) => state.darkmodeReducer);
    const [{ isOpen }, toggleSearch] = useState({
        isOpen: !(isMobile && !isTablet)
    });

    const handleToggle = () => {
        toggleSearch(() => ({ isOpen: !isOpen }))
    }
    return <>
        {(isMobile || isTablet) && <Icon name={!isOpen ? 'search' : 'close'} onClick={handleToggle} />}
        {isOpen && <SearchBar
            maxCap={(isMobile || isTablet) ? 5 : 10}
            fluid
            className={`nav-search center ${darkmode ? 'main-search-dark' : ''} `}
            input={{ fluid: true }}
            compact={true}
            placeholder='Search courses or professors' />
        }

    </>
}