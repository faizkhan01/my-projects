import React, { memo, useMemo } from 'react';
import { styled } from '@mui/material/styles';
import { List, ListItem, ListItemButton } from '@mui/material';
import { CustomContainer } from '@/ui-kit/containers';
import useCategories from '@/hooks/queries/useCategories';
import Link from 'next/link';
import routes from '@/constants/routes';

const StyledList = styled(List)(() => ({
  fontSize: '14px',
  display: 'flex',
  width: '100%',
  padding: '0',
  height: '40px',

  '& > li:last-of-type': {
    paddingRight: '0',
  },
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  fontSize: '14px',
  height: '100%',
  color: theme.palette.text.primary,
  width: 'auto',
  cursor: 'pointer',
  display: 'inline-flex',
  textAlign: 'center',
  flex: 1,
}));

const SecondaryNavbar = memo(function SecondaryNavbar() {
  const { categories = [] } = useCategories();

  const filteredCategories = useMemo(
    () => categories.filter((c) => typeof c.parentId !== 'number'),
    [categories],
  );

  return (
    <div className="bg-white">
      <CustomContainer>
        <nav className="flex items-center justify-between bg-white">
          <StyledList>
            {filteredCategories.map((category) => (
              <StyledListItem
                key={`${category.name}-secondary-navbar`}
                disablePadding
              >
                <ListItemButton
                  component={Link}
                  href={routes.CATALOG.INFO(category.slug, category.id)}
                  className="h-full justify-center  p-0"
                  disableTouchRipple
                >
                  {category.name}
                </ListItemButton>
              </StyledListItem>
            ))}
          </StyledList>
        </nav>
      </CustomContainer>
    </div>
  );
});

export default SecondaryNavbar;
