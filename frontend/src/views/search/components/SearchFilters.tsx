import { Fragment, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  ButtonBase,
  Divider,
  TypographyProps,
  Slider,
  Button,
  Skeleton,
} from '@mui/material';

import { CaretLeft } from '@phosphor-icons/react';
import { Category } from '@/types/categories';
import { ProductFilters } from '@/types/products';
import { SelectedFilters } from '../Search';
import { formatPrice } from '@/utils/currency';
import { useActualCurrency } from '@/hooks/stores/useUserPreferencesStore';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchFiltersProps {
  filters: ProductFilters | null;
  selectedFilters: SelectedFilters;
  onFiltersChange: (data: SelectedFilters) => void;
  categories: Category[];
  isLoading: boolean;
}

const FilterTitle = (props: TypographyProps<'h2'>) => (
  <Typography
    component="h2"
    fontSize={{
      xs: '16px',
      sm: '18px',
    }}
    fontWeight="600"
    lineHeight="24px"
    {...props}
  />
);

const PriceBox = ({ price }: { price: number }) => {
  const currency = useActualCurrency();
  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'text.secondary',
        flex: 1,
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        padding: '11px 8px',
        borderRadius: '4px',
        fontSize: '14px',
      }}
    >
      {formatPrice(price, { currency })}
    </Box>
  );
};

export const SearchFilters = ({
  filters,
  categories,
  isLoading,
  selectedFilters,
  onFiltersChange,
}: SearchFiltersProps) => {
  const [priceLimit, setPriceLimit] = useState<number[] | null>(null);
  const [minPrice, maxPrice] = useMemo(
    () => [
      priceLimit?.[0] ??
        (filters?.min_price.value
          ? Math.round(filters?.min_price.value - 1)
          : undefined) ??
        0,
      priceLimit?.[1] ??
        (filters?.max_price.value
          ? Math.round(filters?.max_price.value + 1)
          : undefined) ??
        0,
    ],
    [filters?.max_price.value, filters?.min_price.value, priceLimit],
  );
  const debouncedPriceLimit = useDebounce(priceLimit, 500);

  const [treeState, setTreeState] = useState<(Category | Category[])[]>([]);

  const onCategoryChange = (name: string | null) =>
    onFiltersChange({ category: name });

  const findChilds = (childCat: Category, catOb: Record<number, Category>) => {
    if (childCat.children && childCat.children.length > 0) {
      return childCat.children.map((item) => {
        return catOb[item.id];
      });
    }
    return [];
  };

  const findParentsAndChilds = (
    cat: Category,
    catOb: Record<number, Category>,
  ) => {
    const childs = findChilds(cat, catOb);

    const parents: Category[] = [];

    if (childs.length > 0) {
      parents.unshift(cat);

      const findParents = (child: Category) => {
        if (child.parentId) {
          const parent = catOb[child.parentId];
          parents.unshift(parent);
          findParents(parent);
        }
      };

      findParents(cat);
    }
    return {
      parents,
      childs,
    };
  };

  const [init, setInit] = useState(false);

  const categoriesObject = useMemo(() => {
    const productCategories = filters?.categories;

    // Get only categories that have products from the search
    const filteredCategories: Category[] = [];
    const parents: Category[] = [];

    categories?.forEach((c) => {
      const isInTheFilters = productCategories?.buckets.some(
        (pc) => pc.key === c.name,
      );

      if (isInTheFilters) {
        filteredCategories.push(c);
      }

      if (c.parentId === null) {
        parents.push(c);
      }
    });

    const categoriesToRender: Category[] = filteredCategories;

    const matchIndex: Category[] = [];

    // Match the the index of the filtered categories with the categories from the search
    categoriesToRender.forEach((c) => {
      const index = productCategories?.buckets.findIndex(
        (pc) => pc.key === c.name,
      );

      if (index !== undefined) {
        matchIndex[index] = c;
      }
    });

    const ob: Record<number, Category> = {};

    matchIndex.forEach((item) => {
      const childs = matchIndex.filter((fitem) => {
        return fitem.parentId === item.id;
      });
      item.children = childs;
      ob[item.id] = item;
    });
    const findCurrentCat = () => {
      if (selectedFilters.category) {
        const cat = matchIndex.find(
          (it) => it.name === selectedFilters.category,
        );
        if (cat) {
          if (cat.parentId && cat.parentId !== null) {
            const { parents, childs } =
              cat.children && cat.children.length > 0
                ? findParentsAndChilds(cat, ob)
                : findParentsAndChilds(ob[cat.parentId], ob);
            if (childs.length > 0) {
              setTreeState([...parents, childs]);
              setInit(true);
            }
          } else if (cat.parentId === null) {
            const { parents, childs } = findParentsAndChilds(cat, ob);
            if (childs.length > 0) {
              setTreeState([...parents, childs]);
            }
            setInit(true);
          }
        }
      }
    };
    if (!init && selectedFilters.category) {
      findCurrentCat();
    }

    return ob;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories, filters?.categories, selectedFilters.category]);

  const handlePriceChange = (_event: Event, newValue: number | number[]) => {
    setPriceLimit(newValue as number[]);
  };

  useEffect(() => {
    if (selectedFilters.price_min && selectedFilters.price_max) {
      setPriceLimit([selectedFilters.price_min, selectedFilters.price_max]);
    }
  }, [selectedFilters.price_min, selectedFilters.price_max]);

  useEffect(() => {
    if (!debouncedPriceLimit) return;
    onFiltersChange({
      price_min: debouncedPriceLimit[0],
      price_max: debouncedPriceLimit[1],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedPriceLimit]);

  return (
    <>
      <Stack spacing="16px" component="ul" sx={{ padding: 0, margin: 0 }}>
        <FilterTitle>Category</FilterTitle>
        {isLoading &&
          [...Array(5)].map((_, index) => (
            <Skeleton key={index} height={20} variant="rounded" />
          ))}

        {treeState.length > 0 ? (
          <>
            {treeState.map((item, index) => {
              return Array.isArray(item) ? (
                item.map((it, index) => {
                  const isChildSelected = it.name === selectedFilters.category;
                  return (
                    <Box
                      key={index}
                      sx={{
                        pl: '26px',
                      }}
                    >
                      <Button
                        sx={{
                          p: 0,
                          px: {
                            xs: '16px',
                          },
                          py: isChildSelected ? '4px' : 0,
                          backgroundColor: isChildSelected
                            ? '#DDDCFF !important'
                            : 'transparent',
                          color: 'text.primary',
                          fontWeight: '400',
                        }}
                        onClick={() => {
                          const { parents, childs } = findParentsAndChilds(
                            it,
                            categoriesObject,
                          );

                          if (childs.length > 0) {
                            setTreeState([...parents, childs]);
                          }
                          onCategoryChange(it.name);
                        }}
                      >
                        {it.name}
                      </Button>
                    </Box>
                  );
                })
              ) : (
                <Box
                  component="li"
                  key={index}
                  sx={{
                    display: 'flex',
                    color: 'primary.main',
                  }}
                >
                  <ButtonBase
                    onClick={() => {
                      if (!item.parentId) {
                        setTreeState([]);
                        onCategoryChange(null);
                        return;
                      }

                      const subParent = categoriesObject[item.parentId];
                      const { parents, childs } = findParentsAndChilds(
                        subParent,
                        categoriesObject,
                      );

                      if (childs.length > 0) {
                        setTreeState([...parents, childs]);
                      }

                      onCategoryChange(subParent.name);
                    }}
                    sx={{
                      px: 0,
                      gap: '8px',
                    }}
                  >
                    <CaretLeft size={18} />
                    <Typography
                      sx={{
                        lineHeight: '18px',
                        fontSize: {
                          xs: '14px',
                          sm: '16px',
                        },
                        fontWeight: 400,
                      }}
                      color="text.primary"
                      component="span"
                    >
                      {item.name}
                    </Typography>
                  </ButtonBase>
                </Box>
              );
            })}
          </>
        ) : (
          Object.values(categoriesObject)
            .filter((it) => it.parentId === null)
            .map((value) => {
              return (
                <Fragment key={value.id}>
                  <Box
                    sx={{
                      display: 'flex',
                      color: 'primary.main',
                    }}
                    component="li"
                  >
                    <ButtonBase
                      onClick={() => {
                        const { parents, childs } = findParentsAndChilds(
                          value,
                          categoriesObject,
                        );

                        if (childs.length > 0) {
                          setTreeState([...parents, childs]);
                        }
                        onCategoryChange(value.name);
                      }}
                      sx={{
                        px: 0,
                        gap: '8px',
                      }}
                    >
                      {treeState.length !== 0 && <CaretLeft size={18} />}
                      <Typography
                        sx={{
                          lineHeight: '18px',
                          fontSize: {
                            xs: '14px',
                            sm: '16px',
                          },
                          fontWeight: 400,
                        }}
                        color="text.primary"
                        component="span"
                      >
                        {value.name}
                      </Typography>
                    </ButtonBase>
                  </Box>
                </Fragment>
              );
            })
        )}
      </Stack>
      <Divider
        sx={{
          my: '24px',
        }}
      />
      <Stack
        spacing="16px"
        component="ul"
        sx={{ padding: 0, margin: 0, mt: '16px' }}
      >
        <FilterTitle>Price</FilterTitle>
        <Stack spacing="16px">
          <Box
            sx={{
              padding: isLoading ? '0' : '0 10px',
            }}
          >
            {isLoading ? (
              <Skeleton variant="rounded" height={30} />
            ) : (
              <Slider
                value={priceLimit ?? [minPrice, maxPrice]}
                onChange={handlePriceChange}
                min={Math.round(
                  filters?.min_price?.value ? filters?.min_price?.value - 1 : 0,
                )}
                // + 1 To make sure that it returns values even if price is with decimals
                max={Math.round(
                  filters?.max_price?.value
                    ? filters?.max_price?.value + 1
                    : 100,
                )}
              />
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: '16px' }}>
            {isLoading ? (
              <>
                <Skeleton width="100%">
                  <PriceBox price={minPrice} />
                </Skeleton>

                <Skeleton width="100%">
                  <PriceBox price={maxPrice} />
                </Skeleton>
              </>
            ) : (
              <>
                <PriceBox price={minPrice} />
                <PriceBox price={maxPrice} />
              </>
            )}
          </Box>
        </Stack>
      </Stack>
      <Divider
        sx={{
          my: '24px',
        }}
      />
    </>
  );
};
