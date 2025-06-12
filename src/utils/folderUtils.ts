import { Item, Folder } from '../types';

// Check if setting a folder as a child of another would create a loop
export const wouldCreateLoop = (items: Item[], folderId: string, newParentId: string | null): boolean => {
  if (newParentId === null) {
    return false; // Moving to root level can't create a loop
  }
  
  if (folderId === newParentId) {
    return true; // Can't set a folder as its own parent
  }

  // Check if any parent of newParentId is folderId (would create a loop)
  let currentParentId: string | null = newParentId;
  const visitedIds = new Set<string>();

  while (currentParentId) {
    if (visitedIds.has(currentParentId)) {
      return true; // Loop detected
    }
    
    visitedIds.add(currentParentId);
    
    if (currentParentId === folderId) {
      return true; // Would create a loop
    }

    const parent = items.find(item => item.id === currentParentId) as Item;
    currentParentId = parent?.parentId || null;
  }

  return false;
};

// Get all child item IDs (recursively) for a folder
export const getAllChildIds = (items: Item[], folderId: string): string[] => {
  const childIds: string[] = [];
  
  // First-level children
  const directChildren = items.filter(item => item.parentId === folderId);
  directChildren.forEach(child => {
    childIds.push(child.id);
    
    // If the child is a folder, get its children too
    if (child.type === 'folder') {
      const nestedChildIds = getAllChildIds(items, child.id);
      childIds.push(...nestedChildIds);
    }
  });
  
  return childIds;
};

// Get all folders for dropdown selection, properly indented
export const getFolderOptions = (items: Item[], currentFolderId?: string): { value: string | null, label: string }[] => {
  const options: { value: string | null; label: string }[] = [{ value: null, label: 'Root' }];
  
  const folders = items.filter(item => item.type === 'folder' && item.id !== currentFolderId) as Folder[];
  
  // Helper function to build nested options with proper indentation
  const buildOptions = (parentId: string | null, level = 0): void => {
    const indent = '  '.repeat(level);
    
    folders
      .filter(folder => folder.parentId === parentId)
      .sort((a, b) => a.title.localeCompare(b.title))
      .forEach(folder => {
        options.push({
          value: folder.id,
          label: `${indent}${folder.title}`,
        });
        
        buildOptions(folder.id, level + 1);
      });
  };
  
  buildOptions(null);
  
  return options;
};