import React from 'react';

interface AvatarProps {
  name: string;
  color: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Avatar: React.FC<AvatarProps> = ({ name, color, size = 'md' }) => {
  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Determine size classes
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  return (
    <div
      className={`${sizeClasses[size]} ${color} rounded-full flex items-center justify-center text-white font-medium`}
      title={name}
    >
      {getInitials(name)}
    </div>
  );
};