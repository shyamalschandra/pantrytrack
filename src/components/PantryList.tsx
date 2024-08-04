import React, { useState } from 'react';
import { List, ListItem, ListItemText, Button } from '@mui/material';

interface Item {
  id: number;
  name: string;
  quantity: number;
}

const PantryList = () => {
  const [items, setItems] = useState<Item[]>([]);

  const onUpdate = (item: Item) => {
    // Update logic here
  };

  const onDelete = (itemId: number) => {
    // Delete logic here
  };

  return (
    <List>
      {items.map((item) => (
        <ListItem key={item.id}>
          <ListItemText primary={item.name} secondary={`Quantity: ${item.quantity}`} />
          <Button onClick={() => onUpdate(item)}>Update</Button>
          <Button onClick={() => onDelete(item.id)}>Delete</Button>
        </ListItem>
      ))}
    </List>
  );
};

export default PantryList;