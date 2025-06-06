import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helpText,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || Math.random().toString(36).substring(2, 9);

  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
          error
            ? 'border-red-300 text-red-900 placeholder-red-300'
            : 'border-gray-300'
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
};