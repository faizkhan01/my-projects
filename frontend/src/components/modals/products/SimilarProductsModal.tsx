import { Grid, Skeleton } from '@mui/material';
import { useSimilarProducts } from '@/hooks/queries/useSimilarProducts';
import { ModalContainer, ModalCardContainer } from '@/ui-kit/containers';
import ProductCard from '@/components/productCard/ProductCard';
import useCart from '@/hooks/queries/customer/useCart';
import useWishlist from '@/hooks/queries/customer/useWishlist';
import { isProductFreeShipping } from '@/utils/products';
import { useUserPreferencesStore } from '@/hooks/stores/useUserPreferencesStore';
import { useCurrencyConverter } from '@/hooks/stores/useCurrencyConverterStore';

interface SimilarProductsModalProps {
  productId: number;
  open: boolean;
  onClose: () => void;
}

const SimilarProductsModal = ({
  productId,
  open,
  onClose,
}: SimilarProductsModalProps) => {
  const { similarProducts = [], isLoading } = useSimilarProducts(productId);
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const shippingCountry = useUserPreferencesStore(
    (state) => state.shippingCountry,
  );
  const currency = useUserPreferencesStore((state) => state.currency);
  const converter = useCurrencyConverter();

  return (
    <ModalContainer open={open} onClose={onClose}>
      <ModalCardContainer title="Similar Products">
        <Grid spacing="20px" container sx={{ py: 1 }}>
          {similarProducts.map((product) => (
            <Grid item key={`${product.id}-similars-${productId}`} xs={6}>
              <ProductCard
                isCart={Boolean(cart[product.id])}
                isWish={Boolean(wishlist[product.id])}
                product={product}
                isFreeShipping={isProductFreeShipping(shippingCountry, product)}
                currency={currency ?? 'USD'}
                exchangeRate={converter(1, {
                  from: product.currency,
                  to: currency,
                })}
              />
            </Grid>
          ))}
          {isLoading &&
            new Array(5).fill(0).map((_, index) => (
              <Grid key={`${index}-similars-${productId}`} item xs={6}>
                <Skeleton variant="rounded" height={400} width={300} />
              </Grid>
            ))}
        </Grid>
      </ModalCardContainer>
    </ModalContainer>
  );
};

export default SimilarProductsModal;
