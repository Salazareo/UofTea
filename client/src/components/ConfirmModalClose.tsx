import React, { useState } from 'react';
import { Button, Confirm } from 'semantic-ui-react';


export const ConfirmModalClose = (props: {
    buttonLabel: string,
    header?: string,
    content: string,
    onAccept: () => void,
}) => {

    const [{ open }, setOpen] = useState({
        open: false,
    });

    const openAlert = () => {
        setOpen(() => ({ open: true }));
    }
    const closeAlert = () => {
        setOpen(() => ({ open: false }));
    }
    return <>
        <Button
            negative
            onClick={openAlert}>
            {props.buttonLabel}
        </Button>
        <Confirm
            open={open}
            header={props.header}
            content={props.content}
            confirmButton='Discard Review'
            cancelButton='Wait no...'
            style={{ width: '300px' }}
            onCancel={closeAlert}
            closeOnDimmerClick={false}
            onConfirm={() => {
                closeAlert();
                props.onAccept();
            }}
        />
    </>
}