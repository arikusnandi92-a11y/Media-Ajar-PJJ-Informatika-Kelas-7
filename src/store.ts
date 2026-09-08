import { useState, useEffect, useCallback } from 'react';
import { UserData } from './types';

const CURRENT_USER_KEY = 'bdr_current_user_id';
const USERS_STORAGE_KEY = 'bdr_users_data';

export const useStore = (isTeacherMode: boolean = false) => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);

  const loadData = useCallback(() => {
    try {
      const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
      let parsedUsers: UserData[] = [];
      if (storedUsers) {
        parsedUsers = JSON.parse(storedUsers);
      }
      setUsers(parsedUsers);

      const currentId = localStorage.getItem(CURRENT_USER_KEY);
      if (currentId) {
        const user = parsedUsers.find(u => u.id === currentId);
        if (user) {
          setCurrentUser(user);
        }
      }
    } catch (e) {
      console.error("Error parsing users from local storage", e);
    }
  }, []);

  useEffect(() => {
    loadData();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === USERS_STORAGE_KEY || e.key === CURRENT_USER_KEY) {
        loadData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadData]);

  const saveUser = async (user: UserData) => {
    try {
      setUsers(prevUsers => {
        const index = prevUsers.findIndex(u => u.id === user.id);
        const newUsers = [...prevUsers];
        if (index >= 0) {
          newUsers[index] = user;
        } else {
          newUsers.push(user);
        }
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(newUsers));
        return newUsers;
      });
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
      const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
      if (storedUsers) {
        const parsedUsers: UserData[] = JSON.parse(storedUsers);
        const user = parsedUsers.find(u => u.id === id);
        return user || null;
      }
    } catch (error) {
      console.error("Error fetching user by id:", error);
    }
    return null;
  };

  const deleteUser = async (userId: string) => {
    try {
      setUsers(prevUsers => {
        const newUsers = prevUsers.filter(u => u.id !== userId);
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(newUsers));
        return newUsers;
      });
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
