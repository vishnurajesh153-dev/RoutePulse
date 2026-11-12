import { useState, useCallback } from 'react';
import { TOAST_DURATION } from '../config/constants';

/**
 * Simple toast notification hook.
 *
 * Usage:
 *   const { notice, notify } = useToast();
 *   notify('Action completed!');
 *   // then in JSX: <Toast message={notice} />
 */
export function useToast() {
  const [notice, setNotice] = useState('');

  const notify = useCallback((message, duration = TOAST_DURATION) => {
    setNotice(message);
    setTimeout(() => setNotice(''), duration);
  }, []);

  return { notice, notify };
}
