import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/ui/icons';

interface BadgeDisplayProps {
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  dateEarned?: string;
}

const iconComponents: Record<string, React.ComponentType<{ className?: string }>> = {
  'calendar-check': Icons.calendarCheck,
  'book-check': Icons.bookCheck,
  'trophy': Icons.trophy,
  // Add more icons as needed
};

export const BadgeDisplay = ({
  name,
  description,
  icon,
  earned,
  dateEarned
}: BadgeDisplayProps) => {
  const IconComponent = iconComponents[icon] || Icons.award;

  return (
    <div className={`relative p-4 rounded-lg border ${earned ? 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-full ${earned ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-500'}`}>
          <IconComponent className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium">{name}</h3>
          <p className="text-sm text-gray-600">{description}</p>
          {earned && dateEarned && (
            <p className="text-xs text-gray-500 mt-1">
              Earned: {new Date(dateEarned).toLocaleDateString()}
            </p>
          )}
        </div>
        <Badge variant={earned ? 'default' : 'secondary'}>
          {earned ? 'Earned' : 'Locked'}
        </Badge>
      </div>
      {!earned && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] rounded-lg" />
      )}
    </div>
  );
};