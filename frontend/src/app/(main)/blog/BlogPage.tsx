'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Typography, Grid } from '@mui/material';
import { CustomContainer } from '@/ui-kit/containers';
import { CaretDown } from '@phosphor-icons/react';
import FooterSocialIcons from '@/layouts/MainLayout/footer/FooterSocialIcons';
import { SearchInput } from '@/ui-kit/inputs';
import ArticleCard from '@/components/blog/ArticleCard';
import { BlogCategory, BlogPost } from '@/types/blog';
import { useQueryStates, queryTypes } from 'next-usequerystate/app';
import { cx } from 'cva';
import { useDebounce } from '@/hooks/useDebounce';
import { useBlogPostsInfinite } from '@/hooks/queries/blog/useBlogPostsInfinite';
import { Button, OutlinedButton } from '@/ui-kit/buttons';
import BlogCarousel from './_BlogPage/BlogCarousel';
import { ButtonType } from '@/ui-kit/buttons/Button';
import useMenu from '@/hooks/useMenu';
import { Menu, MenuItem } from '@/ui-kit/menu';
import {
  SubscribeButton,
  SubscribeInput,
} from '@/components/subscribe/SubscribeTextField';

interface BlogPageProps {
  showCasedPosts: BlogPost[];
  categories: BlogCategory[];
  originUrl?: string;
}

const DEFAULT_QUERIES = {
  q: '',
  category: '',
};

const SortButton = ({
  selected,
  className,
  ...props
}: ButtonType & {
  selected?: boolean;
}) => {
  return (
    <Button
      className={cx(
        'flex h-[40px] items-center rounded-[2px] px-5 py-1 text-[14px] font-normal hover:bg-primary-main hover:text-white',
        selected ? 'bg-primary-main text-white' : 'text-text-primary',
        className,
      )}
      variant="text"
      {...props}
    />
  );
};

const ShowcaseSection = ({
  showCasedPosts,
}: {
  showCasedPosts: BlogPost[];
}) => {
  const { firstShowCased, otherShowCased } = useMemo(() => {
    return {
      firstShowCased: showCasedPosts?.[0],
      otherShowCased: showCasedPosts?.slice(1),
    };
  }, [showCasedPosts]);

  return (
    <CustomContainer>
      <div className="mb-11 mt-4 flex flex-col gap-4 md:mb-12 md:mt-0 ">
        <Typography className="text-center text-primary-main md:hidden">
          Blog
        </Typography>
        <Typography
          component="h1"
          className="max-w-[800px] text-center text-[28px]/none font-semibold md:text-start md:text-[40px]/none"
        >
          Shop & Discover: Your Ultimate Guide to Online Retail Therapy
        </Typography>
      </div>

      {firstShowCased && <ArticleCard variant="banner" post={firstShowCased} />}

      {!!otherShowCased?.length && (
        <div className="mt-11 md:mt-[60px]">
          <div className="md:hidden">
            <BlogCarousel posts={otherShowCased} />
          </div>

          <Grid container spacing={3} className="hidden md:flex">
            {otherShowCased.map((item) => (
              <Grid item xs={12} sm={6} md={6} lg={4} key={item.id}>
                <ArticleCard post={item} variant="card" />
              </Grid>
            ))}
          </Grid>
        </div>
      )}
    </CustomContainer>
  );
};

const SelectCategoryMenu = ({
  categories,
  queryCategory,
  onSelect,
}: {
  categories: BlogCategory[];
  queryCategory: string;
  onSelect: (slug: string | false) => void;
}) => {
  const { handleClose, open, handleClick, menuAria, buttonAria, anchorEl } =
    useMenu();

  const isDefault = queryCategory === DEFAULT_QUERIES.category;

  return (
    <>
      <Button
        className="w-full rounded-[4px] border-[#EAECF4] font-medium text-text-primary"
        color="inherit"
        endIcon={<CaretDown size={14} />}
        variant="outlined"
        onClick={handleClick}
        {...buttonAria}
      >
        {isDefault
          ? 'All Categories'
          : categories.find((item) => item.slug === queryCategory)?.name}
      </Button>
      <Menu open={open} anchorEl={anchorEl} onClose={handleClose} {...menuAria}>
        <MenuItem
          onClick={() => {
            onSelect(false);
            handleClose();
          }}
          selected={isDefault}
        >
          All Categories
        </MenuItem>
        {categories.map((c) => (
          <MenuItem
            key={c.id}
            onClick={() => {
              onSelect(c.slug);
              handleClose();
            }}
            selected={c.slug === queryCategory}
          >
            {c.name}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

const BlogPostsSection = ({ categories }: { categories: BlogCategory[] }) => {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const [queryState, setQueryState] = useQueryStates({
    q: queryTypes.string.withDefault(DEFAULT_QUERIES.q),
    category: queryTypes.string.withDefault(DEFAULT_QUERIES.category),
  });

  const { posts, setSize, isEnd, isLoadingMore, isLoading } =
    useBlogPostsInfinite({
      q: queryState.q,
      categoryIdOrSlug: queryState.category,
    });

  const handleSelectCategory = useCallback(
    (slug: string | false) => {
      if (!slug) {
        return setQueryState((old) => ({
          ...old,
          category: null,
        }));
      }

      return setQueryState((old) => ({
        ...old,
        category: slug,
      }));
    },
    [setQueryState],
  );

  useEffect(() => {
    setQueryState((old) => ({
      ...old,
      q: debouncedSearch,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  return (
    <CustomContainer className="flex flex-col gap-[30px] md:gap-[60px]">
      <div className="grid w-full grid-cols-2 gap-4 sm:flex">
        <div className="hidden flex-1 flex-wrap items-center gap-4 md:flex">
          <SortButton
            selected={queryState.category === DEFAULT_QUERIES.category}
            onClick={() => {
              handleSelectCategory(false);
            }}
          >
            All Posts
          </SortButton>
          {categories.map((item) => (
            <SortButton
              key={item.id}
              selected={queryState.category === item.slug}
              onClick={() => {
                handleSelectCategory(item.slug);
              }}
            >
              {item.name}
            </SortButton>
          ))}
        </div>

        <div className="md:hidden">
          <SelectCategoryMenu
            categories={categories}
            queryCategory={queryState.category}
            onSelect={handleSelectCategory}
          />
        </div>

        <SearchInput
          className="w-full flex-1 md:w-[300px]"
          hideSearchButton
          label="Search posts"
          placeholder="Search posts"
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          value={search}
        />
      </div>
      {!isLoading && !posts?.length && (
        <Typography className="text-center text-lg">No posts found</Typography>
      )}

      {!isLoading && !!posts?.length && (
        <Grid
          container
          rowSpacing={{
            xs: '16px',
            md: '60px',
          }}
          columnSpacing={{
            md: '30px',
          }}
        >
          {posts.map((item) => (
            <Grid item xs={12} sm={6} md={6} lg={4} key={item.id}>
              <ArticleCard post={item} rowInMobile variant="card" />
            </Grid>
          ))}
        </Grid>
      )}

      {isLoading && (
        <Grid
          container
          rowSpacing={{
            xs: '16px',
            md: '60px',
          }}
          columnSpacing={{
            md: '30px',
          }}
        >
          {Array(6)
            .fill(undefined)
            .map((_, index) => (
              <Grid item xs={12} sm={6} md={6} lg={4} key={`skeleton-${index}`}>
                <ArticleCard.Skeleton rowInMobile />
              </Grid>
            ))}
        </Grid>
      )}

      {!isEnd && isLoadingMore && (
        <div className="flex items-center justify-center">
          <div className="mt-[60px] flex w-full max-w-[250px] items-center justify-center">
            <OutlinedButton
              fullWidth
              onClick={() => {
                setSize((old) => old + 1);
              }}
              size="large"
            >
              {isLoadingMore && 'Loading...'}
              {!isLoadingMore && 'View More'}
            </OutlinedButton>
          </div>
        </div>
      )}
    </CustomContainer>
  );
};

const SubscribeSection = () => {
  return (
    <div className="bg-primary-main py-6 sm:py-[120px]">
      <CustomContainer className="flex w-full flex-col items-center justify-start gap-3 sm:flex-row sm:justify-between sm:gap-6">
        <div className="flex w-full flex-1 flex-col text-start text-white md:gap-4">
          <Typography className="text-[28px]/[32px] font-semibold md:text-[64px]/none">
            Stay in the Loop
          </Typography>
          <Typography className="text-xs/[18px] font-normal md:text-base/none">
            Subscribe to Our Newsletter for Exclusive Offers and Updates!
          </Typography>
        </div>

        <div className="flex w-full flex-1 flex-col gap-4">
          <div className="hidden max-h-[50px] sm:flex">
            <SubscribeInput className="w-full" placeholder="Enter your email" />
            <SubscribeButton>Subscribe</SubscribeButton>
          </div>
          <div className="flex flex-col gap-3 sm:hidden">
            <SubscribeInput
              className="px-4 py-[11px]"
              placeholder="Enter your email"
            />
            <SubscribeButton className="rounded-md">Subscribe</SubscribeButton>
          </div>

          <div className="flex justify-center gap-6 md:justify-start">
            <FooterSocialIcons />
          </div>
        </div>
      </CustomContainer>
    </div>
  );
};

const BlogPage = ({ showCasedPosts, categories }: BlogPageProps) => {
  return (
    <div className="flex flex-col gap-11 md:gap-[96px]">
      <ShowcaseSection showCasedPosts={showCasedPosts} />
      <SubscribeSection />

      <BlogPostsSection categories={categories} />
    </div>
  );
};

export default BlogPage;
