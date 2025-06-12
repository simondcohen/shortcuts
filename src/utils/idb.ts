export const set = <T>(key: string, value: T): Promise<void> => {
  return new Promise((resolve, reject) => {
    const openReq = indexedDB.open('shortcuts-db', 1);
    openReq.onupgradeneeded = () => {
      openReq.result.createObjectStore('store');
    };
    openReq.onerror = () => reject(openReq.error);
    openReq.onsuccess = () => {
      const db = openReq.result;
      const tx = db.transaction('store', 'readwrite');
      tx.objectStore('store').put(value, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    };
  });
};

export const get = <T>(key: string): Promise<T | undefined> => {
  return new Promise((resolve, reject) => {
    const openReq = indexedDB.open('shortcuts-db', 1);
    openReq.onupgradeneeded = () => {
      openReq.result.createObjectStore('store');
    };
    openReq.onerror = () => reject(openReq.error);
    openReq.onsuccess = () => {
      const db = openReq.result;
      const tx = db.transaction('store', 'readonly');
      const req = tx.objectStore('store').get(key);
      req.onsuccess = () => resolve(req.result as T | undefined);
      req.onerror = () => reject(req.error);
    };
  });
};
