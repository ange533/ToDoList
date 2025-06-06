import React, { useState, useRef, useEffect } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { Avatar } from './ui/Avatar';
import { ChevronDown, User, Search } from 'lucide-react';

interface UserSelectorProps {
  selectedUserId: string;
  onSelect: (userId: string) => void;
  label?: string;
  error?: string;
  includeAllOption?: boolean;
}

export const UserSelector: React.FC<UserSelectorProps> = ({
  selectedUserId,
  onSelect,
  label,
  error,
  includeAllOption = false,
}) => {
  const { users } = useTaskContext();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Find selected user
  const selectedUser = selectedUserId !== 'all' 
    ? users.find((user) => user.id === selectedUserId)
    : undefined;

  // Handle dropdown toggle
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchQuery('');
    }
  };

  // Handle user selection
  const handleUserSelect = (userId: string) => {
    onSelect(userId);
    setIsOpen(false);
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter users based on search query
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mb-4" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          className={`bg-white relative w-full border rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
            error ? 'border-red-300' : 'border-gray-300'
          }`}
          onClick={toggleDropdown}
        >
          {selectedUser ? (
            <div className="flex items-center">
              <Avatar
                name={selectedUser.name}
                color={selectedUser.avatarColor}
                size="sm"
              />
              <span className="ml-2 block truncate">{selectedUser.name}</span>
            </div>
          ) : selectedUserId === 'all' && includeAllOption ? (
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <User size={16} className="text-gray-600" />
              </div>
              <span className="ml-2 block truncate">All Users</span>
            </div>
          ) : (
            <span className="block truncate text-gray-500">
              Select a user
            </span>
          )}
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <ChevronDown size={16} className="text-gray-400" />
          </span>
        </button>

        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
            <div className="sticky top-0 z-10 bg-white p-2">
              <div className="relative">
                <input
                  type="text"
                  className="block w-full rounded-md border-gray-300 pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                  <Search size={16} className="text-gray-400" />
                </div>
              </div>
            </div>

            {includeAllOption && (
              <div
                className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-50 ${
                  selectedUserId === 'all' ? 'bg-blue-100' : ''
                }`}
                onClick={() => handleUserSelect('all')}
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <User size={16} className="text-gray-600" />
                  </div>
                  <span className="ml-2 block truncate font-medium">
                    All Users
                  </span>
                </div>
              </div>
            )}

            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-50 ${
                    selectedUserId === user.id ? 'bg-blue-100' : ''
                  }`}
                  onClick={() => handleUserSelect(user.id)}
                >
                  <div className="flex items-center">
                    <Avatar
                      name={user.name}
                      color={user.avatarColor}
                      size="sm"
                    />
                    <span className="ml-2 block truncate font-medium">
                      {user.name}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500">No users found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};