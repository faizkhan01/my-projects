import React from 'react';
import {
  Drawer,
  List as MuiList,
  ButtonBase,
  Toolbar,
  ListItem as MuiListItem,
  ListProps,
  ListItemProps,
  ListItemText,
  ListItemButton,
} from '@mui/material';
import { Category } from '@/types/categories';
import { ArrowLeft, CaretDown } from '@phosphor-icons/react';
import Link from 'next/link';
import routes from '@/constants/routes';
import { Accordion } from '@/ui-kit/accordions';

interface SubcategoryDrawerProps {
  isOpen: boolean;
  subcategories: Category[];
  onClose: () => void;
}

const List = (props: ListProps) => <MuiList disablePadding {...props} />;
const ListItem = (props: ListItemProps) => (
  <MuiListItem disablePadding {...props} />
);

// The categories without children will go last place
const sortByChildren = (a: Category, b: Category) => {
  if (a.children.length && !b.children.length) {
    return -1;
  } else {
    return 1;
  }
};

const SubcategoryDrawer: React.FC<SubcategoryDrawerProps> = ({
  isOpen,
  subcategories,
  onClose,
}) => {
  const sorted = subcategories.sort(sortByChildren);
  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      hideBackdrop
      sx={{
        '& > .MuiPaper-root ': {
          width: '100%',
          padding: '0 16px',
        },
      }}
    >
      <Toolbar />
      <ButtonBase
        onClick={onClose}
        sx={{
          gap: '8px',
          justifyContent: 'flex-start',
          fontSize: '16px',
          m: '24px 0',
          fontWeight: 600,
        }}
        focusRipple
      >
        <ArrowLeft size={14} />
        Catalog
      </ButtonBase>
      <Accordion type="single">
        <List
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
        >
          {sorted.map((subcategory) => (
            <ListItem
              key={subcategory.name}
              sx={{
                display: 'block',
              }}
            >
              {subcategory?.children.length ? (
                <Accordion.Item value={subcategory.name}>
                  <Accordion.Summary
                    expandIcon={<CaretDown size={14} />}
                    expandRotation="right-to-down"
                  >
                    {subcategory.name}
                  </Accordion.Summary>
                  <Accordion.Details>
                    <List
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      {subcategory.children.map((child) => (
                        <ListItem key={child.id}>
                          <ListItemButton
                            component={Link}
                            sx={{ px: 0 }}
                            href={routes.CATEGORIES.INFO(child.name)}
                          >
                            <ListItemText
                              sx={{
                                margin: 0,
                                fontSize: '16px',
                              }}
                              primary={child.name}
                              disableTypography
                            />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </Accordion.Details>
                </Accordion.Item>
              ) : (
                <ListItemButton
                  sx={{ px: 0 }}
                  component={Link}
                  href={routes.CATEGORIES.INFO(subcategory.name)}
                >
                  <ListItemText
                    sx={{
                      fontWeight: 600,
                      margin: 0,

                      fontSize: '16px',
                    }}
                    primary={subcategory.name}
                    disableTypography
                  />
                </ListItemButton>
              )}
            </ListItem>
          ))}
        </List>
      </Accordion>
    </Drawer>
  );
};

export default SubcategoryDrawer;
