import React, { useState } from 'react';
import {
  Bell,
  Calendar,
  CircleUserRound,
  Layers3,
  LineChart,
  Wallet,
  Users,
} from 'lucide-react';
import HeaderTab from '@/components/Hostel/Layout/HeaderTab';
import SidebarItem from '@/components/Hostel/Layout/SidebarItem';

import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

// Card Wrapper Component
const Card = ({ children, className = '' }) => (
  <div className={`bg-[#2C2C2C] rounded-lg p-4 shadow ${className}`}>
    {children}
  </div>
);

// Donut Chart using react-circular-progressbar
const DonutChart = ({ label, percent, color }) => {
  const pathColor = {
    cyan: '#22d3ee',
    yellow: '#eab308',
    fuchsia: '#d946ef',
  }[color] || color;

  return (
    <div className="text-center w-24">
      <CircularProgressbar
        value={percent}
        text={`${percent}%`}
        strokeWidth={8}
        styles={buildStyles({
          pathColor,
          textColor: '#e5e7eb', // light gray text
          trailColor: '#1f2937', // dark trail
          textSize: '20px',
        })}
      />
      {label && <p className="mt-2 text-sm text-gray-300">{label}</p>}
    </div>
  );
};

// Student Card Component
const StudentCard = () => (
  <div className="flex items-center justify-between p-2 bg-[#1E1E1E] rounded">
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 rounded-full bg-cyan-400 flex items-center justify-center text-black font-bold text-sm">
        R
      </div>
      <div>
        <p className="text-sm font-medium">Ramakant Sharma</p>
        <p className="text-xs text-gray-400">12:30</p>
      </div>
    </div>
  </div>
);

// Main Component
const HostelManagement = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [activeSidebarItem, setActiveSidebarItem] = useState('Analytics');

  const sidebarItems = [
    { icon: <LineChart />, label: 'Analytics' },
    { icon: <CircleUserRound />, label: 'Students' },
    { icon: <Bell />, label: 'Complaints' },
    { icon: <Layers3 />, label: 'Stock' },
    { icon: <Users />, label: 'Users' },
    { icon: <Wallet />, label: 'Meals' },
  ];

  const headerTabs = ['Dashboard', 'Rooms', 'Attendance', 'Accounts', 'Maintenance'];

  return (
    <div className="flex h-screen bg-[#1E1E1E] text-white">
      {/* Sidebar */}
      <div className="w-64 bg-[#2C2C2C] p-4 flex flex-col justify-between">
        <div>
          <div className="text-cyan-400 text-2xl font-bold mb-10">HMS</div>
          <div className="space-y-4">
            {sidebarItems.map((item) => (
              <SidebarItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                active={activeSidebarItem === item.label}
                onClick={() => setActiveSidebarItem(item.label)}
              />
            ))}
          </div>
        </div>
        <div className="text-sm text-gray-500">v1.0.0</div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-16 bg-[#2C2C2C] flex items-center justify-between px-6 border-b border-gray-700">
          <div className="flex space-x-8">
            {headerTabs.map((tab) => (
              <HeaderTab
                key={tab}
                label={tab}
                active={activeTab === tab}
                onClick={() => setActiveTab(tab)}
              />
            ))}
          </div>
          <div className="flex space-x-4 items-center">
            <Calendar className="text-gray-400" />
            <Bell className="text-yellow-400" />
            <CircleUserRound className="text-cyan-400" />
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 grid grid-cols-4 gap-4 p-6 overflow-y-auto">
          {/* Occupancy */}
          <Card className="col-span-3">
            <h2 className="text-lg font-semibold mb-4">Occupancy</h2>
            <div className="flex space-x-6">
              <DonutChart label="Hostel 1" percent={50} color="cyan" />
              <DonutChart label="Hostel 2" percent={75} color="yellow" />
              <DonutChart label="Hostel 3" percent={95} color="fuchsia" />
            </div>
          </Card>

          {/* Student Updates */}
          <Card>
            <h2 className="text-lg font-semibold mb-4">Student Update</h2>
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <StudentCard key={i} />
              ))}
            </div>
          </Card>

          {/* Fees */}
          <Card className="col-span-3">
            <h2 className="text-lg font-semibold mb-4">Fees Collection</h2>
            <div className="flex justify-between items-center">
              <DonutChart label="" percent={50} color="cyan" />
              <div className="space-y-2">
                <p>Expected: ₹52,00,000</p>
                <p className="text-cyan-400">Collected: ₹26,00,000</p>
              </div>
              <div className="space-y-2">
                <p className="text-yellow-400">Remaining: ₹15,60,000</p>
                <p className="text-fuchsia-500">Overdue: ₹10,40,000</p>
              </div>
            </div>
          </Card>

          {/* Complaints */}
          <Card>
            <h2 className="text-lg font-semibold mb-4">Complaints</h2>
            <div className="space-y-2">
              <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-3 bg-cyan-400"
                  style={{ width: '60%' }}
                ></div>
              </div>
              <div className="text-sm">
                Total: 158 | Resolved: 96 | Open: 62
              </div>
            </div>
          </Card>

          {/* Emergency */}
          <Card className="col-span-4 flex justify-center items-center">
            <div className="text-center">
              <div className="text-red-500 text-4xl mb-2">
                <i className="fas fa-power-off"></i>
              </div>
              <p className="mb-2">Press only in Case of Emergency</p>
              <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                EMERGENCY
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HostelManagement;
