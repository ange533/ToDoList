import React, { useEffect } from 'react';
import { Toast as ToastType } from '../../types';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';

export const Toast: React.FC<{ toast: ToastType }> = ({ toast }) => {
  const { removeToast } = useTaskContext();

  // Auto remove toast after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(toast.id);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [toast.id, removeToast]);

  // Determine icon and color based on toast type
  const getToastStyles = () => {
    switch (toast.type) {
      case 'success':
        return {
          icon: <CheckCircle size={20} className="text-green-500" />,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-400',
        };
      case 'error':
        return {
          icon: <AlertCircle size={20} className="text-red-500" />,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-400',
        };
      case 'info':
      default:
        return {
          icon: <Info size={20} className="text-blue-500" />,
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-400',
        };
    }
  };

  const { icon, bgColor, borderColor } = getToastStyles();

  return (
    <div
      className={`max-w-md w-full ${bgColor} border-l-4 ${borderColor} p-4 rounded-md shadow-md transform transition-all duration-300 ease-in-out mb-2`}
      role="alert"
    >
      <div className="flex items-center">
        <div className="flex-shrink-0">{icon}</div>
        <div className="ml-3">
          <p className="text-sm font-medium">{toast.message}</p>
        </div>
        <div className="ml-auto pl-3">
          <button
            type="button"
            className="inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
            onClick={() => removeToast(toast.id)}
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts } = useTaskContext();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-0 right-0 p-4 space-y-2 z-50">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  );
};