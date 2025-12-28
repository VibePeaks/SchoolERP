import React from 'react';
import { Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const { user } = useAuth();

  return (
    <div className="w-full flex items-center justify-between h-16">
      {/* Left section - Logo + Title */}
      <div className="flex items-center space-x-3">
        <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
        <h1 className="text-xl font-bold text-blue-600">SchoolERP</h1>
      </div>

      {/* Right section - Notification + Profile */}
      <div className="flex items-center space-x-6">
        <div className="relative">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold">
            {user?.name?.[0] ?? 'A'}
          </div>
          <span className="text-gray-800 font-medium">{user?.name}</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
