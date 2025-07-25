import React from 'react';
import { cn } from '@/lib/utils';

interface SidebarItemProps {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ label, icon, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-left transition-colors',
        active
          ? 'bg-[#1e1e2e] text-cyan-400'
          : 'text-white hover:bg-[#2a2a3b]'
      )}
    >
      <span className="text-xl">{icon}</span>
      <span className="font-medium">{label}</span>
    </button>
  );
};

export default SidebarItem;
