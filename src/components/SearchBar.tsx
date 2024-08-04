import React, { useState } from 'react';
import AddItemForm from './AddItemForm';
import { TextField, Button, Box, List, ListItem, ListItemText, ListItemSecondaryAction } from '@mui/material';

// Make sure you have the Item interface defined or imported
interface Item {
  id: string;
  name: string;
  quantity: number;
  image?: string;
}

const SearchBar: React.FC = () => {
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
        itemToUpdate && item.name === itemToUpdate.name ? updatedItem : item
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

export default SearchBar;