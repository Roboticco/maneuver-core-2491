import { useState, useCallback } from 'react';

export interface FieldOrientationState {
    isFieldRotated: boolean;
    toggleFieldOrientation: () => void;
}

export function useFieldOrientation(): FieldOrientationState {
    const [isFieldRotated, setIsFieldRotated] = useState(false);

    const toggleFieldOrientation = useCallback(() => {
        setIsFieldRotated((prev) => !prev);
    }, []);

    return { isFieldRotated, toggleFieldOrientation };
}
