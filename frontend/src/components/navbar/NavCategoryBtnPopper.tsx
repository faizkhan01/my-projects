import {
  Box,
  List,
  ListItemButton,
  InputAdornment,
  Typography,
} from '@mui/material';
import { Popper } from '@/ui-kit/tooltips';
import { CustomContainer } from '@/ui-kit/containers';
import type { Category } from '@/types/categories';
import { useState, useMemo } from 'react';
import usePopper from '@/hooks/usePopper';
import { FormControl, InputBase } from '@mui/material';
import { styled } from '@mui/material/styles';
import { CaretDown, MagnifyingGlass } from '@phosphor-icons/react';
import { arrayToTree } from 'performant-array-to-tree';
import { useNavigationEvent } from '@/hooks/useNavigationEvent';
import { Accordion } from '@/ui-kit/accordions';

const StyledControl = styled(FormControl)(({ theme }) => ({
  height: '44px',
  display: 'flex',
  flexDirection: 'row',
  borderRadius: '4px',
  backgroundColor: theme.palette.grey[50],
  width: '343px',
}));

const StyledInput = styled(InputBase)(({ theme }) => ({
  border: 'none',
  outline: 'none',
  width: '100%',
  fontSize: 16,
  paddingLeft: '12px',
  lineHeight: 1.125,
  color: theme.palette.text.primary,

  // Deletes the X icon on Chrome browsers
  '& ::-webkit-search-decoration, & ::-webkit-search-cancel-button, & ::-webkit-search-results-button, & ::-webkit-search-results-decoration':
    {
      WebkitAppearance: 'none',
    },
}));

const NavCategoryBtnPopper = ({
  id: popperId,
  anchorEl,
  open: isOpenPopper,
  handleClickAway,
  handleClose,
  categories,
  onSelectCategory,
}: {
  categories: Category[];
  onSelectCategory: (category: Category | null) => void;
} & Pick<
  ReturnType<typeof usePopper>,
  'anchorEl' | 'open' | 'id' | 'handleClickAway' | 'handleClose'
>) => {
  const [activeCatagory, setActiveCatagory] = useState<Category['id'] | null>(
    null,
  );
  const treeCategories = useMemo(() => {
    return arrayToTree(categories, {
      dataField: null,
    }) as Category[];
  }, [categories]);

  const handleHover = (id: number) => {
    setActiveCatagory(id);
  };

  const [searchQuery, setSearchQuery] = useState('');

  const handlePopperClose = () => {
    handleClickAway();
  };

  const Category = ({
    category,
    searchQuery,
  }: {
    category: Category;
    searchQuery: string;
  }) => {
    const filteredChildren = category.children.filter(
      (child: { name: string }) => {
        return child.name.toLowerCase().startsWith(searchQuery.toLowerCase());
      },
    );

    return (
      <Box>
        {searchQuery &&
          filteredChildren.map((child) => (
            <Box
              onMouseEnter={() => handleHover(child.id)}
              onClick={() => {
                onSelectCategory(child);
                handlePopperClose();
                setSearchQuery('');
              }}
              key={child.id}
              sx={{
                minHeight: '48px',
                borderBottom: '1px solid #EAECF4',
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                background: activeCatagory === child.id ? '#FCFDFF' : undefined,
              }}
            >
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: '600',
                  lineHeight: '16px',
                  color: '#333E5C',
                }}
              >
                {child.name}
              </Typography>
            </Box>
          ))}
      </Box>
    );
  };

  useNavigationEvent(() => {
    handleClose();
  });

  return (
    <Popper
      anchorEl={anchorEl}
      id={popperId}
      open={isOpenPopper}
      disablePortal
      sx={{
        zIndex: '100',

        '& > div': {
          boxShadow: 'none',
          backgroundColor: 'transparent',
          padding: '0',
        },
      }}
      onClickAway={() => handlePopperClose()}
      modifiers={[
        {
          name: 'offset',
          options: {
            offset: [0, 16],
          },
        },
      ]}
    >
      <CustomContainer>
        <Box
          sx={{
            background: 'white',
            color: 'black',
            padding: '20px',
            borderRadius: '8px',
            boxShadow:
              '0px 4px 103px rgba(0, 0, 0, 0.02), 0px 1.46007px 37.5967px rgba(0, 0, 0, 0.0137996), 0px 0.708835px 18.2525px rgba(0, 0, 0, 0.0111258), 0px 0.347484px 8.94771px rgba(0, 0, 0, 0.00887419), 0px 0.137396px 3.53794px rgba(0, 0, 0, 0.00620037)',
          }}
        >
          <StyledControl>
            <StyledInput
              placeholder="Enter category"
              onInput={(e) => {
                setSearchQuery((e.target as HTMLInputElement).value);
              }}
              startAdornment={
                <InputAdornment position="start">
                  <MagnifyingGlass size={20} color="#C5CCDE" />
                </InputAdornment>
              }
            />
          </StyledControl>
          <List sx={{ paddingTop: '20px', paddingBottom: '0' }}>
            {searchQuery &&
              treeCategories.map((category) => (
                <Category
                  key={category.id}
                  category={category}
                  searchQuery={searchQuery}
                />
              ))}
            {!searchQuery && (
              <Box
                sx={{
                  minHeight: '48px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Typography
                  onClick={() => {
                    onSelectCategory({
                      children: [],
                      id: 0,
                      name: 'All categories',
                      parentId: 0,
                      slug: 'all-categories',
                    });
                    handleClickAway();
                  }}
                  sx={{
                    fontSize: '14px',
                    fontWeight: '600',
                    lineHeight: '16px',
                    color: '#333E5C',
                    cursor: 'pointer',
                  }}
                >
                  All Categories
                </Typography>
              </Box>
            )}
            {!searchQuery && (
              <Accordion type="single">
                {treeCategories?.map((category, index) =>
                  category.children.length == 0 ? (
                    <Box
                      key={index}
                      sx={{
                        minHeight: '48px',
                        borderTop: '1px solid #EAECF4',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Typography
                        onClick={() => {
                          onSelectCategory(category);
                          handleClickAway();
                        }}
                        sx={{
                          fontSize: '14px',
                          fontWeight: '600',
                          lineHeight: '16px',
                          color: '#333E5C',
                          cursor: 'pointer',
                        }}
                      >
                        {category.name}
                      </Typography>
                    </Box>
                  ) : (
                    <Accordion.Item key={index} value={category.id?.toString()}>
                      <Accordion.Summary
                        expandIcon={<CaretDown size={16} color="#96A2C1" />}
                        aria-controls={`panel${index}a-content`}
                        id={`panel${index}a-header`}
                      >
                        <Typography
                          onClick={() => {
                            onSelectCategory(category);
                            handlePopperClose();
                          }}
                          sx={{
                            fontSize: '14px',
                            fontWeight: '600',
                            lineHeight: '16px',
                          }}
                        >
                          {category.name}
                        </Typography>
                      </Accordion.Summary>
                      <Accordion.Details>
                        {category?.children?.map((item) => (
                          <ListItemButton
                            key={item?.name}
                            onClick={() => {
                              onSelectCategory(item);
                              handlePopperClose();
                            }}
                            sx={{
                              p: 0,
                              height: '48px',
                              fontSize: '12px',
                              lineHeight: '16px',
                              fontWeight: '500',
                              color: '#333E5C',
                              borderTop: '1px solid #EAECF4',
                            }}
                          >
                            {item?.name}
                          </ListItemButton>
                        ))}
                      </Accordion.Details>
                    </Accordion.Item>
                  ),
                )}
              </Accordion>
            )}
          </List>
        </Box>
      </CustomContainer>
    </Popper>
  );
};

export default NavCategoryBtnPopper;
