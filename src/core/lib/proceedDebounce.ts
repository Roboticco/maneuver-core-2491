export const DEFAULT_PROCEED_DEBOUNCE_MS = 500;

let lastProceedTime = 0;

/**
 * Returns true if enough time has passed since the last proceed call.
 * Prevents accidental double-taps from advancing the workflow twice.
 */
export function shouldAllowProceed(debounceMs: number = DEFAULT_PROCEED_DEBOUNCE_MS): boolean {
  const now = Date.now();
  if (now - lastProceedTime < debounceMs) {
    return false;
  }
  lastProceedTime = now;
  return true;
}
