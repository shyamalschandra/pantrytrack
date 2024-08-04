'use client';

import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, List, ListItem, ListItemText, ListItemSecondaryAction, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

interface Item {
  id: string;
  name: string;
  quantity: number;
}

import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../utils/firebaseConfig'; // Adjust the import path as needed

const AddItemForm = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [itemToUpdate, setItemToUpdate] = useState<Item | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'pantryItems'), (snapshot) => {
      const fetchedItems = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Item, 'id'>)
      }));
      setItems(fetchedItems);
    });

    // Cleanup function to unsubscribe when component unmounts
    return () => unsubscribe();
  }, []);

  const handleAddItem = async () => {
    console.log('handleAddItem called'); // Debug log
    const newItem = {
      name: newItemName,
      quantity: newItemQuantity
    };

    console.log('New item to add:', newItem); // Debug log

    try {
      const docRef = await addDoc(collection(db, 'pantryItems'), newItem);
      console.log('Document written with ID: ', docRef.id); // Debug log
      setNewItemName('');
      setNewItemQuantity(1);
      setOpenDialog(false);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleUpdateItem = async () => {
    if (itemToUpdate) {
      const updatedItem = {
        name: newItemName,
        quantity: newItemQuantity
      };

      try {
        await updateDoc(doc(db, 'pantryItems', itemToUpdate.id), updatedItem);
        setIsUpdating(false);
        setItemToUpdate(null);
        setOpenDialog(false);
      } catch (error) {
        console.error("Error updating document: ", error);
      }
    }
  };

  const handleEditClick = (item: Item) => {
    setItemToUpdate(item);
    setNewItemName(item.name);
    setNewItemQuantity(item.quantity);
    setIsUpdating(true);
    setOpenDialog(true);
  };

  const handleDeleteClick = async (itemToDelete: Item) => {
    try {
      await deleteDoc(doc(db, 'pantryItems', itemToDelete.id));
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  console.log("Rendering AddItemForm, items:", items);

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', padding: 2, border: '1px solid #ccc' }}>
      <Button onClick={() => setOpenDialog(true)} variant="contained" color="primary" sx={{ mb: 2 }}>
        Add New Item
      </Button>
      <TextField
        label="Search Items"
        value={searchQuery}
        onChange={handleSearchChange}
        variant="outlined"
        size="small"
        fullWidth
        sx={{ mt: 2, mb: 2 }}
      />
      {items.length === 0 ? (
        <div>No items to display</div>
      ) : (
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
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{isUpdating ? 'Update Item' : 'Add New Item'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Item Name"
            type="text"
            fullWidth
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Quantity"
            type="number"
            fullWidth
            value={newItemQuantity}
            onChange={(e) => setNewItemQuantity(Number(e.target.value))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={isUpdating ? handleUpdateItem : handleAddItem}>
            {isUpdating ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddItemForm;