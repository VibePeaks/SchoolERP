
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Users, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Class {
  id: string;
  name: string;
  section: string;
  teacher: string;
  subjects: string[];
  studentCount: number;
  schedule: string;
}

const ClassList = () => {
  const [classes, setClasses] = useState<Class[]>([
    {
      id: '1',
      name: 'Grade 10',
      section: 'A',
      teacher: 'John Smith',
      subjects: ['Mathematics', 'Physics', 'Chemistry', 'English'],
      studentCount: 32,
      schedule: 'Morning'
    },
    {
      id: '2',
      name: 'Grade 10',
      section: 'B',
      teacher: 'Sarah Johnson',
      subjects: ['Mathematics', 'Physics', 'Biology', 'English'],
      studentCount: 28,
      schedule: 'Morning'
    },
    {
      id: '3',
      name: 'Grade 9',
      section: 'A',
      teacher: 'Mike Davis',
      subjects: ['Mathematics', 'Science', 'English', 'History'],
      studentCount: 30,
      schedule: 'Afternoon'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newClass, setNewClass] = useState<Partial<Class>>({
    name: '',
    section: '',
    teacher: '',
    subjects: [],
    studentCount: 0,
    schedule: 'Morning'
  });

  const filteredClasses = classes.filter(cls =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.teacher.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddClass = () => {
    if (newClass.name && newClass.section && newClass.teacher) {
      const classToAdd: Class = {
        id: Date.now().toString(),
        name: newClass.name,
        section: newClass.section,
        teacher: newClass.teacher,
        subjects: newClass.subjects || [],
        studentCount: newClass.studentCount || 0,
        schedule: newClass.schedule || 'Morning'
      };
      setClasses([...classes, classToAdd]);
      setNewClass({ name: '', section: '', teacher: '', subjects: [], studentCount: 0, schedule: 'Morning' });
      setIsAddDialogOpen(false);
    }
  };

  const handleDeleteClass = (id: string) => {
    setClasses(classes.filter(cls => cls.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Class Management</h1>
          <p className="text-gray-600 mt-2">Manage classes, sections, and assignments</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus size={20} />
              <span>Add Class</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Class</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="className">Class Name</Label>
                <Input
                  id="className"
                  value={newClass.name || ''}
                  onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                  placeholder="e.g., Grade 10"
                />
              </div>
              <div>
                <Label htmlFor="section">Section</Label>
                <Input
                  id="section"
                  value={newClass.section || ''}
                  onChange={(e) => setNewClass({ ...newClass, section: e.target.value })}
                  placeholder="e.g., A"
                />
              </div>
              <div>
                <Label htmlFor="teacher">Class Teacher</Label>
                <Input
                  id="teacher"
                  value={newClass.teacher || ''}
                  onChange={(e) => setNewClass({ ...newClass, teacher: e.target.value })}
                  placeholder="Teacher name"
                />
              </div>
              <div>
                <Label htmlFor="schedule">Schedule</Label>
                <Select value={newClass.schedule || 'Morning'} onValueChange={(value) => setNewClass({ ...newClass, schedule: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Morning">Morning</SelectItem>
                    <SelectItem value="Afternoon">Afternoon</SelectItem>
                    <SelectItem value="Evening">Evening</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddClass} className="w-full">Add Class</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-4">
        <Input
          placeholder="Search classes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((cls) => (
          <Card key={cls.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{cls.name} - {cls.section}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">Teacher: {cls.teacher}</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm">
                    <Edit size={16} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteClass(cls.id)}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users size={16} className="text-blue-500" />
                    <span className="text-sm">Students: {cls.studentCount}</span>
                  </div>
                  <Badge variant={cls.schedule === 'Morning' ? 'default' : 'secondary'}>
                    {cls.schedule}
                  </Badge>
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <BookOpen size={16} className="text-green-500" />
                    <span className="text-sm font-medium">Subjects:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {cls.subjects.map((subject, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ClassList;
