import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, User, Phone, Mail, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useGamification } from '@/contexts/GamificationContext';

interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  joinDate: string;
  status: 'active' | 'on-leave';
}

const TeacherList = () => {
  const { addPoints, unlockBadge } = useGamification();
  const [teachers, setTeachers] = useState<Teacher[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@school.edu',
      phone: '+1234567890',
      subject: 'Mathematics',
      joinDate: '2020-01-15',
      status: 'active'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@school.edu',
      phone: '+1234567891',
      subject: 'Science',
      joinDate: '2019-08-20',
      status: 'active'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTeacher, setNewTeacher] = useState<Partial<Teacher>>({
    name: '',
    email: '',
    phone: '',
    subject: ''
  });

  const handleAddTeacher = () => {
    if (newTeacher.name && newTeacher.subject) {
      const teacherToAdd: Teacher = {
        id: Date.now().toString(),
        name: newTeacher.name,
        email: newTeacher.email || '',
        phone: newTeacher.phone || '',
        subject: newTeacher.subject,
        joinDate: new Date().toISOString().split('T')[0],
        status: 'active'
      };
      setTeachers([...teachers, teacherToAdd]);
      addPoints(15); // More points for adding teachers
      if (teachers.length >= 3) {
        unlockBadge('top-performer');
      }
      setNewTeacher({});
      setIsAddDialogOpen(false);
    }
  };

  const filteredTeachers = teachers.filter(teacher => 
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teacher Management</h1>
          <p className="text-gray-600 mt-2">Earn rewards for managing faculty</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus size={20} />
              <span>Add Teacher</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Teacher</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Full Name</Label>
                <Input 
                  value={newTeacher.name || ''}
                  onChange={(e) => setNewTeacher({...newTeacher, name: e.target.value})}
                />
              </div>
              <div>
                <Label>Subject</Label>
                <Input 
                  value={newTeacher.subject || ''}
                  onChange={(e) => setNewTeacher({...newTeacher, subject: e.target.value})}
                />
              </div>
              <Button onClick={handleAddTeacher}>Add Teacher</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <Input
          placeholder="Search teachers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTeachers.map(teacher => (
          <Card key={teacher.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <User size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <CardTitle>{teacher.name}</CardTitle>
                    <p className="text-sm text-gray-600">{teacher.subject}</p>
                  </div>
                </div>
                <Badge variant={teacher.status === 'active' ? 'default' : 'secondary'}>
                  {teacher.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Mail size={14} className="text-gray-400" />
                <span>{teacher.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Phone size={14} className="text-gray-400" />
                <span>{teacher.phone}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TeacherList;
