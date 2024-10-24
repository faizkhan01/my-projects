import { requestAPI } from '@/lib/request';
import MainPage from './MainPage';
import { Promotion } from '@/types/promotion';
import { getPageSections } from '@/services/API/page-sections';
import { cache } from 'react';

export const revalidate = 300; // 5 minutes

export const metadata = {
  alternates: {
    canonical: '/',
  },
};

const getData = cache(async () => {
  const [pgSections, promotions] = await Promise.all([
    getPageSections(),
    requestAPI<Promotion[]>('/promotions'),
  ]);

  return {
    sections: pgSections,
    promotions: promotions.filter((p) => p.showOnHomepage),
  };
});

const Main = async () => {
  const data = await getData();
  return <MainPage {...data} />;
};

export default Main;
