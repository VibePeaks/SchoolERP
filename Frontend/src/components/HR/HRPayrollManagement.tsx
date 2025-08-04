
import React, { useState } from 'react';
import { UserCheck, DollarSign, Calendar, FileText, Clock, TrendingUp, AlertCircle, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Employee {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  position: string;
  salary: number;
  joinDate: string;
  status: 'active' | 'inactive';
  email: string;
  phone: string;
}

interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: 'sick' | 'casual' | 'annual' | 'maternity' | 'emergency';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
}

interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  month: string;
  year: number;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: 'pending' | 'processed' | 'paid';
}

interface Attendance {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut: string;
  hoursWorked: number;
  status: 'present' | 'absent' | 'half-day' | 'late';
}

const HRPayrollManagement = () => {
  const [selectedMonth, setSelectedMonth] = useState('2024-01');
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);

  const mockEmployees: Employee[] = [
    {
      id: '1',
      name: 'Dr. Rajesh Kumar',
      employeeId: 'EMP001',
      department: 'Academic',
      position: 'Principal',
      salary: 80000,
      joinDate: '2020-06-01',
      status: 'active',
      email: 'rajesh@school.com',
      phone: '+91-9876543210'
    },
    {
      id: '2',
      name: 'Mrs. Priya Sharma',
      employeeId: 'EMP002',
      department: 'Academic',
      position: 'Mathematics Teacher',
      salary: 45000,
      joinDate: '2021-07-15',
      status: 'active',
      email: 'priya@school.com',
      phone: '+91-9876543211'
    },
    {
      id: '3',
      name: 'Mr. Amit Patel',
      employeeId: 'EMP003',
      department: 'Administration',
      position: 'Office Manager',
      salary: 35000,
      joinDate: '2022-04-01',
      status: 'active',
      email: 'amit@school.com',
      phone: '+91-9876543212'
    },
    {
      id: '4',
      name: 'Ms. Sneha Gupta',
      employeeId: 'EMP004',
      department: 'Academic',
      position: 'Science Teacher',
      salary: 42000,
      joinDate: '2021-08-20',
      status: 'active',
      email: 'sneha@school.com',
      phone: '+91-9876543213'
    }
  ];

  const mockLeaveRequests: LeaveRequest[] = [
    {
      id: '1',
      employeeId: 'EMP002',
      employeeName: 'Mrs. Priya Sharma',
      leaveType: 'sick',
      startDate: '2024-01-20',
      endDate: '2024-01-22',
      days: 3,
      reason: 'Fever and flu symptoms',
      status: 'pending',
      appliedDate: '2024-01-18'
    },
    {
      id: '2',
      employeeId: 'EMP004',
      employeeName: 'Ms. Sneha Gupta',
      leaveType: 'casual',
      startDate: '2024-01-25',
      endDate: '2024-01-25',
      days: 1,
      reason: 'Personal work',
      status: 'approved',
      appliedDate: '2024-01-15'
    },
    {
      id: '3',
      employeeId: 'EMP003',
      employeeName: 'Mr. Amit Patel',
      leaveType: 'annual',
      startDate: '2024-02-10',
      endDate: '2024-02-15',
      days: 6,
      reason: 'Family vacation',
      status: 'pending',
      appliedDate: '2024-01-16'
    }
  ];

  const mockPayrollRecords: PayrollRecord[] = [
    {
      id: '1',
      employeeId: 'EMP001',
      employeeName: 'Dr. Rajesh Kumar',
      month: 'January',
      year: 2024,
      basicSalary: 80000,
      allowances: 15000,
      deductions: 12000,
      netSalary: 83000,
      status: 'paid'
    },
    {
      id: '2',
      employeeId: 'EMP002',
      employeeName: 'Mrs. Priya Sharma',
      month: 'January',
      year: 2024,
      basicSalary: 45000,
      allowances: 8000,
      deductions: 6500,
      netSalary: 46500,
      status: 'processed'
    },
    {
      id: '3',
      employeeId: 'EMP003',
      employeeName: 'Mr. Amit Patel',
      month: 'January',
      year: 2024,
      basicSalary: 35000,
      allowances: 5000,
      deductions: 4500,
      netSalary: 35500,
      status: 'pending'
    },
    {
      id: '4',
      employeeId: 'EMP004',
      employeeName: 'Ms. Sneha Gupta',
      month: 'January',
      year: 2024,
      basicSalary: 42000,
      allowances: 7000,
      deductions: 5800,
      netSalary: 43200,
      status: 'processed'
    }
  ];

  const mockAttendance: Attendance[] = [
    {
      id: '1',
      employeeId: 'EMP002',
      employeeName: 'Mrs. Priya Sharma',
      date: '2024-01-16',
      checkIn: '08:30',
      checkOut: '16:30',
      hoursWorked: 8,
      status: 'present'
    },
    {
      id: '2',
      employeeId: 'EMP004',
      employeeName: 'Ms. Sneha Gupta',
      date: '2024-01-16',
      checkIn: '09:15',
      checkOut: '16:30',
      hoursWorked: 7.25,
      status: 'late'
    },
    {
      id: '3',
      employeeId: 'EMP003',
      employeeName: 'Mr. Amit Patel',
      date: '2024-01-16',
      checkIn: '',
      checkOut: '',
      hoursWorked: 0,
      status: 'absent'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': case 'processed': case 'paid': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'present': return 'bg-green-100 text-green-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'late': return 'bg-yellow-100 text-yellow-800';
      case 'half-day': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLeaveTypeColor = (type: string) => {
    switch (type) {
      case 'sick': return 'bg-red-100 text-red-800';
      case 'casual': return 'bg-blue-100 text-blue-800';
      case 'annual': return 'bg-green-100 text-green-800';
      case 'maternity': return 'bg-purple-100 text-purple-800';
      case 'emergency': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalSalaryBudget = mockPayrollRecords.reduce((sum, record) => sum + record.netSalary, 0);
  const pendingLeaves = mockLeaveRequests.filter(req => req.status === 'pending').length;
  const totalEmployees = mockEmployees.filter(emp => emp.status === 'active').length;
  const presentToday = mockAttendance.filter(att => att.status === 'present' || att.status === 'late').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">HR & Payroll Management</h1>
          <p className="text-gray-600 mt-2">Manage staff, payroll, leaves, and attendance</p>
        </div>
        <Dialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Calendar size={20} className="mr-2" />
              Apply Leave
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Apply for Leave</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="employee">Employee</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockEmployees.map(emp => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.name} ({emp.employeeId})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="leaveType">Leave Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select leave type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sick">Sick Leave</SelectItem>
                    <SelectItem value="casual">Casual Leave</SelectItem>
                    <SelectItem value="annual">Annual Leave</SelectItem>
                    <SelectItem value="maternity">Maternity Leave</SelectItem>
                    <SelectItem value="emergency">Emergency Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input id="startDate" type="date" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input id="endDate" type="date" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="reason">Reason</Label>
                <Textarea id="reason" placeholder="Enter reason for leave" rows={3} />
              </div>
              <Button className="w-full">Submit Leave Request</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <UserCheck className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold text-gray-900">{totalEmployees}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Present Today</p>
                <p className="text-2xl font-bold text-gray-900">{presentToday}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Leaves</p>
                <p className="text-2xl font-bold text-gray-900">{pendingLeaves}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Monthly Payroll</p>
                <p className="text-2xl font-bold text-gray-900">₹{(totalSalaryBudget / 1000).toFixed(0)}K</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="employees" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="leaves">Leave Management</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Employee Directory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockEmployees.map((employee) => (
                  <div key={employee.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold">{employee.name}</h3>
                      <p className="text-sm text-gray-600">{employee.position} - {employee.department}</p>
                      <p className="text-sm text-gray-500">
                        ID: {employee.employeeId} | Joined: {new Date(employee.joinDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        {employee.email} | {employee.phone}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">₹{employee.salary.toLocaleString()}</p>
                      <Badge className={getStatusColor(employee.status)}>
                        {employee.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Today's Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAttendance.map((record) => (
                  <div key={record.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold">{record.employeeName}</h3>
                      <p className="text-sm text-gray-600">Date: {new Date(record.date).toLocaleDateString()}</p>
                      {record.checkIn && (
                        <p className="text-sm text-gray-500">
                          Check-in: {record.checkIn} | Check-out: {record.checkOut || 'Not checked out'}
                        </p>
                      )}
                      <p className="text-sm text-gray-500">Hours Worked: {record.hoursWorked}</p>
                    </div>
                    <Badge className={getStatusColor(record.status)}>
                      {record.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaves" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Leave Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockLeaveRequests.map((request) => (
                  <div key={request.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">{request.employeeName}</h3>
                        <p className="text-sm text-gray-600">Applied: {new Date(request.appliedDate).toLocaleDateString()}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Badge className={getLeaveTypeColor(request.leaveType)}>
                          {request.leaveType}
                        </Badge>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Duration:</span> {new Date(request.startDate).toLocaleDateString()} to {new Date(request.endDate).toLocaleDateString()} ({request.days} days)</p>
                      <p><span className="font-medium">Reason:</span> {request.reason}</p>
                    </div>
                    {request.status === 'pending' && (
                      <div className="flex space-x-2 mt-3">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">Approve</Button>
                        <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">Reject</Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payroll" className="space-y-4">
          <div className="flex justify-between items-center">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024-01">January 2024</SelectItem>
                <SelectItem value="2023-12">December 2023</SelectItem>
                <SelectItem value="2023-11">November 2023</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Download size={16} className="mr-2" />
                Export Payroll
              </Button>
              <Button>Process Payroll</Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Payroll Records - January 2024</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockPayrollRecords.map((record) => (
                  <div key={record.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">{record.employeeName}</h3>
                        <p className="text-sm text-gray-600">{record.month} {record.year}</p>
                      </div>
                      <Badge className={getStatusColor(record.status)}>
                        {record.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-gray-600">Basic Salary</p>
                        <p className="font-bold">₹{record.basicSalary.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-600">Allowances</p>
                        <p className="font-bold text-green-600">+₹{record.allowances.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-600">Deductions</p>
                        <p className="font-bold text-red-600">-₹{record.deductions.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-600">Net Salary</p>
                        <p className="font-bold text-lg">₹{record.netSalary.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-3">
                      <Button size="sm" variant="outline">View Slip</Button>
                      {record.status === 'processed' && (
                        <Button size="sm">Mark as Paid</Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Payroll Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Basic Salary:</span>
                    <span className="font-bold">₹{mockPayrollRecords.reduce((sum, r) => sum + r.basicSalary, 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Allowances:</span>
                    <span className="font-bold text-green-600">₹{mockPayrollRecords.reduce((sum, r) => sum + r.allowances, 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Deductions:</span>
                    <span className="font-bold text-red-600">₹{mockPayrollRecords.reduce((sum, r) => sum + r.deductions, 0).toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between">
                      <span className="font-semibold">Net Payroll:</span>
                      <span className="font-bold text-lg">₹{totalSalaryBudget.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Leave Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Pending Requests:</span>
                    <span className="font-bold">{mockLeaveRequests.filter(r => r.status === 'pending').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Approved This Month:</span>
                    <span className="font-bold text-green-600">{mockLeaveRequests.filter(r => r.status === 'approved').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rejected This Month:</span>
                    <span className="font-bold text-red-600">{mockLeaveRequests.filter(r => r.status === 'rejected').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Leave Days:</span>
                    <span className="font-bold">{mockLeaveRequests.reduce((sum, r) => sum + r.days, 0)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Attendance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{mockAttendance.filter(a => a.status === 'present').length}</p>
                  <p className="text-sm text-gray-600">Present</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <p className="text-2xl font-bold text-red-600">{mockAttendance.filter(a => a.status === 'absent').length}</p>
                  <p className="text-sm text-gray-600">Absent</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-600">{mockAttendance.filter(a => a.status === 'late').length}</p>
                  <p className="text-sm text-gray-600">Late</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{mockAttendance.filter(a => a.status === 'half-day').length}</p>
                  <p className="text-sm text-gray-600">Half Day</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HRPayrollManagement;
