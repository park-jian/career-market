import React, { ChangeEvent } from 'react';
import { SelectProps } from '../../types/common';

const Select: React.FC<SelectProps> = ({ options, value, onChange, placeholder, className = '' }) => {
    const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
      onChange(event.target.value);
    };
  
    return (
      <select value={value} onChange={handleChange}
      className={`block w-5/6 h-full px-4 py-2 text-gray-700 bg-white border-0 rounded-md shadow-sm focus:outline-none  sm:text-sm ${className}`}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  };
  
  export default Select;