import React from 'react';
import { cn } from '@/lib/utils';

interface HeaderTabProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

const HeaderTab: React.FC<HeaderTabProps> = ({ label, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-4 py-2 rounded-md font-medium transition',
        active
          ? 'bg-[#11111b] text-cyan-400'
          : 'text-white hover:bg-[#1f1f2e]'
      )}
    >
      {label}
    </button>
  );
};

export default HeaderTab;
