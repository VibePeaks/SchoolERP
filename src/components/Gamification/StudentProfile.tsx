import React from 'react';
import { useGamification } from '@/contexts/GamificationContext';
import { BadgeDisplay } from '@/components/ui/badge-display';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/ui/icons';

export const StudentProfile = () => {
  const { badges, points, level } = useGamification();
  const nextLevelPoints = level * 100;
  const progress = (points % 100) || 0;

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Student Achievements</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Level {level}</h3>
            <p className="text-sm text-gray-600">
              {points} points ({nextLevelPoints - points} to next level)
            </p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
            <Icons.trophy className="h-6 w-6 text-blue-600" />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-gray-600">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="space-y-3">
          <h3 className="font-medium">Your Badges</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {badges.map(badge => (
              <BadgeDisplay key={badge.id} {...badge} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};