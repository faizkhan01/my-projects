import Link from 'next/link';
import NextImage from 'next/image';
import { Category } from '@/types/categories';
import routes from '@/constants/routes';

interface CategoryCardProps {
  category: Category;
  size?: 'small' | 'medium';
  bold?: boolean;
  catalog?: boolean;
  priority?: boolean;
}

export const CategoryCard = ({
  size = 'small',
  bold,
  category: { id, name, image, slug },
  catalog,
  priority,
}: CategoryCardProps) => {
  return (
    <Link
      href={
        catalog ? routes.CATALOG.INFO(slug, id) : routes.CATEGORIES.INFO(name)
      }
      className="cursor-pointer text-text-primary no-underline [&:hover>span]:text-primary-main"
    >
      <div className="mb-4 rounded-[10px] bg-[#F6F9FF]">
        <div className="relative aspect-square w-full overflow-hidden rounded-[6px]">
          <NextImage
            src={image?.url || 'https://loremflickr.com/320/240/product'}
            fill
            alt={name}
            className="object-cover"
            priority={priority}
          />
        </div>
      </div>
      <span
        className={`text-center ${bold ? 'font-semibold' : 'font-normal'} ${
          size === 'small' ? 'text-[16px]' : 'text-[20px]'
        }`}
      >
        {name}
      </span>
    </Link>
  );
};

export default CategoryCard;
