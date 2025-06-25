import React, { useState } from 'react';
import { Home, Calendar, Clock, MoreVertical } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface SidebarProps {
  activeView: 'home' | 'events' | 'programs';
  onViewChange: (view: 'home' | 'events' | 'programs') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'programs', label: 'Programs', icon: Clock, section: 'Manage' },
    { id: 'events', label: 'Events', icon: Calendar },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 bg-white dark:bg-gray-900 shadow-lg border-r border-gray-200 dark:border-gray-700 h-screen flex-col transition-colors duration-200">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">My Schedule</span>
            </div>
            <ThemeToggle />
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <div key={item.id}>
                {item.section && (
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 mt-4">
                    {item.section}
                  </div>
                )}
                <button
                  onClick={() => onViewChange(item.id as any)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                    activeView === item.id
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${
                    activeView === item.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
                  }`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              </div>
            ))}
          </div>
        </nav>
      </div>

      {/* Mobile Top Bar */}
      <div className="flex md:hidden flex-col w-full bg-white dark:bg-gray-900 shadow border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between px-4 py-3">
          <ThemeToggle />
          <span className="text-lg font-semibold text-gray-900 dark:text-white">My Schedule</span>
          <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
            <MoreVertical className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
        </div>

        {/* Vertical Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="flex flex-col px-4 pb-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onViewChange(item.id as any);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md transition ${
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
    </>
  );
};

export default Sidebar;
