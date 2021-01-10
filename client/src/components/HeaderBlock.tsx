import React from 'react';
import { Header, Segment } from 'semantic-ui-react';

export const HeaderBlock = (props: { title: string, subheading?: string | undefined | null, darkmode: boolean }) => {
  return <Segment placeholder inverted textAlign='left'
    className={`bottom ${props.darkmode ? 'headerSegment-dark' : 'headerSegment'}`} >
    <Header as='h1'>
      <span className='headingTitle'>{props.title}</span>
      {props.subheading ?
        [<br />, <span className='headingSubtitle'>{props.subheading}</span>]
        : ''
      }
    </Header>
  </Segment>

}