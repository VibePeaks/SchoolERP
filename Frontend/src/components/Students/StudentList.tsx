import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, User, Phone, Mail, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGamification } from '@/contexts/GamificationContext';

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  class: string;
  section: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  phone: string;
  email: string;
  parentName: string;
  parentPhone: string;
  admissionDate: string;
  status: 'active' | 'inactive';
  feeStatus: 'paid' | 'pending' | 'overdue';
  attendancePercentage: number;
}

const StudentList = () => {
  const { addPoints, unlockBadge } = useGamification();
  const [students, setStudents] = useState<Student[]>([
    {
      id: '1',
      name: 'Alice Johnson',
      rollNumber: 'STU001',
      class: 'Grade 10',
      section: 'A',
      dateOfBirth: '2008-05-15',
      gender: 'Female',
      address: '123 Main St, City',
      phone: '+1234567890',
      email: 'alice.johnson@email.com',
      parentName: 'Robert Johnson',
      parentPhone: '+1234567891',
      admissionDate: '2023-04-01',
      status: 'active',
      feeStatus: 'paid',
      attendancePercentage: 92
    },
    {
      id: '2',
      name: 'Bob Smith',
      rollNumber: 'STU002',
      class: 'Grade 10',
      section: 'A',
      dateOfBirth: '2008-08-22',
      gender: 'Male',
      address: '456 Oak Ave, City',
      phone: '+1234567892',
      email: 'bob.smith@email.com',
      parentName: 'Mary Smith',
      parentPhone: '+1234567893',
      admissionDate: '2023-04-01',
      status: 'active',
      feeStatus: 'pending',
      attendancePercentage: 88
    },
    {
      id: '3',
      name: 'Charlie Brown',
      rollNumber: 'STU003',
      class: 'Grade 9',
      section: 'A',
      dateOfBirth: '2009-02-10',
      gender: 'Male',
      address: '789 Pine St, City',
      phone: '+1234567894',
      email: 'charlie.brown@email.com',
      parentName: 'Lisa Brown',
      parentPhone: '+1234567895',
      admissionDate: '2023-04-01',
      status: 'active',
      feeStatus: 'overdue',
      attendancePercentage: 76
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newStudent, setNewStudent] = useState<Partial<Student>>({
    name: '',
    rollNumber: '',
    class: '',
    section: '',
    gender: '',
    parentName: '',
    parentPhone: ''
  });

  const classes = ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];
  const sections = ['A', 'B', 'C'];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = filterClass === 'all' || student.class === filterClass;
    return matchesSearch && matchesClass;
  });

  const handleAddStudent = () => {
    if (newStudent.name && newStudent.rollNumber && newStudent.class) {
      const studentToAdd: Student = {
        id: Date.now().toString(),
        name: newStudent.name,
        rollNumber: newStudent.rollNumber,
        class: newStudent.class,
        section: newStudent.section || 'A',
        dateOfBirth: newStudent.dateOfBirth || '',
        gender: newStudent.gender || 'Male',
        address: newStudent.address || '',
        phone: newStudent.phone || '',
        email: newStudent.email || '',
        parentName: newStudent.parentName || '',
        parentPhone: newStudent.parentPhone || '',
        admissionDate: new Date().toISOString().split('T')[0],
        status: 'active',
        feeStatus: 'pending',
        attendancePercentage: 0
      };
      setStudents([...students, studentToAdd]);
      addPoints(10); // Award 10 points for adding a student
      if (students.length >= 5) {
        unlockBadge('homework-champion');
      }
      setNewStudent({});
      setIsAddDialogOpen(false);
    }
  };

  const handleDeleteStudent = (id: string) => {
    setStudents(students.filter(student => student.id !== id));
    addPoints(5); // Award 5 points for maintaining records
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
          <p className="text-gray-600 mt-2">Earn points and badges for your actions!</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus size={20} />
              <span>Add Student</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newStudent.name || ''}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  placeholder="Student name"
                />
              </div>
              <div>
                <Label htmlFor="rollNumber">Roll Number</Label>
                <Input
                  id="rollNumber"
                  value={newStudent.rollNumber || ''}
                  onChange={(e) => setNewStudent({ ...newStudent, rollNumber: e.target.value })}
                  placeholder="Roll number"
                />
              </div>
              <div>
                <Label htmlFor="class">Class</Label>
                <Select value={newStudent.class || ''} onValueChange={(value) => setNewStudent({ ...newStudent, class: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map(cls => (
                      <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="section">Section</Label>
                <Select value={newStudent.section || ''} onValueChange={(value) => setNewStudent({ ...newStudent, section: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.map(section => (
                      <SelectItem key={section} value={section}>{section}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select value={newStudent.gender || ''} onValueChange={(value) => setNewStudent({ ...newStudent, gender: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="parentName">Parent Name</Label>
                <Input
                  id="parentName"
                  value={newStudent.parentName || ''}
                  onChange={(e) => setNewStudent({ ...newStudent, parentName: e.target.value })}
                  placeholder="Parent/Guardian name"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="parentPhone">Parent Phone</Label>
                <Input
                  id="parentPhone"
                  value={newStudent.parentPhone || ''}
                  onChange={(e) => setNewStudent({ ...newStudent, parentPhone: e.target.value })}
                  placeholder="Parent contact number"
                />
              </div>
            </div>
            <Button onClick={handleAddStudent} className="w-full mt-4">Add Student</Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterClass} onValueChange={setFilterClass}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            {classes.map(cls => (
              <SelectItem key={cls} value={cls}>{cls}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <Card key={student.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{student.name}</CardTitle>
                    <p className="text-sm text-gray-600">{student.rollNumber}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm">
                    <Edit size={16} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteStudent(student.id)}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{student.class} - {student.section}</span>
                  <Badge className={getStatusColor(student.status)}>
                    {student.status}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone size={14} className="text-gray-400" />
                    <span>{student.parentPhone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar size={14} className="text-gray-400" />
                    <span className={getAttendanceColor(student.attendancePercentage)}>
                      {student.attendancePercentage}% Attendance
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-sm text-gray-600">Fee Status:</span>
                  <Badge className={getStatusColor(student.feeStatus)}>
                    {student.feeStatus}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StudentList;
