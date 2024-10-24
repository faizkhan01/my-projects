import { requestAPI } from '@/lib/request';
import { PageFooter, PageSection } from '@/types/page-section';

export const getPageSections = async () => {
  const data = await requestAPI<PageSection[]>('/sections');

  return data;
};

export const getPageSection = async (id: number) => {
  const data = await requestAPI<PageSection>(`/sections/${id}`);

  return data;
};

export const getPageFooter = async () => {
  const data = await requestAPI<PageFooter>('/sections/footer', {
    next: { revalidate: 300 },
  });

  return data;
};
