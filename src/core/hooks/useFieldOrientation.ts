import { useState, useCallback } from 'react';

export interface FieldOrientationState {
  isFieldRotated: boolean;
  toggleFieldOrientation: () => void;
}

const STORAGE_KEY = 'fieldOrientationRotated';

export function useFieldOrientation() {
  const [isFieldRotated, setIsFieldRotated] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const toggleFieldOrientation = useCallback(() => {
    setIsFieldRotated(prev => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  return { isFieldRotated, toggleFieldOrientation };
}
