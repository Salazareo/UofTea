import React from 'react';
import { useClearCache } from 'react-clear-cache';
import { Button, Image } from 'semantic-ui-react';

export const NewVersionMessage = () => {
    const { isLatestVersion, emptyCacheStorage } = useClearCache({ duration: 1000 * 60 * 30 });

    return !isLatestVersion ? <div
        style={{ position: 'fixed', marginLeft: '-125px', top: '80px', textAlign: 'center', minWidth: '250px', left: '50%', zIndex: 2 }} >
        <Button color='green' className='boxshadow' as='a' href='#'
            onClick={e => {
                e.preventDefault();
                emptyCacheStorage();
            }} float compact >
            <Image
                alt='UofTea'
                style={{ width: '1.75em', display: 'inline' }} src='/logo192.png' />  New version available
            </Button>
    </div> : null;
}
