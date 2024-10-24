'use client';
import React from 'react';
import { CustomContainer } from '@/ui-kit/containers';
import routes from '@/constants/routes';
import { Breadcrumbs } from '@/ui-kit/breadcrumbs';
import { BlogPost } from '@/types/blog';
import { styled } from '@mui/material/styles';
import {
  Typography,
  Chip,
  Box,
  IconButton,
  Grid,
  Divider,
  Avatar,
  ListItem,
  Link as MuiLink,
} from '@mui/material';
import { FacebookIcon } from '@/assets/icons/FacebookIcon';
import { LinkedinIcon } from '@/assets/icons/LinkedinIcon';
import Image from 'next/image';
import { TwitterIcon } from '@/assets/icons/TwitterIcon';
import { sanitize } from 'isomorphic-dompurify';
import Link from 'next/link';
import { getShareUrl } from '@/utils/share';
import { BackLinkButton } from '@/ui-kit/buttons';
import {
  SubscribeButton,
  SubscribeInput,
} from '@/components/subscribe/SubscribeTextField';

interface FooterIconProps {
  icon: React.ReactNode;
  href?: string;
  target?: string;
}

const FooterIcon = ({ icon, href = '', target }: FooterIconProps) => (
  <IconButton
    sx={(theme) => ({
      padding: 0,
      borderRadius: '50%',
      border: `1px solid ${theme.palette.primary.main}`,
      backgroundColor: theme.palette.primary.main,

      '& path': {
        transition: 'all .3s ease',
      },
      '&:hover path:nth-of-type(1)': {
        fill: 'white',
        transition: 'all 0.3s',
      },

      '&:hover path': {
        fill: theme.palette.primary.main,
        transition: 'all 0.3s',
      },
    })}
    href={href}
    target={target}
  >
    {icon}
  </IconButton>
);

const StyledChip = styled(Chip)(({ theme }) => ({
  height: '32px',
  borderRadius: '2px',
  fontWeight: 400,
  fontSize: '16px',
  color: theme.palette.primary.main,
  backgroundColor: theme.palette.grey[400],

  [theme.breakpoints.down('sm')]: {
    fontSize: '16px',
  },
}));

const BlueContainerHeading = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '32px',
  textAlign: 'center',
  marginBottom: '8px',
  color: theme.palette.primary.contrastText,
}));

const BlueContainerTitle = styled(Typography)(({ theme }) => ({
  margin: 'auto',
  fontWeight: 200,
  fontSize: '16px',
  textAlign: 'center',
  color: theme.palette.primary.contrastText,
}));

const ShareText = styled(Typography)(({ theme }) => ({
  fontSize: '16px',
  fontStyle: 'normal',
  fontWeight: 400,
  color: theme.palette.text.primary,
}));

const InputBox = styled(Box)(() => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  gap: '12px',
}));

const TableOfContents = ({
  toc,
}: {
  toc: { id: string; text: string; level: number }[];
}) => {
  const [activeId, setActiveId] = React.useState<string | undefined>();
  const observer = React.useRef<IntersectionObserver>();

  React.useEffect(() => {
    const elements = toc.map(({ id }) => document.getElementById(id));
    observer.current?.disconnect();
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry?.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },

      { rootMargin: '0% 0% -25% 0%' },
    );

    elements.forEach((el) => {
      if (el) {
        observer.current?.observe(el);
      }
    });
    return () => observer.current?.disconnect();
  }, [toc]);

  return (
    <nav className="hidden md:block">
      <ul className="m-0 flex flex-col p-0">
        <Typography className="mb-4 text-lg font-semibold">
          Table of contents
        </Typography>
        {toc.map((h, index) => (
          <ListItem
            className={`p-0 text-base text-text-primary ${
              activeId === h.id ? 'font-semibold' : 'font-normal'
            } `}
            style={{
              marginLeft: `${(h.level - 1) * 8}px`,
              marginTop: h.level === 1 ? '0px' : '8px',
            }}
            key={`${h.id}-${index}`}
          >
            <MuiLink
              component={Link}
              href={`#${h.id}`}
              color="inherit"
              underline="hover"
            >
              {h.text}
            </MuiLink>
          </ListItem>
        ))}
      </ul>
    </nav>
  );
};

const PostContent = ({ content }: { content: BlogPost['content'] }) => {
  return (
    <article
      className="prose max-w-full prose-headings:m-0 prose-p:m-0 prose-p:text-base prose-img:m-0 prose-img:w-full prose-img:rounded-xl"
      dangerouslySetInnerHTML={{
        __html: sanitize(content || ''),
      }}
    />
  );
};

const SubscripSection = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-6 bg-primary-main px-4 py-6 md:p-10">
      <div>
        <BlueContainerHeading>Stay in the Loop</BlueContainerHeading>
        <BlueContainerTitle>
          Subscribe to Our Newsletter for Exclusive Offers and Updates!
        </BlueContainerTitle>
      </div>
      <InputBox>
        <SubscribeInput placeholder="Enter your email" className="p-4" />
        <SubscribeButton className="rounded-md">Subscribe</SubscribeButton>
      </InputBox>
    </div>
  );
};

const BlogPostPage = ({
  post,
  toc,
  pageUrl,
}: {
  post: BlogPost;
  toc: { id: string; text: string; level: number }[];
  pageUrl: string;
}) => {
  return (
    <div>
      <CustomContainer>
        <BackLinkButton
          sx={{
            mt: '16px',
            mb: '24px',
          }}
        />

        <Breadcrumbs
          sx={{
            margin: '40px 0px',
            display: { md: 'block', xs: 'none' },
          }}
          links={[
            {
              name: 'Blog',
              href: routes.BLOG.INDEX,
            },
            {
              name: post.title,
            },
          ]}
        />
      </CustomContainer>
      <CustomContainer>
        <Typography
          className="mb-4 max-w-[820px] text-[22px] font-semibold text-text-primary md:mb-6 md:mt-0 md:text-[40px]"
          component="h1"
        >
          {post.title}
        </Typography>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
          <div className="flex items-center gap-2">
            {post?.categories?.map((category) => (
              <StyledChip key={category.id} label={category.name} />
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 rounded-full">
              {post?.author?.avatar?.url && (
                <Image
                  src={post?.author?.avatar?.url}
                  alt={post?.author?.name || 'Only Latest'}
                  fill
                  className="object-cover"
                />
              )}
            </Avatar>
            <div className="flex flex-col gap-1">
              <Typography className="text-sm/none font-semibold text-text-primary">
                {post?.author?.name || 'Only Latest'}
              </Typography>
              {post?.createdAt && (
                <Typography className="text-xs/none font-normal text-text-secondary">
                  {post?.createdAt}
                </Typography>
              )}
            </div>
          </div>
        </div>
        {post?.banner?.url && (
          <div className="relative my-[34px] h-[280px] w-full overflow-hidden rounded-[10px] md:my-[60px] md:h-[600px]">
            <Image
              src={post?.banner?.url}
              alt={post?.title || 'Only Latest'}
              fill
              className="object-cover"
            />
          </div>
        )}

        <Grid
          container
          spacing={{
            xs: 0,
            md: 8,
          }}
        >
          <Grid item xs={12} sm={12} md={4} lg={4}>
            <div className="sticky top-0 flex flex-col gap-[30px] md:gap-[60px]">
              {!!toc.length && <TableOfContents toc={toc} />}
              <div className="hidden md:block">
                <SubscripSection />
              </div>
            </div>
          </Grid>
          <Grid item xs={12} sm={12} md={8} lg={8}>
            <PostContent content={post.content} />
            <Divider className="my-6 md:my-10" />
            <div className="flex flex-wrap items-center justify-between md:justify-start md:gap-[30px]">
              <ShareText>Share this post</ShareText>
              <Box sx={{ display: 'flex', gap: '26px' }}>
                <FooterIcon
                  icon={<FacebookIcon aria-label="Facebook" />}
                  href={getShareUrl('facebook', {
                    pageUrl: pageUrl,
                    title: post.title,
                  })}
                  target="_blank"
                />
                <FooterIcon
                  icon={<TwitterIcon aria-label="Twitter" />}
                  href={getShareUrl('twitter', {
                    pageUrl: pageUrl,
                    title: post.title,
                  })}
                  target="_blank"
                />
                <FooterIcon
                  icon={<LinkedinIcon aria-label="Linkedin" />}
                  href={getShareUrl('linkedin', {
                    pageUrl: pageUrl,
                    title: post.title,
                  })}
                  target="_blank"
                />
              </Box>
            </div>

            <div className="mt-[60px] md:hidden">
              <SubscripSection />
            </div>
          </Grid>
        </Grid>
      </CustomContainer>
    </div>
  );
};

export default BlogPostPage;
