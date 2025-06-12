// Test file for import functionality
// To run this in the browser console:

// Test case: Import a folder with one child item
const testImport = () => {
  const testFolder = {
    id: "folder-123",
    title: "Test Folder",
    type: "folder",
    parentId: null,
    createdAt: Date.now(),
    isOpen: true
  };
  
  const testChild = {
    id: "link-456",
    title: "Test Link",
    type: "link",
    parentId: "folder-123",
    url: "https://example.com",
    createdAt: Date.now()
  };
  
  // This should be available from the useShortcuts hook
  const { importItems } = window.__SHORTCUTS_DEBUG__.hooks.useStorage();
  const result = importItems([testFolder, testChild]);
  
  console.log("Import result:", result);
  console.log("Original IDs mapped to new IDs:", Object.fromEntries(result.idMap));
  console.log("Imported items:", result.importedItems);
  
  // Check if the child's parentId was correctly updated if the folder's ID was changed
  const originalFolderId = testFolder.id;
  const newFolderId = result.idMap.has(originalFolderId) 
    ? result.idMap.get(originalFolderId) 
    : originalFolderId;
  
  const importedChild = result.importedItems.find(item => 
    item.title === testChild.title && item.type === testChild.type
  );
  
  console.log("Original folder ID:", originalFolderId);
  console.log("New folder ID:", newFolderId);
  console.log("Child's parent ID was updated correctly:", 
    importedChild?.parentId === newFolderId
  );
};

// For browser use
window.testImport = testImport;
console.log("Import test ready. Run testImport() to execute.");

// Export for module use
export { testImport }; 