import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  helpText,
  className = '',
  id,
  rows = 3,
  ...props
}) => {
  const textareaId = id || Math.random().toString(36).substring(2, 9);

  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={textareaId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        rows={rows}
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