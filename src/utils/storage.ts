import { Item } from '../types';

// Key for storing items in local storage
const STORAGE_KEY = 'shortcuts-items';

// Get all items from local storage
export const getItems = (): Item[] => {
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
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving items to local storage:', error);
  }
};

// Generate a unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};