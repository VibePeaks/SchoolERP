import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, BookOpen, TrendingUp, Calendar, Award, CheckCircle, AlertTriangle, Info, Clock, Target, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMutation } from '@/hooks/useApi';
import { toast } from 'sonner';

interface StudentData {
  student: {
    id: number;
    firstName: string;
    lastName: string;
    rollNumber: string;
    class: string;
    section: string;
  };
  academicOverview: {
    gpa: number;
    attendancePercentage: number;
    totalSubjects: number;
  };
  recentGrades: Array<{
    id: number;
    subjectName: string;
    examType: string;
    marksObtained: number;
    totalMarks: number;
    percentage: number;
    grade: string;
    examDate: string;
  }>;
  upcomingAssignments: Array<{
    id: number;
    subject: string;
    title: string;
    dueDate: string;
    priority: string;
  }>;
  todaySchedule: Array<{
    time: string;
    subject: string;
    room: string;
  }>;
  achievements: Array<{
    id: number;
    title: string;
    description: string;
    earnedDate: string;
    icon: string;
  }>;
  quickStats: {
    assignmentsDue: number;
    unreadMessages: number;
    studyStreak: number;
  };
}

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);

  // Get parent and student IDs from location state or URL params
  const parentId = location.state?.parentId || 1; // Mock for demo
  const studentId = location.state?.studentId || 1; // Mock for demo

  const getStudentDashboardMutation = useMutation(
    async () => {
      const response = await fetch(`/api/parents/${parentId}/student-mode/${studentId}/dashboard`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add auth header if needed
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch student dashboard');
      }
      return response.json();
    },
    {
      onSuccess: (data) => {
        setStudentData(data.data);
        setLoading(false);
      },
      onError: (error: any) => {
        console.error('Error loading student dashboard:', error);
        toast.error('Failed to load student dashboard');
        navigate('/parent-portal');
      },
    }
  );

  useEffect(() => {
    getStudentDashboardMutation.mutate();
  }, [parentId, studentId]);

  const handleBackToParent = () => {
    navigate('/parent-portal');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'default';
      default: return 'default';
    }
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'default';
    if (grade.startsWith('B')) return 'secondary';
    if (grade.startsWith('C')) return 'secondary';
    return 'destructive';
  };

  const getGradeIcon = (grade: string) => {
    if (grade.startsWith('A')) return <CheckCircle className="text-green-600" />;
    if (grade.startsWith('B')) return <Info className="text-yellow-600" />;
    if (grade.startsWith('C')) return <AlertTriangle className="text-yellow-600" />;
    return <AlertTriangle className="text-red-600" />;
  };

  if (loading || getStudentDashboardMutation.loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          <span className="ml-4 text-lg">Loading your dashboard...</span>
        </div>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-800">Failed to load student data. Please try again.</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => getStudentDashboardMutation.mutate()}>
            Retry
          </Button>
          <Button variant="outline" onClick={handleBackToParent}>
            Back to Parent Portal
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
            <BookOpen className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {studentData.student.firstName}! 🎓
            </h1>
            <p className="text-gray-600">
              {studentData.student.class} - {studentData.student.section} | Roll: {studentData.student.rollNumber}
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={handleBackToParent}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Parent
        </Button>
      </div>

      {/* Academic Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="text-center pt-6">
            <TrendingUp className="w-12 h-12 text-blue-600 mx-auto mb-2" />
            <div className="text-3xl font-bold text-blue-600">
              {studentData.academicOverview.gpa.toFixed(1)}
            </div>
            <p className="text-gray-600">GPA</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center pt-6">
            <Calendar className="w-12 h-12 text-green-600 mx-auto mb-2" />
            <div className="text-3xl font-bold text-green-600">
              {studentData.academicOverview.attendancePercentage}%
            </div>
            <p className="text-gray-600">Attendance</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center pt-6">
            <BookOpen className="w-12 h-12 text-purple-600 mx-auto mb-2" />
            <div className="text-3xl font-bold text-purple-600">
              {studentData.academicOverview.totalSubjects}
            </div>
            <p className="text-gray-600">Subjects</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center pt-6">
            <div className="text-4xl mb-2">🔥</div>
            <div className="text-3xl font-bold text-orange-600">
              {studentData.quickStats.studyStreak}
            </div>
            <p className="text-gray-600">Study Streak</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-600" />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {studentData.todaySchedule.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <Badge variant="outline">{item.time}</Badge>
                  <div className="flex-1">
                    <p className="font-medium">{item.subject}</p>
                    <p className="text-sm text-gray-600">Room {item.room}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Grades */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2 text-green-600" />
              Recent Grades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {studentData.recentGrades.slice(0, 4).map((grade) => (
                <div key={grade.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getGradeIcon(grade.grade)}
                    <div>
                      <p className="font-medium">{grade.subjectName}</p>
                      <p className="text-sm text-gray-600">
                        {grade.examType} • {new Date(grade.examDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant={getGradeColor(grade.grade) as any}>
                    {grade.marksObtained}/{grade.totalMarks}
                  </Badge>
                </div>
              ))}
            </div>
            {studentData.recentGrades.length > 4 && (
              <div className="mt-4">
                <Button variant="outline" className="w-full">
                  View All Grades
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Assignments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
              Homework Due
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {studentData.upcomingAssignments.slice(0, 3).map((assignment) => (
                <div key={assignment.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{assignment.title}</h3>
                    <Badge variant={getPriorityColor(assignment.priority) as any}>
                      {assignment.priority.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{assignment.subject}</p>
                  <p className="text-sm text-gray-600">
                    Due: {new Date(assignment.dueDate).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
            {studentData.upcomingAssignments.length > 3 && (
              <div className="mt-4">
                <Button variant="outline" className="w-full">
                  View All Assignments
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="w-5 h-5 mr-2 text-yellow-600" />
              My Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {studentData.achievements.map((achievement) => (
                <div key={achievement.id} className="p-4 border rounded-lg text-center bg-gray-50">
                  <div className="text-3xl mb-2">{achievement.icon}</div>
                  <h3 className="font-semibold text-sm">{achievement.title}</h3>
                  <p className="text-xs text-gray-600 mt-1">{achievement.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button className="h-16 flex-col">
            <BookOpen className="w-6 h-6 mb-1" />
            <span>Study Materials</span>
          </Button>
          <Button variant="outline" className="h-16 flex-col">
            <Info className="w-6 h-6 mb-1" />
            <span>Ask Teacher</span>
          </Button>
          <Button variant="outline" className="h-16 flex-col">
            <Target className="w-6 h-6 mb-1" />
            <span>Submit Work</span>
          </Button>
          <Button variant="outline" className="h-16 flex-col">
            <TrendingUp className="w-6 h-6 mb-1" />
            <span>Progress Report</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
