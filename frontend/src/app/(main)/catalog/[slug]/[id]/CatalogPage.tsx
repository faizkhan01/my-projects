'use client';
import { Box, Typography, Grid, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import CategoryCard from '@/components/categoryCard/CategoryCard';
import ProductsCardView from '@/components/productCard/ProductsCardView';
import routes from '@/constants/routes';
import { CustomContainer, SectionContainer } from '@/ui-kit/containers';
import { Category } from '@/types/categories';
import { Product } from '@/types/products';

const PageHeading = styled(Typography)(({ theme }) => ({
  fontSize: '40px',
  fontWeight: '600',

  [theme.breakpoints.down('sm')]: {
    fontSize: '28px',
  },
}));

const HeadingContainer = styled(Box)(({ theme }) => ({
  marginBottom: '32px',

  [theme.breakpoints.down('sm')]: {
    marginBottom: '16px',
  },
}));

const CatalogPage = ({
  count,
  category,
  products,
}: {
  count: number;
  category: Category;
  products: Product[];
}) => {
  return (
    <>
      <CustomContainer sx={{ marginTop: '20px' }}>
        <Stack
          spacing={{
            xs: '55px',
            md: '96px',
          }}
        >
          <Box>
            <HeadingContainer
              sx={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}
            >
              <PageHeading>{category?.name}</PageHeading>
              <Typography fontSize={14} color="#96A2C1">
                {count} Items
              </Typography>
            </HeadingContainer>
            {/* <PosterContainer> */}
            {/*   <Image */}
            {/*     src={PosterImage} */}
            {/*     fill */}
            {/*     alt={category?.name} */}
            {/*     style={{ objectFit: 'cover', borderRadius: '2px' }} */}
            {/*   /> */}
            {/* </PosterContainer> */}
          </Box>
          <SectionContainer title="Categories">
            <Grid container columnSpacing="20px" rowSpacing="32px">
              {category?.children?.map((item) => (
                <Grid key={item.name} item xs={12} sm={6} md={3} lg={2.4}>
                  <CategoryCard category={item} />
                </Grid>
              ))}
            </Grid>
          </SectionContainer>
          {!!products.length && (
            <SectionContainer
              title="You May Like"
              viewAll={routes.CATEGORIES.INFO(category.name)}
            >
              <ProductsCardView products={products} loadingCount={10} />
            </SectionContainer>
          )}
        </Stack>
      </CustomContainer>
    </>
  );
};

export default CatalogPage;
