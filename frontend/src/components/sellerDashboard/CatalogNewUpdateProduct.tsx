import {
  Box,
  Typography,
  Tooltip,
  Grid,
  Button,
  Chip,
  Stack,
  Skeleton,
  Divider,
} from '@mui/material';
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
  useFormContext,
} from 'react-hook-form';
import Link from 'next/link';
import {
  ContainedButton,
  OutlinedButton,
  BackLinkButton,
} from '@/ui-kit/buttons';
import { Percent, Plus } from '@phosphor-icons/react';
import routes from '@/constants/routes';
import { Question } from '@phosphor-icons/react';
import { styled } from '@mui/material/styles';
import { FormInput } from '@/ui-kit/inputs';
import { MobileHeading } from '@/ui-kit/typography';
import ControlledFormInput from '../hookForm/ControlledFormInput';
import { ControlledSwitch } from '../hookForm/ControlledSwitch';
import { ControlledUpload } from '../hookForm';
import { FileRejection } from 'react-dropzone';
import { UploadFile } from '../uploaders/Upload';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DataTable } from '@/ui-kit/tables';
import { useShippingProfiles } from '@/hooks/queries/useShippingProfiles';
import { GridColDef } from '@mui/x-data-grid';
import {
  ProductShippingProfileFormValues,
  ShippingProfile,
} from '@/types/shippingProfiles';
import { redirectTo } from '@/utils/redirects';
import { usePathname, useRouter } from 'next/navigation';
import { ControlledAutocomplete } from '../hookForm/ControlledAutocomplete';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import useCategories from '@/hooks/queries/useCategories';
import dynamic from 'next/dynamic';
import { arrayToTree } from 'performant-array-to-tree';
import { Category } from '@/types/categories';
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from '@/services/API/products';
import { isNaN } from 'lodash';
import { showSuccessSnackbar } from '@/hooks/stores/useGlobalSnackbar';
import { mutate } from 'swr';
import { SELLER } from '@/constants/api';
import { SellerProduct } from '@/types/products';
import { handleAxiosError } from '@/lib/axios';
import { Country } from '@/types/countries';
import { shippingProfileFormSchema } from '@/utils/yupValidations';
import AreasDataTable from '../shippingProfileForm/AreasDataTable';
import ProcessingTimeSelector from '../shippingProfileForm/ProcessingTimeSelector';
import ShippingOriginSelector from '../shippingProfileForm/ShippingOriginSelector';
import { ProfileData } from '@/types/user';
import AssignShippingCountriesModal from '../shippingProfileForm/AssignShippingCountriesModal';
import { handleUpdateAreas } from '../shippingProfileForm/utils';
import { getCurrencySymbol } from '@/utils/currency';

const TreeSelect = dynamic(() => import('mui-tree-select'), {
  ssr: false,
  loading: () => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        height: '73px',
      }}
    >
      <Skeleton height={16} width="100%" variant="rounded" />
      <Skeleton height={49} width="100%" variant="rounded" />
    </Box>
  ),
});

const DeleteProductDialog = dynamic(() => import('./DeleteProductDialog'));

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  boxShadow:
    '0px 4px 53px rgba(0, 0, 0, 0.04), 0px 0.500862px 6.63642px rgba(0, 0, 0, 0.02)',
  marginBottom: '30px',
  borderRadius: '10px',
  padding: '24px',

  [theme.breakpoints.down('sm')]: {
    marginBottom: '16px',
  },
}));

const FlexBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginBottom: '24px',
  alignItems: 'center',
  gap: '4px',

  [theme.breakpoints.down('sm')]: {
    marginBottom: '16px',
  },
}));

const MainHeading = styled(Typography)(({ theme }) => ({
  fontStyle: 'normal',
  fontWeight: '600',
  fontSize: '24px',
  marginBottom: '32px',
  color: theme.palette.text.primary,

  [theme.breakpoints.down('sm')]: {
    fontSize: '18px',
    marginBottom: '16px',
  },
}));

const TopicText = styled(Typography)(() => ({
  fontStyle: 'normal',
  fontWeight: '600',
  fontSize: '18px',
  marginBottom: '16px',
}));

const CUSTOM_MARGIN = {
  marginBottom: {
    xs: '16px',
    md: '24px',
  },
};

const MAX_IMAGES_QUANTITY = 10;

interface CatalogNewUpdateProductProps {
  isEdit?: boolean;
  product?: SellerProduct;
  profile: ProfileData;
}

interface FormValues {
  name: string;
  description: string;
  stock: number | '';
  categoryId: number;
  shippingProfileId?: number;
  published: boolean;
  price: number | '';
  discount: number | '';
  images: UploadFile[];
  deleteImages: number[]; // used when isEdit is true
  addImages: UploadFile[]; // used when isEdit is true
  onSale: boolean;
  customShippingSettings: boolean;
  shippingProfile?: ProductShippingProfileFormValues;
  sku?: string;
  tags: string[];
}

const schema = yup.object({
  name: yup
    .string()
    .required('Please provide a name')
    .max(120, 'The name can not be longer than 120 characters'),
  description: yup.string().required('Please provide a description'),
  images: yup
    .array()
    .of(yup.mixed())
    .min(1, 'Please provide at least one image of the product')
    .required('Please provide at least one image of the product'),
  stock: yup.lazy((value) =>
    typeof value === 'number'
      ? yup
          .number()
          .min(0, 'The stock can not be negative')
          .required('Please indicate the stock')
      : yup.string().required('Please indicate the stock'),
  ),
  price: yup.lazy((value) =>
    typeof value === 'number'
      ? yup
          .number()
          .min(0, 'The price can not be negative')
          .required('Please provide a price')
      : yup.string().required('Please provide a price'),
  ),
  discount: yup.mixed().when('onSale', {
    is: (v: boolean) => v === true,
    then: () =>
      yup
        .number()
        .transform((v) => (isNaN(v) ? undefined : v))
        .required('Please provide a discount or unmark "On Sale"')
        .min(0, 'The discount can not be negative'),
  }),
  onSale: yup.boolean(),
  sku: yup.string(),
  tags: yup
    .array()
    .of(yup.string())
    .max(20, 'You can"t add more than 20 tags')
    .min(1, 'Please provide at least one tag')
    .required('Please provide at least one tag'),
  published: yup.boolean(),
  shippingProfileId: yup.number().when('customShippingSettings', {
    is: (v: boolean) => v === false,
    then: (s) =>
      s
        .min(0, 'Select a shipping profile or create a new one')
        .required('Select a shipping profile or create a new one'),
  }),
  shippingProfile: yup.object().when('customShippingSettings', {
    is: (v: boolean) => v === true,
    then: (s) => shippingProfileFormSchema(s).omit(['name', 'description']),
  }),
  customShippingSettings: yup.boolean(),
  categoryId: yup
    .number()
    .min(0, 'Please select a category')
    .required('Please select a category'),
});

class TreeNode {
  value: Category;
  categories: Category[];

  constructor(value: Category, categories: Category[]) {
    this.value = value;
    this.categories = categories;
  }

  getParent(): TreeNode | null {
    if (!this.value.parentId) {
      return null;
    }

    const category = this.categories.find((c) => c.id === this.value.parentId);

    if (!category) return null;

    return new TreeNode(category, this.categories);
  }

  getChildren(): TreeNode[] | null {
    const n = this.value;

    if (n === null)
      return this.categories.map((c) => new TreeNode(c, this.categories));
    if (n.children?.length === 0) return null;

    return n.children.map((c) => new TreeNode(c, this.categories));
  }

  toString() {
    return this.value.name;
  }
}

const defaultFormShippingAreas = [
  {
    carrier: '',
    price: 0,
    minDays: 0,
    maxDays: 0,
    everyWhere: false,
    confirmed: false,
  },
];

const CustomShippingSettingsSection = () => {
  const {
    getValues,
    setValue,
    watch,
    control,
    trigger,
    formState: { defaultValues, errors },
  } = useFormContext<FormValues>();
  const [open, setOpen] = useState(false);
  const [from, to, areas] = watch([
    'shippingProfile.minProcessingDays',
    'shippingProfile.maxProcessingDays',
    'shippingProfile.areas',
  ]);

  const onClose = useCallback(() => {
    // Clean form when close if it's not confirmed
    if (areas?.[areas.length - 1]?.confirmed === false) {
      setValue(`shippingProfile.areas`, areas.slice(0, -1));
    }
    setOpen(false);
  }, [areas, setValue]);

  const onOpen = useCallback(() => {
    const lastArea = areas[areas.length - 1];
    if (lastArea?.confirmed === true || lastArea?.id) {
      setValue(
        `shippingProfile.areas.${areas.length}`,
        defaultFormShippingAreas[0],
      );
    } else if (!areas.length) {
      setValue(
        `shippingProfile.areas.${areas.length}`,
        defaultFormShippingAreas[0],
      );
    }

    setOpen(true);
  }, [areas, setValue]);

  return (
    <Box
      sx={{
        pb: '24px',
      }}
    >
      <AssignShippingCountriesModal
        prefix="shippingProfile."
        open={open}
        onClose={onClose}
        areas={areas}
        methods={{
          setValue,
          getValues,
          watch,
          control,
          trigger,
        }}
      />
      <Divider sx={{ mb: 2 }} />
      <Box
        sx={{
          p: '0 24px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <ProcessingTimeSelector
            prefix="shippingProfile."
            setValue={setValue}
            control={control}
            minDays={from}
            maxDays={to}
            defaultMinDays={defaultValues?.shippingProfile?.minProcessingDays}
          />
          <ShippingOriginSelector prefix="shippingProfile." control={control} />
        </Box>

        <Box sx={{ mt: 2, mb: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            color={errors.shippingProfile?.areas ? 'error' : 'primary'}
            onClick={onOpen}
          >
            Assign Countries
          </Button>
        </Box>
      </Box>
      <AreasDataTable
        prefix="shippingProfile."
        setValue={setValue}
        areas={getValues('shippingProfile.areas')}
      />
    </Box>
  );
};

const CatalogNewUpdateProduct = ({
  isEdit,
  product,
  profile,
}: CatalogNewUpdateProductProps) => {
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  const currencySymbol = useMemo(() => {
    const currency = product?.currency || profile?.store?.currency;
    return currency ? getCurrencySymbol({ currency }) : undefined;
  }, [product?.currency, profile?.store?.currency]);

  const defaultValues: FormValues = useMemo(
    () => ({
      name: '',
      price: '',
      description: '',
      stock: '',
      published: false,
      discount: '',
      onSale: false,
      sku: '',
      categoryId: -1,
      shippingProfileId: -1,
      customShippingSettings: false,
      shippingProfile: {
        minProcessingDays: -1,
        maxProcessingDays: -1,
        countryId: profile?.store?.country.id ?? -1,
        areas: defaultFormShippingAreas,
      },
      tags: [],
      images: [],
      deleteImages: [],
      addImages: [],
    }),
    [profile?.store?.country.id],
  );

  const methods = useForm<FormValues>({
    defaultValues: {
      ...defaultValues,
      ...(isEdit &&
        product && {
          name: product.name,
          description: product.description,
          stock: product.stock,
          discount: product.discount ? product.discount : '',
          onSale: Boolean(product.discount),
          sku: product.sku,
          categoryId: product?.category?.id,
          shippingProfileId: product?.shippingProfile?.id,
          customShippingSettings: Boolean(
            product?.shippingProfile?.forOneProduct,
          ),
          shippingProfile: product?.shippingProfile?.forOneProduct
            ? {
                minProcessingDays: product?.shippingProfile.minProcessingDays,
                maxProcessingDays: product?.shippingProfile.maxProcessingDays,
                countryId: product?.shippingProfile.fromCountry?.id,
                areas: product?.shippingProfile.areas,
              }
            : defaultValues.shippingProfile,

          tags: product.tags,
          published: product.published,
          price: product.price,
          images: product.images.map((i) => {
            const image: UploadFile = { preview: i.url, name: i.fileName };
            return image;
          }),
        }),
    },
    resolver: yupResolver(schema),
  });

  const {
    control,
    setValue,
    setError,
    getValues,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
  } = methods;

  const pathname = usePathname();
  const { push, refresh } = useRouter();
  const { shippingProfiles = [], isLoading: isLoadingProfiles } =
    useShippingProfiles();
  const { categories = [], isLoading: isLoadingCategories } = useCategories();
  const [price, onSale, discount, profileId, customShippingSettings] = watch([
    'price',
    'onSale',
    'discount',
    'shippingProfileId',
    'customShippingSettings',
  ]);

  const isLoading = isSubmitting || isLoadingCategories || isLoadingProfiles;

  const confirmDelete = useCallback(async () => {
    if (!deleting) return;
    setIsLoadingDelete(true);

    try {
      await deleteProduct(deleting);
      setDeleting(null);
      push(routes.SELLER_DASHBOARD.PRODUCTS.LIST);
      refresh();
    } catch (error) {
      handleAxiosError(error);
    } finally {
      setIsLoadingDelete(false);
    }
  }, [deleting, push, refresh]);

  const treeCategories = useMemo(
    () => arrayToTree(categories, { dataField: null }),
    [categories],
  );

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      if (data.price == '' || data.stock === '') return;

      if (isEdit && !product) return;

      if (data.customShippingSettings === false) {
        delete data.shippingProfile;
      } else if (
        Boolean(product?.shippingProfile?.forOneProduct === false || !isEdit) &&
        data.customShippingSettings
      ) {
        delete data.shippingProfileId;
      }

      if (!isEdit) {
        await createProduct({
          name: data.name,
          tags: data.tags,
          categoryId: data.categoryId,
          description: data.description,
          sku: data.sku,
          discount: data.discount === '' || !data.onSale ? 0 : data.discount,
          images: data.images as File[],
          price: data.price,
          published: data.published,
          shippingProfileId: data.shippingProfileId,
          shippingProfile: data?.shippingProfile,
          stock: data.stock,
        });

        showSuccessSnackbar('Product created successfully');
      }

      if (isEdit && product) {
        // INFO: when updating the already added custom shipping profile
        // we don't have countryIds, causing it to send an error
        // to avoid this we set them here:
        if (
          data.shippingProfileId &&
          data.customShippingSettings &&
          data.shippingProfile?.areas
        ) {
          data.shippingProfile.areas = data.shippingProfile.areas.map((a) => {
            if (a.countryIds?.length) {
              return a;
            }

            return { ...a, countryIds: a.countries?.map((c) => c.id) || [] };
          });
        }

        await updateProduct(product.id, {
          name: data.name,
          tags: data.tags,
          categoryId: data.categoryId,
          description: data.description,
          sku: data.sku,
          discount: data.discount === '' || !data.onSale ? 0 : data.discount,
          images: data.addImages as File[],
          price: data.price,
          published: data.published,
          shippingProfileId: data.shippingProfileId,
          shippingProfile: data.shippingProfile,
          stock: data.stock,
          deleteImages: data.deleteImages,
        });

        // Due to the fact that the route to update the product doesn't update the areas
        // be will make it here
        if (
          data?.shippingProfileId &&
          data.customShippingSettings &&
          data?.shippingProfile?.areas
        ) {
          await handleUpdateAreas(
            data.shippingProfileId,
            data.shippingProfile.areas,
            product.shippingProfile?.areas ?? [],
          );
        }

        showSuccessSnackbar('Product updated successfully');
      }

      await mutate(SELLER.PRODUCTS.LIST);
      push(routes.SELLER_DASHBOARD.PRODUCTS.LIST);
      refresh();
    } catch (e) {
      handleAxiosError(e);
    }
  };

  const onDropImage = (
    acceptedFiles: File[],
    rejectedFiles: FileRejection[],
  ) => {
    const files = getValues('images');

    for (const file of Array.from(acceptedFiles)) {
      if (!file.type.includes('image')) {
        setError('images', {
          type: 'manual',
          message: 'Only images are allowed',
        });
        setValue('images', []);
        return;
      }
    }

    const newFiles: UploadFile[] = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      }),
    );

    const totalFiles = [...(files ?? []), ...newFiles] as UploadFile[];

    if (
      rejectedFiles.length > MAX_IMAGES_QUANTITY ||
      totalFiles.length > MAX_IMAGES_QUANTITY
    ) {
      return setError('images', {
        type: 'manual',
        message: `You can't upload more than ${MAX_IMAGES_QUANTITY} images`,
      });
    }

    setValue('images', totalFiles, {
      shouldValidate: true,
    });

    if (isEdit) {
      setValue('addImages', newFiles, {
        shouldValidate: true,
      });
    }
  };

  const discountedPrice = useMemo(() => {
    if (Number.isNaN(price) || price === '') {
      return 0;
    }

    if (!discount) return price;
    if (discount >= 100) return 0;
    if (discount < 0) return price;

    if (!onSale) return price;

    return (price * (100 - discount)) / 100;
  }, [price, discount, onSale]);

  const shippingColumns: GridColDef<ShippingProfile>[] = useMemo(() => {
    const columns: GridColDef<ShippingProfile>[] = [
      {
        field: 'name',
        headerName: 'Name',
        width: 70,
      },

      {
        field: 'description',
        headerName: 'Description',
        width: 95,
      },
      {
        field: 'fromCountry',
        headerName: 'Shipping from',
        align: 'center',
        description: 'Country where the items are shipped from',
        renderCell: (params) => {
          const image = params.row.fromCountry?.emoji;

          return (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
              title={params.row.fromCountry.name ?? 'Unknown'}
            >
              {image && (
                <Box role="img" component="span">
                  {image}
                </Box>
              )}
            </Box>
          );
        },
        width: 110,
      },
      {
        align: 'center',
        field: 'minProcessingDays',
        headerName: 'Processing Days',
        description: 'Time to process the items before shipping',
        width: 130,
        valueGetter: (params) => ({
          minProcessingDays: params.row.minProcessingDays,
          maxProcessingDays: params.row.maxProcessingDays,
        }),
        valueFormatter: (params) =>
          `${params.value.minProcessingDays} - ${params.value.maxProcessingDays} days`,
        sortComparator: (
          v1: { minProcessingDays: number; maxProcessingDays: number },
          v2: { minProcessingDays: number; maxProcessingDays: number },
        ) => v1.minProcessingDays - v2.minProcessingDays,
      },
      {
        width: 150,
        field: 'areas',
        headerName: 'Areas',
        headerAlign: 'center',
        align: 'center',
        description: 'Areas/countries that have custom settings',
        valueGetter: (params) =>
          params.row.areas.filter((a) => !a.everyWhere).length,
        renderCell: (params) => {
          const allCountries: Country[] = [];

          for (const area of params.row.areas) {
            if (area.countries?.length && !area.everyWhere) {
              allCountries.push(...area.countries);
            }
          }

          return (
            <Box sx={{ display: 'flex', columnGap: 0.5, flexWrap: 'wrap' }}>
              {allCountries.map(
                (country) =>
                  country?.emoji && (
                    <Tooltip
                      title={country.name}
                      key={`${country.name} - ${country.emoji}`}
                    >
                      <Box role="img" component="span">
                        {country.emoji}
                      </Box>
                    </Tooltip>
                  ),
              )}
            </Box>
          );
        },
      },
      {
        width: 180,
        align: 'center',
        field: 'everyWhere',
        headerName: 'Shipping Everywhere',
        description:
          'Indicates if it can send orders to all the available countries around the world',
        valueGetter: (params) => params.row.areas.some((a) => a.everyWhere),
        renderCell: (params) => {
          const text = params.value ? 'Yes' : 'No';

          return (
            <Box
              sx={{
                display: 'flex',
                gap: '4px',
                alignItems: 'center',
              }}
              title={text}
            >
              <Box
                component="span"
                sx={{
                  display: 'inline-block',
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: params.value
                    ? 'primary.main'
                    : 'warning.main',
                }}
              />
              <span
                style={{
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '14px',
                  lineHeight: '18px',
                }}
              >
                {text}
              </span>
            </Box>
          );
        },
      },
    ];

    return columns;
  }, []);

  useEffect(() => {
    if (errors.discount && !onSale) {
      // When the discount has some error and the onSale gets setted as false,
      // it will trigger the discount field to be validated again
      trigger('discount');
    }
  }, [trigger, errors.discount, onSale]);

  useEffect(() => {
    if (errors.shippingProfileId && customShippingSettings) {
      trigger('shippingProfileId');
    }
    if (errors.shippingProfile && !customShippingSettings) {
      trigger('shippingProfile');
    }
  }, [
    customShippingSettings,
    errors.shippingProfile,
    errors.shippingProfileId,
    trigger,
  ]);

  useEffect(() => {
    if (isEdit) {
      trigger();
    }
  }, [isEdit, trigger]);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit, (errors) => console.error(errors))}
      >
        <BackLinkButton backUrl={routes.SELLER_DASHBOARD.PRODUCTS.LIST} />
        <MobileHeading title="Catalog" />
        {isEdit && product?.name && <MainHeading>{product.name}</MainHeading>}
        <Grid
          container
          direction={{
            xs: 'column-reverse',
            lg: 'row',
          }}
          spacing={{
            sm: '16px',
            md: '16px',
            lg: '30px',
          }}
          justifyContent="space-between"
        >
          <Grid xs sm={7} lg={8} item>
            <StyledBox>
              <TopicText>Basic Information</TopicText>
              <ControlledFormInput
                id="productName"
                name="name"
                control={control}
                label="Name"
                type="text"
                multiline
                sx={CUSTOM_MARGIN}
                placeholder="Provide a descriptive name"
              />
              <ControlledFormInput
                id="description"
                control={control}
                name="description"
                label="Description"
                type="text"
                minRows={7}
                multiline={true}
                placeholder="• Description"
              />
            </StyledBox>
            <StyledBox>
              <TopicText>Media</TopicText>
              <ControlledUpload
                multiple
                control={control}
                name="images"
                description="Up to 10 images in format PNG, JPG"
                thumbnail
                onDrop={onDropImage}
                onRemove={(file) => {
                  const images = getValues('images');

                  if (isEdit) {
                    const deleteImages = getValues('deleteImages');
                    const addImages = getValues('addImages');
                    const imgToDelete = product?.images.find(
                      (i) => i.fileName === file.name,
                    );

                    if (imgToDelete) {
                      setValue('deleteImages', [
                        ...deleteImages,
                        imgToDelete.id,
                      ]);
                    }

                    if (addImages.length) {
                      setValue(
                        'addImages',
                        addImages.filter((f) => f.name !== file.name),
                      );
                    }

                    if (imgToDelete || addImages.length) {
                      setValue(
                        'images',
                        images.filter((f) => f.name !== file.name),
                      );
                    }

                    return;
                  }

                  if (images) {
                    setValue('images', images?.filter((f) => f != file) ?? []);
                  }
                }}
              />
            </StyledBox>
            <StyledBox>
              <TopicText>Pricing</TopicText>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '140px 140px', md: '1fr' },
                  direction: 'row',
                  gap: {
                    xs: '16px',
                    md: '24px',
                  },
                  ...CUSTOM_MARGIN,
                }}
              >
                <ControlledFormInput
                  type="number"
                  id="main-price"
                  control={control}
                  name="price"
                  label="Price"
                  placeholder="100.00"
                  endAdornment={currencySymbol}
                  sx={{
                    width: {
                      md: '158px',
                    },
                  }}
                  InputProps={{
                    inputProps: {
                      min: 0,
                    },
                  }}
                />
                <FlexBox
                  sx={{
                    marginBlock: 'auto',
                  }}
                >
                  <ControlledSwitch
                    control={control}
                    name="onSale"
                    label={
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        On Sale
                        <Box
                          component="span"
                          sx={{
                            display: 'flex',
                            alignItems: 'flex-end',
                            color: 'text.secondary',
                          }}
                        >
                          <Percent size={18} />
                        </Box>
                      </Box>
                    }
                  />
                </FlexBox>
              </Box>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '140px 140px', md: '158px 158px' },
                  direction: 'row',
                  gap: {
                    xs: '16px',
                    md: '24px',
                  },
                }}
              >
                <ControlledFormInput
                  id="discount"
                  label="Discount"
                  placeholder="20"
                  endAdornment={<Percent size={18} />}
                  control={control}
                  name="discount"
                  disabled={!onSale}
                  type="number"
                  InputProps={{
                    inputProps: {
                      min: 0,
                    },
                  }}
                />

                <FormInput
                  id="discount-price"
                  label="Total Price"
                  placeholder="20.00"
                  endAdornment={currencySymbol}
                  InputProps={{
                    readOnly: true,
                    inputProps: {
                      min: 0,
                    },
                  }}
                  sx={{
                    '& .MuiInputBase-root': {
                      backgroundColor: '#EAECF4',
                    },
                  }}
                  value={discountedPrice}
                />
              </Box>
            </StyledBox>
            <StyledBox
              sx={{
                paddingLeft: 0,
                paddingRight: 0,
                paddingBottom: 0,
                width: '100%',
                display: 'table',
                tableLayout: 'fixed',
              }}
            >
              <TopicText
                sx={{
                  padding: '0 24px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  rowGap: 0.5,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <span>Shipping</span>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                  component="span"
                >
                  <ControlledSwitch
                    id="shippingSettings"
                    label="Custom settings"
                    name="customShippingSettings"
                    control={control}
                  />
                </Box>

                {errors.shippingProfileId?.message && (
                  <Typography
                    color="error"
                    component="span"
                    sx={{
                      display: 'block',
                    }}
                  >
                    {errors.shippingProfileId.message}
                  </Typography>
                )}
              </TopicText>
              {!customShippingSettings && (
                <>
                  <DataTable
                    rowSelectionModel={
                      profileId && profileId > -1 ? [profileId] : []
                    }
                    onRowSelectionModelChange={(newRowSelectionModel) => {
                      const lastSelected = newRowSelectionModel.find(
                        (v) => v !== profileId,
                      );

                      // we have to check that shippingProfiles length
                      // is not 0 to avoid to set shippingProfile equal to -1 on first renders,
                      if (
                        newRowSelectionModel.length === 0 &&
                        shippingProfiles?.length
                      ) {
                        return setValue('shippingProfileId', -1, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                      }

                      if (typeof lastSelected === 'number') {
                        return setValue('shippingProfileId', lastSelected, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                      }
                    }}
                    loading={isLoadingProfiles}
                    columns={shippingColumns}
                    rows={shippingProfiles}
                    checkboxSelection
                    hideToolbar
                    hideFooter
                    autoHeight
                  />

                  <Button
                    fullWidth
                    sx={{ p: 1 }}
                    startIcon={<Plus size={18} />}
                    component={Link}
                    href={redirectTo(
                      pathname,
                      routes.SELLER_DASHBOARD.SHIPPING.METHODS.NEW,
                    )}
                  >
                    Add new
                  </Button>
                </>
              )}

              {customShippingSettings && <CustomShippingSettingsSection />}
            </StyledBox>
            <StyledBox>
              <TopicText>Inventory</TopicText>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '140px 150px', md: '158px 158px' },
                  gap: '24px',
                }}
              >
                <ControlledFormInput
                  id="stock"
                  label="Stock"
                  placeholder="Stock"
                  name="stock"
                  type="number"
                  control={control}
                  InputProps={{
                    inputProps: {
                      min: 0,
                    },
                  }}
                />
                <ControlledFormInput
                  id="sku"
                  name="sku"
                  control={control}
                  label={
                    <Box
                      sx={{
                        display: 'flex',
                        gap: '4px',
                      }}
                    >
                      <span>SKU</span>
                      <Tooltip title="Stock keeping unit">
                        <Question size={12} color="#96A2C1" />
                      </Tooltip>
                    </Box>
                  }
                  placeholder="364215376135191"
                />
              </Box>
            </StyledBox>
          </Grid>
          <Grid item xs={12} sm={5} lg={4}>
            <StyledBox
              sx={{
                position: 'sticky',
                top: 0,
              }}
            >
              <TopicText>Product Settings</TopicText>
              <Stack spacing={2}>
                <Box>
                  <ControlledSwitch
                    label="Published"
                    id="published"
                    name="published"
                    control={control}
                  />
                </Box>
                <Controller
                  name="categoryId"
                  control={control}
                  render={({
                    field: { onChange, value, ...field },
                    formState: { errors },
                  }) => {
                    const c = categories.find((c) => c.id === value);

                    const v = c
                      ? new TreeNode(
                          c as Category,
                          treeCategories as Category[],
                        )
                      : null;

                    return (
                      <TreeSelect
                        {...field}
                        getChildren={(node) => {
                          const n = node as TreeNode | null;

                          return n
                            ? n?.getChildren()
                            : treeCategories.map(
                                (c) =>
                                  new TreeNode(
                                    c as Category,
                                    treeCategories as Category[],
                                  ),
                              );
                        }}
                        getParent={(node) => {
                          const n = node as TreeNode;

                          return n.getParent();
                        }}
                        value={v}
                        onChange={(_, value) => {
                          const v = value as TreeNode;
                          onChange(v?.value.id);
                        }}
                        renderInput={(params) => (
                          <FormInput
                            {...params}
                            label="Category"
                            placeholder="Select a category"
                            errorMessage={errors.categoryId?.message}
                          />
                        )}
                      />
                    );
                  }}
                />
                <ControlledAutocomplete
                  id="tags"
                  options={[]}
                  freeSolo
                  control={control}
                  placeholder="Add tags, Ex: gaming console"
                  label="Tags"
                  name="tags"
                  helperText="Press Enter to add a tag"
                  multiple
                  renderTags={(value: string[], getTagProps) => {
                    return value.map((v, index) => (
                      // getTagProps already returns key prop
                      // eslint-disable-next-line react/jsx-key
                      <Chip
                        sx={{ borderRadius: '4px' }}
                        label={v}
                        {...getTagProps({ index })}
                      />
                    ));
                  }}
                />
              </Stack>
            </StyledBox>
          </Grid>
        </Grid>
        <StyledBox>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              flexDirection: {
                xs: 'column-reverse',
                md: 'row',
              },
              gap: '20px',
            }}
          >
            {isEdit && product?.id && (
              <ContainedButton
                size="large"
                className="w-full max-w-full bg-error-main hover:bg-error-dark sm:max-w-[120px]"
                onClick={() => setDeleting(product.id)}
              >
                Delete
              </ContainedButton>
            )}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'end',
                alignItems: 'center',
                flexDirection: {
                  xs: 'column-reverse',
                  md: 'row',
                },
                gap: '20px',
                flex: 1,
              }}
            >
              <Link
                passHref
                href={routes.SELLER_DASHBOARD.PRODUCTS.LIST}
                legacyBehavior
              >
                <OutlinedButton
                  size="large"
                  className="w-full max-w-full sm:max-w-[120px]"
                  type="submit"
                >
                  Back
                </OutlinedButton>
              </Link>
              <ContainedButton
                size="large"
                className="w-full max-w-full sm:max-w-[120px]"
                type="submit"
                loading={isLoading}
              >
                Save
              </ContainedButton>
            </Box>
          </Box>
        </StyledBox>
        {isEdit && (
          <DeleteProductDialog
            open={Boolean(deleting)}
            isLoading={isLoadingDelete}
            onClose={() => setDeleting(null)}
            confirmDelete={confirmDelete}
          />
        )}
      </form>
    </FormProvider>
  );
};

export default CatalogNewUpdateProduct;
