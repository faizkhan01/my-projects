import { useMemo } from 'react';
import { useProductSearchSuggestions } from './useProductSearchSuggestions';
import { useSearchHistory } from './useSearchHistory';

export const useProductSuggestionsAutocomplete = (search?: string) => {
  const { history } = useSearchHistory({
    limit: 5,
  });
  const { suggestions } = useProductSearchSuggestions(search);

  const autocompleteData = useMemo<
    {
      id: string | number;
      keyword: string;
      highlight?: string;
    }[]
  >(() => {
    if (!search) {
      return (
        history?.map((i) => ({
          id: i?.id ?? i?.keyword,
          keyword: i.keyword,
          highlight: undefined,
        })) ?? []
      );
    }

    return suggestions
      ? suggestions?.map((i) => ({
          id: i?.suggestion,
          keyword: i.suggestion,
          highlight: i.highlight,
        }))
      : [];
  }, [history, search, suggestions]);

  return {
    data: autocompleteData,
  };
};
