import HelpSection from './components/HelpSection';
import { Typography } from '@mui/material';
import routes from '@/constants/routes';
import type { HelpTopic } from '@/types/help';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { CustomContainer } from '@/ui-kit/containers';
import { BackLinkButton } from '@/ui-kit/buttons';
import { MobileHeading } from '@/ui-kit/typography';
import { SearchInput } from '@/ui-kit/inputs';
import { Breadcrumbs } from '@/ui-kit/breadcrumbs';
import { stringify } from 'querystring';

interface HelpProps {
  topics: HelpTopic[];
}

interface SearchForm {
  search: string;
}

const Help = ({ topics }: HelpProps): JSX.Element => {
  const { control, handleSubmit } = useForm<SearchForm>();
  const pathname = usePathname();
  const query = useSearchParams();
  const q = query.get('q');
  const { push } = useRouter();

  const onSearch: SubmitHandler<SearchForm> = (data) => {
    const { search } = data;
    push(
      `${pathname}?${stringify({
        q: search,
      })}`,
    );
  };

  return (
    <CustomContainer>
      <BackLinkButton />
      <MobileHeading title="Help Center" />
      <Breadcrumbs
        sx={{
          marginTop: '20px',
          display: { md: 'block', xs: 'none' },
        }}
        links={[
          {
            name: 'Account',
            href: routes.DASHBOARD.INDEX,
          },
          {
            name: 'Help Center',
          },
        ]}
      />
      <Typography
        sx={{
          marginTop: '40px',
          display: { md: 'block', xs: 'none' },
        }}
        fontWeight={600}
        fontSize={40}
        component="h1"
      >
        Help Center
      </Typography>
      <form onSubmit={handleSubmit(onSearch)}>
        <Controller
          name="search"
          control={control}
          render={({ field }) => (
            <SearchInput
              sx={{
                maxWidth: {
                  xs: '100%',
                  sm: '570px',
                },
                margin: '40px 0',
                '& > button': {
                  minWidth: '110px',
                  height: '40px',
                },
              }}
              placeholder="Search for questions..."
              label="Search for questions..."
              {...field}
            />
          )}
        />
      </form>

      <HelpSection
        topics={topics}
        search={typeof q === 'string' ? q : undefined}
      />
    </CustomContainer>
  );
};

export default Help;
