import React from 'react';
import { isMobile } from 'react-device-detect';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { Dropdown, Icon, Image, Menu } from 'semantic-ui-react';
import { RootState } from '../redux/reducers';
import { darkmodeToggle } from '../redux/thunks/darkmodeThunk';
import { logout } from '../redux/thunks/userThunks';
import { ConfirmLogout } from './ConfirmLogout';
import { SearchMobile } from './SearchMobile';

export const Navbar = () => {

    const { jwt, username } = useSelector((state: RootState) => state.authReducer);
    const { darkmode } = useSelector((state: RootState) => state.darkmodeReducer);
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
    }
    const handleDarkmode = () => {
        dispatch(darkmodeToggle(!darkmode));
    }

    const invertedPaths = ['/', '/login', '/register', '/404', '/forgot'];

    const location = useLocation()
    const pathName = location.pathname;
    const funkyPath = invertedPaths.includes(pathName) || pathName.includes('/verify/') || pathName.includes('/reset/');
    return <div className='Header' >
        <Menu
            inverted={funkyPath || darkmode}
            size='large'
            borderless
            className={`no-rounded-border navHeight ${funkyPath && (darkmode ? 'uoftea_navbar-dark' : 'uoftea_navbar')} `}
            style={{ width: '100vw' }}
            fixed='top'>
            <Menu.Item
                header={true}
                as={NavLink}
                to='/'
                exact
                className='nav-header'
            >
                <Image
                    alt='UofTea'
                    style={{
                        borderWidth: '3px', marginRight: !isMobile ? '3px' : undefined, borderStyle: 'solid', borderColor: 'black',
                        backgroundColor: 'white',
                        padding: '2px', borderRadius: '15%', width: '1.5em'
                    }} src='/logo192.png' verticalAlign='top' />
                {!isMobile && <strong> UofTea</strong>}

            </Menu.Item>

            {!funkyPath && <Menu.Item>
                <SearchMobile />

            </Menu.Item>}

            <Menu.Menu position='right' >
                {pathName !== '/login' && pathName !== '/register' && pathName !== '/forgot' && <Menu.Item
                    name='Browse'
                    as={NavLink}
                    style={{
                        fontSize: isMobile ? '1em' : '1.15em'
                    }}
                    to='/browse'
                />}

                {!jwt && pathName !== '/login' && pathName !== '/register' && pathName !== '/forgot' && <Menu.Item
                    name='Log in'
                    as={NavLink}
                    style={{
                        fontSize: isMobile ? '1em' : '1.15em'
                    }}
                    to={{ pathname: '/login', state: { backTo: pathName + location.search } }}
                />}

                {!jwt && pathName !== '/register' && pathName !== '/login' && pathName !== '/forgot' && <Menu.Item
                    name='Register'
                    as={NavLink}
                    style={{
                        fontSize: isMobile ? '1em' : '1.15em'
                    }}
                    to={{ pathname: '/register', state: { backTo: pathName + location.search } }}
                />}
                {jwt && <Dropdown
                    item
                    inverted
                    text={username.replace(/[,/#!$%^&*;:{}=`~()'"<>]/g, '')}
                    style={{ fontSize: isMobile ? '1em' : '1.15em' }}
                >

                    <Dropdown.Menu >
                        <Dropdown.Item onClick={handleDarkmode}>
                            <Icon name={darkmode ? 'toggle on' : 'toggle off'} />Dark Mode 🌙
                            </Dropdown.Item>
                        <Dropdown.Divider />
                        <ConfirmLogout
                            content='Are you sure you wanna logout?'
                            onAccept={handleLogout}
                            buttonLabel='Logout' />
                    </Dropdown.Menu>
                </Dropdown>
                }
            </Menu.Menu>
        </Menu >
    </div>
}