import { Item } from '../types';
import { get, set } from './idb';

type FileSystemHandlePermissionDescriptor = {
  mode?: 'read' | 'readwrite';
};

const HANDLE_KEY = 'data-file-handle';

export const isFileSystemSupported = (): boolean => {
  return typeof window !== 'undefined' && 'showSaveFilePicker' in window;
};

export const getStoredHandle = async (): Promise<FileSystemFileHandle | undefined> => {
  return get<FileSystemFileHandle>(HANDLE_KEY);
};

export const storeHandle = async (handle: FileSystemFileHandle): Promise<void> => {
  await set(HANDLE_KEY, handle);
};

export const pickFile = async (): Promise<FileSystemFileHandle | null> => {
  try {
    const win = window as Window & {
      showSaveFilePicker?: (options?: { 
        types?: Array<{
          description?: string;
          accept?: Record<string, string[]>;
        }>; 
        excludeAcceptAllOption?: boolean;
        suggestedName?: string;
      }) => Promise<FileSystemFileHandle>;
    };
    
    const handle = await win.showSaveFilePicker!({
      types: [{ 
        description: 'JSON Files', 
        accept: { 'application/json': ['.json'] } 
      }],
      excludeAcceptAllOption: false,
      suggestedName: 'shortcuts-data.json'
    });
    
    return handle;
  } catch (err) {
    console.error('File selection cancelled or failed', err);
    return null;
  }
};

interface PermissibleHandle extends FileSystemFileHandle {
  queryPermission?(descriptor?: FileSystemHandlePermissionDescriptor): Promise<PermissionState>;
  requestPermission?(descriptor?: FileSystemHandlePermissionDescriptor): Promise<PermissionState>;
}

const verifyPermission = async (handle: FileSystemFileHandle, readWrite: boolean) => {
  const opts: FileSystemHandlePermissionDescriptor = readWrite ? { mode: 'readwrite' } : { mode: 'read' };
  const h = handle as PermissibleHandle;
  if (h.queryPermission && (await h.queryPermission(opts)) === 'granted') {
    return true;
  }
  if (h.requestPermission && (await h.requestPermission(opts)) === 'granted') {
    return true;
  }
  return false;
};

export const readFileItems = async (handle: FileSystemFileHandle): Promise<{ items: Item[]; lastModified: number }> => {
  if (!(await verifyPermission(handle, false))) {
    throw new Error('No permission to read file');
  }
  const file = await handle.getFile();
  const text = await file.text();
  let items: Item[] = [];
  if (text.trim().length) {
    try {
      items = JSON.parse(text) as Item[];
    } catch (e) {
      console.error('Failed parsing file', e);
    }
  }
  return { items, lastModified: file.lastModified };
};

export const writeFileItems = async (handle: FileSystemFileHandle, items: Item[]): Promise<number> => {
  if (!(await verifyPermission(handle, true))) {
    throw new Error('No permission to write file');
  }
  const writable = await handle.createWritable();
  await writable.write(JSON.stringify(items, null, 2));
  await writable.close();
  const file = await handle.getFile();
  return file.lastModified;
};
