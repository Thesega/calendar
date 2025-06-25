import React from 'react';
import { Home, Calendar, Clock, ChevronDown } from 'lucide-react';

interface SidebarProps {
  activeView: 'home' | 'events' | 'programs';
  onViewChange: (view: 'home' | 'events' | 'programs') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'programs', label: 'Programs', icon: Clock, section: 'Manage' },
    { id: 'events', label: 'Events', icon: Calendar },
  ];

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 h-screen">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-gray-900">My Schedule</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <div key={item.id}>
              {item.section && (
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 mt-4">
                  {item.section}
                </div>
              )}
              <button
                onClick={() => onViewChange(item.id as any)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeView === item.id
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <item.icon className={`w-5 h-5 ${
                  activeView === item.id ? 'text-blue-600' : 'text-gray-500'
                }`} />
                <span className="font-medium">{item.label}</span>
              </button>
            </div>
          ))}
        </div>
      </nav>

      {/* User Profile */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">ES</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Elijah Scott</p>
            <p className="text-xs text-gray-500 truncate">scotteli@hey.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;