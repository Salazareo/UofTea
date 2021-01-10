import React, { useState } from 'react';
import { Confirm, Dropdown } from 'semantic-ui-react';


export const ConfirmLogout = (props: {
    buttonLabel: string,
    header?: string,
    content: string,
    onAccept: () => void,
}) => {

    const [{ openConfirmLogout }, setOpen] = useState({
        openConfirmLogout: false,
    });

    const openAlert = () => {
        setOpen(() => { return { openConfirmLogout: true } });
    }
    const closeAlert = () => {
        setOpen(() => { return { openConfirmLogout: false } });
    }
    return <>
        <Dropdown.Item onClick={openAlert}>
            {props.buttonLabel}
        </Dropdown.Item>
        <Confirm
            centered
            open={openConfirmLogout}
            header={props.header}
            content={props.content}
            style={{ width: '300px' }}
            confirmButton='Log me out'
            cancelButton='Wait no...'
            onCancel={closeAlert}
            closeOnDimmerClick={false}
            onConfirm={() => {
                closeAlert();
                props.onAccept();
            }}
        />
    </>
}