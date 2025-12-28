import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/Layout/DashBoardLayout'; // ✅ new reusable layout
import SubscriptionProtectedRoute from '@/components/SubscriptionProtectedRoute';

// Pages
import Dashboard from '@/components/Dashboard/Dashboard';
import StudentList from '@/components/Students/StudentList';
import TeacherList from '@/components/Teachers/TeacherList';
import ClassList from '@/components/Classes/ClassList';
import AttendanceTracker from '@/components/Attendance/AttendanceTracker';
import FeeManagement from '@/components/Fees/FeeManagement';
import TransportManagement from '@/components/Transport/TransportManagement';
import InventoryManagement from '@/components/Inventory/InventoryManagement';
import ParentPortalManagement from '@/components/ParentPortal/ParentPortalManagement';
import LibraryManagement from '@/components/Library/LibraryManagement';
import HRPayrollManagement from '@/components/HR/HRPayrollManagement';
import ELearningManagement from '@/components/ELearning/ELearningManagement';
import NoticesManagement from '@/components/Notices/NoticesManagement';
import ExamManagement from '@/components/Exams/ExamManagement';
import Settings from '@/components/Settings/Settings';

const Index = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('activeTab') || 'dashboard');

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    localStorage.setItem('activeTab', tab);
  };

  if (!user) {
    console.log('No user found, redirecting to login');
    return <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-4">Authentication Required</h2>
        <p className="text-gray-600 mb-4">Please log in to access the dashboard</p>
        <button
          onClick={() => window.location.href = '/login'}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Go to Login
        </button>
      </div>
    </div>;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'students': return <StudentList />;
      case 'teachers': return <TeacherList />;
      case 'classes': return <ClassList />;
      case 'attendance': return <AttendanceTracker />;
      case 'fees': return <FeeManagement />;
      case 'exams': return <ExamManagement />;
      case 'notices': return <NoticesManagement />;
      case 'transport': return <TransportManagement />;
      case 'inventory': return <InventoryManagement />;
      case 'library':
        return (
          <SubscriptionProtectedRoute requiredPlan="premium" moduleName="Library Management">
            <LibraryManagement />
          </SubscriptionProtectedRoute>
        );
      case 'hr-payroll': return <HRPayrollManagement />;
      case 'e-learning':
        return (
          <SubscriptionProtectedRoute requiredPlan="premium" moduleName="E-Learning Platform">
            <ELearningManagement />
          </SubscriptionProtectedRoute>
        );
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={handleTabChange}>
      {renderContent()}
    </DashboardLayout>
  );
};

export default Index;
