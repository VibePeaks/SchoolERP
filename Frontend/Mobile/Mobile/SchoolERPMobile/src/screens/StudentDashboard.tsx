import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  Alert,
  Dimensions,
} from 'react-native';
import { theme } from '../theme';
import apiService from '../services/apiService';

const { width } = Dimensions.get('window');

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

const StudentDashboard = ({ route, navigation }: any) => {
  const [refreshing, setRefreshing] = useState(false);
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock parent and student IDs - in real app, these would come from route params
  const parentId = 1; // Mock parent ID
  const studentId = 1; // Mock student ID - would come from passkey validation

  useEffect(() => {
    loadStudentDashboard();
  }, []);

  const loadStudentDashboard = async () => {
    try {
      setLoading(true);
      const response = await apiService.getStudentDashboard(parentId, studentId);
      if (response.success) {
        setStudentData(response.data);
      } else {
        Alert.alert('Error', 'Failed to load student dashboard');
      }
    } catch (error) {
      console.error('Error loading student dashboard:', error);
      Alert.alert('Error', 'Failed to load student dashboard');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadStudentDashboard().finally(() => setRefreshing(false));
  };

  const handleBackToParent = () => {
    Alert.alert(
      'Back to Parent Mode',
      'Are you sure you want to exit Student Mode?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Exit',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return theme.colors.destructive;
      case 'medium': return '#F59E0B';
      case 'low': return theme.colors.primary;
      default: return theme.colors.mutedForeground;
    }
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return theme.colors.primary;
    if (grade.startsWith('B')) return '#3B82F6';
    if (grade.startsWith('C')) return '#F59E0B';
    return theme.colors.destructive;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading your dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!studentData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load student data</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadStudentDashboard}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
          <Text style={styles.welcomeText}>Welcome back!</Text>
          <Text style={styles.headerTitle}>
            {studentData.student.firstName}'s World
          </Text>
          <TouchableOpacity style={styles.backButton} onPress={handleBackToParent}>
            <Text style={styles.backButtonText}>← Back to Parent</Text>
          </TouchableOpacity>
        </View>

        {/* Academic Overview */}
        <View style={styles.overviewGrid}>
          <View style={styles.overviewCard}>
            <View style={styles.overviewIcon}>
              <Text style={styles.overviewIconText}>📊</Text>
            </View>
            <View>
              <Text style={styles.overviewLabel}>My GPA</Text>
              <Text style={styles.overviewValue}>{studentData.academicOverview.gpa.toFixed(1)}</Text>
            </View>
          </View>

          <View style={styles.overviewCard}>
            <View style={styles.overviewIcon}>
              <Text style={styles.overviewIconText}>📅</Text>
            </View>
            <View>
              <Text style={styles.overviewLabel}>Attendance</Text>
              <Text style={styles.overviewValue}>{studentData.academicOverview.attendancePercentage}%</Text>
            </View>
          </View>

          <View style={styles.overviewCard}>
            <View style={styles.overviewIcon}>
              <Text style={styles.overviewIconText}>📚</Text>
            </View>
            <View>
              <Text style={styles.overviewLabel}>Subjects</Text>
              <Text style={styles.overviewValue}>{studentData.academicOverview.totalSubjects}</Text>
            </View>
          </View>

          <View style={styles.overviewCard}>
            <View style={styles.overviewIcon}>
              <Text style={styles.overviewIconText}>🔥</Text>
            </View>
            <View>
              <Text style={styles.overviewLabel}>Study Streak</Text>
              <Text style={styles.overviewValue}>{studentData.quickStats.studyStreak} days</Text>
            </View>
          </View>
        </View>

        {/* Today's Schedule */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📅 Today's Schedule</Text>
          {studentData.todaySchedule.map((item, index) => (
            <View key={index} style={styles.scheduleItem}>
              <View style={styles.scheduleTime}>
                <Text style={styles.scheduleTimeText}>{item.time}</Text>
              </View>
              <View style={styles.scheduleDetails}>
                <Text style={styles.scheduleSubject}>{item.subject}</Text>
                <Text style={styles.scheduleRoom}>Room {item.room}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Recent Grades */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📈 My Grades</Text>
          {studentData.recentGrades.slice(0, 3).map((grade) => (
            <View key={grade.id} style={styles.gradeItem}>
              <View style={styles.gradeInfo}>
                <Text style={styles.gradeSubject}>{grade.subjectName}</Text>
                <Text style={styles.gradeTest}>{grade.examType}</Text>
              </View>
              <View style={styles.gradeScore}>
                <Text style={styles.gradeMarks}>
                  {grade.marksObtained}/{grade.totalMarks}
                </Text>
                <Text
                  style={[
                    styles.gradeLetter,
                    { color: getGradeColor(grade.grade) },
                  ]}
                >
                  {grade.grade}
                </Text>
              </View>
            </View>
          ))}
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllButtonText}>View All Grades</Text>
          </TouchableOpacity>
        </View>

        {/* Upcoming Assignments */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 Homework Due</Text>
          {studentData.upcomingAssignments.slice(0, 3).map((assignment) => (
            <View key={assignment.id} style={styles.assignmentItem}>
              <View style={styles.assignmentInfo}>
                <Text style={styles.assignmentTitle}>{assignment.title}</Text>
                <Text style={styles.assignmentSubject}>{assignment.subject}</Text>
                <Text style={styles.assignmentDue}>
                  Due: {new Date(assignment.dueDate).toLocaleDateString()}
                </Text>
              </View>
              <View
                style={[
                  styles.assignmentPriority,
                  { backgroundColor: getPriorityColor(assignment.priority) },
                ]}
              >
                <Text style={styles.assignmentPriorityText}>
                  {assignment.priority.toUpperCase()}
                </Text>
              </View>
            </View>
          ))}
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllButtonText}>View All Assignments</Text>
          </TouchableOpacity>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏆 My Achievements</Text>
          <View style={styles.achievementsGrid}>
            {studentData.achievements.map((achievement) => (
              <View key={achievement.id} style={styles.achievementCard}>
                <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.achievementDesc}>{achievement.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>💬</Text>
            <Text style={styles.actionText}>Ask Teacher</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>📚</Text>
            <Text style={styles.actionText}>Study Materials</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>📝</Text>
            <Text style={styles.actionText}>Submit Assignment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>📊</Text>
            <Text style={styles.actionText}>Progress Report</Text>
          </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.mutedForeground,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing[6],
  },
  errorText: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.destructive,
    marginBottom: theme.spacing[4],
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing[6],
    paddingVertical: theme.spacing[3],
    borderRadius: theme.borderRadius.md,
  },
  retryButtonText: {
    color: theme.colors['primary-foreground'],
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
  },
  header: {
    padding: theme.spacing[6],
    backgroundColor: theme.colors.card,
    position: 'relative',
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
  backButton: {
    position: 'absolute',
    top: theme.spacing[6],
    right: theme.spacing[6],
    padding: theme.spacing[2],
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.md,
  },
  backButtonText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.medium,
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[3],
    padding: theme.spacing[6],
  },
  overviewCard: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing[4],
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  overviewIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing[3],
  },
  overviewIconText: {
    fontSize: theme.fontSize.xl,
  },
  overviewLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedForeground,
  },
  overviewValue: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.foreground,
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
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing[4],
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
  scheduleSubject: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.foreground,
  },
  scheduleRoom: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.mutedForeground,
    marginTop: theme.spacing[1],
  },
  gradeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing[4],
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing[2],
  },
  gradeInfo: {
    flex: 1,
  },
  gradeSubject: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.foreground,
  },
  gradeTest: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.mutedForeground,
    marginTop: theme.spacing[1],
  },
  gradeScore: {
    alignItems: 'flex-end',
  },
  gradeMarks: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.foreground,
  },
  gradeLetter: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
  },
  viewAllButton: {
    backgroundColor: theme.colors.secondary,
    padding: theme.spacing[3],
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginTop: theme.spacing[2],
  },
  viewAllButtonText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.medium,
  },
  assignmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing[4],
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing[2],
  },
  assignmentInfo: {
    flex: 1,
  },
  assignmentTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.foreground,
  },
  assignmentSubject: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.mutedForeground,
    marginTop: theme.spacing[1],
  },
  assignmentDue: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.mutedForeground,
    marginTop: theme.spacing[1],
  },
  assignmentPriority: {
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.borderRadius.sm,
  },
  assignmentPriorityText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.card,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[3],
  },
  achievementCard: {
    flex: 1,
    minWidth: '45%',
    padding: theme.spacing[4],
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  achievementIcon: {
    fontSize: theme.fontSize['3xl'],
    marginBottom: theme.spacing[2],
  },
  achievementTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.foreground,
    textAlign: 'center',
    marginBottom: theme.spacing[1],
  },
  achievementDesc: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.mutedForeground,
    textAlign: 'center',
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
});

export default StudentDashboard;
