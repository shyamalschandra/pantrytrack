'use client';

import React, { useState } from 'react';
import AddItemForm from './AddItemForm';
import { TextField, Button, Box, List, ListItem, ListItemText, ListItemSecondaryAction } from '@mui/material';

const ParentComponent = () => {
  const [items, setItems] = useState([]);
  const [itemToUpdate, setItemToUpdate] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddItem = (item) => {
    setItems((prevItems) => [...prevItems, item]);
  };

  const handleUpdateItem = (updatedItem) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.name === itemToUpdate.name ? updatedItem : item
      )
    );
    setIsUpdating(false);
    setItemToUpdate(null);
  };

  const handleEditClick = (item) => {
    setItemToUpdate(item);
    setIsUpdating(true);
  };

  const handleDeleteClick = (itemToDelete) => {
    setItems((prevItems) => prevItems.filter(item => item.name !== itemToDelete.name));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', padding: 2 }}>
      <AddItemForm
        onAddItem={handleAddItem}
        itemToUpdate={itemToUpdate}
        isUpdating={isUpdating}
        onUpdateItem={handleUpdateItem}
      />
      <TextField
        label="Search Items"
        value={searchQuery}
        onChange={handleSearchChange}
        variant="outlined"
        size="small"
        fullWidth
        sx={{ mt: 2, mb: 2 }}
      />
      <List>
        {filteredItems.map((item, index) => (
          <ListItem key={index} divider>
            <ListItemText primary={`${item.name} - ${item.quantity}`} />
            <ListItemSecondaryAction>
              <Button onClick={() => handleEditClick(item)} variant="contained" color="secondary" size="small" sx={{ mr: 1 }}>
                Edit
              </Button>
              <Button onClick={() => handleDeleteClick(item)} variant="contained" color="error" size="small">
                Delete
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ParentComponent;