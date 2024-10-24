import Image from 'next/image';
import { Typography, Grid, Tooltip } from '@mui/material';
import { CustomContainer } from '@/ui-kit/containers';
import type { Store } from '@/types/stores';
import { StoreProducts } from './_components/StoreProducts';

import {
  CustomDesktopSealCheck,
  CustomMobileSealCheck,
} from '@/components/stores/CustomSealCheck';
import StoreFollowButton from './_components/StoreFollowButton';
import StoreReportContactButtons from './_components/StoreReportContactButtons';

const StoreInfoPage = ({ store }: { store: Store }): JSX.Element => {
  const hasBanner = !!store.banner?.url;

  return (
    <div>
      {hasBanner && (
        <div className="relative h-[120px] w-full sm:h-[170px]">
          <Image
            src={store.banner!.url}
            fill
            alt={store.name}
            className="object-cover"
            priority
          />
        </div>
      )}
      <div className="bg-[#F6F9FF] pb-8 pt-4 sm:pb-[30px] sm:pt-[30px]">
        <CustomContainer>
          <Grid
            container
            columnSpacing={{
              xs: '12px',
              md: '32px',
            }}
            rowSpacing={{
              xs: '12px',
              sm: '0',
            }}
          >
            {store.logo?.url && (
              <Grid item xs="auto">
                <div
                  className={`relative h-[90px] w-[90px] sm:h-[180px] sm:w-[180px] ${
                    hasBanner ? '-mt-[50px] sm:-mt-[100px]' : ''
                  }`}
                >
                  <Image
                    src={store.logo.url}
                    fill
                    alt={store.name}
                    className="rounded-[6px] object-cover"
                    priority
                  />
                </div>
              </Grid>
            )}
            <Grid item xs alignItems="center">
              <div>
                <div
                  className={`flex h-full flex-col items-start ${
                    hasBanner ? 'justify-between' : 'justify-end'
                  } sm:h-auto sm:justify-start`}
                >
                  <div className="flex items-center gap-2">
                    <Typography
                      className="text-center text-sm font-semibold sm:text-[40px]/[40px]"
                      component="h3"
                    >
                      {store.name}
                    </Typography>
                    {store.verified && (
                      <>
                        <Tooltip title="This store has been verified by our team.">
                          <div className="text-primary-main">
                            <div className="sm:hidden">
                              <CustomMobileSealCheck />
                            </div>
                            <div className="hidden sm:block">
                              <CustomDesktopSealCheck />
                            </div>
                          </div>
                        </Tooltip>
                      </>
                    )}
                  </div>
                  <StoreReportContactButtons store={store} />
                </div>
              </div>
            </Grid>

            <Grid
              item
              className={`flex  ${hasBanner ? 'items-start' : 'items-center'} `}
              xs={12}
              sm="auto"
            >
              <StoreFollowButton store={store} />
            </Grid>
          </Grid>
        </CustomContainer>
      </div>
      <CustomContainer>
        <div className="mb-6 mt-12">
          <StoreProducts storeSlug={store.slug} storeName={store.name} />
        </div>
      </CustomContainer>
    </div>
  );
};

export default StoreInfoPage;
