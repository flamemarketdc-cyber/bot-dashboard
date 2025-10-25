import React, { useState } from 'react';

interface ToggleProps {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
}

const Toggle: React.FC<ToggleProps> = ({ enabled, setEnabled }) => {
  return (
    <button
      type="button"
      className={`${
        enabled ? 'bg-vibrant-red' : 'bg-base-400'
      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-vibrant-red focus:ring-offset-2 focus:ring-offset-base-200`}
      role="switch"
      aria-checked={enabled}
      onClick={() => setEnabled(!enabled)}
    >
      <span
        aria-hidden="true"
        className={`${
          enabled ? 'translate-x-5' : 'translate-x-0'
        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
      />
    </button>
  );
};

export default Toggle;