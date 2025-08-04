import React from 'react';
import { Users, GraduationCap, BookOpen, Calendar, DollarSign, TrendingUp, Clock, AlertCircle, MoreVertical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import StatsCard from './StatsCard';
import AttendanceChart from './AttendanceChart';

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Students',
      value: '1,248',
      change: '+12%',
      trend: 'up' as const,
      icon: Users,
      color: 'blue' as const
    },
    {
      title: 'Teaching Staff',
      value: '89',
      change: '+3%',
      trend: 'up' as const,
      icon: GraduationCap,
      color: 'purple' as const
    },
    {
      title: 'Classes',
      value: '42',
      change: '0%',
      trend: 'neutral' as const,
      icon: BookOpen,
      color: 'green' as const
    },
    {
      title: 'Today\'s Attendance',
      value: '94.2%',
      change: '+2.1%',
      trend: 'up' as const,
      icon: Calendar,
      color: 'orange' as const
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'fee',
      message: 'Fee payment received from Alice Johnson',
      time: '2 hours ago',
      status: 'success'
    },
    {
      id: 2,
      type: 'attendance',
      message: 'Attendance marked for Grade 10-A',
      time: '3 hours ago',
      status: 'info'
    },
    {
      id: 3,
      type: 'alert',
      message: '5 students absent today in Grade 9-B',
      time: '4 hours ago',
      status: 'warning'
    },
    {
      id: 4,
      type: 'fee',
      message: 'Fee reminder sent to 15 parents',
      time: '5 hours ago',
      status: 'info'
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'Parent-Teacher Meeting',
      date: '2024-01-20',
      time: '10:00 AM',
      type: 'meeting'
    },
    {
      id: 2,
      title: 'Annual Sports Day',
      date: '2024-01-25',
      time: '9:00 AM',
      type: 'event'
    },
    {
      id: 3,
      title: 'Mid-term Examinations',
      date: '2024-02-01',
      time: '9:00 AM',
      type: 'exam'
    },
    {
      id: 4,
      title: 'Science Fair',
      date: '2024-02-10',
      time: '2:00 PM',
      type: 'event'
    }
  ];

  const pendingTasks = [
    {
      id: 1,
      task: 'Review pending fee payments',
      priority: 'high',
      count: 23
    },
    {
      id: 2,
      task: 'Approve leave requests',
      priority: 'medium',
      count: 8
    },
    {
      id: 3,
      task: 'Update student records',
      priority: 'low',
      count: 12
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'fee': return <DollarSign size={16} className="text-green-500" />;
      case 'attendance': return <Calendar size={16} className="text-blue-500" />;
      case 'alert': return <AlertCircle size={16} className="text-orange-500" />;
      default: return <Clock size={16} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-50 border-l-4 border-green-500';
      case 'warning': return 'bg-orange-50 border-l-4 border-orange-500';
      case 'info': return 'bg-blue-50 border-l-4 border-blue-500';
      default: return 'bg-gray-50 border-l-4 border-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'meeting': return <div className="p-2 bg-blue-100 rounded-lg"><span className="text-blue-800">👥</span></div>;
      case 'event': return <div className="p-2 bg-purple-100 rounded-lg"><span className="text-purple-800">🎉</span></div>;
      case 'exam': return <div className="p-2 bg-yellow-100 rounded-lg"><span className="text-yellow-800">📝</span></div>;
      default: return <div className="p-2 bg-gray-100 rounded-lg"><span className="text-gray-800">📅</span></div>;
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header with improved typography */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">School Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening at your school today.</p>
        <div className="w-16 h-1 bg-blue-500 rounded-full mt-3"></div>
      </div>

      {/* Stats cards grid with improved spacing */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Attendance Chart - Wider column */}
        <div className="lg:col-span-2">
          <Card className="h-full shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <TrendingUp size={20} className="text-blue-500" />
                  <span>Attendance Overview</span>
                </CardTitle>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical size={18} />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <AttendanceChart />
            </CardContent>
            <CardFooter className="bg-gray-50 py-3 border-t">
              <p className="text-sm text-gray-500">Weekly average: 92.7% (+1.4% from last week)</p>
            </CardFooter>
          </Card>
        </div>

        {/* Recent Activities */}
        <div>
          <Card className="h-full shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Clock size={20} className="text-purple-500" />
                  <span>Recent Activities</span>
                </CardTitle>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical size={18} />
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {recentActivities.map((activity) => (
                  <div 
                    key={activity.id} 
                    className={`p-4 ${getStatusColor(activity.status)}`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="mt-0.5">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{activity.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Upcoming Events */}
        <div>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Calendar size={20} className="text-green-500" />
                  <span>Upcoming Events</span>
                </CardTitle>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical size={18} />
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {upcomingEvents.map((event) => (
                  <div 
                    key={event.id} 
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getEventIcon(event.type)}
                        <div>
                          <p className="font-medium text-gray-800">{event.title}</p>
                          <p className="text-sm text-gray-500">{event.time}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-600">
                          {new Date(event.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(event.date).toLocaleDateString('en-US', { 
                            weekday: 'short' 
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Tasks */}
        <div>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <AlertCircle size={20} className="text-orange-500" />
                  <span>Pending Tasks</span>
                </CardTitle>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical size={18} />
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {pendingTasks.map((task) => (
                  <div 
                    key={task.id} 
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{task.task}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={`${getPriorityColor(task.priority)} px-2 py-0.5 rounded`}>
                            {task.priority}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-2xl font-bold text-gray-700">
                          {task.count}
                        </span>
                        <span className="text-xs text-gray-500">items</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Card */}
        <div>
          <Card className="h-full bg-gradient-to-br from-blue-50 to-indigo-50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all">
                  <div className="p-3 bg-blue-100 rounded-full mb-2">
                    <Calendar size={20} className="text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Take Attendance</span>
                </button>
                <button className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all">
                  <div className="p-3 bg-green-100 rounded-full mb-2">
                    <DollarSign size={20} className="text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Record Payment</span>
                </button>
                <button className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all">
                  <div className="p-3 bg-purple-100 rounded-full mb-2">
                    <BookOpen size={20} className="text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Add Class</span>
                </button>
                <button className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all">
                  <div className="p-3 bg-orange-100 rounded-full mb-2">
                    <AlertCircle size={20} className="text-orange-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Send Alert</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;