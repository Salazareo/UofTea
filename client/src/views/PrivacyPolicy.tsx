import React from 'react';
import { useSelector } from 'react-redux';
import { Container, Header } from 'semantic-ui-react';
import { HeaderBlock } from '../components/HeaderBlock';
import { RootState } from '../redux/reducers';
export const PrivacyPolicy = () => {

    const { darkmode } = useSelector((state: RootState) => state.darkmodeReducer);

    return <Container className='boxshadow' textAlign='left'>
        <HeaderBlock title='Privacy Policy' darkmode={darkmode} />

        <p><b>Last Updated: </b> November 16, 2020</p>

        <p>UofTea <b>("Company", "we", "us", "our")</b> are committed to protecting your personal information and your right
        to privacy.</p>

        <p>When you visit our website
        <pre style={{ display: 'inline' }}> uoftea.ca </pre><b>(the "Website")</b>, and more generally, use any of our
        services <b>(the "Services", which includes the Website)</b>, we appreciate that you are trusting us with your
        personal information. We take your privacy very seriously. In this privacy notice, we seek to explain to you in
        the clearest way possible what information we collect, how we use it and what rights you have in relation to it.
        We hope you take some time to read through it carefully, as it is important. If there are any terms in this
        privacy notice that you do not agree with, please discontinue the use of our Services immediately.</p>

        <p>This privacy notice applies to all information collected through our Services (which, as described above,
        includes our Website), as well as, any related services, sales, marketing or events.</p>

        <p><b>Please read this privacy notice carefully as it will help you understand what we do with the information that
            we collect.</b></p>

        <Header as='h1' inverted={darkmode}>1. What Information Do We Collect?</Header>

        <Header as='h2' inverted={darkmode}>Personal information you disclose to us</Header>

        <p><b>In Short:</b> We collect personal information that you provide to us.</p>

        <p>We collect personal information that you voluntarily provide to us when you register on the Website, express an
        interest in obtaining information about us or our products and Services, when you participate in activities on
        the Website (such as by posting messages in our online forums or entering competitions, contests or giveaways)
        or otherwise when you contact us.</p>
        <p>The personal information that we collect depends on the context of your interactions with us and the Website, the
        choices you make and the products and features you use. The personal information we collect may include the
        following:</p>

        <p><b>Personal Information Provided by You.</b> We collect names; email addresses; usernames; passwords; and other
        similar information.</p>

        <p>All personal information that you provide to us must be true, complete and accurate, and you must notify us of
        any changes to such personal information.</p>

        <Header as='h2' inverted={darkmode}>Information automatically collected</Header>

        <p><b>In Short:</b> Some information such as your browser and device characteristics - is collected automatically
        when you visit our Website.</p>

        <p>We automatically collect certain information when you visit, use or navigate the Website. This information does
        not reveal your specific identity (such as your name or contact information) but may include device and usage
        information, such as your IP address, browser and device characteristics, operating system, language
        preferences, referring URLs, device name, country, location, information about how and when you use our Website
        and other technical information. This information is primarily needed to maintain the security and operation of
        our Website, and for our internal analytics and reporting purposes.</p>

        <p>Like many businesses, we also collect information through cookies and similar technologies.</p>

        <p>The information we collect includes:</p>
        <ul>
            <li><i>Log and Usage Data.</i> Log and usage data is service-related, diagnostic, usage and performance
            information our
            servers automatically collect when you access or use our Website and which we record in log files. Depending
            on how you interact with us, this log data may include your IP address, device information, browser type and
            settings and information about your activity in the Website (such as the date/time stamps associated with
            your usage, pages and files viewed, searches and other actions you take such as which features you use),
            device event information (such as system activity, error reports (sometimes called 'crash dumps') and
            hardware settings).</li><br />
            <li><i>Device Data.</i> We collect device data such as information about your computer, phone, tablet or other
            device
            you use to access the Website. Depending on the device used, this device data may include information such
            as your IP address (or proxy server), device and application identification numbers, location, browser type,
            hardware model Internet service provider and/or mobile carrier, operating system and system configuration
            information.</li><br />
            <li><i>Location Data.</i> We collect location data such as information about your device's location, which can
            be
            either precise or imprecise. How much information we collect depends on the type and settings of the device
            you use to access the Website. For example, we may use GPS and other technologies to collect geolocation
            data that tells us your current location (based on your IP address). You can opt out of allowing us to
            collect this information either by refusing access to the information or by disabling your Location setting
            on your device. Note however, if you choose to opt out, you may not be able to use certain aspects of the
            Services.</li>
        </ul>

        <Header as='h1' inverted={darkmode}>2. How Do We Use Your Information?</Header>
        <p><b>In Short:</b> We process your information for purposes based on legitimate business interests, the fulfillment
        of our contract with you, compliance with our legal obligations, and/or your consent.</p>
        <p>We use personal information collected via our Website for a variety of business purposes described below. We
        process your personal information for these purposes in reliance on our legitimate business interests, in order
        to enter into or perform a contract with you, with your consent, and/or for compliance with our legal
        obligations. We indicate the specific processing grounds we rely on next to each purpose listed below.</p>
        <p>We use the information we collect or receive:</p>
        <ul>
            <li><b>To facilitate account creation and logon process.</b></li>
            <li><b>To post testimonials.</b> We post testimonials on our Website that may contain personal information. Prior to
            posting a testimonial, we will obtain your consent to use your name and the content of the testimonial. If
            you wish to update, or delete your testimonial, please contact us and be sure to
            include your name, testimonial location, and contact information.</li>
            <li><b>Request feedback.</b> We may use your information to request feedback and to contact you about your use of our
            Website.</li>
            <li><b>To enable user-to-user communications.</b> We may use your information in order to enable user-to-user
            communications with each user's consent.</li>
            <li><b>To manage user accounts.</b> We may use your information for the purposes of managing our account and keeping
            it in working order.</li>
            <li><b>To send administrative information to you.</b> We may use your personal information to send you product,
            service and new feature information and/or information about changes to our terms, conditions, and policies.
        </li>
            <li><b>To protect our Services.</b> We may use your information as part of our efforts to keep our Website safe and
            secure (for example, for fraud monitoring and prevention).</li>
            <li><b>To enforce our terms, conditions and policies for business purposes, to comply with legal and regulatory
            requirements or in connection with our contract.</b></li>
            <li><b>To deliver and facilitate delivery of services to the user.</b> We may use your information to provide you with
            the requested service.</li>
            <li><b>To respond to user inquiries/offer support to users.</b> We may use your information to respond to your
            inquiries and solve any potential issues you might have with the use of our Services.</li>
            <li><b>For other business purposes.</b> We may use your information for other business purposes, such as data
            analysis, identifying usage trends, determining the effectiveness of our promotional campaigns and to
            evaluate and improve our Website, products, marketing and your experience. We may use and store this
            information in aggregated and anonymized form so that it is not associated with individual end users and
            does not include personal information. We will not use identifiable personal information without your
            consent.</li>
        </ul>
        <Header as='h1' inverted={darkmode}>3. Will Your Information Be Shared With Anyone?</Header>
        <p><b>In Short:</b> We only share information with your consent, to comply with laws, to provide you with services,
        to protect your rights, or to fulfill business obligations.</p>
        <p>We may process or share your data that we hold based on the following legal basis:</p>
        <ul>
            <li><b>Consent:</b> We may process your data if you have given us specific consent to use your personal information for
            a specific purpose.</li>
            <li><b>Legitimate Interests:</b> We may process your data when it is reasonably necessary to achieve our legitimate
            business interests.</li>
            <li><b>Performance of a Contract:</b> Where we have entered into a contract with you, we may process your personal
            information to fulfill the terms of our contract.</li>
            <li><b>Legal Obligations:</b> We may disclose your information where we are legally required to do so in order to
            comply with applicable law, governmental requests, a judicial proceeding, court order, or legal process,
            such as in response to a court order or a subpoena (including in response to public authorities to meet
            national security or law enforcement requirements).</li>
            <li><b>Vital Interests:</b> We may disclose your information where we believe it is necessary to investigate, prevent,
            or take action regarding potential violations of our policies, suspected fraud, situations involving
            potential threats to the safety of any person and illegal activities, or as evidence in litigation in which
            we are involved.</li>
        </ul>
        <p>More specifically, we may need to process your data or share your personal information in the following
        situations:</p>
        <ul>
            <li><b>Other Users.</b> When you share personal information (for example, by posting comments, contributions or other
            content to the Website) or otherwise interact with public areas of the Website, such personal information
            may be viewed by all users and may be publicly made available outside the Website in perpetuity. Similarly,
            other users will be able to view descriptions of your activity, communicate with you within our Website, and
            view your profile.</li>
        </ul>
        <Header as='h1' inverted={darkmode}>4. Do We Use Cookies and Other Tracking Technologies?</Header>
        <p><b>In Short:</b> We may use cookies and other tracking technologies to collect and store your information.</p>

        <p>We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store
        information. Specific information about how we use such technologies and how you can refuse certain cookies is
        set out in our Cookie Notice.</p>

        <Header as='h1' inverted={darkmode}>5. How Long Do We Keep Your Information?</Header>

        <p><b>In Short:</b> We keep your information for as long as necessary to fulfill the purposes outlined in this
        privacy notice unless otherwise required by law.</p>

        <p>We will only keep your personal information for as long as it is necessary for the purposes set out in this
        privacy notice, unless a longer retention period is required or permitted by law (such as tax, accounting or
        other legal requirements). No purpose in this notice will require us keeping your personal information for
        longer than the period of time in which users have an account with us.</p>

        <p>When we have no ongoing legitimate business need to process your personal information, we will either delete or
        anonymize such information, or, if this is not possible (for example, because your personal information has been
        stored in backup archives), then we will securely store your personal information and isolate it from any
        further processing until deletion is possible.</p>

        <Header as='h1' inverted={darkmode}>6. How Do We Keep Your Information Safe?</Header>
        <p><b>In Short: </b> We aim to protect your personal information through a system of organizational and technical
        security measures.</p>

        <p>We have implemented appropriate technical and organizational security measures designed to protect the security
        of any personal information we process. However, despite our safeguards and efforts to secure your information,
        no electronic transmission over the Internet or information storage technology can be guaranteed to be 100%
        secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will
        not be able to defeat our security, and improperly collect, access, steal, or modify your information. Although
        we will do our best to protect your personal information, transmission of personal information to and from our
        Website is at your own risk. You should only access the Website within a secure environment.</p>

        <Header as='h1' inverted={darkmode}>7. What Are Your Privacy Rights?</Header>
        <p><b>In Short: </b> You may review, change, or terminate your account at any time.</p>
        <Header as='h2' inverted={darkmode}>Account Information</Header>
        <p>If you would at any time like to review or change the information in your account or terminate your account, you
        can:</p>
        <ul>
            <li>Log in to your account settings and update your user account.</li>
            <li>Contact us using the contact information provided.</li>
        </ul>

        <p>Upon your request to terminate your account, we will deactivate or delete your account and information from our
        active databases. However, we may retain some information in our files to prevent fraud, troubleshoot problems,
        assist with any investigations, enforce our Terms of Use and/or comply with applicable legal requirements.</p>

        <p><b>Cookies and similar technologies:</b> Most Web browsers are set to accept cookies by default. If you prefer, you can
        usually choose to set your browser to remove cookies and to reject cookies. If you choose to remove cookies or
        reject cookies, this could affect certain features or services of our Website. To opt-out of interest-based
        advertising by advertisers on our Website visit http://www.aboutads.info/choices/.</p>

        <p>We may still communicate with you, for example to send you
        service-related emails that are necessary for the administration and use of your account, to respond to service
        requests, or for other non-marketing purposes. To otherwise opt-out, you may:</p>
        <ul>
            <li>Access your account settings and update your preferences.</li>
        </ul>
        <Header as='h1' inverted={darkmode}>8. Do We Make Updates To This Notice?</Header>
        <p><b>In Short: </b> Yes, we will update this notice as necessary to stay compliant with relevant laws.</p>

        <p>We may update this privacy notice from time to time. The updated version will be indicated by an updated
        "Revised" date and the updated version will be effective as soon as it is accessible. If we make material
        changes to this privacy notice, we may notify you either by prominently posting a notice of such changes or by
        directly sending you a notification. We encourage you to review this privacy notice frequently to be informed of
        how we are protecting your information.</p>
    </Container>
}