import { useState, useEffect } from 'react';
import { UserData } from './types';
import { db } from './lib/firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';

const CURRENT_USER_KEY = 'bdr_current_user_id';

export const useStore = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const fetchedUsers: UserData[] = [];
      snapshot.forEach((docSnap) => {
        fetchedUsers.push(docSnap.data() as UserData);
      });
      setUsers(fetchedUsers);
      
      const currentId = localStorage.getItem(CURRENT_USER_KEY);
      if (currentId) {
        const user = fetchedUsers.find(u => u.id === currentId);
        if (user) {
          setCurrentUser(user);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const saveUser = async (user: UserData) => {
    try {
      await setDoc(doc(db, 'users', user.id), user);
      setCurrentUser(user);
      localStorage.setItem(CURRENT_USER_KEY, user.id);
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      await deleteDoc(doc(db, 'users', userId));
      const currentId = localStorage.getItem(CURRENT_USER_KEY);
      if (currentId === userId) {
        clearCurrentUser();
      }
    } catch (error) {
      console.error("Error deleting user data:", error);
    }
  };

  const clearCurrentUser = () => {
    setCurrentUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  const addPoints = (pointsToAdd: number, reason: string) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, points: currentUser.points + pointsToAdd };
      saveUser(updatedUser);
    }
  };

  const unlockBadge = (badge: string) => {
    if (currentUser && !currentUser.badges.includes(badge)) {
      const updatedUser = { ...currentUser, badges: [...currentUser.badges, badge] };
      saveUser(updatedUser);
    }
  };

  const markStepComplete = (stepId: number) => {
    if (currentUser && !currentUser.completedSteps.includes(stepId)) {
      const updatedUser = {
        ...currentUser,
        completedSteps: [...currentUser.completedSteps, stepId],
        progress: Math.min(100, Math.round(((currentUser.completedSteps.length + 1) / 18) * 100))
      };
      saveUser(updatedUser);
    }
  };

  return {
    users,
    currentUser,
    saveUser,
    deleteUser,
    clearCurrentUser,
    addPoints,
    unlockBadge,
    markStepComplete,
  };
};
