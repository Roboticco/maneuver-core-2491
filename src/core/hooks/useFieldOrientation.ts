import { useState, useCallback } from 'react';

export interface FieldOrientationState {
<<<<<<< Updated upstream
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
=======
    isFieldRotated: boolean;
    toggleFieldOrientation: () => void;
}

export function useFieldOrientation(): FieldOrientationState {
    const [isFieldRotated, setIsFieldRotated] = useState(false);

    const toggleFieldOrientation = useCallback(() => {
        setIsFieldRotated((prev) => !prev);
    }, []);

    return { isFieldRotated, toggleFieldOrientation };
>>>>>>> Stashed changes
}
