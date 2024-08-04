import React from 'react';
import { Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';

const CategorySelect = ({ value, onChange, categories }: {
  value: string;
  onChange: (event: SelectChangeEvent<string>) => void;
  categories: string[];
}) => {
  return (
    <FormControl>
      <InputLabel>Category</InputLabel>
      <Select value={value} onChange={onChange}>
        {categories.map((category) => (
          <MenuItem key={category} value={category}>
            {category}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CategorySelect;