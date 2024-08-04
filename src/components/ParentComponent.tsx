'use client';

import React, { useState, ChangeEvent } from 'react';
import AddItemForm from './AddItemForm';
import { TextField, Button, Box, List, ListItem, ListItemText, ListItemSecondaryAction } from '@mui/material';

interface Item {
  id: string;
  name: string;
  quantity: number;
  image?: string;
}

const ParentComponent: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [itemToUpdate, setItemToUpdate] = useState<Item | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddItem = (item: Item) => {
    setItems((prevItems) => [...prevItems, item]);
  };

  const handleUpdateItem = (updatedItem: Item) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemToUpdate?.id ? updatedItem : item
      )
    );
    setIsUpdating(false);
    setItemToUpdate(null);
  };

  const handleEditClick = (item: Item) => {
    setItemToUpdate(item);
    setIsUpdating(true);
  };

  const handleDeleteClick = (itemToDelete: Item) => {
    setItems((prevItems) => prevItems.filter(item => item.id !== itemToDelete.id));
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
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
        {filteredItems.map((item) => (
          <ListItem key={item.id} divider>
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