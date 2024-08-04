'use client';

import React, { useState, useEffect, useRef } from 'react';
import { TextField, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, List, ListItem, ListItemText, ListItemSecondaryAction } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import ImageUploader from './ImageUploader';
import { collection, onSnapshot, query, addDoc, updateDoc, deleteDoc, doc, getDocs, getFirestore, enableNetwork, disableNetwork, writeBatch, enablePersistence } from 'firebase/firestore';
import { firestore } from '../utils/firebaseConfig'; // Adjust the import path as needed
import { uploadImageToStorage } from '../utils/imageUpload'; 
import Image from 'next/image';
import styles from './AddItemForm.module.css'; // Add this line

interface Item {
  id: string;
  name: string;
  quantity: number;
  image?: string;
}

interface AddItemFormProps {
  onAddItem: (item: Item) => void;
  itemToUpdate: Item | null;
  isUpdating: boolean;
  onUpdateItem: (updatedItem: Item) => void;
}

const db = getFirestore();
enablePersistence(db).catch((err: any) => { // Add type annotation here
    if (err.code == 'failed-precondition') {
        console.log("Multiple tabs open, persistence can only be enabled in one tab at a a time.");
    } else if (err.code == 'unimplemented') {
        console.log("The current browser does not support all of the features required to enable persistence");
    }
});

const AddItemForm: React.FC<AddItemFormProps> = ({ onAddItem, itemToUpdate, isUpdating, onUpdateItem }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [imageLabels, setImageLabels] = useState<string[]>([]);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const q = query(collection(firestore, 'pantryItems'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedItems = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Item, 'id'>)
      }));
      console.log('Fetched items:', fetchedItems);
      setItems(fetchedItems);
    }, (error) => {
      console.error("Error fetching items:", error);
    });

    return () => unsubscribe();
  }, []);

  const MAX_RETRIES = 3;
  const RETRY_DELAY = 1000;

  const handleAddOrUpdateItem = async () => {
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        let imageUrl = '';
        if (selectedImage) {
          imageUrl = await uploadImageToStorage(selectedImage);
        }
  
        const itemData = {
          name: newItemName,
          quantity: newItemQuantity,
          image: imageUrl,
        };
  
        if (isUpdating && itemToUpdate) {
          await updateDoc(doc(db, 'pantryItems', itemToUpdate.id), itemData);
          onUpdateItem({ ...itemToUpdate, ...itemData }); // Ensure onUpdateItem is called
        } else {
          const docRef = await addDoc(collection(db, 'pantryItems'), itemData);
          onAddItem({ id: docRef.id, ...itemData }); // Ensure onAddItem is called
        }
  
        resetForm();
        setOpenDialog(false); // Close the dialog
        return; // Success, exit the function
      } catch (error) {
        console.error(`Error on attempt ${attempt + 1}:`, error);
        if (attempt === MAX_RETRIES - 1) {
          // If this was the last attempt, show an error to the user
          alert('Failed to save item. Please try again later.');
        } else {
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        }
      }
    }
  };

  const resetForm = () => {
    setNewItemName('');
    setNewItemQuantity(1);
    setSelectedImage(null);
    setImageLabels([]);
  };

  const handleDeleteClick = async (itemToDelete: Item) => {
    try {
      await deleteDoc(doc(firestore, 'pantryItems', itemToDelete.id));
      setItems(prevItems => prevItems.filter(item => item.id !== itemToDelete.id));
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);

      const imageUrl = URL.createObjectURL(file);

      const model = await mobilenet.load();

      const img = new globalThis.Image();
      img.src = imageUrl;
      img.onload = async () => {
        const predictions = await model.classify(img);
        const labels = predictions.map(p => p.className);
        setImageLabels(labels);

        if (labels.length > 0) {
          setNewItemName(labels[0]);
        }
      };
    }
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box className={styles.container}>
      <IconButton color="primary" aria-label="upload picture" component="label">
        <input hidden accept="image/*" type="file" onChange={handleImageUpload} />
        <PhotoCamera />
      </IconButton>
      {selectedImage && <p>Image selected: {selectedImage.name}</p>}
      <Button onClick={() => setOpenDialog(true)} variant="contained" color="primary" className={styles.uploadButton}>
        Add New Item
      </Button>
      <TextField
        label="Search Items"
        value={searchQuery}
        onChange={handleSearchChange}
        variant="outlined"
        size="small"
        fullWidth
        className={styles.searchField}
      />
      <List>
        {filteredItems.map((item) => (
          <ListItem key={item.id} divider>
            <ListItemText primary={`${item.name} - ${item.quantity}`} />
            {item.image && <Image src={item.image} alt={item.name} width={50} height={50} className={styles.imagePreview} />}
            <ListItemSecondaryAction>
              <Button onClick={() => {
                setNewItemName(item.name);
                setNewItemQuantity(item.quantity);
                setOpenDialog(true);
              }} variant="contained" color="secondary" size="small" sx={{ mr: 1 }}>
                Edit
              </Button>
              <Button onClick={() => handleDeleteClick(item)} variant="contained" color="error" size="small">
                Delete
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Dialog open={openDialog} onClose={() => {
        resetForm();
        setOpenDialog(false);
      }}>
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
            error={!newItemName.trim()}
            helperText={!newItemName.trim() ? 'Item name is required' : ''}
          />
          <TextField
            margin="dense"
            label="Quantity"
            type="number"
            fullWidth
            value={newItemQuantity}
            onChange={(e) => setNewItemQuantity(Number(e.target.value))}
            inputProps={{ min: 1 }}
          />
          <Button
            variant="contained"
            component="label"
            startIcon={<PhotoCamera />}
            sx={{ mt: 2 }}
          >
            Upload Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageUpload}
            />
          </Button>
          {selectedImage && (
            <div>
              <p>Image selected: {selectedImage.name}</p>
              <Image
                ref={imageRef}
                src={URL.createObjectURL(selectedImage)}
                alt="Selected"
                width={200}
                height={200}
                className={styles.dialogImage}
              />
              {imageLabels.length > 0 && (
                <div>
                  <p>Detected labels:</p>
                  <ul>
                    {imageLabels.map((label, index) => (
                      <li key={index}>{label}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            resetForm();
            setOpenDialog(false);
          }}>
            Cancel
          </Button>
          <Button onClick={handleAddOrUpdateItem} disabled={!newItemName.trim()}>
            {isUpdating ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openImageDialog} onClose={() => setOpenImageDialog(false)}>
        <DialogTitle>Upload Image</DialogTitle>
        <DialogContent>
          <input
            accept="image/*"
            type="file"
            onChange={handleImageUpload}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenImageDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddItemForm;