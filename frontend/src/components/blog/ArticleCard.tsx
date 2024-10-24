import { Typography, Chip, Skeleton, Link as MuiLink } from '@mui/material';
import Image from 'next/image';
import { ArrowUpRight } from '@phosphor-icons/react';
import { Button } from '@/ui-kit/buttons';
import { BlogPost } from '@/types/blog';
import Link from 'next/link';
import routes from '@/constants/routes';
import { cn } from '@/ui-kit/utils';

type ArticleCardProps = {
  post: BlogPost;
  variant: 'card' | 'banner';
} & (
  | {
      variant: 'card';
      rowInMobile?: boolean;
    }
  | {
      variant: 'banner';
      rowInMobile?: false;
    }
);

const ArticleCard = ({ post, rowInMobile, variant }: ArticleCardProps) => {
  const href = routes.BLOG.INFO(post.slug);

  return (
    <article
      className={cn(
        'flex h-full md:gap-8',
        rowInMobile ? 'gap-3 sm:flex-col sm:gap-4' : 'flex-col gap-4',
        variant === 'banner' && 'md:flex-row md:items-center',
      )}
    >
      {post?.banner?.url && (
        <Link
          href={href}
          className={cn(
            'relative block overflow-hidden rounded-[10px]',
            rowInMobile
              ? 'h-[80px] w-[80px] sm:h-[240px] sm:w-full'
              : 'h-[240px] w-full',
            variant === 'banner' && 'md:h-[355px] md:max-w-[640px] md:flex-[2]',
          )}
        >
          <Image
            src={post.banner?.url}
            alt={`${post.title} banner image`}
            fill
            className="object-cover"
          />
        </Link>
      )}

      <div
        className={cn(
          'flex flex-1 flex-col',
          rowInMobile
            ? 'justify-center gap-2 sm:justify-start sm:gap-4'
            : 'gap-3 md:gap-4',
          variant === 'banner' && 'md:flex-1 md:gap-6',
        )}
      >
        <div className="flex gap-2">
          {post?.categories?.map((category) => (
            <Chip
              key={`${post.id}-${category}`}
              label={category.name}
              className={cn(
                'rounded-[2px] bg-[#F6F9FF] text-primary-main',
                rowInMobile
                  ? 'h-[22px] text-[11px] font-semibold sm:h-8 sm:text-base sm:font-medium'
                  : 'h-8 text-base font-medium',
              )}
            />
          ))}
        </div>

        <MuiLink
          component={Link}
          className={cn(
            'font-semibold text-text-primary sm:text-xl/none',
            rowInMobile ? 'text-sm/4' : 'text-lg/none ',
            variant === 'banner' && 'md:text-[40px]',
          )}
          underline="none"
          href={href}
        >
          {post.title}
        </MuiLink>
        <Link href={href} passHref legacyBehavior>
          <Button
            variant="text"
            className={cn(
              'mt-auto h-fit min-h-0 w-fit p-0',
              rowInMobile ? 'hidden sm:flex' : '',
              variant === 'banner' && 'mt-0',
            )}
            endIcon={<ArrowUpRight size={18} />}
          >
            Read more
          </Button>
        </Link>
      </div>
    </article>
  );
};

ArticleCard.Skeleton = function ArticleCardSkeleton({
  rowInMobile,
}: {
  rowInMobile?: boolean;
}) {
  return (
    <div
      className={cn(
        'flex h-full md:gap-8',
        rowInMobile ? 'gap-3 sm:flex-col sm:gap-4' : 'flex-col gap-4',
      )}
    >
      <div
        className={cn(
          'relative overflow-hidden rounded-[10px]',
          rowInMobile
            ? 'h-[80px] w-[80px] sm:h-[240px] sm:w-full'
            : 'h-[240px] w-full',
        )}
      >
        <Skeleton variant="rounded" height="100%" width="100%" />
      </div>
      <div
        className={cn(
          'flex flex-1 flex-col',
          rowInMobile
            ? 'justify-center gap-2 sm:justify-start sm:gap-4'
            : 'gap-3 md:gap-4',
        )}
      >
        <div className="flex gap-2">
          <Skeleton width={60} height={32} />
          <Skeleton width={60} height={32} />
        </div>
        <Typography
          className={cn(
            'font-semibold sm:text-xl/none',
            rowInMobile ? 'text-sm/4' : 'text-lg/none ',
          )}
        >
          <Skeleton />
        </Typography>

        <Skeleton
          height={'19px'}
          width={'105px'}
          className={rowInMobile ? 'hidden sm:flex' : ''}
        />
      </div>
    </div>
  );
};

export default ArticleCard;
