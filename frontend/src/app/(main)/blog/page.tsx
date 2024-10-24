import BlogPage from './BlogPage';
import { Box } from '@mui/material';
import { CustomContainer } from '@/ui-kit/containers';
import { Breadcrumbs } from '@/ui-kit/breadcrumbs';
import { getBlogCategories, getBlogPosts } from '@/services/API/blog';

export const dynamic = 'force-dynamic';

async function getData() {
  const [posts, showcasedPosts, categories] = await Promise.allSettled([
    getBlogPosts(),
    getBlogPosts({
      showcased: true,
    }),
    getBlogCategories({
      showInMenu: true,
    }),
  ]);

  return {
    posts: posts.status === 'fulfilled' ? posts.value : null,
    showcasedPosts:
      showcasedPosts.status === 'fulfilled' ? showcasedPosts.value : null,
    categories: categories.status === 'fulfilled' ? categories.value : null,
  };
}

const Blog = async () => {
  const { posts, showcasedPosts, categories } = await getData();

  const showcased = showcasedPosts?.results ? showcasedPosts.results : [];

  return (
    <Box>
      <CustomContainer>
        <Breadcrumbs
          sx={{
            margin: '40px 0px',
            display: { md: 'block', xs: 'none' },
          }}
          links={[
            {
              name: 'Blog',
            },
          ]}
        />
      </CustomContainer>
      <BlogPage
        showCasedPosts={
          showcased.length === 0 ? posts?.results ?? [] : showcased
        }
        categories={categories ?? []}
      />
    </Box>
  );
};

export default Blog;
