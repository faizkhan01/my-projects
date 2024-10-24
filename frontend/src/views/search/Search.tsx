'use client';
import React, { useState } from 'react';
import {
  Typography,
  Grid,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Slider,
  Box,
} from '@mui/material';

const categories = ['Beachwear', 'Coats', 'Denim', 'Dresses', 'Jackets'];

const brands = ['A BATHING', 'APE', 'A.P.C', 'AC9', 'ALEMAIS'];

const sizes = ['One Size', 'XL', 'L', 'M', 'S', 'XS'];

const colors = ['Black', 'Silver', 'Gray', 'White', 'Blue'];

const products = [
  {
    id: 1,
    name: 'Product 1',
    category: 'Beachwear',
    price: 80,
    onSale: true,
    freeShipping: true,
    brand: 'A BATHING',
    size: 'XL',
    color: 'Black',
  },
  {
    id: 2,
    name: 'Product 2',
    category: 'Coats',
    price: 120,
    onSale: false,
    freeShipping: true,
    brand: 'APE',
    size: 'L',
    color: 'Blue',
  },
];

const Search: React.FC = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
  const [brandFilters, setBrandFilters] = useState<string[]>([]);
  const [sizeFilters, setSizeFilters] = useState<string[]>([]);
  const [colorFilters, setColorFilters] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(200);
  const [onSaleFilter, setOnSaleFilter] = useState<boolean>(false);
  const [freeShippingFilter, setFreeShippingFilter] = useState<boolean>(false);

  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  const handleSearch = () => {
    const filteredProducts = products.filter((product) => {
      const searchTermMatch =
        searchTerm === '' ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const categoryMatch =
        categoryFilters.length === 0 ||
        categoryFilters.includes(product.category);
      const brandMatch =
        brandFilters.length === 0 || brandFilters.includes(product.brand);
      const sizeMatch =
        sizeFilters.length === 0 || sizeFilters.includes(product.size);
      const colorMatch =
        colorFilters.length === 0 || colorFilters.includes(product.color);
      const priceMatch = product.price >= minPrice && product.price <= maxPrice;
      const onSaleMatch = !onSaleFilter || product.onSale;
      const freeShippingMatch = !freeShippingFilter || product.freeShipping;

      return (
        searchTermMatch &&
        categoryMatch &&
        brandMatch &&
        sizeMatch &&
        colorMatch &&
        priceMatch &&
        onSaleMatch &&
        freeShippingMatch
      );
    });

    // console.log(filteredProducts);
  };

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Typography variant="h4">Search Products</Typography>
          <TextField
            label="Search"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button onClick={toggleDrawer}>Product Filters</Button>
        </Grid>
        <Grid item xs={12} sm={6} md={8} lg={9}>
          <h1>Products</h1>
        </Grid>
      </Grid>
      <Drawer anchor="left" open={openDrawer} onClose={toggleDrawer}>
        <List>
          <ListItem>
            <ListItemText primary="All Filters" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Filter: Sale" />
            <FormControlLabel
              control={
                <Checkbox
                  checked={onSaleFilter}
                  onChange={() => setOnSaleFilter(!onSaleFilter)}
                />
              }
              label="On Sale"
            />
          </ListItem>
          <ListItem>
            <ListItemText primary="Filter: Shipping" />
            <FormControlLabel
              control={
                <Checkbox
                  checked={freeShippingFilter}
                  onChange={() => setFreeShippingFilter(!freeShippingFilter)}
                />
              }
              label="Free Shipping"
            />
          </ListItem>
          <ListItem>
            <ListItemText primary="Filter: Category" />
            <TextField
              label="Search category"
              variant="outlined"
              onChange={(e) => setCategoryFilters([e.target.value])}
            />
            {categories.map((category) => (
              <FormControlLabel
                key={category}
                control={
                  <Checkbox
                    checked={categoryFilters.includes(category)}
                    onChange={() =>
                      setCategoryFilters((prev) =>
                        prev.includes(category)
                          ? prev.filter((c) => c !== category)
                          : [...prev, category],
                      )
                    }
                  />
                }
                label={category}
              />
            ))}
            <Typography variant="body2" color="primary">
              Show more
            </Typography>
          </ListItem>
          <ListItem>
            <ListItemText primary="Filter: Brand" />
            <TextField
              label="Search brand"
              variant="outlined"
              onChange={(e) => setBrandFilters([e.target.value])}
            />
            {brands.map((brand) => (
              <FormControlLabel
                key={brand}
                control={
                  <Checkbox
                    checked={brandFilters.includes(brand)}
                    onChange={() =>
                      setBrandFilters((prev) =>
                        prev.includes(brand)
                          ? prev.filter((b) => b !== brand)
                          : [...prev, brand],
                      )
                    }
                  />
                }
                label={brand}
              />
            ))}
            <Typography variant="body2" color="primary">
              Show more
            </Typography>
          </ListItem>
          <ListItem>
            <ListItemText primary="Filter: Size" />
            <Box display="flex">
              {sizes.map((size) => (
                <Box key={size} flexGrow={1}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={sizeFilters.includes(size)}
                        onChange={() =>
                          setSizeFilters((prev) =>
                            prev.includes(size)
                              ? prev.filter((s) => s !== size)
                              : [...prev, size],
                          )
                        }
                      />
                    }
                    label={size}
                  />
                </Box>
              ))}
            </Box>
          </ListItem>
          <ListItem>
            <ListItemText primary="Filter: Color" />
            <Box display="flex">
              {colors.map((color) => (
                <Box key={color} flexGrow={1}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={colorFilters.includes(color)}
                        onChange={() =>
                          setColorFilters((prev) =>
                            prev.includes(color)
                              ? prev.filter((c) => c !== color)
                              : [...prev, color],
                          )
                        }
                      />
                    }
                    label={
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div
                          style={{
                            backgroundColor: color,
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            marginRight: '8px',
                          }}
                        ></div>
                        {color}
                      </div>
                    }
                  />
                </Box>
              ))}
            </Box>
            <Typography variant="body2" color="primary">
              Show more
            </Typography>
          </ListItem>
          <ListItem>
            <ListItemText primary="Filter: Price" />
            <Slider
              value={[minPrice, maxPrice]}
              onChange={(_, newValue) => {
                setMinPrice(newValue[0]);
                setMaxPrice(newValue[1]);
              }}
              valueLabelDisplay="auto"
              min={0}
              max={200}
            />
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2">{`Min Price: $${minPrice}`}</Typography>
              <Typography variant="body2">{`Max Price: $${maxPrice}`}</Typography>
            </Box>
          </ListItem>
          <ListItem>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSearch}
            >
              Show Results
            </Button>
          </ListItem>
          <ListItem>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => {
                setSearchTerm('');
                setCategoryFilters([]);
                setBrandFilters([]);
                setSizeFilters([]);
                setColorFilters([]);
                setMinPrice(0);
                setMaxPrice(200);
                setOnSaleFilter(false); // Clear onSaleFilter
                setFreeShippingFilter(false); // Clear freeShippingFilter
                handleSearch();
              }}
            >
              Clear All Filters
            </Button>
          </ListItem>
        </List>
      </Drawer>
    </Container>
  );
};

export default Search;
