import { useState, useEffect } from 'react';
import { auth } from '../utils/firebaseConfig';
import { User } from 'firebase/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return user;
}
