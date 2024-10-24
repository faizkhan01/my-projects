import { getCategory } from '@/services/API/categories';
import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import routes from '@/constants/routes';
import CatalogPage from './CatalogPage';
import { getProducts } from '@/services/API/products';

interface Props {
  params: { slug: string; id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = Number(params.id);

  const data = await getCategory(id);

  return {
    title: data?.category?.name,
  };
}

const CategoryCatalog = async ({ params }: Props) => {
  const id = Number(params.id);

  try {
    const { category, count } = await getCategory(id);

    // If the category doesn't contain any children category, then we move it to the search page
    if (!category?.children?.length) {
      return redirect(routes.CATEGORIES.INFO(category.name));
    }

    const products = await getProducts({
      category: category.name,
      limit: 10,
      withAggs: false,
    });

    return (
      <CatalogPage
        count={count}
        category={category}
        products={products.results.results.map((p) => p._source)}
      />
    );
  } catch (error) {
    return notFound();
  }
};

export default CategoryCatalog;
