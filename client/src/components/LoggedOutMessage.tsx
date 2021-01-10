import React from 'react';
import { useSelector } from 'react-redux';
import { Message, Transition } from 'semantic-ui-react';
import { RootState } from '../redux/reducers';

export const LoggedOutMessage = () => {

    const { displayMessage } = useSelector((state: RootState) => state.authReducer)

    return <Transition.Group animation='fly up' duration={500}>
        {displayMessage !== undefined && <div
            style={{ position: 'fixed', marginLeft: '-125px', bottom: '70px', textAlign: 'center', minWidth: '250px', left: '50%', zIndex: 2 }} >
            <Message color={displayMessage.header.includes('Error') ? 'red' : 'green'} className='boxshadow'
                float compact >
                <Message.Header>
                    {displayMessage.header}
                </Message.Header>
                <Message.Content>
                    {displayMessage.content}
                </Message.Content>
            </Message>
        </div>}
    </Transition.Group>
}