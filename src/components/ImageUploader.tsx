import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@mui/material';
import { storage, firestore } from '../utils/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { classifyImage } from '../utils/tensorflow';
import Image from 'next/image';

const ImageUploader = () => {
  const [image, setImage] = useState<File | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (image && imageRef.current) {
      if (!isOnline) {
        console.warn('You are offline. Image will be uploaded when connection is restored.');
        // Implement local storage or IndexedDB caching here
        return;
      }

      const storageRef = ref(storage, `images/${image.name}`);
      await uploadBytes(storageRef, image);
      const url = await getDownloadURL(storageRef);

      // Classify image using TensorFlow.js
      const labels = await classifyImage(imageRef.current);

      // Save image URL and labels to Firestore
      await addDoc(collection(firestore, 'images'), {
        url,
        labels,
        createdAt: new Date()
      });

      // Reset image state
      setImage(null);
    }
  };

  return (
    <div>
      {!isOnline && <p>You are currently offline. Some features may be limited.</p>}
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {image && <Image src={URL.createObjectURL(image)} alt="preview" width={200} height={200} style={{ objectFit: 'cover' }} />}
      <Button onClick={handleUpload} variant="contained" color="primary">
        Upload Image
      </Button>
    </div>
  );
};

export default ImageUploader;