import React from 'react';
import { Check } from 'lucide-react';

export default function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="toast" role="status" aria-live="polite">
      <Check size={16} />
      {message}
    </div>
  );
}
