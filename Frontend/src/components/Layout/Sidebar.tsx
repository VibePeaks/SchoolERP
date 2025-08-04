import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  DollarSign,
  FileText,
  Bell,
  Settings,
  LogOut,
  Bus,
  Package,
  Smartphone,
  Library,
  UserCheck,
  Monitor,
  Bed
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    localStorage.removeItem('activeTab');
    navigate('/login');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'principal', 'teacher'] },
    { id: 'students', label: 'Students', icon: Users, roles: ['admin', 'principal', 'teacher'] },
    { id: 'teachers', label: 'Teachers', icon: GraduationCap, roles: ['admin', 'principal'] },
    { id: 'classes', label: 'Classes', icon: BookOpen, roles: ['admin', 'principal', 'teacher'] },
    { id: 'attendance', label: 'Attendance', icon: Calendar, roles: ['admin', 'principal', 'teacher'] },
    { id: 'fees', label: 'Fees', icon: DollarSign, roles: ['admin', 'principal'] },
    { id: 'exams', label: 'Exams', icon: FileText, roles: ['admin', 'principal', 'teacher'] },
    { id: 'notices', label: 'Notices', icon: Bell, roles: ['admin', 'principal', 'teacher'] },
    { id: 'transport', label: 'Transport', icon: Bus, roles: ['admin', 'principal'], isNew: true },
    { id: 'inventory', label: 'Inventory', icon: Package, roles: ['admin', 'principal'], isNew: true },
    { id: 'parent-portal', label: 'Parent Portal', icon: Smartphone, roles: ['admin', 'principal'], isNew: true },
    { id: 'library', label: 'Library', icon: Library, roles: ['admin', 'principal', 'teacher'], isNew: true },
    { id: 'hr-payroll', label: 'HR & Payroll', icon: UserCheck, roles: ['admin', 'principal'], isNew: true },
    { id: 'e-learning', label: 'E-Learning', icon: Monitor, roles: ['admin', 'principal', 'teacher'], isNew: true },
    { id: 'hostel', label: 'Hostel', icon: Bed, roles: ['admin', 'principal', 'teacher'], isNew: true },
    { id: 'settings', label: 'Settings', icon: Settings, roles: ['admin'] },
  ];

  const filteredMenuItems = menuItems.filter(item =>
    user?.role && item.roles.includes(user.role)
  );

  return (
    <div className="w-64 h-[calc(100vh-4rem)] fixed top-16 left-0 z-20 bg-white border-r shadow flex flex-col">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* User Info */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
              {user?.name?.charAt(0)}
            </div>
            <div>
              <p className="font-medium text-gray-800">{user?.name}</p>
              <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                  onClick={() => {
                        if (item.id === 'hostel') {
                      navigate('/hostel');
                    }else {
                      setActiveTab(item.id);
                      localStorage.setItem('activeTab', item.id);
                    }
                  }}

                className={cn(
                  'w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors',
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                )}
              >
                <div className="flex items-center space-x-3">
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.isNew && (
                  <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full font-medium">
                    New
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout */}
      <div className="p-4 border-t shrink-0">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
        <p className="text-sm text-gray-500 mt-1">Powered by Vibepeks</p>
      </div>
    </div>
  );
};

export default Sidebar;
