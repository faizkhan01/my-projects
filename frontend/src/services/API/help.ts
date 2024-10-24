import type { HelpTopic } from '@/types/help';
import { axiosAPI } from '@/lib/axios';

type GetHelpTopicsResponse = HelpTopic[];

export const getHelpTopics = async () => {
  const { data } = await axiosAPI.get<GetHelpTopicsResponse>('/help');

  return data;
};
