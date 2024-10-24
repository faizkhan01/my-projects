/* eslint-disable @typescript-eslint/no-explicit-any */
import { getBlogPost } from '@/services/API/blog';
import BlogPostPage from './BlogPostPage';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import dayjs from 'dayjs';
import { rehype } from 'rehype';
import { visit } from 'unist-util-visit';
import { getFullUrl } from '@/utils/ssr';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

interface Props {
  params: { slug: string };
}
async function getData(slug: string) {
  try {
    const post = await getBlogPost(slug);

    return post;
  } catch (e) {
    notFound();
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getData(params.slug);
  const title = post?.meta?.title || post?.title || '';
  const description = post?.meta?.description || post?.description || '';

  return {
    title,
    description,
    keywords: post?.meta?.keywords || undefined,
    openGraph: {
      title,
      description,
      type: 'article',
      ...(post.banner?.url && {
        images: [post.banner?.url],
      }),
    },
    twitter: {
      ...(post.banner?.url && {
        images: [post.banner?.url],
      }),
      title,
      description,
    },
  };
}

const BlogPost = async ({ params }: Props) => {
  const post = await getData(params.slug);

  if (post.createdAt) {
    post.createdAt = dayjs(post.createdAt).format('MMM D, YYYY');
  }
  if (post.updatedAt) {
    post.updatedAt = dayjs(post.updatedAt).format('MMM D, YYYY');
  }

  const toc: { id: string; text: string; level: number }[] = [];

  if (post.content) {
    post.content = (
      await rehype()
        .use(() => {
          return (tree) => {
            visit(tree, 'element', (node: any) => {
              if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(node.tagName)) {
                if (!node.children?.[0]?.value) return;

                if (!node.properties.id) {
                  node.properties.id = node.children[0].value
                    .toLowerCase()
                    .replace(/ /g, '-');
                }

                toc.push({
                  id: node.properties.id,
                  text: node.children[0].value,
                  level: parseInt(node.tagName.replace('h', '')),
                });
              }
            });
          };
        })
        .process(post.content)
    ).toString();
  }

  const headersList = headers();
  const url = getFullUrl(headersList);

  return <BlogPostPage post={post} toc={toc} pageUrl={url} />;
};

export default BlogPost;
