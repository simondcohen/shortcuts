import { Item } from '../types';

// Key for storing items in local storage
const STORAGE_KEY = 'shortcuts-items';

// Check if localStorage is available
const isLocalStorageAvailable = (): boolean => {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

// Check if we have enough storage space
const hasEnoughStorageSpace = (data: string): boolean => {
  try {
    const quota = 5 * 1024 * 1024; // 5MB limit
    const used = new Blob([data]).size;
    return used < quota;
  } catch (e) {
    console.error('Error checking storage space:', e);
    return false;
  }
};

// Get all items from local storage
export const getItems = (): Item[] => {
  if (!isLocalStorageAvailable()) {
    console.error('localStorage is not available');
    return [];
  }

  try {
    const itemsJson = localStorage.getItem(STORAGE_KEY);
    return itemsJson ? JSON.parse(itemsJson) : [];
  } catch (error) {
    console.error('Error retrieving items from local storage:', error);
    return [];
  }
};

// Save all items to local storage
export const saveItems = (items: Item[]): void => {
  if (!isLocalStorageAvailable()) {
    console.error('localStorage is not available');
    return;
  }

  try {
    const itemsJson = JSON.stringify(items);
    
    if (!hasEnoughStorageSpace(itemsJson)) {
      console.error('Not enough storage space available');
      return;
    }
    
    localStorage.setItem(STORAGE_KEY, itemsJson);
  } catch (error) {
    console.error('Error saving items to local storage:', error);
  }
};

// Generate a unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};