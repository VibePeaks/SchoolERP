
import React, { useState } from 'react';
import { Smartphone, Bell, Calendar, BookOpen, DollarSign, MessageSquare, Users, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const ParentPortalManagement = () => {
  const [selectedStudent, setSelectedStudent] = useState('1');

  const mockStudents = [
    { id: '1', name: 'Arjun Sharma', class: '10-A', rollNumber: '101' },
    { id: '2', name: 'Priya Sharma', class: '8-B', rollNumber: '201' }
  ];

  const mockAnnouncements = [
    {
      id: '1',
      title: 'Parent-Teacher Meeting Scheduled',
      message: 'PTM scheduled for January 20th, 2024. Please confirm your attendance.',
      date: '2024-01-15',
      priority: 'high',
      category: 'Meeting'
    },
    {
      id: '2',
      title: 'School Fee Reminder',
      message: 'Quarter fee payment due date is approaching. Please make payment by January 25th.',
      date: '2024-01-12',
      priority: 'medium',
      category: 'Fee'
    },
    {
      id: '3',
      title: 'Sports Day Event',
      message: 'Annual Sports Day will be held on February 10th. Registration open now.',
      date: '2024-01-10',
      priority: 'low',
      category: 'Event'
    }
  ];

  const mockAttendance = [
    { date: '2024-01-15', status: 'present', subject: 'All Subjects' },
    { date: '2024-01-14', status: 'present', subject: 'All Subjects' },
    { date: '2024-01-13', status: 'absent', subject: 'All Subjects', reason: 'Sick leave' },
    { date: '2024-01-12', status: 'present', subject: 'All Subjects' },
    { date: '2024-01-11', status: 'present', subject: 'All Subjects' }
  ];

  const mockGrades = [
    { subject: 'Mathematics', test: 'Unit Test 1', marks: 85, maxMarks: 100, grade: 'A' },
    { subject: 'Science', test: 'Unit Test 1', marks: 78, maxMarks: 100, grade: 'B+' },
    { subject: 'English', test: 'Unit Test 1', marks: 92, maxMarks: 100, grade: 'A+' },
    { subject: 'Social Studies', test: 'Unit Test 1', marks: 80, maxMarks: 100, grade: 'B+' },
    { subject: 'Hindi', test: 'Unit Test 1', marks: 88, maxMarks: 100, grade: 'A' }
  ];

  const mockFeeDetails = [
    { item: 'Tuition Fee', amount: 15000, status: 'paid', dueDate: '2024-01-10' },
    { item: 'Transport Fee', amount: 2000, status: 'paid', dueDate: '2024-01-10' },
    { item: 'Activity Fee', amount: 1500, status: 'pending', dueDate: '2024-01-25' },
    { item: 'Library Fee', amount: 500, status: 'pending', dueDate: '2024-01-25' }
  ];

  const mockHomework = [
    {
      subject: 'Mathematics',
      title: 'Algebra Problems',
      description: 'Complete exercises 1-20 from chapter 5',
      assignedDate: '2024-01-15',
      dueDate: '2024-01-18',
      status: 'pending'
    },
    {
      subject: 'Science',
      title: 'Physics Lab Report',
      description: 'Write a detailed report on the pendulum experiment',
      assignedDate: '2024-01-14',
      dueDate: '2024-01-20',
      status: 'submitted'
    },
    {
      subject: 'English',
      title: 'Essay Writing',
      description: 'Write a 500-word essay on "Environmental Conservation"',
      assignedDate: '2024-01-13',
      dueDate: '2024-01-19',
      status: 'pending'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAttendanceColor = (status: string) => {
    return status === 'present' ? 'text-green-600' : 'text-red-600';
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-600';
    if (grade.startsWith('B')) return 'text-blue-600';
    if (grade.startsWith('C')) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'submitted': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Parent Portal</h1>
          <p className="text-gray-600 mt-2">Stay connected with your child's education</p>
        </div>
        <div className="flex items-center space-x-4">
          <select 
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {mockStudents.map(student => (
              <option key={student.id} value={student.id}>
                {student.name} ({student.class})
              </option>
            ))}
          </select>
          <Button>
            <Bell size={20} className="mr-2" />
            Notifications
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar size={24} className="text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Attendance</p>
                <p className="text-2xl font-bold text-gray-900">94.5%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Star size={24} className="text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overall Grade</p>
                <p className="text-2xl font-bold text-gray-900">A-</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <BookOpen size={24} className="text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending HW</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <DollarSign size={24} className="text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Due Fees</p>
                <p className="text-2xl font-bold text-gray-900">₹2,000</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="announcements" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="grades">Grades</TabsTrigger>
          <TabsTrigger value="fees">Fees</TabsTrigger>
          <TabsTrigger value="homework">Homework</TabsTrigger>
          <TabsTrigger value="communication">Messages</TabsTrigger>
        </TabsList>

        <TabsContent value="announcements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Announcements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAnnouncements.map((announcement) => (
                  <div key={announcement.id} className="border-l-4 border-blue-500 pl-4 py-3">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">{announcement.title}</h3>
                      <div className="flex space-x-2">
                        <Badge variant="outline">{announcement.category}</Badge>
                        <Badge className={getPriorityColor(announcement.priority)}>
                          {announcement.priority}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-2">{announcement.message}</p>
                    <p className="text-sm text-gray-500">{new Date(announcement.date).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Record</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockAttendance.map((record, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{new Date(record.date).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-600">{record.subject}</p>
                      {record.reason && (
                        <p className="text-sm text-gray-500">Reason: {record.reason}</p>
                      )}
                    </div>
                    <Badge className={record.status === 'present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {record.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grades" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Academic Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockGrades.map((grade, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{grade.subject}</p>
                      <p className="text-sm text-gray-600">{grade.test}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{grade.marks}/{grade.maxMarks}</p>
                      <p className={`text-lg font-bold ${getGradeColor(grade.grade)}`}>
                        {grade.grade}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fees" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fee Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockFeeDetails.map((fee, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{fee.item}</p>
                      <p className="text-sm text-gray-600">Due: {new Date(fee.dueDate).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">₹{fee.amount.toLocaleString()}</p>
                      <Badge className={getStatusColor(fee.status)}>
                        {fee.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <Button className="w-full">Pay Pending Fees</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="homework" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Homework & Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockHomework.map((hw, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{hw.title}</h3>
                        <p className="text-sm text-blue-600">{hw.subject}</p>
                      </div>
                      <Badge className={getStatusColor(hw.status)}>
                        {hw.status}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{hw.description}</p>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Assigned: {new Date(hw.assignedDate).toLocaleDateString()}</span>
                      <span>Due: {new Date(hw.dueDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communication" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Messages & Communication</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Send Message to Teacher</h3>
                  <div className="space-y-3">
                    <Input placeholder="Subject" />
                    <Textarea placeholder="Type your message here..." rows={4} />
                    <Button>Send Message</Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold">Recent Messages</h3>
                  <div className="border rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium">Mrs. Priya (Math Teacher)</span>
                      <span className="text-sm text-gray-500">2 days ago</span>
                    </div>
                    <p className="text-gray-600">Arjun has shown great improvement in algebra. Keep up the good work!</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ParentPortalManagement;
