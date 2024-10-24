import { useSearchParams } from 'next/navigation';

interface usePaginationFiltersProps {
  defaultPage?: number;
  defaultPerPage?: number;
}

export const usePaginationFilters = (
  props: usePaginationFiltersProps | null,
) => {
  const defaultPage = props?.defaultPage ?? 1;
  const defaultPerPage = props?.defaultPerPage ?? 10;
  const query = useSearchParams();

  const q = query.get('q') ?? '';
  let page = query.get('page') ?? defaultPage;
  let perPage = query.get('perPage') ?? defaultPerPage;

  page = Number(page);
  perPage = Number(perPage);

  if (page < 1) {
    page = defaultPage;
  }

  return { q, page, perPage, limit: perPage, offset: (page - 1) * perPage };
};
