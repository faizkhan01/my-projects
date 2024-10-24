'use client';

import routes from '@/constants/routes';
import { ContainedButton } from '@/ui-kit/buttons';
import { SearchInput } from '@/ui-kit/inputs';
import { useRouter } from 'next/navigation';

const NotFoundSearchBar = () => {
  const { push } = useRouter();
  return (
    <form
      className="flex w-full max-w-[770px] flex-col gap-2 sm:flex-row sm:gap-0 md:h-[54px]"
      onSubmit={(e) => {
        e.preventDefault();
        const search = e.currentTarget.search.value;
        push(
          routes.SEARCH.INDEX({
            q: search,
          }),
        );
      }}
    >
      <SearchInput
        className="h-full max-h-none min-h-0 overflow-hidden rounded-[4px] bg-[#403ADC]"
        InputProps={{
          name: 'search',
          slotProps: {
            root: {
              className: 'text-white',
            },
          },
        }}
        hideSearchButton
        label="Search on Only Latest"
        placeholder="Search on Only Latest"
      />
      <ContainedButton
        className="h-full w-full bg-white py-[18px] text-primary-main hover:bg-white hover:text-primary-dark sm:max-w-[170px]"
        type="submit"
      >
        Search
      </ContainedButton>
    </form>
  );
};

export default NotFoundSearchBar;
