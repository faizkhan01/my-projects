import { useSimilarProducts } from '@/hooks/queries/useSimilarProducts';
import { SectionContainer } from '@/ui-kit/containers';
import { Box } from '@mui/material';
import { ProductGridCarousel } from '../carousel/ProductGridCarousel';

interface Props {
  productId: number;
}

export const SimilarProductList = ({ productId }: Props) => {
  const { similarProducts = [], isLoading } = useSimilarProducts(productId);

  return !isLoading && !similarProducts?.length ? null : (
    <Box
      sx={{
        mt: '96px',
      }}
    >
      <SectionContainer title="Similar Products">
        <ProductGridCarousel products={similarProducts} loading={isLoading} />
      </SectionContainer>
    </Box>
  );
};
