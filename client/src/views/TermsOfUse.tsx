import React from 'react';
import { useSelector } from 'react-redux';
import { Container, Header } from 'semantic-ui-react';
import { HeaderBlock } from '../components/HeaderBlock';
import { RootState } from '../redux/reducers';


export const TermsOfUse = () => {

    const { darkmode } = useSelector((state: RootState) => state.darkmodeReducer);

    return <Container className='boxshadow' textAlign='left'>
        <HeaderBlock title={'Terms of Use'} darkmode={darkmode} />

        <p><b>Last Updated: </b> November 16, 2020</p>

        <Header as='h2' inverted={darkmode}>
            1. Introduction
        </Header>

        <p>This website <b>uoftea.ca</b> is operated by UofTea. The terms <b>“we”, “us”, and “our”</b> refer to
        <u><b> UofTea</b></u>. The use of
        our website is subject to the following terms and conditions of use, as amended from time to time (the
        <b>“Terms”</b>). The
        Terms are to be read together by you with any terms, conditions or disclaimers provided in the pages of our
        website.
        Please review the Terms carefully. The Terms apply to all users of our website, including without limitation,
        users
        who are browsers, visitors and/or contributors of content. <b>If you access and use this website,
            you accept and agree to be bound by and comply with the Terms and our Privacy Policy. If you do not agree to
            the
            Terms or our Privacy Policy, you are not authorized to access our website, use any of our website’s
            services.</b></p>

        <p>1.2 The supplemental policies set out in Section 1.7 below, as well as any supplemental terms and condition or
        documents that may be posted on the Site from time to time, are expressly incorporated by reference.</p>

        <p>1.3 We may make changes to these Terms and Conditions at any time. The updated version of these Terms and
        Conditions will be indicated by an updated "Revised" date and the updated version will be effective as soon as
        it is accessible. You are responsible for reviewing these Terms and Conditions to stay informed of updates. Your
        continued use of the Site represents that you have accepted such changes.</p>

        <p>1.4 We may update or change the Site from time to time to reflect changes to our products, our users' needs
        and/or our business priorities.</p>

        <p>1.5 Our site is directed to people residing in Canada. The information provided on the Site is not
        intended for distribution to or use by any person or entity in any jurisdiction or country where such
        distribution or use would be contrary to law or regulation or which would subject us to any registration
        requirement within such jurisdiction or country.</p>

        <p>1.6 The Site is intended for users who are at least 18 years old. If you are under the age of 18, you are not
        permitted to register for the Site or use the Services without parental permission.</p>

        <p>1.7 Additional policies which also apply to your use of the Site include:</p>

        <ul>
            <li>Our Privacy Notice <pre style={{ display: 'inline' }}>uoftea.ca</pre>
        privacy, which sets out the terms on which we process any personal data we collect
            from
            you, or that you provide to us. By using the Site, you consent to such processing and you warrant that all
            data
            provided by you is accurate.</li>
            <li>Our Acceptable Use Policy in section 2 of the Terms of Use, which sets out the permitted uses and prohibited uses of the Site.
            When
            using the Site, you must comply with this Acceptable Use Policy.</li>
            <li>Our Cookie Policy <pre style={{ display: 'inline' }}>uoftea.ca</pre>/privacy, which sets out information about the cookies on the Site.</li>
        </ul>

        <Header as='h2' inverted={darkmode}>2. Acceptable use</Header>

        <p>2.1 Acceptance Uses for our Site: </p>

        <p>2.2 You may not access or use the Site for any purpose other than that for which we make the site and our
        services available. The Site may not be used in connection with any commercial endeavors except those that are
    specifically endorsed or approved by us.</p>

        <p>2.3 As a user of this Site, you agree not to:</p>


        <Header as='h2' inverted={darkmode}>3. Information you provide to us </Header>


        <p>We reserve the right to refuse service to anyone, at any time, for any reason. We reserve the right to make any
        modifications to the website, including terminating, changing, suspending or discontinuing any aspect of the
        website
        at any time, without notice. We may impose additional rules or limits on the use of our website. You agree to
        review
        the Terms regularly and your continued access or use of our website will mean that you agree to any changes.</p>

        <p>You agree that we will not be liable to you or any third party for any modification, suspension or discontinuance
        of
        our website or for any service, content, feature or product offered through our website.</p>


        <Header as='h2' inverted={darkmode}>4. Products or Services </Header>


        <p>All purchases through our website are subject to product availability. We may, in our sole discretion, limit or
        cancel the quantities offered on our website or limit the sales of our products or services to any person,
        household, geographic region or jurisdiction.</p>

        <p>Prices for our products are subject to change, without notice. Unless otherwise indicated, prices displayed on
        our
        website are quoted in Canadian dollars.</p>

        <p>We reserve the right, in our sole discretion, to refuse orders, including without limitation, orders that appear
        to
        be placed by distributors or resellers. If we believe that you have made a false or fraudulent order, we will be
        entitled to cancel the order and inform the relevant authorities.</p>

        <p>We do not guarantee the accuracy of the colour or design of the products on our website. We have made efforts to
        ensure the colour and design of our products are displayed as accurately as possible on our website.</p>


        <Header as='h2' inverted={darkmode}>5. Links to Third-Party Websites </Header>


        <p>Links from or to websites outside our website are meant for convenience only. We do not review, endorse, approve
        or
        control, and are not responsible for any sites linked from or to our website, the content of those sites, the
        third
        parties named therein, or their products and services. Linking to any other site is at your sole risk and we
        will
        not be responsible or liable for any damages in connection with linking. Links to downloadable software sites
        are
        for convenience only and we are not responsible or liable for any difficulties or consequences associated with
        downloading the software. Use of any downloaded software is governed by the terms of the license agreement, if
        any,
        which accompanies or is provided with the software.</p>


        <Header as='h2' inverted={darkmode}>6. Use Comments, Feedback, and Other Submissions </Header>


        <p>You acknowledge that you are responsible for the information, profiles, opinions, messages, comments and any
        other
        content (collectively, the “Content”) that you post, distribute or share on or through our website or services
        available in connection with our website. You further acknowledge that you have full responsibility for the
        Content,
        including but limited to, with respect to its legality, and its trademark, copyright and other intellectual
        property
        ownership.</p>

        <p>You agree that any Content submitted by you in response to a request by us for a specific submission may be
        edited,
        adapted, modified, recreated, published, or distributed by us. You further agree that we are under no obligation
        to
        maintain any Content in confidence, to pay compensation for any Content or to respond to any Content.</p>

        <p>You agree that you will not post, distribute or share any Content on our website that is protected by copyright,
        trademark, patent or any other proprietary right without the express consent of the owner of such proprietary
        right.
        You further agree that your Content will not be unlawful, abusive or obscene nor will it contain any malware or
        computer virus that could affect our website’s operations. You will be solely liable for any Content that you
        make
        and its accuracy. We have no responsibility and assume no liability for any Content posted by you or any
        third-party.</p>

        <p>We reserve the right to terminate your ability to post on our website and to remove and/or delete any Content
        that
        we deem objectionable. You consent to such removal and/or deletion and waive any claim against us for the
        removal
        and/or deletion of your Content.</p>

        <Header as='h2' inverted={darkmode}>7. Your Personal Information </Header>


        <p>Please see our Privacy Policy to learn about how we collect, use, and share your personal information.</p>

        <Header as='h2' inverted={darkmode}>8. Errors and Omissions </Header>


        <p>Please note that our website may contain typographical errors or inaccuracies and may not be complete or current.
        We
        reserve the right to correct any errors, inaccuracies or omissions and to change or update information at any
        time,
        without prior notice (including after an order has been submitted). Such errors, inaccuracies or omissions may
        relate to product description, pricing, promotion and availability and we reserve the right to cancel or refuse
        any
        order placed based on incorrect pricing or availability information, to the extent permitted by applicable law.
    </p>

        <p>We do not undertake to update, modify or clarify information on our website, except as required by law.</p>

        <Header as='h2' inverted={darkmode}>9. Disclaimer and Limitation of Liability </Header>


        <p>You assume all responsibility and risk with respect to your use of our website, which is provided “as is” without
        warranties, representations or conditions of any kind, either express or implied, with regard to information
        accessed from or via our website, including without limitation, all content and materials, and functions and
        services provided on our website, all of which are provided without warranty of any kind, including but not
        limited
        to warranties concerning the availability, accuracy, completeness or usefulness of content or information,
        uninterrupted access, and any warranties of title, non-infringement, merchantability or fitness for a particular
        purpose. We do not warrant that our website or its functioning or the content and material of the services made
        available thereby will be timely, secure, uninterrupted or error-free, that defects will be corrected, or that
        our
        websites or the servers that make our website available are free of viruses or other harmful components.</p>

        <p>The use of our website is at your sole risk and you assume full responsibility for any costs associated with your
        use of our website. We will not be liable for any damages of any kind related to the use of our website.</p>

        <p>In no event will we, or our affiliates, our or their respective content or service providers, or any of our or
        their
        respective directors, officers, agents, contractors, suppliers or employees be liable to you for any direct,
        indirect, special, incidental, consequential, exemplary or punitive damages, losses or causes of action, or lost
        revenue, lost profits, lost business or sales, or any other type of damage, whether based in contract or tort
        (including negligence), strict liability or otherwise, arising from your use of, or the inability to use, or the
        performance of, our website or the content or material or functionality through our website, even if we are
        advised
        of the possibility of such damages.</p>

        <p>Certain jurisdictions do not allow limitation of liability or the exclusion or limitation of certain damages. In
        such jurisdictions, some or all of the above disclaimers, exclusions, or limitations, may not apply to you and
        our
        liability will be limited to the maximum extent permitted by law.</p>

        <Header as='h2' inverted={darkmode}>10. Indemnification </Header>


        <p>You agree to defend and indemnify us, and hold us and our affiliates harmless,, and our and their respective
        directors, officers, agents, contractors, and employees against any losses, liabilities, claims, expenses
        (including
        legal fees) in any way arising from, related to or in connection with your use of our website, your violation of
        the
        Terms, or the posting or transmission of any materials on or through the website by you, including but not
        limited
        to, any third party claim that any information or materials provided by you infringe upon any third party
        proprietary rights.</p>

        <Header as='h2' inverted={darkmode}>11. Entire Agreement</Header>



        <p>The Terms and any documents expressly referred to in them represent the entire agreement between you and us in
        relation to the subject matter of the Terms and supersede any prior agreement, understanding or arrangement
        between
        you and us, whether oral or in writing. Both you and we acknowledge that, in entering into these Terms, neither
        you
        nor we have relied on any representation, undertaking or promise given by the other or implied from anything
        said or
        written between you and us prior to such Terms, except as expressly stated in the Terms.</p>

        <Header as='h2' inverted={darkmode}>12. Waiver</Header>

        <p>Our failure to exercise or enforce any right or provision of the Terms will not constitute a waiver of such right
        or
        provision. A waiver by us of any default will not constitute a waiver of any subsequent default. No waiver by us
        is
        effective unless it is communicated to you in writing.</p>

        <Header as='h2' inverted={darkmode}>13. Headings</Header>



        <p>Any headings and titles herein are for convenience only.</p>

        <Header as='h2' inverted={darkmode}>14. Severability</Header>
        <p>If any of the provisions of the Terms are determined by any competent authority to be invalid, unlawful or
        unenforceable, such provision will to that extent be severed from the remaining Terms, which will continue to be
        valid and enforceable to the fullest extent permitted by law.</p>

        <Header as='h2' inverted={darkmode}>15. Governing Law</Header>


        <p>Any disputes arising out of or relating to the Terms, the Privacy Policy, use of our website, or our products or
        services offered on our website will be resolved in accordance with the laws of the Province of Ontario
        without regard to its conflict of law rules. Any disputes, actions or proceedings relating to the Terms or your
        access to or use of our website must be brought before the courts of the Province of Ontario in the
        City
        of Toronto,</p>

        <p>Ontario and you irrevocably consent to the exclusive jurisdiction and venue of such courts.</p>
        <br />
    </Container>
}