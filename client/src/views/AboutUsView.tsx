import React from 'react';
import { useSelector } from 'react-redux';
import { Container, Grid, Header, Icon, Image, SemanticICONS } from 'semantic-ui-react';
import { HeaderBlock } from '../components/HeaderBlock';
import { RootState } from '../redux/reducers';

interface TeamMemberInfo {
    name: string;
    picList: string[];
    linkedIn: string;
    otherLink?: { url: string, label: string, iconName?: SemanticICONS },
}

export const AboutUsView = () => {
    const { darkmode } = useSelector((state: RootState) => state.darkmodeReducer);
    const shuffle = <T extends unknown>(array: T[]) => {
        return array.sort(() => Math.random() - 0.5);
    }

    const teamMembers: TeamMemberInfo[] = [{
        name: 'Daniel Salazar',
        picList: ['daniel1.png', 'daniel2.png', 'daniel3.png'],
        linkedIn: 'https://www.linkedin.com/in/salazareo/',
        otherLink: { url: 'https://www.instagram.com/salazareo/', label: 'Instagram', iconName: 'instagram' }
    },
    {
        name: 'Lukasz Dworakowski',
        picList: ['lukasz1.png', 'lukasz2.png', 'lukasz3.png'],
        linkedIn: 'https://www.linkedin.com/in/lukaszdworako/',
        otherLink: { url: 'http://lukasz.dworakowski.xyz', label: 'Personal Website', iconName: 'user' }
    },
    {
        name: 'Lance Santiago',
        picList: ['lance1.png', 'lance2.png', 'lance3.png'],
        linkedIn: 'https://www.linkedin.com/in/joseph-lance-santiago-385a52153/'
    },
    {
        name: 'Jonathan Ho',
        picList: ['jonathan1.png', 'jonathan2.png', 'jonathan3.png'],
        linkedIn: 'https://www.linkedin.com/in/jonathan-ck-ho/',
        otherLink: { url: 'http://jonathan.creatic.xyz', label: 'Personal Website', iconName: 'user' }
    },
    {
        name: 'Jessica Ly',
        picList: ['jess1.png', 'jess2.png', 'jess3.png'],
        linkedIn: 'https://www.linkedin.com/in/jessly/'
    },
    ]


    return <Container className='boxshadow' textAlign='left'>
        <HeaderBlock title='About Us' darkmode={darkmode} />
        <Header inverted={darkmode} as='h1'>About UofTea</Header>
        <p>
            One problem UofT students face was a lack of access to realistic and meaningful course or professor feedback, often taking courses blindly, or
            hoping to get first hand info about a course by trying their luck asking on social media.
            On top of that even finding information about courses can be a tiresome task, having to rely on clunky timetables, or unindexed calenders
            sharded across campuses.
            <br /><br />
            <Image
                alt=''
                src='/logo192.png' style={{ width: '1em', backgroundColor: 'white', borderRadius: '15px' }} inline /> UofTea
              aims to fix these problems wtih an easy to use web app to provide students with realiable course and professor information,
              alongside first hand reviews and comprehensive ratings from current and past students.
            <br /><br />
            <b>UofTea's core values:</b>
            <ul>
                <li>
                    <strong>Hot.</strong> We keep our information current and up to date.
                </li>
                <li>
                    <strong>Aromatic.</strong> We make our app pleasant and easy to use.
                </li>
                <li>
                    <strong>Tea.</strong> We encourage the whole story, no bs.
                </li>
            </ul>
            <Header inverted={darkmode} as='h3'>"Come spill the tea at UofTea"</Header>
            A big thanks to:<br />
            <ul>
                <li>
                    <a target='_blank'
                        rel='noopener noreferrer'
                        href='https://docs.nikel.ml/'><strong>Nikel API</strong></a> for stepping up to provide a nice programmatic
            way to fetch UofT course and prof. data (please make an official api for this UofT 😒)<br />
                </li>
                <li>
                    <a target='_blank'
                        rel='noopener noreferrer'
                        href='https://uwflow.com/'><strong>UWFlow</strong></a> for inspiring us to create an app akin to theirs,
             but for the best university in Canada 😎 Jokes aside, imitation is the greatest form of flattery, much respect.
             </li>
            </ul>
        </p>
        <Header inverted={darkmode} as='h1'>The Team</Header>
        <p>
            <Grid stackable columns={5}>
                {shuffle(teamMembers).map((member) => <Grid.Column textAlign='center'>
                    <div style={{
                        border: darkmode ? '2px solid gray' : undefined,
                        padding: '10px', borderRadius: '10px', boxShadow: ' 0.5px 2px 2px 1px rgba(0, 0, 0, 0.2)'
                    }}>
                        <Header inverted={darkmode} as='h4'>{member.name}</Header>
                        <Image
                            alt={member.name}
                            style={{ maxWidth: '300px', width: '100%' }} centered src={`/teamPics/${shuffle(member.picList)[0]}`}></Image>
                        <br />
                        <a target='_blank'
                            rel='noopener noreferrer'
                            href={member.linkedIn}><b>Linked<Icon name='linkedin' /></b></a>
                        {member.otherLink ? <>
                            <br /><a target='_blank'
                                rel='noopener noreferrer'
                                href={member.otherLink.url}>
                                <b>{member.otherLink.label}{member.otherLink.iconName ? <Icon name={member.otherLink.iconName as any} /> : ''}</b></a>
                        </> :
                            ''}
                        <hr />
                    </div>
                </Grid.Column>)}
            </Grid>
        </p>
    </Container >
}