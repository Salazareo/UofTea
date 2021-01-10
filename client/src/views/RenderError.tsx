import React from 'react'
import { NavLink } from 'react-router-dom'
import { Button, Container, Header, Icon, Segment } from 'semantic-ui-react';
// This is not really playing nice with what we got, so alas, im keeping it unused for now

export class RenderError extends React.Component<{}, { error: Error | undefined }> {
    constructor(props: any) {
        super(props);
        this.state = { error: undefined };
    }

    static getDerivedStateFromError(error: Error): { error: Error | undefined } {
        // Update state so the next render will show the fallback UI.
        return { error };
    }
    componentDidCatch(error: Error, errorInfo: any) {
        return;
    }

    render(): React.ReactNode {
        if (this.state.error) {
            // You can render any custom fallback UI
            return <div>
                <div className='empty-top'></div>
                <Segment
                    className={`landing header-bg`}
                    inverted
                    textAlign='left'
                    padded='very'>
                    <Container>
                        <Header as='h1' inverted className='landing-heading'>
                            <b>Error</b> - Something went wrong 😥
                    </Header>
                        <Header style={{ display: 'inline-block' }} size='medium' inverted className='landing-subheading'>
                            A little unexpected oopsie occured...
                    </Header>
                        <p>
                            If you want, plz send a message to Daniel about this booboo (you can find contact in the <NavLink target='_blank'
                                to='/about' >About Us</NavLink> page) and he can look into it...
                        A pic of this error might help:
                    </p>
                        <br />
                        <p>
                            {this.state.error}
                        </p>
                        <br /><br />
                        <Button size='huge' positive icon as={NavLink} to='/'>
                            <Icon name='home' /> Return to Home
                    </Button>
                    </Container>
                </Segment>
            </div >;
        }
        return this.props.children;
    }
}