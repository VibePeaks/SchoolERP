import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  Alert,
} from 'react-native';
import { theme } from '../theme';

interface ClassInfo {
  id: string;
  name: string;
  subject: string;
  students: number;
  attendanceMarked: boolean;
  nextClass: string;
}

interface AttendanceRecord {
  studentId: string;
  studentName: string;
  status: 'present' | 'absent' | 'late';
  rollNumber: string;
}

interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  submitted: number;
  total: number;
  status: 'active' | 'completed';
}

const TeacherDashboard = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedClass, setSelectedClass] = useState('10-A Mathematics');

  const classes: ClassInfo[] = [
    {
      id: '1',
      name: '10-A Mathematics',
      subject: 'Mathematics',
      students: 32,
      attendanceMarked: true,
      nextClass: '09:00 AM'
    },
    {
      id: '2',
      name: '9-B Mathematics',
      subject: 'Mathematics',
      students: 28,
      attendanceMarked: false,
      nextClass: '10:30 AM'
    },
    {
      id: '3',
      name: '8-A Mathematics',
      subject: 'Mathematics',
      students: 30,
      attendanceMarked: true,
      nextClass: '02:00 PM'
    },
  ];

  const todayAttendance: AttendanceRecord[] = [
    { studentId: '1', studentName: 'Arjun Sharma', status: 'present', rollNumber: '1' },
    { studentId: '2', studentName: 'Priya Patel', status: 'present', rollNumber: '2' },
    { studentId: '3', studentName: 'Rohan Kumar', status: 'absent', rollNumber: '3' },
    { studentId: '4', studentName: 'Sneha Singh', status: 'late', rollNumber: '4' },
  ];

  const assignments: Assignment[] = [
    {
      id: '1',
      title: 'Algebra Problem Set',
      subject: 'Mathematics',
      dueDate: '2024-01-20',
      submitted: 28,
      total: 32,
      status: 'active'
    },
    {
      id: '2',
      title: 'Geometry Quiz',
      subject: 'Mathematics',
      dueDate: '2024-01-18',
      submitted: 32,
      total: 32,
      status: 'completed'
    },
  ];

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getAttendanceColor = (status: string) => {
    switch (status) {
      case 'present': return theme.colors.primary;
      case 'late': return '#F59E0B';
      case 'absent': return theme.colors.destructive;
      default: return theme.colors.mutedForeground;
    }
  };

  const markAttendance = () => {
    Alert.alert(
      'Mark Attendance',
      'Open attendance marking interface?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open', onPress: () => console.log('Navigate to attendance screen') }
      ]
    );
  };

  const createAssignment = () => {
    Alert.alert(
      'Create Assignment',
      'Open assignment creation interface?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Create', onPress: () => console.log('Navigate to assignment creation') }
      ]
    );
  };

  const enterGrades = () => {
    Alert.alert(
      'Enter Grades',
      'Open grade entry interface?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open', onPress: () => console.log('Navigate to grade entry') }
      ]
    );
  };

  const attendancePercentage = Math.round(
    (todayAttendance.filter(record => record.status === 'present').length / todayAttendance.length) * 100
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Good morning!</Text>
          <Text style={styles.headerTitle}>Teacher Dashboard</Text>
          <Text style={styles.headerSubtitle}>Manage your classes and students</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton} onPress={markAttendance}>
            <Text style={styles.actionIcon}>📝</Text>
            <Text style={styles.actionText}>Mark Attendance</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={createAssignment}>
            <Text style={styles.actionIcon}>📚</Text>
            <Text style={styles.actionText}>Create Assignment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={enterGrades}>
            <Text style={styles.actionIcon}>📊</Text>
            <Text style={styles.actionText}>Enter Grades</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>💬</Text>
            <Text style={styles.actionText}>Parent Messages</Text>
          </TouchableOpacity>
        </View>

        {/* Today's Stats */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>👥</Text>
            <Text style={styles.statValue}>{classes.length}</Text>
            <Text style={styles.statLabel}>Active Classes</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>📅</Text>
            <Text style={styles.statValue}>{attendancePercentage}%</Text>
            <Text style={styles.statLabel}>Today's Attendance</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>📝</Text>
            <Text style={styles.statValue}>{assignments.filter(a => a.status === 'active').length}</Text>
            <Text style={styles.statLabel}>Pending Assignments</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>⭐</Text>
            <Text style={styles.statValue}>4.8</Text>
            <Text style={styles.statLabel}>Class Rating</Text>
          </View>
        </View>

        {/* My Classes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Classes</Text>
          {classes.map((classInfo) => (
            <TouchableOpacity
              key={classInfo.id}
              style={[
                styles.classCard,
                selectedClass === classInfo.name && styles.classCardActive,
              ]}
              onPress={() => setSelectedClass(classInfo.name)}
            >
              <View style={styles.classHeader}>
                <Text style={styles.className}>{classInfo.name}</Text>
                <View style={styles.classBadge}>
                  <Text style={styles.classBadgeText}>
                    {classInfo.attendanceMarked ? '✅' : '⏰'} {classInfo.attendanceMarked ? 'Marked' : 'Pending'}
                  </Text>
                </View>
              </View>
              <View style={styles.classDetails}>
                <Text style={styles.classSubject}>{classInfo.subject}</Text>
                <Text style={styles.classStudents}>{classInfo.students} students</Text>
                <Text style={styles.classTime}>Next: {classInfo.nextClass}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Today's Attendance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Attendance - {selectedClass.split(' ')[0]}</Text>
          {todayAttendance.slice(0, 6).map((record) => (
            <View key={record.studentId} style={styles.attendanceItem}>
              <View style={styles.studentInfo}>
                <Text style={styles.studentName}>{record.studentName}</Text>
                <Text style={styles.rollNumber}>Roll: {record.rollNumber}</Text>
              </View>
              <View
                style={[
                  styles.attendanceStatus,
                  { backgroundColor: getAttendanceColor(record.status) },
                ]}
              >
                <Text style={styles.attendanceStatusText}>
                  {record.status.toUpperCase()}
                </Text>
              </View>
            </View>
          ))}
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All Students →</Text>
          </TouchableOpacity>
        </View>

        {/* Assignments */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Assignments</Text>
          {assignments.map((assignment) => (
            <View key={assignment.id} style={styles.assignmentCard}>
              <View style={styles.assignmentHeader}>
                <Text style={styles.assignmentTitle}>{assignment.title}</Text>
                <View style={[
                  styles.assignmentStatus,
                  { backgroundColor: assignment.status === 'active' ? '#3B82F6' : '#10B981' }
                ]}>
                  <Text style={styles.assignmentStatusText}>
                    {assignment.status === 'active' ? 'Active' : 'Completed'}
                  </Text>
                </View>
              </View>
              <View style={styles.assignmentDetails}>
                <Text style={styles.assignmentSubject}>{assignment.subject}</Text>
                <Text style={styles.assignmentDue}>Due: {new Date(assignment.dueDate).toLocaleDateString()}</Text>
                <Text style={styles.assignmentProgress}>
                  {assignment.submitted}/{assignment.total} submitted
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Upcoming Classes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Schedule</Text>
          <View style={styles.scheduleItem}>
            <View style={styles.scheduleTime}>
              <Text style={styles.scheduleTimeText}>09:00 AM</Text>
            </View>
            <View style={styles.scheduleDetails}>
              <Text style={styles.scheduleClass}>10-A Mathematics</Text>
              <Text style={styles.scheduleTopic}>Algebra - Linear Equations</Text>
              <Text style={styles.scheduleRoom}>Room 201</Text>
            </View>
          </View>
          <View style={styles.scheduleItem}>
            <View style={styles.scheduleTime}>
              <Text style={styles.scheduleTimeText}>10:30 AM</Text>
            </View>
            <View style={styles.scheduleDetails}>
              <Text style={styles.scheduleClass}>9-B Mathematics</Text>
              <Text style={styles.scheduleTopic}>Geometry - Triangles</Text>
              <Text style={styles.scheduleRoom}>Room 203</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: theme.spacing[6],
    backgroundColor: theme.colors.card,
  },
  welcomeText: {
    fontSize: theme.fontSize.base,
    color: theme.colors.mutedForeground,
    marginBottom: theme.spacing[1],
  },
  headerTitle: {
    fontSize: theme.fontSize['2xl'],
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.foreground,
  },
  headerSubtitle: {
    fontSize: theme.fontSize.base,
    color: theme.colors.mutedForeground,
    marginTop: theme.spacing[2],
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[3],
    padding: theme.spacing[6],
  },
  actionButton: {
    flex: 1,
    minWidth: '45%',
    padding: theme.spacing[4],
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  actionIcon: {
    fontSize: theme.fontSize['2xl'],
    marginBottom: theme.spacing[2],
  },
  actionText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.foreground,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[3],
    padding: theme.spacing[6],
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: theme.spacing[4],
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statEmoji: {
    fontSize: theme.fontSize['2xl'],
    marginBottom: theme.spacing[2],
  },
  statValue: {
    fontSize: theme.fontSize['2xl'],
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.foreground,
  },
  statLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedForeground,
    textAlign: 'center',
    marginTop: theme.spacing[1],
  },
  section: {
    padding: theme.spacing[6],
    backgroundColor: theme.colors.card,
    marginTop: theme.spacing[2],
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.foreground,
    marginBottom: theme.spacing[4],
  },
  classCard: {
    padding: theme.spacing[4],
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing[2],
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  classCardActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.card,
  },
  classHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[2],
  },
  className: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.foreground,
  },
  classBadge: {
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.muted,
  },
  classBadgeText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.foreground,
  },
  classDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  classSubject: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.foreground,
  },
  classStudents: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedForeground,
  },
  classTime: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.medium,
  },
  attendanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing[3],
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing[2],
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.foreground,
  },
  rollNumber: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.mutedForeground,
    marginTop: theme.spacing[1],
  },
  attendanceStatus: {
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.borderRadius.sm,
  },
  attendanceStatusText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.card,
  },
  viewAllButton: {
    padding: theme.spacing[3],
    alignItems: 'center',
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.md,
  },
  viewAllText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.medium,
  },
  assignmentCard: {
    padding: theme.spacing[4],
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing[2],
  },
  assignmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[2],
  },
  assignmentTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.foreground,
    flex: 1,
  },
  assignmentStatus: {
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.borderRadius.sm,
  },
  assignmentStatusText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.card,
  },
  assignmentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  assignmentSubject: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.mutedForeground,
  },
  assignmentDue: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.mutedForeground,
  },
  assignmentProgress: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.medium,
  },
  scheduleItem: {
    flexDirection: 'row',
    padding: theme.spacing[3],
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing[2],
  },
  scheduleTime: {
    width: 80,
    alignItems: 'center',
  },
  scheduleTimeText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.primary,
  },
  scheduleDetails: {
    flex: 1,
  },
  scheduleClass: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.foreground,
  },
  scheduleTopic: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.mutedForeground,
    marginTop: theme.spacing[1],
  },
  scheduleRoom: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.mutedForeground,
  },
});

export default TeacherDashboard;
