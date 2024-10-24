import { getPageSection } from '@/services/API/page-sections';
import { PageSection } from '@/types/page-section';
import Search from '@/views/search/Search';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Search',
};

const SearchPage = async ({
  searchParams,
  params,
}: {
  params: {
    category?: string;
  };
  searchParams: Record<string, string | undefined>;
}) => {
  const section = searchParams.section;
  let foundSection: PageSection | null = null;

  if (section && Number.isNaN(Number(section)) === false) {
    try {
      foundSection = await getPageSection(Number(section));
    } catch (error) {
      return notFound();
    }
  }

  return (
    <Search
      section={foundSection}
      query={{
        category:
          searchParams.category ||
          decodeURIComponent(
            Array.isArray(params?.category)
              ? params?.category[0]
              : params?.category ?? '',
          ),
        q: searchParams.q ?? null,
        price_min: searchParams.price_min ?? null,
        price_max: searchParams.price_max ?? null,

        sort_by: searchParams.sort_by ?? null,
        page: searchParams.page ?? null,
        store: searchParams.store ?? null,
      }}
    />
  );
};

export default SearchPage;
