
import React, { useState } from 'react';
import { Monitor, BookOpen, Play, Users, Clock, Award, Upload, Download, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Course {
  id: string;
  title: string;
  subject: string;
  teacher: string;
  description: string;
  duration: string;
  studentsEnrolled: number;
  progress: number;
  status: 'active' | 'draft' | 'completed';
  createdDate: string;
  thumbnail: string;
}

interface Assignment {
  id: string;
  title: string;
  subject: string;
  courseId: string;
  dueDate: string;
  totalMarks: number;
  submissionsReceived: number;
  totalStudents: number;
  status: 'active' | 'closed' | 'grading';
  description: string;
}

interface VirtualClass {
  id: string;
  title: string;
  subject: string;
  teacher: string;
  scheduledDate: string;
  scheduledTime: string;
  duration: number;
  meetingLink: string;
  studentsJoined: number;
  maxStudents: number;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
}

interface Quiz {
  id: string;
  title: string;
  subject: string;
  questions: number;
  timeLimit: number;
  attempts: number;
  passingScore: number;
  studentsAttempted: number;
  averageScore: number;
  status: 'active' | 'draft' | 'closed';
}

const ELearningManagement = () => {
  const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false);
  const [isScheduleClassOpen, setIsScheduleClassOpen] = useState(false);

  const mockCourses: Course[] = [
    {
      id: '1',
      title: 'Advanced Mathematics - Calculus',
      subject: 'Mathematics',
      teacher: 'Mrs. Priya Sharma',
      description: 'Comprehensive course covering differential and integral calculus',
      duration: '12 weeks',
      studentsEnrolled: 45,
      progress: 75,
      status: 'active',
      createdDate: '2024-01-01',
      thumbnail: '/api/placeholder/300/200'
    },
    {
      id: '2',
      title: 'Organic Chemistry Fundamentals',
      subject: 'Chemistry',
      teacher: 'Dr. Rajesh Kumar',
      description: 'Introduction to organic chemistry concepts and reactions',
      duration: '10 weeks',
      studentsEnrolled: 38,
      progress: 60,
      status: 'active',
      createdDate: '2024-01-05',
      thumbnail: '/api/placeholder/300/200'
    },
    {
      id: '3',
      title: 'English Literature - Shakespeare',
      subject: 'English',
      teacher: 'Ms. Anjali Gupta',
      description: 'Study of Shakespeare\'s major works and their historical context',
      duration: '8 weeks',
      studentsEnrolled: 52,
      progress: 90,
      status: 'active',
      createdDate: '2023-12-15',
      thumbnail: '/api/placeholder/300/200'
    }
  ];

  const mockAssignments: Assignment[] = [
    {
      id: '1',
      title: 'Calculus Problem Set 1',
      subject: 'Mathematics',
      courseId: '1',
      dueDate: '2024-01-25',
      totalMarks: 100,
      submissionsReceived: 35,
      totalStudents: 45,
      status: 'active',
      description: 'Solve the given differential equations and integration problems'
    },
    {
      id: '2',
      title: 'Organic Reactions Lab Report',
      subject: 'Chemistry',
      courseId: '2',
      dueDate: '2024-01-22',
      totalMarks: 50,
      submissionsReceived: 28,
      totalStudents: 38,
      status: 'grading',
      description: 'Submit detailed lab report on organic synthesis experiment'
    },
    {
      id: '3',
      title: 'Hamlet Character Analysis',
      subject: 'English',
      courseId: '3',
      dueDate: '2024-01-20',
      totalMarks: 75,
      submissionsReceived: 52,
      totalStudents: 52,
      status: 'closed',
      description: 'Analyze the character development in Shakespeare\'s Hamlet'
    }
  ];

  const mockVirtualClasses: VirtualClass[] = [
    {
      id: '1',
      title: 'Calculus - Limits and Continuity',
      subject: 'Mathematics',
      teacher: 'Mrs. Priya Sharma',
      scheduledDate: '2024-01-18',
      scheduledTime: '10:00',
      duration: 60,
      meetingLink: 'https://zoom.us/j/123456789',
      studentsJoined: 42,
      maxStudents: 45,
      status: 'completed'
    },
    {
      id: '2',
      title: 'Organic Chemistry - Reactions',
      subject: 'Chemistry',
      teacher: 'Dr. Rajesh Kumar',
      scheduledDate: '2024-01-19',
      scheduledTime: '14:00',
      duration: 45,
      meetingLink: 'https://teams.microsoft.com/l/meetup-join/19%3a...',
      studentsJoined: 0,
      maxStudents: 38,
      status: 'scheduled'
    },
    {
      id: '3',
      title: 'Shakespeare Discussion Forum',
      subject: 'English',
      teacher: 'Ms. Anjali Gupta',
      scheduledDate: '2024-01-17',
      scheduledTime: '15:30',
      duration: 90,
      meetingLink: 'https://meet.google.com/abc-defg-hij',
      studentsJoined: 48,
      maxStudents: 52,
      status: 'live'
    }
  ];

  const mockQuizzes: Quiz[] = [
    {
      id: '1',
      title: 'Calculus Basics Quiz',
      subject: 'Mathematics',
      questions: 20,
      timeLimit: 30,
      attempts: 2,
      passingScore: 70,
      studentsAttempted: 43,
      averageScore: 82,
      status: 'active'
    },
    {
      id: '2',
      title: 'Organic Chemistry Mid-term',
      subject: 'Chemistry',
      questions: 50,
      timeLimit: 90,
      attempts: 1,
      passingScore: 60,
      studentsAttempted: 36,
      averageScore: 76,
      status: 'closed'
    },
    {
      id: '3',
      title: 'Literature Analysis Quiz',
      subject: 'English',
      questions: 15,
      timeLimit: 25,
      attempts: 3,
      passingScore: 75,
      studentsAttempted: 51,
      averageScore: 88,
      status: 'active'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': case 'live': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': case 'closed': return 'bg-gray-100 text-gray-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'grading': return 'bg-orange-100 text-orange-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalCourses = mockCourses.length;
  const activeCourses = mockCourses.filter(c => c.status === 'active').length;
  const totalStudentsEnrolled = mockCourses.reduce((sum, course) => sum + course.studentsEnrolled, 0);
  const pendingAssignments = mockAssignments.filter(a => a.status === 'active').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">E-Learning Platform</h1>
          <p className="text-gray-600 mt-2">Digital learning management and virtual classrooms</p>
        </div>
        <div className="flex space-x-3">
          <Dialog open={isCreateCourseOpen} onOpenChange={setIsCreateCourseOpen}>
            <DialogTrigger asChild>
              <Button>
                <BookOpen size={20} className="mr-2" />
                Create Course
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Course</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Course Title</Label>
                  <Input id="title" placeholder="Enter course title" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mathematics">Mathematics</SelectItem>
                      <SelectItem value="science">Science</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="history">History</SelectItem>
                      <SelectItem value="geography">Geography</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Course description" rows={3} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="duration">Duration (weeks)</Label>
                  <Input id="duration" type="number" placeholder="12" />
                </div>
                <Button className="w-full">Create Course</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isScheduleClassOpen} onOpenChange={setIsScheduleClassOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Monitor size={20} className="mr-2" />
                Schedule Class
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Schedule Virtual Class</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="classTitle">Class Title</Label>
                  <Input id="classTitle" placeholder="Enter class title" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="classSubject">Subject</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mathematics">Mathematics</SelectItem>
                      <SelectItem value="science">Science</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="classDate">Date</Label>
                    <Input id="classDate" type="date" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="classTime">Time</Label>
                    <Input id="classTime" type="time" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input id="duration" type="number" placeholder="60" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="meetingLink">Meeting Link</Label>
                  <Input id="meetingLink" placeholder="https://zoom.us/j/..." />
                </div>
                <Button className="w-full">Schedule Class</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900">{totalCourses}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Play className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Courses</p>
                <p className="text-2xl font-bold text-gray-900">{activeCourses}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Students Enrolled</p>
                <p className="text-2xl font-bold text-gray-900">{totalStudentsEnrolled}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Assignments</p>
                <p className="text-2xl font-bold text-gray-900">{pendingAssignments}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="courses" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="classes">Virtual Classes</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{course.title}</h3>
                    <Badge className={getStatusColor(course.status)}>
                      {course.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{course.subject} • {course.teacher}</p>
                  <p className="text-sm text-gray-500 mb-3">{course.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>

                  <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                    <span>{course.studentsEnrolled} students</span>
                    <span>{course.duration}</span>
                  </div>

                  <div className="flex space-x-2 mt-4">
                    <Button size="sm" className="flex-1">View Course</Button>
                    <Button size="sm" variant="outline">Edit</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="classes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Virtual Classes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockVirtualClasses.map((vClass) => (
                  <div key={vClass.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">{vClass.title}</h3>
                        <p className="text-sm text-gray-600">{vClass.subject} • {vClass.teacher}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(vClass.scheduledDate).toLocaleDateString()} at {vClass.scheduledTime} 
                          ({vClass.duration} minutes)
                        </p>
                      </div>
                      <Badge className={getStatusColor(vClass.status)}>
                        {vClass.status}
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-gray-500">
                        {vClass.studentsJoined}/{vClass.maxStudents} students joined
                      </span>
                      <Progress value={(vClass.studentsJoined / vClass.maxStudents) * 100} className="w-32 h-2" />
                    </div>

                    <div className="flex space-x-2">
                      {vClass.status === 'live' && (
                        <Button size="sm" className="bg-red-600 hover:bg-red-700">
                          <Play size={16} className="mr-1" />
                          Join Live
                        </Button>
                      )}
                      {vClass.status === 'scheduled' && (
                        <Button size="sm" variant="outline">Join Meeting</Button>
                      )}
                      <Button size="sm" variant="outline">Copy Link</Button>
                      <Button size="sm" variant="outline">Edit</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAssignments.map((assignment) => (
                  <div key={assignment.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">{assignment.title}</h3>
                        <p className="text-sm text-gray-600">{assignment.subject}</p>
                        <p className="text-sm text-gray-500">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                      </div>
                      <Badge className={getStatusColor(assignment.status)}>
                        {assignment.status}
                      </Badge>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">{assignment.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-gray-600">Total Marks</p>
                        <p className="font-bold">{assignment.totalMarks}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-600">Submissions</p>
                        <p className="font-bold">{assignment.submissionsReceived}/{assignment.totalStudents}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-600">Submission Rate</p>
                        <p className="font-bold">{Math.round((assignment.submissionsReceived / assignment.totalStudents) * 100)}%</p>
                      </div>
                    </div>

                    <div className="flex space-x-2 mt-3">
                      <Button size="sm">View Submissions</Button>
                      <Button size="sm" variant="outline">
                        <Download size={16} className="mr-1" />
                        Download All
                      </Button>
                      <Button size="sm" variant="outline">Edit</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quizzes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Online Quizzes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockQuizzes.map((quiz) => (
                  <div key={quiz.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">{quiz.title}</h3>
                        <p className="text-sm text-gray-600">{quiz.subject}</p>
                      </div>
                      <Badge className={getStatusColor(quiz.status)}>
                        {quiz.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-gray-600">Questions</p>
                        <p className="font-bold">{quiz.questions}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-600">Time Limit</p>
                        <p className="font-bold">{quiz.timeLimit} min</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-600">Students Attempted</p>
                        <p className="font-bold">{quiz.studentsAttempted}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-600">Average Score</p>
                        <p className="font-bold">{quiz.averageScore}%</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-3">
                      <span className="text-sm text-gray-500">
                        Passing Score: {quiz.passingScore}% • {quiz.attempts} attempts allowed
                      </span>
                      <div className="flex space-x-2">
                        <Button size="sm">View Results</Button>
                        <Button size="sm" variant="outline">Edit Quiz</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Digital Library</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Mathematics Textbook PDF</p>
                      <p className="text-sm text-gray-500">Class 10 • 15.2 MB</p>
                    </div>
                    <Button size="sm" variant="outline">
                      <Download size={16} />
                    </Button>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Chemistry Lab Manual</p>
                      <p className="text-sm text-gray-500">Practical Guide • 8.7 MB</p>
                    </div>
                    <Button size="sm" variant="outline">
                      <Download size={16} />
                    </Button>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">English Literature Collection</p>
                      <p className="text-sm text-gray-500">eBooks • 45.3 MB</p>
                    </div>
                    <Button size="sm" variant="outline">
                      <Download size={16} />
                    </Button>
                  </div>
                </div>
                <Button className="w-full mt-4">
                  <Upload size={16} className="mr-2" />
                  Upload Resource
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Discussion Forums</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">Mathematics Help</h4>
                      <Badge variant="outline">12 new</Badge>
                    </div>
                    <p className="text-sm text-gray-600">General math questions and solutions</p>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <MessageSquare size={14} className="mr-1" />
                      <span>245 posts • Last activity 2h ago</span>
                    </div>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">Science Experiments</h4>
                      <Badge variant="outline">5 new</Badge>
                    </div>
                    <p className="text-sm text-gray-600">Share and discuss lab experiments</p>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <MessageSquare size={14} className="mr-1" />
                      <span>128 posts • Last activity 5h ago</span>
                    </div>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">Study Groups</h4>
                      <Badge variant="outline">8 new</Badge>
                    </div>
                    <p className="text-sm text-gray-600">Form study groups and collaborate</p>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <MessageSquare size={14} className="mr-1" />
                      <span>89 posts • Last activity 1d ago</span>
                    </div>
                  </div>
                </div>
                <Button className="w-full mt-4" variant="outline">View All Forums</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ELearningManagement;
