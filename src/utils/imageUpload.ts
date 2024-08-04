import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const uploadImageToStorage = async (file: File): Promise<string> => {
  const storage = getStorage();
  const storageRef = ref(storage, `images/${file.name}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};