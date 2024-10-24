import SearchPage from '../../search/page';

interface Props {
  params: {
    category: string;
  };
}

export async function generateMetadata({ params }: Props) {
  return {
    title: decodeURIComponent(params.category),
  };
}

export default SearchPage;
