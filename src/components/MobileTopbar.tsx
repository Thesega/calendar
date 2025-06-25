// MobileTopbar.tsx
import React, { useState } from 'react';
import { MoreVertical, Home, Calendar, Clock } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface Props {
  activeView: 'home' | 'events' | 'programs';
  onViewChange: (view: 'home' | 'events' | 'programs') => void;
}

const MobileTopbar: React.FC<Props> = ({ activeView, onViewChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'programs', label: 'Programs', icon: Clock },
    { id: 'events', label: 'Events', icon: Calendar },
  ];

  return (
    <div className="md:hidden w-full bg-white dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700">
      <div className="flex items-center justify-between px-4 py-3">
        <ThemeToggle />
        <span className="text-lg font-semibold text-gray-900 dark:text-white">My Schedule</span>
        <button onClick={() => setIsOpen(!isOpen)}>
          <MoreVertical className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </button>
      </div>

      {isOpen && (
        <div className="flex flex-col px-4 pb-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onViewChange(item.id as any);
                setIsOpen(false);
              }}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md ${
                activeView === item.id
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MobileTopbar;
