import { useState, useCallback } from 'react';

export const useClipboard = (resetDelay = 2000) => {
  const [hasCopied, setHasCopied] = useState(false);
  const [itemId, setItemId] = useState<string | null>(null);

  const copyToClipboard = useCallback(async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setHasCopied(true);
      setItemId(id);
      
      // Reset after delay
      setTimeout(() => {
        setHasCopied(false);
        setItemId(null);
      }, resetDelay);
      
      return true;
    } catch (error) {
      console.error('Failed to copy text:', error);
      return false;
    }
  }, [resetDelay]);

  return {
    hasCopied,
    itemId,
    copyToClipboard,
  };
};