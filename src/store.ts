import { useState, useEffect, useCallback } from 'react';
import { UserData } from './types';
import { db } from './lib/firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';

const CURRENT_USER_KEY = 'bdr_current_user_id';

export const useStore = (isTeacherMode: boolean = false) => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);

  // Listen to all users ONLY in teacher mode
  useEffect(() => {
    if (!isTeacherMode) {
      setUsers([]);
      return;
    }
    
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const fetchedUsers: UserData[] = [];
      snapshot.forEach((docSnap) => {
        fetchedUsers.push(docSnap.data() as UserData);
      });
      setUsers(fetchedUsers);
    }, (error) => {
      console.error("Error listening to users:", error);
    });

    return () => unsubscribe();
  }, [isTeacherMode]);

  // Listen to current user if not in teacher mode
  useEffect(() => {
    if (isTeacherMode) return;
    
    const currentId = localStorage.getItem(CURRENT_USER_KEY);
    if (!currentId) {
      setCurrentUser(null);
      return;
    }

    const unsubscribe = onSnapshot(doc(db, 'users', currentId), (docSnap) => {
      if (docSnap.exists()) {
        setCurrentUser(docSnap.data() as UserData);
      } else {
        // User was deleted from backend
        clearCurrentUser();
      }
    }, (error) => {
      console.error("Error listening to current user:", error);
    });

    return () => unsubscribe();
  }, [isTeacherMode]);

  const saveUser = async (user: UserData) => {
    try {
      await setDoc(doc(db, 'users', user.id), user);
      if (!isTeacherMode && (!currentUser || currentUser.id === user.id)) {
        setCurrentUser(user);
        localStorage.setItem(CURRENT_USER_KEY, user.id);
      }
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  const getUserById = async (id: string): Promise<UserData | null> => {
    try {
      const docSnap = await getDoc(doc(db, 'users', id));
      if (docSnap.exists()) {
        return docSnap.data() as UserData;
      }
    } catch (error) {
      console.error("Error fetching user by id:", error);
    }
    return null;
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

  const addPoints = async (pointsToAdd: number, reason: string) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, points: currentUser.points + pointsToAdd };
      await saveUser(updatedUser);
    }
  };

  const unlockBadge = async (badge: string) => {
    if (currentUser && !currentUser.badges.includes(badge)) {
      const updatedUser = { ...currentUser, badges: [...currentUser.badges, badge] };
      await saveUser(updatedUser);
    }
  };

  const markStepComplete = async (stepId: number) => {
    if (currentUser && !currentUser.completedSteps.includes(stepId)) {
      const updatedUser = {
        ...currentUser,
        completedSteps: [...currentUser.completedSteps, stepId],
        progress: Math.min(100, Math.round(((currentUser.completedSteps.length + 1) / 18) * 100))
      };
      await saveUser(updatedUser);
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
    getUserById,
  };
};
