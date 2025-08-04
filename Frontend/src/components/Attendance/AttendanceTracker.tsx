
import React, { useState } from 'react';
import { Calendar, Check, X, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AttendanceRecord {
  studentId: string;
  studentName: string;
  class: string;
  date: string;
  status: 'present' | 'absent' | 'late';
}

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  class: string;
}

const AttendanceTracker = () => {
  const [selectedClass, setSelectedClass] = useState('Grade 10 - A');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const students: Student[] = [
    { id: '1', name: 'Alice Johnson', rollNumber: '001', class: 'Grade 10 - A' },
    { id: '2', name: 'Bob Smith', rollNumber: '002', class: 'Grade 10 - A' },
    { id: '3', name: 'Charlie Brown', rollNumber: '003', class: 'Grade 10 - A' },
    { id: '4', name: 'Diana Prince', rollNumber: '004', class: 'Grade 10 - A' },
    { id: '5', name: 'Edward Wilson', rollNumber: '005', class: 'Grade 10 - A' },
  ];

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([
    { studentId: '1', studentName: 'Alice Johnson', class: 'Grade 10 - A', date: selectedDate, status: 'present' },
    { studentId: '2', studentName: 'Bob Smith', class: 'Grade 10 - A', date: selectedDate, status: 'present' },
    { studentId: '3', studentName: 'Charlie Brown', class: 'Grade 10 - A', date: selectedDate, status: 'absent' },
    { studentId: '4', studentName: 'Diana Prince', class: 'Grade 10 - A', date: selectedDate, status: 'late' },
    { studentId: '5', studentName: 'Edward Wilson', class: 'Grade 10 - A', date: selectedDate, status: 'present' },
  ]);

  const classes = ['Grade 10 - A', 'Grade 10 - B', 'Grade 9 - A', 'Grade 9 - B'];

  const updateAttendance = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setAttendanceRecords(records =>
      records.map(record =>
        record.studentId === studentId && record.date === selectedDate
          ? { ...record, status }
          : record
      )
    );
  };

  const getTodayAttendance = () => {
    const todayRecords = attendanceRecords.filter(r => r.date === selectedDate && r.class === selectedClass);
    const present = todayRecords.filter(r => r.status === 'present').length;
    const absent = todayRecords.filter(r => r.status === 'absent').length;
    const late = todayRecords.filter(r => r.status === 'late').length;
    const total = todayRecords.length;
    
    return { present, absent, late, total, percentage: total > 0 ? ((present + late) / total * 100).toFixed(1) : 0 };
  };

  const stats = getTodayAttendance();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Attendance Tracking</h1>
        <p className="text-gray-600 mt-2">Track and manage student attendance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="text-green-500" size={20} />
              <div>
                <p className="text-sm text-gray-600">Present</p>
                <p className="text-2xl font-bold text-green-600">{stats.present}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <X className="text-red-500" size={20} />
              <div>
                <p className="text-sm text-gray-600">Absent</p>
                <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="text-orange-500" size={20} />
              <div>
                <p className="text-sm text-gray-600">Late</p>
                <p className="text-2xl font-bold text-orange-600">{stats.late}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="text-blue-500" size={20} />
              <div>
                <p className="text-sm text-gray-600">Attendance Rate</p>
                <p className="text-2xl font-bold text-blue-600">{stats.percentage}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="today" className="space-y-4">
        <TabsList>
          <TabsTrigger value="today">Today's Attendance</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          <div className="flex space-x-4">
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {classes.map(cls => (
                  <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border rounded-md"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Mark Attendance - {selectedClass}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {students.filter(s => s.class === selectedClass).map(student => {
                  const record = attendanceRecords.find(r => r.studentId === student.id && r.date === selectedDate);
                  const status = record?.status || 'present';
                  
                  return (
                    <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">{student.rollNumber}</span>
                        </div>
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-gray-500">Roll No: {student.rollNumber}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant={status === 'present' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateAttendance(student.id, 'present')}
                          className="flex items-center space-x-1"
                        >
                          <Check size={14} />
                          <span>Present</span>
                        </Button>
                        <Button
                          variant={status === 'late' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateAttendance(student.id, 'late')}
                        >
                          Late
                        </Button>
                        <Button
                          variant={status === 'absent' ? 'destructive' : 'outline'}
                          size="sm"
                          onClick={() => updateAttendance(student.id, 'absent')}
                          className="flex items-center space-x-1"
                        >
                          <X size={14} />
                          <span>Absent</span>
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Detailed attendance reports and analytics will be available here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AttendanceTracker;
