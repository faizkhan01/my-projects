import NextLink from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { styled } from '@mui/material/styles';
import {
  Link,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { CaretDown } from '@phosphor-icons/react';
import { useMemo } from 'react';
import type { HelpQuestion, HelpTopic } from '@/types/help';
import { NextSeo } from 'next-seo';
import routes from '@/constants/routes';
import { Accordion } from '@/ui-kit/accordions';

interface HelpSectionProps {
  topics: HelpTopic[];
  search?: string;
}

interface SidebarProps {
  isHome: boolean;
  topics: HelpTopic[];
  selectedQuestion?: HelpQuestion;
  selectedTopic?: HelpTopic;
  topicSlug?: string;
}

const HelpCenterContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '260px 1fr',

  '& .MuiList-root': {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '30px',
    padding: '0',
  },
  '& .MuiListItem-root': {
    display: 'block',
    padding: '0',
    paddingLeft: '30px',
  },
  '& .MuiListItemText-root': {
    display: 'flex',
    alignItems: 'center',
    marginBlock: '8px',
  },
  '& .MuiListItemText-primary': {
    color: theme.palette.primary.main,
    fontSize: '28px',
    marginRight: '8px',
  },
  '& .MuiListItemText-secondary': {
    color: '#96A2C1',
    fontSize: '14px',
    lineHeight: '22px',
  },
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
    gap: '2rem',
    '& .MuiList-root': {
      gridTemplateColumns: '1fr',
    },
    '& .MuiListItem-root': {
      paddingLeft: '0',
    },
  },
}));

const SidebarContainer = styled(Box)(({ theme }) => ({
  paddingRight: '24px',
  borderRight: '1px solid #EAECF4',
  [theme.breakpoints.down('sm')]: { borderRight: '0', paddingRight: '0' },
}));

const Sidebar = ({
  isHome,
  topics,
  selectedQuestion,
  selectedTopic,
  topicSlug,
}: SidebarProps) => {
  const { push } = useRouter();
  return (
    <>
      <NextLink passHref legacyBehavior href={routes.HELP_CENTER}>
        <Link
          fontSize={18}
          fontWeight={600}
          lineHeight="24px"
          mb={1}
          sx={{
            color: isHome ? 'main.primary' : 'text.primary',
            cursor: 'pointer',
            display: 'block',
          }}
          underline="none"
        >
          Home
        </Link>
      </NextLink>
      <Accordion type="single" defaultValue={topicSlug}>
        {topics.map((topic) => (
          <Accordion.Item
            key={topic.id}
            className="border-0"
            value={topic.slug}
          >
            <Accordion.Summary
              expandIcon={<CaretDown size={18} color="#333E5C" />}
              className="py-3"
              onClick={() =>
                push(`${routes.HELP_CENTER}/${topic.slug}`, { scroll: false })
              }
            >
              <Typography
                fontSize={18}
                fontWeight={600}
                lineHeight="24px"
                sx={{
                  color:
                    selectedTopic?.slug === topic.slug
                      ? 'primary.main'
                      : 'text.primary',
                }}
              >
                {topic.title}
              </Typography>
            </Accordion.Summary>
            <Accordion.Details>
              {topic.questions.map((question) => (
                <ListItemText
                  key={question.id}
                  primary="•"
                  secondary={
                    <NextLink
                      legacyBehavior
                      passHref
                      href={`${routes.HELP_CENTER}/${topic.slug}/${question.slug}`}
                    >
                      <Link
                        underline="hover"
                        sx={{
                          color:
                            selectedQuestion?.slug === question.slug
                              ? 'main.primary'
                              : 'text.primary',
                        }}
                      >
                        {question.title}
                      </Link>
                    </NextLink>
                  }
                />
              ))}
            </Accordion.Details>
          </Accordion.Item>
        ))}
      </Accordion>
    </>
  );
};

const HelpSection = ({ topics, search }: HelpSectionProps): JSX.Element => {
  const params = useParams();
  const [topicSlug, questionSlug] =
    (Array.isArray(params?.slug)
      ? [params.slug?.[0], params.slug?.[1]]
      : params?.slug?.split('/')) || [];

  const selectedTopic = useMemo(
    () => (topicSlug ? topics.find((q) => topicSlug == q.slug) : undefined),
    [topicSlug, topics],
  );
  const selectedQuestion = useMemo(
    () =>
      topicSlug && questionSlug
        ? selectedTopic?.questions.find(
            (question) => question.slug === questionSlug,
          )
        : undefined,
    [questionSlug, selectedTopic, topicSlug],
  );
  const topicsToShow = useMemo(() => {
    if (!search) return topics;
    const lowerSearch = search.toLowerCase();

    return topics.filter((topic) =>
      topic.questions.some((q) => q.title.toLowerCase().includes(lowerSearch)),
    );
  }, [topics, search]);

  const isHome = !params?.slug;
  const isTopic = Boolean(topicSlug) && !questionSlug;
  const isQuestion = Boolean(topicSlug) && Boolean(questionSlug);

  const seoTitle = useMemo(() => {
    let title = 'Help';

    if (isTopic) title = selectedTopic?.title || title;
    else if (isQuestion) title = selectedQuestion?.title || title;

    return title;
  }, [isQuestion, isTopic, selectedQuestion?.title, selectedTopic?.title]);

  return (
    <HelpCenterContainer
      sx={{
        ...(search
          ? {
              display: 'block',
            }
          : {}),
      }}
    >
      <NextSeo title={seoTitle} />
      {!search && (
        <SidebarContainer sx={{ display: { md: 'block', xs: 'none' } }}>
          <Sidebar
            isHome={isHome}
            topics={topics}
            selectedQuestion={selectedQuestion}
            selectedTopic={selectedTopic}
            topicSlug={topicSlug}
          />
        </SidebarContainer>
      )}
      <Box>
        {Boolean(isTopic || isQuestion) && (
          <Box
            sx={{
              paddingLeft: {
                lg: '30px',
                sm: '0',
              },
            }}
          >
            {isQuestion && (
              <>
                <Typography
                  fontSize={24}
                  fontWeight={600}
                  lineHeight="32px"
                  mb={2}
                  component="h3"
                >
                  {selectedQuestion?.title}
                </Typography>
                {selectedQuestion?.answer && (
                  <Box
                    dangerouslySetInnerHTML={{
                      __html: selectedQuestion?.answer,
                    }}
                  />
                )}
              </>
            )}

            {isTopic &&
              selectedTopic?.questions.map((question) => (
                <Box key={question.title} sx={{ mb: 2 }}>
                  <NextLink
                    href={`${routes.HELP_CENTER}/${topicSlug}/${question.slug}`}
                    passHref
                    legacyBehavior
                  >
                    <Link color="text.primary" underline="hover">
                      <Typography
                        fontSize={24}
                        fontWeight={600}
                        lineHeight="32px"
                        mb={2}
                        component="h3"
                      >
                        {question.title}
                      </Typography>
                    </Link>
                  </NextLink>
                  {selectedTopic?.questions?.length > 1 ? null : (
                    <Box
                      dangerouslySetInnerHTML={{
                        __html: question.answer,
                      }}
                    />
                  )}
                </Box>
              ))}
          </Box>
        )}

        {isHome && (
          <List>
            {topicsToShow.map((topic) => (
              <ListItem key={topic.id}>
                <NextLink
                  legacyBehavior
                  passHref
                  href={`${routes.HELP_CENTER}/${topic.slug}`}
                >
                  <Link underline="hover" color="text.primary">
                    <Typography
                      fontSize={18}
                      fontWeight={600}
                      lineHeight="24px"
                      mb={1}
                      component="h3"
                    >
                      {topic.title}
                    </Typography>
                  </Link>
                </NextLink>

                {topic.questions.map((question) => (
                  <ListItemText
                    key={question.title}
                    primary="•"
                    secondary={
                      <NextLink
                        legacyBehavior
                        passHref
                        href={`${routes.HELP_CENTER}/${topic.slug}/${question.slug}`}
                      >
                        <Link underline="hover" color="text.primary">
                          {question.title}
                        </Link>
                      </NextLink>
                    }
                  />
                ))}
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </HelpCenterContainer>
  );
};

export default HelpSection;
