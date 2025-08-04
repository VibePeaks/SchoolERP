import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children, activeTab, setActiveTab }) => {
  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-50">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 h-16 z-30 bg-white shadow flex items-center px-6">
        <Header />
      </div>

      {/* Sidebar + Content */}
      <div className="flex pt-16 h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r shadow h-full">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
