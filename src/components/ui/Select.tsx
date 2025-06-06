import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  options: SelectOption[];
  error?: string;
  onChange: (value: string) => void;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  value,
  onChange,
  error,
  className = '',
  id,
  ...props
}) => {
  const selectId = id || Math.random().toString(36).substring(2, 9);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <select
        id={selectId}
        value={value}
        onChange={handleChange}
        className={`block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
          error
            ? 'border-red-300 text-red-900'
            : 'border-gray-300'
        } ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};