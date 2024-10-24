/* eslint-disable react/no-unescaped-entities */
'use client';
import { Box, IconButton, Typography, TypographyProps } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { styled } from '@mui/material/styles';
import { CustomContainer } from '@/ui-kit/containers';
import Link from 'next/link';
import TOC from './TOC';
import TOCItems from './TOCItems';
import TOCMobile from './TOCMobile';
import { CaretUp } from '@phosphor-icons/react';

const Pagelayout = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 370px',
  gap: '30px',
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
  },
}));

const NavigationBoxDesktop = styled(Box)(({ theme }) => ({
  padding: '24px 30px',
  background: ' #F6F9FF',
  display: 'flex',
  alignItems: 'flex-start',
  gap: '8px',
  flexDirection: 'column',
  borderRadius: '10px',
  position: 'sticky',
  top: '0',
  maxHeight: '714px',

  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

const SectionHeading = styled(Typography)(({ theme }) => ({
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '28px',
  marginTop: '32px',
  marginBottom: '16px',
  [theme.breakpoints.down('sm')]: {
    fontSize: '22px',
    lineHeight: '26px',
    marginTop: '24px',
    marginBottom: '12px',
  },
}));

const Heading = styled((props: TypographyProps<'h2'>) => (
  <Typography component="h2" {...props} />
))<TypographyProps<'h2'>>(({ theme }) => ({
  fontSize: '32px',
  fontWeight: '600',
  lineHeight: '38px',
  marginTop: '48px',
  [theme.breakpoints.down('sm')]: {
    fontSize: '28px',
    lineHeight: '32px',
    marginTop: '32px',
  },
}));

const Paragraph = styled(Typography)(({ theme }) => ({
  fontSize: '16px',
  lineHeight: '26px',
  color: '#333E5C',
  [theme.breakpoints.down('sm')]: {
    fontSize: '14px',
    lineHeight: '22px',
  },
}));

const SmallHeading = styled((props: TypographyProps<'h4'>) => (
  <Typography component="h4" {...props} />
))<TypographyProps<'h4'>>(({ theme }) => ({
  fontSize: '20px',
  lineHeight: '24px',
  fontWeight: '600',
  marginBottom: '16px',
  [theme.breakpoints.down('sm')]: {
    fontSize: '18px',
    lineHeight: '20px',
    marginBottom: '12px',
  },
}));

const CONTENT = [
  {
    intro: <Heading>Interpretation and Definitions</Heading>,
    heading: 'Interpretation',
    children: (
      <Paragraph>
        The words of which the initial letter is capitalized have meanings
        defined under the following conditions. The following definitions shall
        have the same meaning regardless of whether they appear in singular or
        in plural.
      </Paragraph>
    ),
  },
  {
    heading: 'Definitions',
    children: (
      <div className="space-y-4">
        <Paragraph>For the purposes of this Privacy Policy:</Paragraph>
        <Paragraph>
          <b>Account</b> means a unique account created for You to access our
          Service or parts of our Service.
        </Paragraph>
        <Paragraph>
          <b>Affiliate</b> means an entity that controls, is controlled by or is
          under common control with a party, where "control" means ownership of
          50% or more of the shares, equity interest or other securities
          entitled to vote for election of directors or other managing
          authority.
        </Paragraph>
        <Paragraph>
          <b>Business</b>, for the purpose of CCPA/CPRA, refers to the Company
          as the legal entity that collects Consumers' personal information and
          determines the purposes and means of the processing of Consumers'
          personal information, or on behalf of which such information is
          collected and that alone, or jointly with others, determines the
          purposes and means of the processing of consumers' personal
          information, that does business in the State of California.
        </Paragraph>
        <Paragraph>
          <b>CCPA and/or CPRA</b> refers to the California Consumer Privacy Act
          (the "CCPA") as amended by the California Privacy Rights Act of 2020
          (the "CPRA"). Company (referred to as either "the Company", "We", "Us"
          or "Our" in this Agreement) refers to Only Latest, Inc. , Vancouver,
          Canada. For the purpose of the GDPR, the Company is the Data
          Controller.
        </Paragraph>
        <Paragraph>
          <b>Consumer</b>, for the purpose of the CCPA/CPRA, means a natural
          person who is a California resident. A resident, as defined in the
          law, includes (1) every individual who is in the USA for other than a
          temporary or transitory purpose, and (2) every individual who is
          domiciled in the USA who is outside the USA for a temporary or
          transitory purpose.
        </Paragraph>
        <Paragraph>
          <b>Cookies</b> are small files that are placed on Your computer,
          mobile device or any other device by a website, containing the details
          of Your browsing history on that website among its many uses.
        </Paragraph>
        <Paragraph>
          <b>Country</b> refers to: British Columbia, Canada
        </Paragraph>
        <Paragraph>
          <b>Data Controller</b>, for the purposes of the GDPR (General Data
          Protection Regulation), refers to the Company as the legal person
          which alone or jointly with others determines the purposes and means
          of the processing of Personal Data.
        </Paragraph>
        <Paragraph>
          <b>Device</b> means any device that can access the Service such as a
          computer, a cellphone or a digital tablet.
        </Paragraph>
        <Paragraph>
          <b>Do Not Track (DNT)</b> is a concept that has been promoted by US
          regulatory authorities, in particular the U.S. Federal Trade
          Commission (FTC), for the Internet industry to develop and implement a
          mechanism for allowing internet users to control the tracking of their
          online activities across websites.
        </Paragraph>
        <Paragraph>
          <b>GDPR</b> refers to EU General Data Protection Regulation.
        </Paragraph>
        <Paragraph>
          <b>Personal Data</b> is any information that relates to an identified
          or identifiable individual. For the purposes of GDPR, Personal Data
          means any information relating to You such as a name, an
          identification number, location data, online identifier or to one or
          more factors specific to the physical, physiological, genetic, mental,
          economic, cultural or social identity. For the purposes of the
          CCPA/CPRA, Personal Data means any information that identifies,
          relates to, describes or is capable of being associated with, or could
          reasonably be linked, directly or indirectly, with You.
        </Paragraph>
        <Paragraph>
          <b>Service</b> refers to the Website.
        </Paragraph>
        <Paragraph>
          <b>Service Provider</b> means any natural or legal person who
          processes the data on behalf of the Company. It refers to third-party
          companies or individuals employed by the Company to facilitate the
          Service, to provide the Service on behalf of the Company, to perform
          services related to the Service or to assist the Company in analyzing
          how the Service is used. For the purpose of the GDPR, Service
          Providers are considered Data Processors.
        </Paragraph>
        <Paragraph>
          <b>Usage Data</b> refers to data collected automatically, either
          generated by the use of the Service or from the Service infrastructure
          itself (for example, the duration of a page visit).
        </Paragraph>
        <Paragraph>
          <b>Website</b> refers to Only Latest , accessible from{' '}
          <Link
            style={{ textDecoration: 'none', color: '#5F59FF' }}
            href="www.onlylatest.com"
          >
            www.onlylatest.com
          </Link>
        </Paragraph>
        <Paragraph>
          <b>You</b> means the individual accessing or using the Service, or the
          company, or other legal entity on behalf of which such individual is
          accessing or using the Service, as applicable. Under GDPR, You can be
          referred to as the Data Subject or as the User as you are the
          individual using the Service.
        </Paragraph>
      </div>
    ),
  },
  {
    intro: <Heading>Collecting and Using Your Personal Data</Heading>,
    heading: 'Types of Data Collected',
    children: (
      <div>
        <SmallHeading sx={{ marginTop: { xs: '12px', md: '16px' } }}>
          Personal Data
        </SmallHeading>
        <Paragraph>
          While using Our Service, We may ask You to provide Us with certain
          personally identifiable information that can be used to contact or
          identify You. Personally identifiable information may include, but is
          not limited to:
        </Paragraph>
        <ul>
          <li>
            <Paragraph>Email address</Paragraph>
          </li>
          <li>
            <Paragraph>First name and last name</Paragraph>
          </li>
          <li>
            <Paragraph>Phone number</Paragraph>
          </li>
          <li>
            <Paragraph>
              Address, State, Province, ZIP/Postal code, City
            </Paragraph>
          </li>
          <li>
            <Paragraph>
              Email addressBank account information in order to pay for products
              and/or services within the Service
            </Paragraph>
          </li>
          <li>
            <Paragraph>Usage Data</Paragraph>
          </li>
        </ul>
        <Paragraph>
          When You pay for a product and/or a service via bank transfer, We may
          ask You to provide information to facilitate this transaction and to
          verify Your identity. Such information may include, without
          limitation:
        </Paragraph>
        <ul>
          <li>
            <Paragraph>Date of birth</Paragraph>
          </li>
          <li>
            <Paragraph>Passport or National ID card</Paragraph>
          </li>
          <li>
            <Paragraph>Bank card statement</Paragraph>
          </li>
          <li>
            <Paragraph>Other information linking You to an address</Paragraph>
          </li>
        </ul>
        <SmallHeading sx={{ marginTop: { xs: '24px', md: '32px' } }}>
          Usage Data
        </SmallHeading>
        <Paragraph>
          Usage Data is collected automatically when using the Service.
        </Paragraph>
        <Paragraph mt="16px">
          Usage Data may include information such as Your Device's Internet
          Protocol address (e.g. IP address), browser type, browser version, the
          pages of our Service that You visit, the time and date of Your visit,
          the time spent on those pages, unique device identifiers and other
          diagnostic data.
        </Paragraph>
        <Paragraph mt="16px">
          When You access the Service by or through a mobile device, We may
          collect certain information automatically, including, but not limited
          to, the type of mobile device You use, Your mobile device unique ID,
          the IP address of Your mobile device, Your mobile operating system,
          the type of mobile Internet browser You use, unique device identifiers
          and other diagnostic data.
        </Paragraph>
        <Paragraph mt="16px">
          We may also collect information that Your browser sends whenever You
          visit our Service or when You access the Service by or through a
          mobile device.
        </Paragraph>
        <SmallHeading sx={{ marginTop: { xs: '24px', md: '32px' } }}>
          Tracking Technologies and Cookies
        </SmallHeading>
        <Paragraph>
          We use Cookies and similar tracking technologies to track the activity
          on Our Service and store certain information. Tracking technologies
          used are beacons, tags, and scripts to collect and track information
          and to improve and analyze Our Service. The technologies We use may
          include:
        </Paragraph>
        <ul>
          <li>
            <Paragraph>
              <b>Cookies or Browser Cookies</b>. A cookie is a small file placed
              on Your Device. You can instruct Your browser to refuse all
              Cookies or to indicate when a Cookie is being sent. However, if
              You do not accept Cookies, You may not be able to use some parts
              of our Service. Unless you have adjusted Your browser setting so
              that it will refuse Cookies, our Service may use Cookies.
            </Paragraph>
          </li>
          <li>
            <Paragraph>
              <b>Web Beacons</b>. Certain sections of our Service and our emails
              may contain small electronic files known as web beacons (also
              referred to as clear gifs, pixel tags, and single-pixel gifs) that
              permit the Company, for example, to count users who have visited
              those pages or opened an email and for other related website
              statistics (for example, recording the popularity of a certain
              section and verifying system and server integrity).
            </Paragraph>
          </li>
        </ul>
        <Paragraph>
          Cookies can be "Persistent" or "Session" Cookies. Persistent Cookies
          remain on Your personal computer or mobile device when You go offline,
          while Session Cookies are deleted as soon as You close Your web
          browser. You can learn more about cookies on TermsFeed website
          article. We use both Session and Persistent Cookies for the purposes
          set out below:
        </Paragraph>
        <ul>
          <li style={{ marginBottom: '16px' }}>
            <Paragraph>
              <b>Necessary / Essential Cookies</b>
              <br />
              <span style={{ color: '#96A2C1' }}>Type:</span> Session Cookies
              <br />
              <span style={{ color: '#96A2C1' }}>Administered by:</span> Us
              <br />
              <span style={{ color: '#96A2C1' }}>Purpose:</span> These Cookies
              are essential to provide You with services available through the
              Website and to enable You to use some of its features. They help
              to authenticate users and prevent fraudulent use of user accounts.
              Without these Cookies, the services that You have asked for cannot
              be provided, and We only use these Cookies to provide You with
              those services.
            </Paragraph>
          </li>
          <li style={{ marginBottom: '16px' }}>
            <Paragraph>
              <b>Cookies Policy / Notice Acceptance Cookies</b>
              <br />
              <span style={{ color: '#96A2C1' }}>Type:</span> Persistent Cookies
              <br />
              <span style={{ color: '#96A2C1' }}>Administered by:</span> Us
              <br />
              <span style={{ color: '#96A2C1' }}>Purpose:</span> These Cookies
              identify if users have accepted the use of cookies on the Website.
            </Paragraph>
          </li>
          <li style={{ marginBottom: '16px' }}>
            <Paragraph>
              <b>Functionality Cookies</b>
              <br />
              <span style={{ color: '#96A2C1' }}>Type:</span> Persistent Cookies
              <br />
              <span style={{ color: '#96A2C1' }}>Administered by:</span> Us
              <br />
              <span style={{ color: '#96A2C1' }}>Purpose:</span> These Cookies
              allow us to remember choices You make when You use the Website,
              such as remembering your login details or language preference. The
              purpose of these Cookies is to provide You with a more personal
              experience and to avoid You having to re-enter your preferences
              every time You use the Website.
            </Paragraph>
          </li>
          <li style={{ marginBottom: '16px' }}>
            <Paragraph>
              <b>Tracking and Performance Cookies</b>
              <br />
              <span style={{ color: '#96A2C1' }}>Type:</span> Persistent Cookies
              <br />
              <span style={{ color: '#96A2C1' }}>Administered by:</span>{' '}
              Third-Parties
              <br />
              <span style={{ color: '#96A2C1' }}>Purpose:</span> These Cookies
              are used to track information about traffic to the Website and how
              users use the Website. The information gathered via these Cookies
              may directly or indirectly identify you as an individual visitor.
              This is because the information collected is typically linked to a
              pseudonymous identifier associated with the device you use to
              access the Website. We may also use these Cookies to test new
              pages, features or new functionality of the Website to see how our
              users react to them.
            </Paragraph>
          </li>
          <li style={{ marginBottom: '16px' }}>
            <Paragraph>
              <b>Targeting and Advertising Cookies</b>
              <br />
              <span style={{ color: '#96A2C1' }}>Type:</span> Persistent Cookies
              <br />
              <span style={{ color: '#96A2C1' }}>Administered by:</span>{' '}
              Third-Parties
              <br />
              <span style={{ color: '#96A2C1' }}>Purpose:</span> These Cookies
              track your browsing habits to enable Us to show advertising which
              is more likely to be of interest to You. These Cookies use
              information about your browsing history to group You with other
              users who have similar interests. Based on that information, and
              with Our permission, third party advertisers can place Cookies to
              enable them to show adverts which We think will be relevant to
              your interests while You are on third party websites.
            </Paragraph>
          </li>
        </ul>
        <Paragraph>
          For more information about the cookies we use and your choices
          regarding cookies, please visit our Cookies Policy or the Cookies
          section of our Privacy Policy.
        </Paragraph>
      </div>
    ),
  },
  {
    heading: 'Use of Your Personal Data',
    children: (
      <div>
        <Paragraph>
          The Company may use Personal Data for the following purposes:
        </Paragraph>
        <ul>
          <li>
            <Paragraph>
              <b>To provide and maintain our Service,</b> including to monitor
              the usage of our Service.
            </Paragraph>
          </li>
          <li>
            <Paragraph>
              <b>To manage Your Account:</b> to manage Your registration as a
              user of the Service. The Personal Data You provide can give You
              access to different functionalities of the Service that are
              available to You as a registered user.
            </Paragraph>
          </li>
          <li>
            <Paragraph>
              <b>For the performance of a contract:</b> the development,
              compliance and undertaking of the purchase contract for the
              products, items or services You have purchased or of any other
              contract with Us through the Service.
            </Paragraph>
          </li>
          <li>
            <Paragraph>
              <b>To contact You:</b> To contact You by email, telephone calls,
              SMS, or other equivalent forms of electronic communication, such
              as a mobile application's push notifications regarding updates or
              informative communications related to the functionalities,
              products or contracted services, including the security updates,
              when necessary or reasonable for their implementation.
            </Paragraph>
          </li>
          <li>
            <Paragraph>
              <b>To provide You with news,</b> special offers and general
              information about other goods, services and events which we offer
              that are similar to those that you have already purchased or
              enquired about unless You have opted not to receive such
              information.
            </Paragraph>
          </li>
          <li>
            <Paragraph>
              <b>To manage Your requests:</b> To attend and manage Your requests
              to Us.
            </Paragraph>
          </li>
          <li>
            <Paragraph>
              <b>For business transfers:</b> We may use Your information to
              evaluate or conduct a merger, divestiture, restructuring,
              reorganization, dissolution, or other sale or transfer of some or
              all of Our assets, whether as a going concern or as part of
              bankruptcy, liquidation, or similar proceeding, in which Personal
              Data held by Us about our Service users is among the assets
              transferred.
            </Paragraph>
          </li>
          <li>
            <Paragraph>
              <b>For other purposes:</b> We may use Your information for other
              purposes, such as data analysis, identifying usage trends,
              determining the effectiveness of our promotional campaigns and to
              evaluate and improve our Service, products, services, marketing
              and your experience.
            </Paragraph>
          </li>
        </ul>
        <Paragraph>
          We may share Your personal information in the following situations:
        </Paragraph>
        <ul>
          <li>
            <Paragraph>
              <b>With Service Providers:</b> We may share Your personal
              information with Service Providers to monitor and analyze the use
              of our Service, to show advertisements to You to help support and
              maintain Our Service, for payment processing, to contact You.
            </Paragraph>
          </li>
          <li>
            <Paragraph>
              <b>For business transfers:</b> We may share or transfer Your
              personal information in connection with, or during negotiations
              of, any merger, sale of Company assets, financing, or acquisition
              of all or a portion of Our business to another company.
            </Paragraph>
          </li>
          <li>
            <Paragraph>
              <b>With Affiliates:</b> We may share Your information with Our
              affiliates, in which case we will require those affiliates to
              honor this Privacy Policy. Affiliates include Our parent company
              and any other subsidiaries, joint venture partners or other
              companies that We control or that are under common control with
              Us.
            </Paragraph>
          </li>
          <li>
            <Paragraph>
              <b>With business partners:</b> We may share Your information with
              Our business partners to offer You certain products, services or
              promotions.
            </Paragraph>
          </li>
          <li>
            <Paragraph>
              <b>With other users:</b> when You share personal information or
              otherwise interact in the public areas with other users, such
              information may be viewed by all users and may be publicly
              distributed outside.
            </Paragraph>
          </li>
          <li>
            <Paragraph>
              <b>With Your consent:</b> We may disclose Your personal
              information for any other purpose with Your consent.
            </Paragraph>
          </li>
        </ul>
      </div>
    ),
  },
  {
    heading: 'Retention of Your Personal Data',
    children: (
      <div>
        <Paragraph>
          The Company will retain Your Personal Data only for as long as is
          necessary for the purposes set out in this Privacy Policy. We will
          retain and use Your Personal Data to the extent necessary to comply
          with our legal obligations (for example, if we are required to retain
          your data to comply with applicable laws), resolve disputes, and
          enforce our legal agreements and policies.{' '}
        </Paragraph>
        <Paragraph mt="16px">
          The Company will also retain Usage Data for internal analysis
          purposes. Usage Data is generally retained for a shorter period of
          time, except when this data is used to strengthen the security or to
          improve the functionality of Our Service, or We are legally obligated
          to retain this data for longer time periods.
        </Paragraph>
      </div>
    ),
  },
  {
    heading: 'Transfer of Your Personal Data',
    children: (
      <div>
        <Paragraph>
          Your information, including Personal Data, is processed at the
          Company's operating offices and in any other places where the parties
          involved in the processing are located. It means that this information
          may be transferred to — and maintained on — computers located outside
          of Your state, province, country or other governmental jurisdiction
          where the data protection laws may differ than those from Your
          jurisdiction.{' '}
        </Paragraph>
        <Paragraph mt="16px">
          Your consent to this Privacy Policy followed by Your submission of
          such information represents Your agreement to that transfer.{' '}
        </Paragraph>
        <Paragraph mt="16px">
          The Company will take all steps reasonably necessary to ensure that
          Your data is treated securely and in accordance with this Privacy
          Policy and no transfer of Your Personal Data will take place to an
          organization or a country unless there are adequate controls in place
          including the security of Your data and other personal information.
        </Paragraph>
      </div>
    ),
  },
  {
    heading: 'Delete Your Personal Data',
    children: (
      <div>
        <Paragraph>
          You have the right to delete or request that We assist in deleting the
          Personal Data that We have collected about You.
        </Paragraph>
        <Paragraph mt="16px">
          Our Service may give You the ability to delete certain information
          about You from within the Service.
        </Paragraph>
        <Paragraph mt="16px">
          You may update, amend, or delete Your information at any time by
          signing in to Your Account, if you have one, and visiting the account
          settings section that allows you to manage Your personal information.
          You may also contact Us to request access to, correct, or delete any
          personal information that You have provided to Us.
        </Paragraph>
        <Paragraph mt="16px">
          Please note, however, that We may need to retain certain information
          when we have a legal obligation or lawful basis to do so.
        </Paragraph>
      </div>
    ),
  },
  {
    heading: 'Disclosure of Your Personal Data',
    children: (
      <div>
        <SmallHeading sx={{ marginBottom: '8px' }}>
          Business Transactions
        </SmallHeading>
        <Paragraph mb="16px">
          If the Company is involved in a merger, acquisition or asset sale,
          Your Personal Data may be transferred. We will provide notice before
          Your Personal Data is transferred and becomes subject to a different
          Privacy Policy.
        </Paragraph>
        <SmallHeading sx={{ marginBottom: '8px' }}>
          Law enforcement
        </SmallHeading>
        <Paragraph mb="16px">
          Under certain circumstances, the Company may be required to disclose
          Your Personal Data if required to do so by law or in response to valid
          requests by public authorities (e.g. a court or a government agency).
        </Paragraph>
        <SmallHeading sx={{ marginBottom: '8px' }}>
          Other legal requirements
        </SmallHeading>
        <Paragraph>
          The Company may disclose Your Personal Data in the good faith belief
          that such action is necessary to:
        </Paragraph>
        <ul>
          <li>
            <Paragraph>Comply with a legal obligation</Paragraph>
          </li>
          <li>
            <Paragraph>
              Protect and defend the rights or property of the Company
            </Paragraph>
          </li>
          <li>
            <Paragraph>
              Prevent or investigate possible wrongdoing in connection with the
              Service
            </Paragraph>
          </li>
          <li>
            <Paragraph>
              Protect the personal safety of Users of the Service or the public
            </Paragraph>
          </li>
          <li>
            <Paragraph>Protect against legal liability</Paragraph>
          </li>
        </ul>
      </div>
    ),
  },
  {
    heading: 'Security of Your Personal Data',
    children: (
      <Paragraph>
        The security of Your Personal Data is important to Us, but remember that
        no method of transmission over the Internet, or method of electronic
        storage is 100% secure. While We strive to use commercially acceptable
        means to protect Your Personal Data, We cannot guarantee its absolute
        security.
      </Paragraph>
    ),
  },
  {
    intro: (
      <div>
        <Heading>
          Detailed Information on the Processing of Your Personal Data
        </Heading>
        <Paragraph mt="32px">
          The Service Providers We use may have access to Your Personal Data.
          These third-party vendors collect, store, use, process and transfer
          information about Your activity on Our Service in accordance with
          their Privacy Policies.
        </Paragraph>
      </div>
    ),
    heading: 'Analytics',
    children: (
      <div>
        <Paragraph>
          We may use third-party Service providers to monitor and analyze the
          use of our Service.
        </Paragraph>
        <Paragraph mt="16px">
          <b>Google Analytics</b>
          <br />
          Google Analytics is a web analytics service offered by Google that
          tracks and reports website traffic. Google uses the data collected to
          track and monitor the use of our Service. This data is shared with
          other Google services. Google may use the collected data to
          contextualize and personalize the ads of its own advertising network.{' '}
        </Paragraph>
        <Paragraph mt="16px">
          You can opt-out of having made your activity on the Service available
          to Google Analytics by installing the Google Analytics opt-out browser
          add-on. The add-on prevents the Google Analytics JavaScript (ga.js,
          analytics.js and dc.js) from sharing information with Google Analytics
          about visits activity. For more information on the privacy practices
          of Google, please visit the Google Privacy & Terms web page:
          <Link
            style={{ textDecoration: 'none', color: '#5F59FF' }}
            href="https://policies.google.com/privacy"
          >
            https://policies.google.com/privacy
          </Link>
        </Paragraph>
      </div>
    ),
  },
  {
    heading: 'Advertising',
    children: (
      <div>
        <Paragraph>
          We may use Service Providers to show advertisements to You to help
          support and maintain Our Service.
        </Paragraph>
        <Paragraph mt="16px">
          <b>Google AdSense & DoubleClick Cookie</b>
          <br />
          Google, as a third party vendor, uses cookies to serve ads on our
          Service. Google's use of the DoubleClick cookie enables it and its
          partners to serve ads to our users based on their visit to our Service
          or other websites on the Internet.
        </Paragraph>
        <Paragraph mt="16px">
          You may opt out of the use of the DoubleClick Cookie for
          interest-based advertising by visiting the Google Ads Settings web
          page:{' '}
          <Link
            style={{ textDecoration: 'none', color: '#5F59FF' }}
            href="http://www.google.com/ads/preferences/"
          >
            http://www.google.com/ads/preferences/
          </Link>
        </Paragraph>
      </div>
    ),
  },
  {
    heading: 'Email Marketing',
    children: (
      <div>
        <Paragraph>
          We may use Your Personal Data to contact You with newsletters,
          marketing or promotional materials and other information that may be
          of interest to You. You may opt-out of receiving any, or all, of these
          communications from Us by following the unsubscribe link or
          instructions provided in any email We send or by contacting Us.
        </Paragraph>
        <Paragraph mt="16px">
          We may use Email Marketing Service Providers to manage and send emails
          to You.
        </Paragraph>
        <Paragraph mt="16px">
          <b>Mailchimp</b>
          <br />
          Mailchimp is an email marketing sending service provided by The Rocket
          Science Group LLC.
        </Paragraph>
        <Paragraph mt="16px">
          For more information on the privacy practices of Mailchimp, please
          visit their Privacy policy:{' '}
          <Link
            style={{ textDecoration: 'none', color: '#5F59FF' }}
            href="https://mailchimp.com/legal/privacy/"
          >
            https://mailchimp.com/legal/privacy/
          </Link>
        </Paragraph>
      </div>
    ),
  },
  {
    heading: 'Payments',
    children: (
      <div>
        <Paragraph>
          We may provide paid products and/or services within the Service. In
          that case, we may use third-party services for payment processing
          (e.g. payment processors).
        </Paragraph>
        <Paragraph mt="16px">
          We will not store or collect Your payment card details. That
          information is provided directly to Our third-party payment processors
          whose use of Your personal information is governed by their Privacy
          Policy. These payment processors adhere to the standards set by
          PCI-DSS as managed by the PCI Security Standards Council, which is a
          joint effort of brands like Visa, Mastercard, American Express and
          Discover. PCI-DSS requirements help ensure the secure handling of
          payment information.
        </Paragraph>
        <Paragraph mt="16px">
          <b>Apple Store In-App Payments</b>
          <br />
          Their Privacy Policy can be viewed at{' '}
          <Link
            style={{ textDecoration: 'none', color: '#5F59FF' }}
            href="https://www.apple.com/legal/privacy/en-ww/"
          >
            https://www.apple.com/legal/privacy/en-ww/
          </Link>
        </Paragraph>
        <Paragraph mt="16px">
          <b>Stripe</b>
          <br />
          Their Privacy Policy can be viewed at{' '}
          <Link
            style={{ textDecoration: 'none', color: '#5F59FF' }}
            href="mhttps://stripe.com/us/privacy"
          >
            https://stripe.com/us/privacy
          </Link>
        </Paragraph>
        <Paragraph mt="16px">
          <b>PayPal</b>
          <br />
          Their Privacy Policy can be viewed at{' '}
          <Link
            style={{ textDecoration: 'none', color: '#5F59FF' }}
            href="https://www.paypal.com/webapps/mpp/ua/privacy-full"
          >
            https://www.paypal.com/webapps/mpp/ua/privacy-full
          </Link>
        </Paragraph>
        <Paragraph mt="16px">
          When You use Our Service to pay a product and/or service via bank
          transfer, We may ask You to provide information to facilitate this
          transaction and to verify Your identity.
        </Paragraph>
      </div>
    ),
  },
  {
    intro: <Heading>GDPR Privacy</Heading>,
    heading: 'Legal Basis for Processing Personal Data under GDPR',
    children: (
      <div>
        <Paragraph>
          We may process Personal Data under the following conditions:
        </Paragraph>
        <ul>
          <li>
            <Paragraph>
              <b>Consent: </b>You have given Your consent for processing
              Personal Data for one or more specific purposes.
            </Paragraph>
          </li>
          <li>
            <Paragraph>
              <b>Performance of a contract: </b>Provision of Personal Data is
              necessary for the performance of an agreement with You and/or for
              any pre-contractual obligations thereof.
            </Paragraph>
          </li>
          <li>
            <Paragraph>
              <b>Legal obligations:</b> Processing Personal Data is necessary
              for compliance with a legal obligation to which the Company is
              subject.
            </Paragraph>
          </li>
          <li>
            <Paragraph>
              <b>Vital interests: </b>Processing Personal Data is necessary in
              order to protect Your vital interests or of another natural
              person.
            </Paragraph>
          </li>
          <li>
            <Paragraph>
              <b>Public interests: </b>Processing Personal Data is related to a
              task that is carried out in the public interest or in the exercise
              of official authority vested in the Company.
            </Paragraph>
          </li>
          <li>
            <Paragraph>
              <b>Legitimate interests: </b>Processing Personal Data is necessary
              for the purposes of the legitimate interests pursued by the
              Company.
            </Paragraph>
          </li>
        </ul>
        <Paragraph>
          In any case, the Company will gladly help to clarify the specific
          legal basis that applies to the processing, and in particular whether
          the provision of Personal Data is a statutory or contractual
          requirement, or a requirement necessary to enter into a contract.
        </Paragraph>
      </div>
    ),
  },
  {
    heading: 'Your Rights under the GDPR',
    children: (
      <div>
        <Paragraph>
          The Company undertakes to respect the confidentiality of Your Personal
          Data and to guarantee You can exercise Your rights.
        </Paragraph>
        <Paragraph mt="16px">
          You have the right under this Privacy Policy, and by law if You are
          within the EU, to:
        </Paragraph>
        <ul>
          <li>
            <Paragraph>
              <b>Request access to Your Personal Data.</b> The right to access,
              update or delete the information We have on You. Whenever made
              possible, you can access, update or request deletion of Your
              Personal Data directly within Your account settings section. If
              you are unable to perform these actions yourself, please contact
              Us to assist You. This also enables You to receive a copy of the
              Personal Data We hold about You.
            </Paragraph>
          </li>
          <li>
            <Paragraph>
              <b>
                Request correction of the Personal Data that We hold about You.
              </b>{' '}
              You have the right to have any incomplete or inaccurate
              information We hold about You corrected.
            </Paragraph>
          </li>
          <li>
            <Paragraph>
              <b>Object to processing of Your Personal Data.</b> This right
              exists where We are relying on a legitimate interest as the legal
              basis for Our processing and there is something about Your
              particular situation, which makes You want to object to our
              processing of Your Personal Data on this ground. You also have the
              right to object where We are processing Your Personal Data for
              direct marketing purposes.
            </Paragraph>
          </li>
          <li>
            <Paragraph>
              <b>Request erasure of Your Personal Data.</b> You have the right
              to ask Us to delete or remove Personal Data when there is no good
              reason for Us to continue processing it.
            </Paragraph>
          </li>
          <li>
            <Paragraph>
              <b>Request the transfer of Your Personal Data.</b> We will provide
              to You, or to a third-party You have chosen, Your Personal Data in
              a structured, commonly used, machine-readable format. Please note
              that this right only applies to automated information which You
              initially provided consent for Us to use or where We used the
              information to perform a contract with You.
            </Paragraph>
          </li>
          <li>
            <Paragraph>
              <b>Withdraw Your consent.</b> You have the right to withdraw Your
              consent on using your Personal Data. If You withdraw Your consent,
              We may not be able to provide You with access to certain specific
              functionalities of the Service.
            </Paragraph>
          </li>
        </ul>
        <Paragraph></Paragraph>
      </div>
    ),
  },
  {
    heading: 'Exercising of Your GDPR Data Protection Rights',
    children: (
      <div>
        <Paragraph>
          You may exercise Your rights of access, rectification, cancellation
          and opposition by contacting Us. Please note that we may ask You to
          verify Your identity before responding to such requests. If You make a
          request, We will try our best to respond to You as soon as possible.
        </Paragraph>
        <Paragraph mt="16px">
          You have the right to complain to a Data Protection Authority about
          Our collection and use of Your Personal Data. For more information, if
          You are in the European Economic Area (EEA), please contact Your local
          data protection authority in the EEA.
        </Paragraph>
      </div>
    ),
  },
  {
    intro: (
      <div>
        <Heading>CCPA/CPRA Privacy Notice (California Privacy Rights)</Heading>
        <Paragraph mt="32px">
          This privacy notice section for California residents supplements the
          information contained in Our Privacy Policy and it applies solely to
          all visitors, users, and others who reside in the State of California.
        </Paragraph>
      </div>
    ),
    heading: 'Categories of Personal Information Collected',
    children: (
      <div>
        <Paragraph>
          We collect information that identifies, relates to, describes,
          references, is capable of being associated with, or could reasonably
          be linked, directly or indirectly, with a particular Consumer or
          Device. The following is a list of categories of personal information
          which we may collect or may have been collected from California
          residents within the last twelve (12) months.
        </Paragraph>
        <Paragraph mt="16px" mb="16px">
          Please note that the categories and examples provided in the list
          below are those defined in the CCPA/CPRA. This does not mean that all
          examples of that category of personal information were in fact
          collected by Us, but reflects our good faith belief to the best of Our
          knowledge that some of that information from the applicable category
          may be and may have been collected. For example, certain categories of
          personal information would only be collected if You provided such
          personal information directly to Us.
        </Paragraph>
        <ul>
          <li style={{ marginBottom: '16px' }}>
            <Paragraph>
              <b>Category A: Identifiers.</b>
              <br />
              <span style={{ color: '#96A2C1' }}>Examples:</span> A real name,
              alias, postal address, unique personal identifier, online
              identifier, Internet Protocol address, email address, account
              name, driver's license number, passport number, or other similar
              identifiers.
              <br />
              <span style={{ color: '#96A2C1' }}>Collected:</span> Yes.
            </Paragraph>
          </li>
          <li style={{ marginBottom: '16px' }}>
            <Paragraph>
              <b>
                Category B: Personal information categories listed in the
                California Customer Records statute (Cal. Civ. Code §
                1798.80(e)).
              </b>
              <br />
              <span style={{ color: '#96A2C1' }}>Examples:</span> A name,
              signature, Social Security number, physical characteristics or
              description, address, telephone number, passport number, driver's
              license or state identification card number, insurance policy
              number, education, employment, employment history, bank account
              number, credit card number, debit card number, or any other
              financial information, medical information, or health insurance
              information. Some personal information included in this category
              may overlap with other categories.
              <br />
              <span style={{ color: '#96A2C1' }}>Collected:</span> Yes.
            </Paragraph>
          </li>
          <li style={{ marginBottom: '16px' }}>
            <Paragraph>
              <b>
                Category C: Protected classification characteristics under
                California or federal law.
              </b>
              <br />
              <span style={{ color: '#96A2C1' }}>Examples:</span> Age (40 years
              or older), race, color, ancestry, national origin, citizenship,
              religion or creed, marital status, medical condition, physical or
              mental disability, sex (including gender, gender identity, gender
              expression, pregnancy or childbirth and related medical
              conditions), sexual orientation, veteran or military status,
              genetic information (including familial genetic information).
              <br />
              <span style={{ color: '#96A2C1' }}>Collected:</span> No.
            </Paragraph>
          </li>
          <li style={{ marginBottom: '16px' }}>
            <Paragraph>
              <b>Category D: Commercial information.</b>
              <br />
              <span style={{ color: '#96A2C1' }}>Examples:</span> Records and
              history of products or services purchased or considered.
              <br />
              <span style={{ color: '#96A2C1' }}>Collected:</span> Yes.
            </Paragraph>
          </li>
          <li style={{ marginBottom: '16px' }}>
            <Paragraph>
              <b>Category E: Biometric information.</b>
              <br />
              <span style={{ color: '#96A2C1' }}>Examples:</span> Genetic,
              physiological, behavioral, and biological characteristics, or
              activity patterns used to extract a template or other identifier
              or identifying information, such as, fingerprints, faceprints, and
              voiceprints, iris or retina scans, keystroke, gait, or other
              physical patterns, and sleep, health, or exercise data.
              <br />
              <span style={{ color: '#96A2C1' }}>Collected:</span> No.
            </Paragraph>
          </li>
          <li style={{ marginBottom: '16px' }}>
            <Paragraph>
              <b>Category F: Internet or other similar network activity.</b>
              <br />
              <span style={{ color: '#96A2C1' }}>Examples:</span> Interaction
              with our Service or advertisement.
              <br />
              <span style={{ color: '#96A2C1' }}>Collected:</span> Yes.
            </Paragraph>
          </li>
          <li style={{ marginBottom: '16px' }}>
            <Paragraph>
              <b>Category G: Geolocation data.</b>
              <br />
              <span style={{ color: '#96A2C1' }}>Examples:</span> Approximate
              physical location.
              <br />
              <span style={{ color: '#96A2C1' }}>Collected:</span> No.
            </Paragraph>
          </li>
          <li style={{ marginBottom: '16px' }}>
            <Paragraph>
              <b>Category H: Sensory data.</b>
              <br />
              <span style={{ color: '#96A2C1' }}>Examples:</span> Audio,
              electronic, visual, thermal, olfactory, or similar information.
              <br />
              <span style={{ color: '#96A2C1' }}>Collected:</span> No.
            </Paragraph>
          </li>
          <li style={{ marginBottom: '16px' }}>
            <Paragraph>
              <b>Category I: Professional or employment-related information.</b>
              <br />
              <span style={{ color: '#96A2C1' }}>Examples:</span>Current or past
              job history or performance evaluations.
              <br />
              <span style={{ color: '#96A2C1' }}>Collected:</span> No.
            </Paragraph>
          </li>
          <li style={{ marginBottom: '16px' }}>
            <Paragraph>
              <b>
                Category J: Non-public education information (per the Family
                Educational Rights and Privacy Act (20 U.S.C. Section 1232g, 34
                C.F.R. Part 99)).
              </b>
              <br />
              <span style={{ color: '#96A2C1' }}>Examples:</span> Education
              records directly related to a student maintained by an educational
              institution or party acting on its behalf, such as grades,
              transcripts, class lists, student schedules, student
              identification codes, student financial information, or student
              disciplinary records.
              <br />
              <span style={{ color: '#96A2C1' }}>Collected:</span> No.
            </Paragraph>
          </li>
          <li style={{ marginBottom: '16px' }}>
            <Paragraph>
              <b>
                Category K: Inferences drawn from other personal information.
              </b>
              <br />
              <span style={{ color: '#96A2C1' }}>Examples:</span> Profile
              reflecting a person's preferences, characteristics, psychological
              trends, predispositions, behavior, attitudes, intelligence,
              abilities, and aptitudes.
              <br />
              <span style={{ color: '#96A2C1' }}>Collected:</span> No.
            </Paragraph>
          </li>
          <li style={{ marginBottom: '16px' }}>
            <Paragraph>
              <b>Category L: Sensitive personal information.</b>
              <br />
              <span style={{ color: '#96A2C1' }}>Examples:</span>Examples:
              Account login and password information, geolocation data.
              <br />
              <span style={{ color: '#96A2C1' }}>Collected:</span> Yes.
            </Paragraph>
          </li>
        </ul>
        <Paragraph mb="16px">
          Under CCPA/CPRA, personal information does not include:
        </Paragraph>
        <ol>
          <li>
            <Paragraph>
              Publicly available information from government records
            </Paragraph>
          </li>
          <li>
            <Paragraph>
              Deidentified or aggregated consumer information
            </Paragraph>
          </li>
          <li>
            <Paragraph>
              Information excluded from the CCPA/CPRA's scope, such as:
            </Paragraph>
          </li>
        </ol>
        <ul>
          <li>
            <Paragraph>
              Health or medical information covered by the Health Insurance
              Portability and Accountability Act of 1996 (HIPAA) and the
              California Confidentiality of Medical Information Act (CMIA) or
              clinical trial data
            </Paragraph>
          </li>
          <li>
            <Paragraph>
              Personal Information covered by certain sector-specific privacy
              laws, including the Fair Credit Reporting Act (FRCA), the
              Gramm-Leach-Bliley Act (GLBA) or California Financial Information
              Privacy Act (FIPA), and the Driver's Privacy Protection Act of
              1994
            </Paragraph>
          </li>
        </ul>
      </div>
    ),
  },
  {
    heading: 'Sources of Personal Information',
    children: (
      <div>
        <Paragraph>
          We obtain the categories of personal information listed above from the
          following categories of sources:
        </Paragraph>
        <ul>
          <li>
            <Paragraph>
              <b>Directly from You.</b> For example, from the forms You complete
              on our Service, preferences You express or provide through our
              Service, or from Your purchases on our Service.
            </Paragraph>
          </li>
          <li>
            <Paragraph>
              <b>Indirectly from You.</b> For example, from observing Your
              activity on our Service.
            </Paragraph>
          </li>
          <li>
            <Paragraph>
              <b>Automatically from You.</b> For example, through cookies We or
              our Service Providers set on Your Device as You navigate through
              our Service.
            </Paragraph>
          </li>
          <li>
            <Paragraph>
              <b>From Service Providers.</b> For example, third-party vendors to
              monitor and analyze the use of our Service, third-party vendors to
              provide advertising on our Service, third-party vendors for
              payment processing, or other third-party vendors that We use to
              provide the Service to You.
            </Paragraph>
          </li>
        </ul>
        <Paragraph></Paragraph>
      </div>
    ),
  },
  {
    heading: 'Use of Personal Information',
    children: (
      <div>
        <Paragraph>
          We may use or disclose personal information We collect for "business
          purposes" or "commercial purposes" (as defined under the CCPA/CPRA),
          which may include the following examples:
        </Paragraph>
        <ul>
          <li>
            <Paragraph>
              To operate our Service and provide You with Our Service.
            </Paragraph>
          </li>
          <li>
            <Paragraph>
              To provide You with support and to respond to Your inquiries,
              including to investigate and address Your concerns and monitor and
              improve our Service.
            </Paragraph>
          </li>
          <li>
            <Paragraph>
              To fulfill or meet the reason You provided the information. For
              example, if You share Your contact information to ask a question
              about our Service, We will use that personal information to
              respond to Your inquiry. If You provide Your personal information
              to purchase a product or service, We will use that information to
              process Your payment and facilitate delivery.
            </Paragraph>
          </li>
          <li>
            <Paragraph>
              To respond to law enforcement requests and as required by
              applicable law, court order, or governmental regulations.
            </Paragraph>
          </li>
          <li>
            <Paragraph>
              As described to You when collecting Your personal information or
              as otherwise set forth in the CCPA/CPRA.
            </Paragraph>
          </li>
          <li>
            <Paragraph>
              For internal administrative and auditing purposes.
            </Paragraph>
          </li>
          <li>
            <Paragraph>
              To detect security incidents and protect against malicious,
              deceptive, fraudulent or illegal activity, including, when
              necessary, to prosecute those responsible for such activities.
            </Paragraph>
          </li>
          <li>
            <Paragraph>Other one-time uses.</Paragraph>
          </li>
        </ul>
        <Paragraph>
          Please note that the examples provided above are illustrative and not
          intended to be exhaustive. For more details on how we use this
          information, please refer to the "Use of Your Personal Data" section.
        </Paragraph>
        <Paragraph mt="16px">
          If We decide to collect additional categories of personal information
          or use the personal information We collected for materially different,
          unrelated, or incompatible purposes, We will update this Privacy
          Policy.
        </Paragraph>
      </div>
    ),
  },
  {
    heading: 'Disclosure of Personal Information',
    children: (
      <div>
        <Paragraph>
          We may use or disclose and may have used or disclosed in the last
          twelve (12) months the following categories of personal information
          for business or commercial purposes:
        </Paragraph>
        <ul>
          <li>
            <Paragraph>
              <b>Category A:</b> Identifiers
            </Paragraph>
          </li>
          <li>
            <Paragraph>
              <b>Category B:</b> Personal information categories listed in the
              California Customer Records statute (Cal. Civ. Code § 1798.80(e))
            </Paragraph>
          </li>
          <li>
            <Paragraph>
              <b>Category D:</b> Commercial information
            </Paragraph>
          </li>
          <li>
            <Paragraph>
              <b>Category F:</b> Internet or other similar network activity
            </Paragraph>
          </li>
        </ul>
        <Paragraph>
          Please note that the categories listed above are those defined in the
          CCPA/CPRA. This does not mean that all examples of that category of
          personal information were in fact disclosed, but reflects our good
          faith belief to the best of our knowledge that some of that
          information from the applicable category may be and may have been
          disclosed.
        </Paragraph>
        <Paragraph mt="16px">
          When We disclose personal information for a business purpose or a
          commercial purpose, We enter a contract that describes the purpose and
          requires the recipient to both keep that personal information
          confidential and not use it for any purpose except performing the
          contract.
        </Paragraph>
      </div>
    ),
  },
  {
    heading: 'Share of Personal Information',
    children: (
      <div>
        <Paragraph>
          We may share, and have shared in the last twelve (12) months, Your
          personal information identified in the above categories with the
          following categories of third parties:
        </Paragraph>
        <ul>
          <li>
            <Paragraph>Service Providers</Paragraph>
          </li>
          <li>
            <Paragraph>Payment processors</Paragraph>
          </li>
          <li>
            <Paragraph>Our affiliates</Paragraph>
          </li>
          <li>
            <Paragraph>Our business partners</Paragraph>
          </li>
          <li>
            <Paragraph>
              Third party vendors to whom You or Your agents authorize Us to
              disclose Your personal information in connection with products or
              services We provide to You
            </Paragraph>
          </li>
        </ul>
      </div>
    ),
  },
  {
    heading: 'Sale of Personal Information',
    children: (
      <div>
        <Paragraph>
          As defined in the CCPA/CPRA, "sell" and "sale" mean selling, renting,
          releasing, disclosing, disseminating, making available, transferring,
          or otherwise communicating orally, in writing, or by electronic or
          other means, a Consumer's personal information by the Business to a
          third party for valuable consideration. This means that We may have
          received some kind of benefit in return for sharing personal
          information, but not necessarily a monetary benefit.
        </Paragraph>
        <Paragraph mt="16px">
          We do not sell personal information as the term sell is commonly
          understood. We do allow Service Providers to use Your personal
          information for the business purposes described in Our Privacy Policy,
          for activities such as advertising, marketing, and analytics, and
          these may be deemed a sale under CCPA/CPRA.
        </Paragraph>
        <Paragraph mt="16px">
          We may sell and may have sold in the last twelve (12) months the
          following categories of personal information:
        </Paragraph>
        <ul>
          <li>
            <Paragraph>
              <b>Category A:</b> Identifiers
            </Paragraph>
          </li>
          <li>
            <Paragraph>
              <b>Category B:</b> Personal information categories listed in the
              California Customer Records statute (Cal. Civ. Code § 1798.80(e))
            </Paragraph>
          </li>
          <li>
            <Paragraph>
              <b>Category D:</b> Commercial information
            </Paragraph>
          </li>
          <li>
            <Paragraph>
              <b>Category F:</b> Internet or other similar network activity
            </Paragraph>
          </li>
        </ul>
        <Paragraph>
          Please note that the categories listed above are those defined in the
          CCPA/CPRA. This does not mean that all examples of that category of
          personal information were in fact sold, but reflects our good faith
          belief to the best of Our knowledge that some of that information from
          the applicable category may be and may have been shared for value in
          return.
        </Paragraph>
      </div>
    ),
  },
  {
    heading: 'Sale of Personal Information of Minors Under 16 Years of Age',
    children: (
      <div>
        <Paragraph>
          We do not knowingly collect personal information from minors under the
          age of 16 through our Service, although certain third party websites
          that we link to may do so. These third-party websites have their own
          terms of use and privacy policies and We encourage parents and legal
          guardians to monitor their children's Internet usage and instruct
          their children to never provide information on other websites without
          their permission.
        </Paragraph>
        <Paragraph mt="16px">
          We do not sell the personal information of Consumers We actually know
          are less than 16 years of age, unless We receive affirmative
          authorization (the "right to opt-in") from either the Consumer who is
          between 13 and 16 years of age, or the parent or guardian of a
          Consumer less than 13 years of age. Consumers who opt-in to the sale
          of personal information may opt-out of future sales at any time. To
          exercise the right to opt-out, You (or Your authorized representative)
          may submit a request to Us by contacting Us.
        </Paragraph>
        <Paragraph mt="16px">
          If You have reason to believe that a child under the age of 13 (or 16)
          has provided Us with personal information, please contact Us with
          sufficient detail to enable Us to delete that information.
        </Paragraph>
      </div>
    ),
  },
];

const EXTRA_CONTENT = [
  {
    section: (
      <div>
        <SectionHeading>Your Rights under the CCPA/CPRA</SectionHeading>
        <Paragraph>
          The CCPA/CPRA provides California residents with specific rights
          regarding their personal information. If You are a resident of
          California, You have the following rights:
        </Paragraph>
        <Paragraph mt="16px">
          <b>The right to notice.</b> You have the right to be notified which
          categories of Personal Data are being collected and the purposes for
          which the Personal Data is being used.
        </Paragraph>
        <Paragraph mt="16px">
          <b>The right to know/access.</b> Under CCPA/CPRA, You have the right
          to request that We disclose information to You about Our collection,
          use, sale, disclosure for business purposes and share of personal
          information. Once We receive and confirm Your request, We will
          disclose to You:
        </Paragraph>
        <ul>
          <li>
            <Paragraph>
              The categories of personal information We collected about You
            </Paragraph>
          </li>
          <li>
            <Paragraph>
              The categories of sources for the personal information We
              collected about You
            </Paragraph>
          </li>
          <li>
            <Paragraph>
              Our business or commercial purposes for collecting or selling that
              personal information
            </Paragraph>
          </li>
          <li>
            <Paragraph>
              The categories of third parties with whom We share that personal
              information{' '}
            </Paragraph>
          </li>
          <li>
            <Paragraph>
              The specific pieces of personal information We collected about You
            </Paragraph>
          </li>
          <li>
            <Paragraph>
              If we sold Your personal information or disclosed Your personal
              information for a business purpose, We will disclose to You.
            </Paragraph>
          </li>
          <li>
            <Paragraph>
              The categories of personal information categories solda) The
              categories of personal information categories disclosedb) The
              right to say no to the sale or sharing of Personal Data (opt-out).
              You have the right to direct Us to not sell Your personal
              information. To submit an opt-out request, please see the "Do Not
              Sell My Personal Information" section or contact Us.
            </Paragraph>
          </li>
        </ul>
        <Paragraph>
          <b>The right to correct Personal Data.</b> You have the right to
          correct or rectify any inaccurate personal information about You that
          We collected. Once We receive and confirm Your request, We will use
          commercially reasonable efforts to correct (and direct our Service
          Providers to correct) Your personal information, unless an exception
          applies.
        </Paragraph>
        <Paragraph mt="16px">
          <b>
            The right to limit use and disclosure of sensitive Personal Data.
          </b>{' '}
          You have the right to request to limit the use or disclosure of
          certain sensitive personal information We collected about You, unless
          an exception applies. To submit, please see the "Limit the Use or
          Disclosure of My Sensitive Personal Information" section or contact
          Us.
        </Paragraph>
        <Paragraph mt="16px">
          <b>The right to delete Personal Data.</b> You have the right to
          request the deletion of Your Personal Data under certain
          circumstances, subject to certain exceptions. Once We receive and
          confirm Your request, We will delete (and direct Our Service Providers
          to delete) Your personal information from our records, unless an
          exception applies. We may deny Your deletion request if retaining the
          information is necessary for Us or Our Service Providers to:
        </Paragraph>
        <ul>
          <li>
            <Paragraph>
              Complete the transaction for which We collected the personal
              information, provide a good or service that You requested, take
              actions reasonably anticipated within the context of our ongoing
              business relationship with You, or otherwise perform our contract
              with You.
            </Paragraph>
          </li>
          <li>
            <Paragraph>
              Detect security incidents, protect against malicious, deceptive,
              fraudulent, or illegal activity, or prosecute those responsible
              for such activities.
            </Paragraph>
          </li>
          <li>
            <Paragraph>
              Debug products to identify and repair errors that impair existing
              intended functionality.
            </Paragraph>
          </li>
          <li>
            <Paragraph>
              Exercise free speech, ensure the right of another consumer to
              exercise their free speech rights, or exercise another right
              provided for by law.
            </Paragraph>
          </li>
          <li>
            <Paragraph>
              Comply with the California Electronic Communications Privacy Act
              (Cal. Penal Code § 1546 et. seq.).
            </Paragraph>
          </li>
          <li>
            <Paragraph>
              Engage in public or peer-reviewed scientific, historical, or
              statistical research in the public interest that adheres to all
              other applicable ethics and privacy laws, when the information's
              deletion may likely render impossible or seriously impair the
              research's achievement, if You previously provided informed
              consent.
            </Paragraph>
          </li>
          <li>
            <Paragraph>
              Enable solely internal uses that are reasonably aligned with
              consumer expectations based on Your relationship with Us.
            </Paragraph>
          </li>
          <li>
            <Paragraph>Comply with a legal obligation.</Paragraph>
          </li>
          <li>
            <Paragraph>
              Make other internal and lawful uses of that information that are
              compatible with the context in which You provided it.
            </Paragraph>
          </li>
        </ul>

        <Paragraph>
          <b>The right not to be discriminated against.</b> You have the right
          not to be discriminated against for exercising any of Your consumer's
          rights, including by:
        </Paragraph>
        <ul>
          <li>
            <Paragraph>Denying goods or services to You</Paragraph>
          </li>
          <li>
            <Paragraph>
              Charging different prices or rates for goods or services,
              including the use of discounts or other benefits or imposing
              penalties
            </Paragraph>
          </li>
          <li>
            <Paragraph>
              Providing a different level or quality of goods or services to You
            </Paragraph>
          </li>
          <li>
            <Paragraph>
              Suggesting that You will receive a different price or rate for
              goods or services or a different level or quality of goods or
              services
            </Paragraph>
          </li>
        </ul>
      </div>
    ),
  },
  {
    section: (
      <div>
        <SectionHeading>
          Exercising Your CCPA/CPRA Data Protection Rights
        </SectionHeading>
        <Paragraph>
          Please see the "Do Not Sell My Personal Information" section and
          "Limit the Use or Disclosure of My Sensitive Personal Information"
          section for more information on how to opt out and limit the use of
          sensitive information collected.
        </Paragraph>
        <Paragraph mt="16px">
          Additionally, in order to exercise any of Your rights under the
          CCPA/CPRA, and if You are a California resident, You can contact Us:
        </Paragraph>
        <ul>
          <li>
            <Paragraph>
              By email:{' '}
              <Link
                style={{ textDecoration: 'none', color: '#5F59FF' }}
                href="mailto:contact@onlylatest.com"
              >
                contact@onlylatest.com
              </Link>
            </Paragraph>
          </li>
        </ul>

        <Paragraph>
          Only You, or a person registered with the California Secretary of
          State that You authorize to act on Your behalf, may make a verifiable
          request related to Your personal information.
        </Paragraph>
        <Paragraph mt="16px">Your request to Us must:</Paragraph>
        <ul>
          <li>
            <Paragraph>
              Provide sufficient information that allows Us to reasonably verify
              You are the person about whom We collected personal information or
              an authorized representative
            </Paragraph>
          </li>
          <li>
            <Paragraph>
              Describe Your request with sufficient detail that allows Us to
              properly understand, evaluate, and respond to it
            </Paragraph>
          </li>
        </ul>
        <Paragraph>
          We cannot respond to Your request or provide You with the required
          information if We cannot:
        </Paragraph>
        <ul>
          <li>
            <Paragraph>
              Verify Your identity or authority to make the request
            </Paragraph>
          </li>
          <li>
            <Paragraph>
              And confirm that the personal information relates to You
            </Paragraph>
          </li>
        </ul>
        <Paragraph>
          We will disclose and deliver the required information free of charge
          within 45 days of receiving Your verifiable request. The time period
          to provide the required information may be extended once by an
          additional 45 days when reasonably necessary and with prior notice.
        </Paragraph>
        <Paragraph mt="16px">
          Any disclosures We provide will only cover the 12-month period
          preceding the verifiable request's receipt.
        </Paragraph>
        <Paragraph mt="16px">
          For data portability requests, We will select a format to provide Your
          personal information that is readily usable and should allow You to
          transmit the information from one entity to another entity without
          hindrance.
        </Paragraph>
      </div>
    ),
  },
  {
    section: (
      <div>
        <SectionHeading>Do Not Sell My Personal Information</SectionHeading>
        <Paragraph>
          As defined in the CCPA/CPRA, "sell" and "sale" mean selling, renting,
          releasing, disclosing, disseminating, making available, transferring,
          or otherwise communicating orally, in writing, or by electronic or
          other means, a Consumer's personal information by the Business to a
          third party for valuable consideration. This means that We may have
          received some kind of benefit in return for sharing personal
          information, but not necessarily a monetary benefit.
        </Paragraph>
        <Paragraph mt="16px">
          We do not sell personal information as the term sell is commonly
          understood. We do allow Service Providers to use Your personal
          information for the business purposes described in Our Privacy Policy,
          for activities such as advertising, marketing, and analytics, and
          these may be deemed a sale under CCPA/CPRA.
        </Paragraph>
        <Paragraph mt="16px">
          You have the right to opt-out of the sale of Your personal
          information. Once We receive and confirm a verifiable consumer request
          from You, we will stop selling Your personal information. To exercise
          Your right to opt-out, please contact Us.
        </Paragraph>
        <Paragraph mt="16px">
          The Service Providers we partner with (for example, our analytics or
          advertising partners) may use technology on the Service that sells
          personal information as defined by the CCPA/CPRA law. If you wish to
          opt out of the use of Your personal information for interest-based
          advertising purposes and these potential sales as defined under
          CCPA/CPRA law, you may do so by following the instructions below.
        </Paragraph>
        <Paragraph mt="16px">
          Please note that any opt out is specific to the browser You use. You
          may need to opt out on every browser that You use.
        </Paragraph>
      </div>
    ),
  },
  {
    section: (
      <div>
        <SmallHeading sx={{ marginTop: '16px' }}>Website</SmallHeading>
        <Paragraph>
          If applicable, click "Privacy Preferences", "Update Privacy
          Preferences" or "Do Not Sell My Personal Information" buttons listed
          on the Service to review Your privacy preferences and opt out of
          cookies and other technologies that We may use. Please note that You
          will need to opt out from each browser that You use to access the
          Service.
        </Paragraph>
        <Paragraph mt="16px">
          Additionally, You can opt out of receiving ads that are personalized
          as served by our Service Providers by following our instructions
          presented on the Service:
        </Paragraph>
        <ul>
          <li>
            <Paragraph>
              The NAI's opt-out platform:{' '}
              <Link
                style={{ textDecoration: 'none', color: '#5F59FF' }}
                href="http://www.networkadvertising.org/choices/"
              >
                http://www.networkadvertising.org/choices/
              </Link>
            </Paragraph>
          </li>
          <li>
            <Paragraph>
              The EDAA's opt-out platform:{' '}
              <Link
                style={{ textDecoration: 'none', color: '#5F59FF' }}
                href="http://www.youronlinechoices.com/"
              >
                http://www.youronlinechoices.com/
              </Link>
            </Paragraph>
          </li>
          <li>
            <Paragraph>
              The DAA's opt-out platform:{' '}
              <Link
                style={{ textDecoration: 'none', color: '#5F59FF' }}
                href="http://optout.aboutads.info/?c=2&lang=EN"
              >
                http://optout.aboutads.info/?c=2&lang=EN
              </Link>
            </Paragraph>
          </li>
        </ul>
        <Paragraph>
          The opt out will place a cookie on Your computer that is unique to the
          browser You use to opt out. If you change browsers or delete the
          cookies saved by Your browser, You will need to opt out again.
        </Paragraph>
      </div>
    ),
  },
  {
    section: (
      <div>
        <SmallHeading sx={{ marginTop: '16px' }}>Mobile Devices</SmallHeading>
        <Paragraph>
          Your mobile device may give You the ability to opt out of the use of
          information about the apps You use in order to serve You ads that are
          targeted to Your interests:
        </Paragraph>
        <ul>
          <li>
            <Paragraph>
              "Opt out of Interest-Based Ads" or "Opt out of Ads
              Personalization" on Android devices
            </Paragraph>
          </li>
          <li>
            <Paragraph>"Limit Ad Tracking" on iOS devices</Paragraph>
          </li>
        </ul>

        <Paragraph>
          You can also stop the collection of location information from Your
          mobile device by changing the preferences on Your mobile device.
        </Paragraph>
      </div>
    ),
  },
  {
    section: (
      <div>
        <SectionHeading>
          Limit the Use or Disclosure of My Sensitive Personal Information
        </SectionHeading>
        <Paragraph>
          If You are a California resident, You have the right to limit the use
          and disclosure of Your sensitive personal information to that use
          which is necessary to perform the services or provide the goods
          reasonably expected by an average consumer who requests such services
          or goods.
        </Paragraph>
        <Paragraph sx={{ marginTop: '16px' }}>
          We collect, use and disclose sensitive personal information in ways
          that are necessary to provide the Service. For more information on how
          We use Your personal information, please see the "Use of Your Personal
          Data" section or contact us.
        </Paragraph>
      </div>
    ),
  },
  {
    section: (
      <div>
        <Heading>
          "Do Not Track" Policy as Required by California Online Privacy
          Protection Act (CalOPPA)
        </Heading>
        <Paragraph mt="16px">
          Our Service does not respond to Do Not Track signals.
        </Paragraph>
        <Paragraph mt="16px">
          However, some third party websites do keep track of Your browsing
          activities. If You are visiting such websites, You can set Your
          preferences in Your web browser to inform websites that You do not
          want to be tracked. You can enable or disable DNT by visiting the
          preferences or settings page of Your web browser.
        </Paragraph>
      </div>
    ),
  },
  {
    section: (
      <div>
        <Heading>
          Your California Privacy Rights (California's Shine the Light law)
        </Heading>
        <Paragraph mt="16px">
          Under California Civil Code Section 1798 (California's Shine the Light
          law), California residents with an established business relationship
          with us can request information once a year about sharing their
          Personal Data with third parties for the third parties' direct
          marketing purposes.
        </Paragraph>
        <Paragraph mt="16px">
          If you'd like to request more information under the California Shine
          the Light law, and if You are a California resident, You can contact
          Us using the contact information provided below.
        </Paragraph>
      </div>
    ),
  },
  {
    section: (
      <div>
        <Heading>
          California Privacy Rights for Minor Users (California Business and
          Professions Code Section 22581)
        </Heading>
        <Paragraph mt="16px">
          California Business and Professions Code Section 22581 allows
          California residents under the age of 18 who are registered users of
          online sites, services or applications to request and obtain removal
          of content or information they have publicly posted.
        </Paragraph>
        <Paragraph mt="16px">
          To request removal of such data, and if You are a California resident,
          You can contact Us using the contact information provided below, and
          include the email address associated with Your account.
        </Paragraph>
        <Paragraph mt="16px">
          Be aware that Your request does not guarantee complete or
          comprehensive removal of content or information posted online and that
          the law may not permit or require removal in certain circumstances.
        </Paragraph>
      </div>
    ),
  },
  {
    section: (
      <div>
        <Heading>Children's Privacy</Heading>
        <Paragraph mt="16px">
          Our Service does not address anyone under the age of 13. We do not
          knowingly collect personally identifiable information from anyone
          under the age of 13. If You are a parent or guardian and You are aware
          that Your child has provided Us with Personal Data, please contact Us.
          If We become aware that We have collected Personal Data from anyone
          under the age of 13 without verification of parental consent, We take
          steps to remove that information from Our servers.
        </Paragraph>
        <Paragraph mt="16px">
          If We need to rely on consent as a legal basis for processing Your
          information and Your country requires consent from a parent, We may
          require Your parent's consent before We collect and use that
          information.
        </Paragraph>
      </div>
    ),
  },
  {
    section: (
      <div>
        <Heading>Links to Other Websites</Heading>
        <Paragraph mt="16px">
          Our Service may contain links to other websites that are not operated
          by Us. If You click on a third party link, You will be directed to
          that third party's site. We strongly advise You to review the Privacy
          Policy of every site You visit.
        </Paragraph>
        <Paragraph mt="16px">
          We have no control over and assume no responsibility for the content,
          privacy policies or practices of any third party sites or services.
        </Paragraph>
      </div>
    ),
  },
  {
    section: (
      <div>
        <Heading>Changes to this Privacy Policy</Heading>
        <Paragraph mt="16px">
          We may update Our Privacy Policy from time to time. We will notify You
          of any changes by posting the new Privacy Policy on this page.
        </Paragraph>
        <Paragraph mt="16px">
          We will let You know via email and/or a prominent notice on Our
          Service, prior to the change becoming effective and update the "Last
          updated" date at the top of this Privacy Policy.
        </Paragraph>
        <Paragraph mt="16px">
          You are advised to review this Privacy Policy periodically for any
          changes. Changes to this Privacy Policy are effective when they are
          posted on this page.
        </Paragraph>
      </div>
    ),
  },
  {
    section: (
      <div>
        <Heading>Contact Us</Heading>
        <Paragraph mt="16px">
          If you have any questions about this Privacy Policy, you can contact
          us at{' '}
          <Link
            style={{ textDecoration: 'none', color: '#5F59FF' }}
            href="mailto:contact@onlylatest.com"
          >
            contact@onlylatest.com
          </Link>
        </Paragraph>
      </div>
    ),
  },
];

const PrivacyPolicyPage = () => {
  const [isScrollUp, setIsScrollUp] = useState(false);
  const scrollPos = useRef<number | null>(
    typeof window !== 'undefined' ? window.scrollY : null,
  );

  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;

      if (scrollPos?.current && scrollPos?.current > currentScrollPos) {
        if (
          document.body.scrollTop > 20 ||
          document.documentElement.scrollTop > 20
        ) {
          setIsScrollUp(true);
        } else {
          setIsScrollUp(false);
        }
      } else {
        setIsScrollUp(false);
      }

      scrollPos.current = currentScrollPos;
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Box>
      <TOCMobile />
      {isScrollUp && (
        <IconButton
          onClick={() => {
            goToTop();
          }}
          sx={{
            position: 'fixed',
            bottom: '104px',
            right: '16px',
            height: '48px',
            width: '48px',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'primary.main',
            borderRadius: '90px',

            '&:hover': {
              backgroundColor: 'primary.dark',
            },
            display: { xs: 'flex', md: 'none' },
          }}
        >
          <CaretUp size={18} color="white" />
        </IconButton>
      )}
      <CustomContainer>
        <Pagelayout>
          <Box>
            <Typography
              fontSize={{ xs: '32px', md: '40px' }}
              fontWeight={600}
              lineHeight={{ xs: '38px', md: '48px' }}
              component="h1"
            >
              Privacy Policy
            </Typography>
            <Typography
              fontSize={{ xs: '14px', md: '16px' }}
              lineHeight={{ xs: '22px', md: '26 px' }}
              sx={{ color: '#96A2C1', marginBlock: '16px' }}
            >
              Last updated: May 24, 2023
            </Typography>
            <Paragraph>
              This Privacy Policy describes Our policies and procedures on the
              collection, use and disclosure of Your information when You use
              the Service and tells You about Your privacy rights and how the
              law protects You.{' '}
            </Paragraph>
            <Paragraph mt="16px">
              We use Your Personal data to provide and improve the Service. By
              using the Service, You agree to the collection and use of
              information in accordance with this Privacy Policy.
            </Paragraph>
            {CONTENT?.map(({ intro, heading, children }) => (
              <TOCItems key={heading} intro={intro} heading={heading}>
                {children}
              </TOCItems>
            ))}
            {EXTRA_CONTENT?.map(({ section }, index) => (
              <Box key={index}>{section}</Box>
            ))}
          </Box>
          <NavigationBoxDesktop>
            <TOC />
          </NavigationBoxDesktop>
        </Pagelayout>
      </CustomContainer>
      <Box
        sx={{
          marginTop: '96px',
          paddingBlock: '16px',
          borderTop: '1px solid #EAECF4',
        }}
      >
        <CustomContainer
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: { xs: 'center', md: 'flex-start' },
          }}
        >
          <Typography
            sx={{
              color: '#96A2C1',
              fontSize: '12px',
              lineHeight: '16px',
            }}
          >
            Copyright © {new Date().getFullYear()} Only Latest, Inc. All rights
            reserved
          </Typography>
        </CustomContainer>
      </Box>
    </Box>
  );
};

export default PrivacyPolicyPage;
