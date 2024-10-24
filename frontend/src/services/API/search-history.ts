import { SEARCH_HISTORY } from '@/constants/api';
import { axiosAPI } from '@/lib/axios';
import { SearchHistory } from '@/types/searchHistory';

export const getSearchHistory = async (props?: { limit?: number }) => {
  const res = await axiosAPI.get<SearchHistory[]>(
    SEARCH_HISTORY.LIST({
      limit: props?.limit,
    }),
  );
  return res.data;
};

export const addToSearchHistory = async (data: {
  keyword: string;
  resultsCount: number;
}) => {
  const res = await axiosAPI.post(SEARCH_HISTORY.CREATE, data);
  return res.data;
};
