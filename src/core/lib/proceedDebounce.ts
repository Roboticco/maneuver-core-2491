export const DEFAULT_PROCEED_DEBOUNCE_MS = 500;

let lastProceedTime = 0;

export function shouldAllowProceed(debounceMs: number = DEFAULT_PROCEED_DEBOUNCE_MS): boolean {
    const now = Date.now();
    if (now - lastProceedTime < debounceMs) {
        return false;
    }
    lastProceedTime = now;
    return true;
}
