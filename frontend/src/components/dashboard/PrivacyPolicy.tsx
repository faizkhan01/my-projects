'use client';
import { useState } from 'react';
import { CustomContainer } from '@/ui-kit/containers';
import { styled } from '@mui/material/styles';
import { Box, Stack } from '@mui/system';
import { Typography } from '@mui/material';
import { CaretRight, ArrowLeft } from '@phosphor-icons/react';

const Header2 = styled('h2')(() => ({
  fontStyle: 'normal',
  fontWeight: 600,
  fontSize: '24px',
  lineHeight: '26.4px',
  margin: '0 0 24px 0',
}));

const Navigation = styled('details')(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  marginTop: '-20px',
  cursor: 'pointer',

  width: '100%',
  position: 'sticky',
  top: 0,
  left: 0,
  zIndex: 1,

  [theme.breakpoints.up('sm')]: {
    display: 'none',
  },
}));

const Summary = styled('summary')(({ theme }) => ({
  ...theme.mixins.toolbar,
  padding: '0 1rem',
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '8px',
  listStyle: 'none',
}));

const headerStyle = {
  fontWeight: 600,
  fontSize: {
    xs: '28px',
    md: '54px',
  },
  color: '#333E5C',
  textAlign: {
    md: 'center',
  },
};

const PrivacyPolicy = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Navigation onClick={() => setOpen((open) => !open)}>
        <Summary>
          {open ? (
            <Box
              sx={{
                display: 'flex',
                gap: '8px',
              }}
            >
              <ArrowLeft size={14} />
              Back
            </Box>
          ) : (
            <>
              Privacy Policy
              <CaretRight size={14} weight="bold" />
            </>
          )}
        </Summary>
      </Navigation>
      <CustomContainer
        sx={{
          marginTop: {
            xs: '24px',
            md: '0',
          },
        }}
      >
        <Stack
          sx={{
            marginTop: {
              md: '75px',
            },
            marginBottom: '125px',
            '& p, li': {
              fontWeight: 400,
              fontSize: '18px',
              lineHeight: '28.8px',
              margin: 0,
            },
            '& li': {
              padding: '0 0 0 1rem',
            },
            '& li::marker': {
              color: '#96A2C1',
            },
            '& li > p': {
              display: 'inline',
            },
            '& ol, ul': {
              padding: '0 0 0 1rem',
            },
          }}
          spacing={{
            xs: '40px',
            md: '48px',
          }}
        >
          <Stack
            spacing={{
              xs: '24px',
              md: '48px',
            }}
          >
            <Typography sx={headerStyle} component="h1">
              Privacy Policy
            </Typography>
            <Stack
              spacing={{
                xs: '16px',
                md: '24px',
              }}
            >
              <Typography>
                This Privacy Policy applies to information collected by through
                the Site. This Privacy Policy does not apply to the practices of
                any third party websites, applications or services that does not
                own or maintain (collectively, «Third Party Services») or to any
                third parties that use the Application Programming Interface
                (API) to perform any function related to the («Integrated
                Platforms»). In particular, this Privacy Policy does not cover
                any information or other content you can view via the on
                Integrated Platforms or information you provide to Third Party
                Services accessed. As further detailed below, we cannot take
                responsibility for the content or privacy policies of any Third
                Party Services. If you are a Viewer we encourage you to
                carefully review the privacy policies of the User whose Content
                you view and the privacy policies of any Integrated Platforms or
                Third Party Services used by such User which you may access via
                the Properties.
              </Typography>
              <Typography>
                This Privacy Policy also does not cover any information,
                recorded in any form, about more than one individual where the
                identity of the individuals is not known, cannot be inferred
                from the information,and is not linked or reasonably linkable to
                an individual, including via a device («Aggregated
                Information»). retains the right to use Aggregated Information
                in any way that it reasonably determines is appropriate.
              </Typography>

              <Typography>
                By using the Services or otherwise providing us with your
                Personal Information (as defined below), you are accepting the
                practices described in this Privacy Policy, as they may be
                amended by us from time to time, and agreeing to our collection
                and use of your information in accordance with this Privacy
                Policy. If you do not agree to the collection, use and
                disclosure of your information in this way, please do not use
                any or otherwise provide with Personal Information.
              </Typography>
            </Stack>
          </Stack>
          <Box>
            <Header2>What information Only Latest collects from you</Header2>
            <Typography>
              Only Latest collects only the information required to provide
              products and services to you. The amount of information provided
              by you and collected by Only Latest depends on the circumstances.
              Only Latest may collect two (2) types of information about you:
              Personal and Non-Personal.
            </Typography>
            <Stack
              component="ol"
              spacing={{
                xs: '16px',
                md: '24px',
              }}
              mt={{
                xs: '16px',
                md: '24px',
              }}
            >
              <Box component="li">
                <Typography>
                  «Personal Information.» Personal Information means any
                  information that identifies, relates to, describes, is
                  reasonably capable of being associated with, or could
                  reasonably be linked, directly or indirectly, with a
                  particular individual or household, or is otherwise defined as
                  personal information under applicable law. Only Latest may
                  collect Personal Information when you use the Only Latest
                  Properties including, without limitation, setting up account
                  information, filling out surveys, corresponding with Digit
                  Carts, or otherwise volunteering information about yourself.
                </Typography>
              </Box>
              <Box component="li">
                <Typography>
                  Non-Personal Information. Non-Personal Information refers to
                  information that does not meet the definition of Personal
                  Information above. Only Latest may collect Non-Personal
                  Information through any of the methods discussed above as well
                  as automatically through use of industry standard technologies
                  described further below.
                </Typography>
              </Box>
            </Stack>
          </Box>
          <Box>
            <Header2>How Only Latest collects your information</Header2>
            <Box>
              <Stack component="ol" spacing="24px">
                <Box component="li">
                  <Typography>
                    Registration. Prior to using one or more of the Only Latest
                    Properties, Only Latest may require you to provide us with
                    certain Personal Information and Non-Personal Information to
                    create an account (&quot;Account&quot;) or to enable
                    features or functionality of the Only Latest Properties.
                  </Typography>
                </Box>
                <Box component="li">
                  <Typography>
                    Users. Only Latest may gather Personal Information about
                    organizational representatives via various methods (phone,
                    email, online forms, in-person meetings) but only if such
                    Personal Information is submitted voluntarily. Only Latest
                    may use such Personal Information for sales, marketing, and
                    support of the Only Latest Properties. This Personal
                    Information is never shared with third parties other than
                    Third Party Service Providers utilized by a User in
                    connection with Only Latest Services.
                  </Typography>
                </Box>
                <Box component="li">
                  <Typography>
                    User communications. When you send email or other
                    communications to us, we may retain those communications in
                    order to process your inquiries, respond to your requests
                    and improve the Only Latest Properties.
                  </Typography>
                </Box>
                <Box component="li">
                  <Typography>
                    Information Collected Through Technology. Only Latest
                    automatically collects and receives certain information from
                    your computer or mobile device, including the activities you
                    perform on the Only Latest Site, the Only Latest Software
                    and the Only Latest Services, the type of hardware and
                    software you are using (for example, your operating system
                    or browser), and information obtained from cookies (see
                    below). If you have an Account, we may link this
                    Non-Personal Information to your Account to better
                    understand your needs and the needs of Users in the
                    aggregate, diagnose problems, analyze trends, provide
                    services, improve the features and usability of the Digit
                    Carts Properties, and better understand and market to our
                    customers and Users.
                  </Typography>
                </Box>
                <Box component="li">
                  <Typography
                    sx={{
                      marginBottom: '26px',
                      display: 'block !important',
                    }}
                  >
                    We use technology to automatically gather information by the
                    following methods:
                  </Typography>
                  <Stack component="ul" spacing="16px">
                    <Box component="li">
                      <Typography>
                        Cookies. Only Latest uses cookies on the Only Latest
                        Site and other aspects of the Only Latest Properties.
                        Cookies, including local shared objects, are small
                        pieces of information that are stored by your browser on
                        your computer&apos;s hard drive which work by assigning
                        to your computer a unique number that has no meaning
                        outside of the Only Latest Properties. Most web browsers
                        automatically accept cookies, but you can usually
                        configure your browser to prevent this. Not accepting
                        cookies may make certain features of the Bloom
                        Properties unavailable to you.
                      </Typography>
                    </Box>
                    <Box component="li">
                      <Typography>
                        IP Address. You may visit many areas of the Only Latest
                        Site anonymously without the need to become a registered
                        User. Even in such cases, Only Latest may collect IP
                        addresses automatically. An IP address is a number that
                        is automatically assigned to your computer whenever you
                        begin services with an Internet services provider. Each
                        time you access the Only Latest Site and each time you
                        request one of the pages of the Only Latest Site, the
                        server logs your IP address.
                      </Typography>
                    </Box>
                    <Box component="li">
                      <Typography>
                        Web Beacons. Web beacons are small pieces of data that
                        are embedded in web pages and emails. Only Latest may
                        use these technical methods in HTML emails that Digit
                        Carts sends to Users to determine whether they have
                        opened those emails and/or clicked on links in those
                        emails. The information from use of these technical
                        methods may be collected in a form that is Personal
                        Information.
                      </Typography>
                    </Box>
                    <Box component="li">
                      <Typography>
                        Tracking Content Usage. If you use the Only Latest
                        Services and you post audio visual materials including,
                        without limitation, videos, links, logos, artwork,
                        graphics, pictures, advertisements, sound and other
                        related intellectual property contained in such
                        materials (collectively, &quot;Content&quot;) to your
                        website or to a third party website, Only Latest tracks
                        and captures information associated with User accounts
                        and the use of Content by those that access your
                        Content.
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Stack>
            </Box>
          </Box>
          <Box>
            <Header2>How Only Latest uses your information</Header2>
            <Stack component="ol" spacing="24px">
              <Box component="li">
                <Typography>
                  Registration. Prior to using one or more of the Only Latest
                  Properties, Only Latest may require you to provide us with
                  certain Personal Information and Non-Personal Information to
                  create an account (&quot;Account&quot;) or to enable features
                  or functionality of the Only Latest Properties.
                </Typography>
              </Box>

              <Box component="li">
                <Typography
                  sx={{
                    marginBottom: '24px',
                    display: 'block !important',
                  }}
                >
                  By using the Only Latest Properties, you will be deemed to
                  consent to our use of your Personal Information for the
                  purposes of:
                </Typography>
                <Stack component="ul" spacing="1rem">
                  <Box component="li">
                    <Typography>communicating with you generally;</Typography>
                  </Box>
                  <Box component="li">
                    <Typography>processing your purchases;</Typography>
                  </Box>
                  <Box component="li">
                    <Typography>
                      processing and keeping track of transactions and reporting
                      back to you;
                    </Typography>
                  </Box>
                  <Box component="li">
                    <Typography>protecting against fraud or error;</Typography>
                  </Box>
                  <Box component="li">
                    <Typography>
                      providing information or services requested by you;
                    </Typography>
                  </Box>
                  <Box component="li">
                    <Typography>
                      administering and managing the Only Latest Properties and
                      our business operations;
                    </Typography>
                  </Box>
                  <Box component="li">
                    <Typography>
                      personalizing your experience with the Only Latest Site,
                      as well as evaluating statistics on Only Latest Site
                      activity;
                    </Typography>
                  </Box>
                  <Box component="li">
                    <Typography>
                      administering and managing the Only Latest Properties and
                      our business operations;
                    </Typography>
                  </Box>
                  <Box component="li">
                    <Typography>
                      performing statistical analyses of your behavior and
                      characteristics, in order to measure interest in and use
                      of the various sections of the Only Latest Site;
                    </Typography>
                  </Box>
                  <Box component="li">
                    <Typography>
                      communicating with you on other websites;
                    </Typography>
                  </Box>
                  <Box component="li">
                    <Typography>email gating;</Typography>
                  </Box>
                  <Box component="li">
                    <Typography>
                      delivery of content and information to Third Party
                      Services Providers;
                    </Typography>
                  </Box>
                  <Box component="li">
                    <Typography>
                      complying with legal and governmental requirements; and/or
                    </Typography>
                  </Box>
                  <Box component="li">
                    <Typography>
                      fulfilling any other purpose that would be reasonably
                      apparent to the average person at the time that we collect
                      it.
                    </Typography>
                  </Box>
                </Stack>
              </Box>
              <Box component="li">
                <Typography>
                  Users utilize Only Latest Properties to manage and deliver
                  Content to Viewers. As part of this process, Only Latest may
                  collect Personal Information from you. Otherwise, we will
                  obtain your express consent (by verbal, written or electronic
                  agreement) to collect, use or disclose your Personal
                  Information. You can change your consent preferences at any
                  time by contacting us at Only Latest@example.com.
                </Typography>
              </Box>
              <Box component="li">
                <Typography>
                  Only Latest extends the rights granted to &quot;data
                  subject&quot;s under the General Data Protection Regulation
                  (Regulation (EU) 2016/679) (the &quot;GDPR&quot;) to all of
                  its Users. Consequently, you have the right to withdraw your
                  consent to our processing of your Personal Information at any
                  time (if our processing is based on consent) and the right to
                  object to our processing of your Personal Information (if
                  processing is based on legitimate interests).
                </Typography>
              </Box>
              <Box component="li">
                <Typography
                  sx={{
                    display: 'block !important',
                    marginBottom: '24px',
                  }}
                >
                  Non-Personal Information. Only Latest may use Non-Personal
                  Information for the following purposes:
                </Typography>
                <Stack component="ul" spacing="16px">
                  <Box component="li">
                    <Typography>
                      System Administration: Only Latest may use Non-Personal
                      Information for the purposes of system administration,
                      assisting in diagnosing problems with Only Latest servers,
                      monitoring Only Latest&apos;s system performance and
                      traffic on the Only Latest Properties and to gather broad
                      demographic information about Only Latest Users.
                    </Typography>
                  </Box>
                  <Box component="li">
                    <Typography>
                      Personalization: Only Latest uses cookies and IP addresses
                      to track features such as delivering Content specific to
                      your interests and informing you of new, relevant services
                      or certain third party offerings.
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Stack>
          </Box>
          <Stack spacing="24px">
            <Box>
              <Header2>European Economic Area Residents</Header2>
              <Typography>
                If you are in the European Economic Area («EEA»), you have
                certain rights and protections under the law regarding the
                processing of your personal data.
              </Typography>
            </Box>

            <Box>
              <Header2>Legal Basis for Processing</Header2>
              <Typography>
                If you are in the EEA, when we process your personal data we
                will only do so in the following situations:
              </Typography>

              <Box component="ul">
                <Box component="li">
                  We need to use information about you to perform our
                  responsibilities under our contract with you such as to
                  process your transcriptions and provide the Services you have
                  requested;
                </Box>
                <Box component="li">
                  We have a legitimate interest in processing information about
                  you. For example, we may process information about you to send
                  you marketing communications, to communicate with you about
                  changes to our Services, and to provide, secure, and improve
                  our Sites and Services;
                </Box>
                <Box component="li">
                  We need to process information about you to comply with our
                  legal obligations;
                </Box>
                <Box component="li">
                  We may process information about you with your consent, which
                  you may revoke at any time.
                </Box>
              </Box>
            </Box>

            <Box>
              <Header2>Data Subject Requests</Header2>
              <Box>
                <Typography>
                  If you are in the EEA, you have the right to access personal
                  data we hold about you and to ask that your personal data be
                  corrected, erased, or transferred. You may also have the right
                  to object to, or request that we restrict, certain processing.
                  If you would like to exercise any of these rights, you may
                  contact us as at Only Latest@example.com
                </Typography>
              </Box>
            </Box>
          </Stack>

          <Box>
            <Header2>European residents</Header2>
            <Stack spacing="24px">
              <Typography>
                European law grants additional privacy rights to European
                residents. In particular, the European Consumer Privacy Act
                (CCPA) requires businesses to disclose, for the past 12 months,
                (i) the categories of personal information collected, (ii) the
                sources of the collected personal information, (iii) the
                purposes for which the collected personal information is used,
                (iv) the categories of personal information disclosed for a
                business purpose, and (v) the categories of any personal
                information sold. Only Latest provides these disclosures in the
                following table. Only Latest has not sold personal information
                in the past 12 months.
              </Typography>
              <Box>
                <Typography>Category: Identifiers</Typography>
                <br />
                <br />
                <Typography>
                  Sources of Collection: Website visits and registration for
                  Only Latest Services
                </Typography>

                <br />
                <br />
                <Typography>
                  Purposes of Collection: To allow use of Only Latest Services
                  and to enable Only Latest to communicate with you
                </Typography>

                <br />
                <br />
                <Typography>
                  Disclosures for a Business Purpose: To Only Latest service
                  providers for the purpose of providing Only Latest Services to
                  you
                </Typography>
              </Box>
              <Box>
                <Typography>
                  European residents also have the rights described below. We
                  will not discriminate against any European resident who
                  exercises these rights.
                </Typography>
              </Box>
              <Box>
                <Typography>
                  Right to access/know. You may request from us a list of (i)
                  the personal information that we have collected about you, and
                  (ii) the categories of third parties to whom we have disclosed
                  your personal information. You have the right to up to two (2)
                  access requests each twelve (12) months.
                </Typography>
              </Box>
              <Box>
                <Typography>
                  Right to delete your personal information. You may request, at
                  any time, that we delete your personal information.
                </Typography>
              </Box>
              <Box>
                <Typography>
                  You may contact us to exercise these rights at digit
                  carts@example.com. To ensure the privacy and protection of
                  individuals, we are required to verify your identity or
                  otherwise authenticate your request (s). Please note that,
                  under the CCPA, we are not required to grant a request to
                  access/know or a request to delete with respect to personal
                  information obtained from you in your role as an employee,
                  owner, director, officer or contractor of a company and within
                  the context of Only Latest providing the Only Latest Services
                  to such company.
                </Typography>
              </Box>
            </Stack>
          </Box>
          <Box>
            <Header2>How to contact us</Header2>
            <Stack spacing="24px">
              <Typography>
                If you have any questions or concerns about this Privacy Policy
                or our privacy practices, you may contact us directly as
                follows:
              </Typography>
              <Typography>Email us: digitcarts@example.com</Typography>
              <Typography>
                If you are a resident of the European Union, and you believe
                that our processing of your Personal Information is inconsistent
                with your data protection rights under the GDPR and we have not
                adequately addressed your concerns, you
              </Typography>
              <Typography>
                have the right to lodge a complaint with the data protection
                supervisory authority of your country Current list of National
                Data Protection Authorities and members of the European Data
                Protection Board found here.
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </CustomContainer>
    </>
  );
};

export default PrivacyPolicy;
