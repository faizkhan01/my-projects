import { getStore } from '@/services/API/stores';
import StorePage from './StorePage';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const store = await getStore(params.slug);

  return {
    title: store.name,
  };
}

const Store = async ({ params }: Props) => {
  const { slug } = params;

  const store = await getStore(slug);

  if (!store) {
    return notFound();
  }

  return <StorePage store={store} />;
};

export default Store;
