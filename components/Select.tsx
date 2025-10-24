import React from 'react';
import Spinner from './Spinner';
import { ChevronDownIcon } from './Icons';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  loading?: boolean;
  placeholder?: string;
  description?: string;
}

const Select: React.FC<SelectProps> = ({ label, options, loading = false, placeholder, description, ...props }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-1">
        {label}
      </label>
      {description && <p className="text-xs text-slate-400 mb-2">{description}</p>}
      <div className="relative">
        {loading && <div className="absolute inset-y-0 left-0 flex items-center pl-3"><Spinner size="sm" /></div>}
        <select
          {...props}
          className={`w-full bg-slate-900 border border-slate-700/80 rounded-lg py-3 pr-10 text-slate-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition appearance-none ${loading ? 'pl-10' : 'pl-4'} ${props.disabled ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          <option value="" disabled={props.value !== ""}>{placeholder ?? "Select an option..."}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
            <ChevronDownIcon />
        </div>
      </div>
    </div>
  );
};

export default Select;