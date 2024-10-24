import { getPromotion } from '@/services/API/promotions';
import Search from '@/views/search/Search';

interface Props {
  params: {
    promotionId: string;
    category?: string;
  };
  searchParams: Record<string, string | undefined>;
}

const Promotion = async ({ params, searchParams }: Props) => {
  const id = Number(params?.promotionId);

  if (isNaN(id)) {
    return {
      notFound: true,
    };
  }

  const promotion = await getPromotion(id);

  if (!promotion) {
    return {
      notFound: true,
    };
  }

  return (
    <Search
      promotion={promotion}
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

export default Promotion;
