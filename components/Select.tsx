
import React from 'react';
import Spinner from './Spinner';
import { ChevronDownIcon } from './Icons';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  loading?: boolean;
  placeholder: string;
}

const Select: React.FC<SelectProps> = ({ label, options, loading = false, placeholder, ...props }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>
      <div className="relative">
        {loading && <div className="absolute inset-y-0 left-0 flex items-center pl-3"><Spinner size="sm" /></div>}
        <select
          {...props}
          className={`w-full bg-gray-900 border border-gray-600 rounded-lg py-3 pr-10 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition appearance-none ${loading ? 'pl-10' : 'pl-4'} ${props.disabled ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          <option value="" disabled>{props.value === "" ? placeholder : "Select an option..."}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
            <ChevronDownIcon />
        </div>
      </div>
    </div>
  );
};

export default Select;
