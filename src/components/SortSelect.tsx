import React from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const SortSelect = ({ value, onChange }) => {
  return (
    <FormControl>
      <InputLabel>Sort By</InputLabel>
      <Select value={value} onChange={onChange}>
        <MenuItem value="name">Name</MenuItem>
        <MenuItem value="quantity">Quantity</MenuItem>
        {/* Add more sort options as needed */}
      </Select>
    </FormControl>
  );
};

export default SortSelect;