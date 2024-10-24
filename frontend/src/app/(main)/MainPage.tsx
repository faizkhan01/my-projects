import { ConditionalWrapper, CustomContainer } from '@/ui-kit/containers';
import { SectionContainer } from '@/ui-kit/containers';
import ProductsCardView from '@/components/productCard/ProductsCardView';
import { ProductGridCarousel } from '@/components/carousel/ProductGridCarousel';
import CategoryCard from '@/components/categoryCard/CategoryCard';
import PromotionsCarousel from '@/components/carousel/PromotionsCarousel';
import { ReactNode, Suspense, memo } from 'react';
import routes from '@/constants/routes';
import { PageSection } from '@/types/page-section';
import { Promotion } from '@/types/promotion';
import clsx from 'clsx';
import { Category } from '@/types/categories';
import { getProducts } from '@/services/API/products';

const CategoriesGrid = memo(function CategoriesGrid({
  categories,
  priority,
}: {
  categories: Category[];
  priority?: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-x-[30px] gap-y-8 md:grid-cols-4">
      {categories?.map((c) => (
        <CategoryCard
          catalog={!c.parentId}
          category={c}
          size="medium"
          bold
          key={`category-card-${c.id}`}
          priority={priority}
        />
      ))}
    </div>
  );
});

const ProductSection = async ({ section }: { section: PageSection }) => {
  const queryParams = section.data?.queryParams;

  if (queryParams) {
    delete queryParams.withAggs;

    const data = await getProducts({ ...queryParams, withAggs: false });
    section.products = [
      ...(section.products ?? []),
      ...data.results.results.map((res) => res._source),
    ];

    // Remove duplicates
    section.products = section.products.filter(
      (product, index, self) =>
        index === self.findIndex((p) => p.id === product.id),
    );

    if (section.products.length > 10) {
      section.products = section.products.slice(0, 10);
    }
  }

  return (
    <>
      {Boolean(
        section.data?.widgetType === 'list' || !section?.data?.widgetType,
      ) && (
        <ProductsCardView carouselOnMobile products={section.products ?? []} />
      )}
      {section.data?.widgetType === 'carousel' && (
        <ProductGridCarousel products={section.products ?? []} />
      )}
    </>
  );
};

const Main = ({
  promotions,
  sections,
}: {
  promotions: Promotion[];
  sections: PageSection[];
}) => {
  const getChildrenContent = (s: PageSection, index: number): ReactNode => {
    switch (s.type) {
      case 'product_list': {
        return (
          <CustomContainer>
            <SectionContainer
              title={s.name}
              viewAll={routes.SEARCH.INDEX({
                section: s.id.toString(),
              })}
            >
              <Suspense
                fallback={
                  <>
                    {Boolean(
                      s.data?.widgetType === 'list' || !s?.data?.widgetType,
                    ) && (
                      <ProductsCardView
                        carouselOnMobile
                        products={[]}
                        loading
                        loadingCount={5}
                      />
                    )}
                    {s.data?.widgetType === 'carousel' && (
                      <ProductGridCarousel products={[]} loading />
                    )}
                  </>
                }
              >
                <ProductSection section={s} />
              </Suspense>
            </SectionContainer>
          </CustomContainer>
        );
      }

      case 'categories_grid': {
        return (
          <CustomContainer>
            <SectionContainer title={s.name}>
              <CategoriesGrid
                categories={s.categories ?? []}
                priority={index === 0}
              />
            </SectionContainer>
          </CustomContainer>
        );
      }
    }

    return null;
  };

  return (
    <div className="mt-4 md:mt-8">
      {!!promotions.length && (
        <CustomContainer>
          <PromotionsCarousel promotions={promotions} />
        </CustomContainer>
      )}

      {sections?.map((s, index) => {
        let shouldShowPaddingTop = false;
        const lastSection = sections[index - 1];

        if (
          Boolean(
            lastSection?.settings?.backgroundColor &&
              lastSection.settings.backgroundColor.toLowerCase() !==
                'transparent',
          ) ||
          Boolean(
            s?.settings?.backgroundColor &&
              s.settings.backgroundColor.toLowerCase() !== 'transparent',
          ) ||
          index === 0
        ) {
          shouldShowPaddingTop = true;
        }

        return (
          <ConditionalWrapper
            key={`${s.id}_${s.type}-section`}
            condition={
              s.type === 'product_list' || s.type === 'categories_grid'
            }
            wrapper={(c) => (
              <div
                className={clsx(
                  'w-full p-[54px_0_60px_0] md:p-[96px_0_112px_0]',
                  !shouldShowPaddingTop && '!pt-0',
                )}
                style={{
                  backgroundColor: s.settings?.backgroundColor,
                }}
              >
                {c}
              </div>
            )}
          >
            <>{getChildrenContent(s, index)}</>
          </ConditionalWrapper>
        );
      })}
    </div>
  );
};

export default Main;
