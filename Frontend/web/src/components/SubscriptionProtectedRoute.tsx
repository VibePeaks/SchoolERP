import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { SubscriptionPlan } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Lock } from 'lucide-react';

interface SubscriptionProtectedRouteProps {
  children: React.ReactNode;
  requiredPlan: SubscriptionPlan;
  moduleName: string;
}

const SubscriptionProtectedRoute = ({
  children,
  requiredPlan,
  moduleName
}: SubscriptionProtectedRouteProps) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return null; // or <Loader /> if you want

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  // Check subscription plan hierarchy: basic < premium < enterprise
  const planHierarchy = {
    basic: 1,
    premium: 2,
    enterprise: 3
  };

  const userPlanLevel = planHierarchy[user.subscriptionPlan];
  const requiredPlanLevel = planHierarchy[requiredPlan];

  if (userPlanLevel < requiredPlanLevel) {
    // Show upgrade prompt
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-yellow-600" />
            </div>
            <CardTitle className="text-xl">{moduleName} - Premium Feature</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              This module requires a <span className="font-semibold capitalize">{requiredPlan}</span> subscription plan.
            </p>
            <p className="text-gray-600">
              Your current plan: <span className="font-semibold capitalize">{user.subscriptionPlan}</span>
            </p>
            <div className="space-y-2">
              <Button className="w-full" size="lg">
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to {requiredPlan === 'premium' ? 'Premium' : 'Enterprise'}
              </Button>
              <Button variant="outline" className="w-full">
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default SubscriptionProtectedRoute;
