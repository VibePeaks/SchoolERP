import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { theme } from '../theme';

interface AttendanceRecord {
  date: string;
  status: 'present' | 'absent';
  subject: string;
  reason?: string;
}

interface GradeRecord {
  subject: string;
  test: string;
  marks: number;
  maxMarks: number;
  grade: string;
}

interface FeeRecord {
  item: string;
  amount: number;
  status: 'paid' | 'pending';
  dueDate: string;
}

interface BusLocation {
  busNumber: string;
  status: 'active' | 'delayed';
  currentStop: string;
  estimatedArrival: string;
  studentsOnBoard: number;
}

const ParentDashboard = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedChild, setSelectedChild] = useState('Arjun Sharma');

  const children = [
    { id: '1', name: 'Arjun Sharma', class: '10-A' },
    { id: '2', name: 'Priya Sharma', class: '8-B' },
  ];

  const attendanceData: AttendanceRecord[] = [
    { date: '2024-01-15', status: 'present', subject: 'All Subjects' },
    { date: '2024-01-14', status: 'present', subject: 'All Subjects' },
    { date: '2024-01-13', status: 'absent', subject: 'All Subjects', reason: 'Sick leave' },
  ];

  const gradesData: GradeRecord[] = [
    { subject: 'Mathematics', test: 'Unit Test 1', marks: 85, maxMarks: 100, grade: 'A' },
    { subject: 'Science', test: 'Unit Test 1', marks: 78, maxMarks: 100, grade: 'B+' },
    { subject: 'English', test: 'Unit Test 1', marks: 92, maxMarks: 100, grade: 'A+' },
  ];

  const feesData: FeeRecord[] = [
    { item: 'Tuition Fee', amount: 15000, status: 'paid', dueDate: '2024-01-10' },
    { item: 'Transport Fee', amount: 2000, status: 'paid', dueDate: '2024-01-10' },
    { item: 'Activity Fee', amount: 1500, status: 'pending', dueDate: '2024-01-25' },
  ];

  const busData: BusLocation = {
    busNumber: 'BUS-001',
    status: 'active',
    currentStop: 'Oak Street Stop',
    estimatedArrival: '08:00',
    studentsOnBoard: 12,
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getAttendanceColor = (status: string) => {
    return status === 'present' ? theme.colors.primary : theme.colors.destructive;
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return theme.colors.primary;
    if (grade.startsWith('B')) return '#3B82F6';
    if (grade.startsWith('C')) return '#F59E0B';
    return theme.colors.destructive;
  };

  const getStatusColor = (status: string) => {
    return status === 'paid' ? theme.colors.primary : '#F59E0B';
  };

  const attendancePercentage = Math.round(
    (attendanceData.filter(record => record.status === 'present').length / attendanceData.length) * 100
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
          <Text style={styles.welcomeText}>Welcome back!</Text>
          <Text style={styles.headerTitle}>Parent Dashboard</Text>
        </View>

        {/* Child Selector */}
        <View style={styles.childSelector}>
          <Text style={styles.sectionTitle}>Select Child</Text>
          <View style={styles.childButtons}>
            {children.map((child) => (
              <TouchableOpacity
                key={child.id}
                style={[
                  styles.childButton,
                  selectedChild === child.name && styles.childButtonActive,
                ]}
                onPress={() => setSelectedChild(child.name)}
              >
                <Text
                  style={[
                    styles.childButtonText,
                    selectedChild === child.name && styles.childButtonTextActive,
                  ]}
                >
                  {child.name}
                </Text>
                <Text
                  style={[
                    styles.childButtonClass,
                    selectedChild === child.name && styles.childButtonTextActive,
                  ]}
                >
                  {child.class}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Text style={styles.statIconText}>📅</Text>
            </View>
            <View>
              <Text style={styles.statLabel}>Attendance</Text>
              <Text style={styles.statValue}>{attendancePercentage}%</Text>
            </View>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Text style={styles.statIconText}>⭐</Text>
            </View>
            <View>
              <Text style={styles.statLabel}>Avg Grade</Text>
              <Text style={styles.statValue}>A-</Text>
            </View>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Text style={styles.statIconText}>📚</Text>
            </View>
            <View>
              <Text style={styles.statLabel}>Pending HW</Text>
              <Text style={styles.statValue}>2</Text>
            </View>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Text style={styles.statIconText}>💰</Text>
            </View>
            <View>
              <Text style={styles.statLabel}>Due Fees</Text>
              <Text style={styles.statValue}>₹2,000</Text>
            </View>
          </View>
        </View>

        {/* Recent Attendance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Attendance</Text>
          {attendanceData.slice(0, 3).map((record, index) => (
            <View key={index} style={styles.attendanceItem}>
              <View style={styles.attendanceInfo}>
                <Text style={styles.attendanceDate}>
                  {new Date(record.date).toLocaleDateString()}
                </Text>
                <Text style={styles.attendanceSubject}>{record.subject}</Text>
                {record.reason && (
                  <Text style={styles.attendanceReason}>Reason: {record.reason}</Text>
                )}
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
        </View>

        {/* Academic Performance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Academic Performance</Text>
          {gradesData.map((grade, index) => (
            <View key={index} style={styles.gradeItem}>
              <View style={styles.gradeInfo}>
                <Text style={styles.gradeSubject}>{grade.subject}</Text>
                <Text style={styles.gradeTest}>{grade.test}</Text>
              </View>
              <View style={styles.gradeScore}>
                <Text style={styles.gradeMarks}>
                  {grade.marks}/{grade.maxMarks}
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
        </View>

        {/* Fee Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fee Details</Text>
          {feesData.map((fee, index) => (
            <View key={index} style={styles.feeItem}>
              <View style={styles.feeInfo}>
                <Text style={styles.feeItemName}>{fee.item}</Text>
                <Text style={styles.feeDueDate}>
                  Due: {new Date(fee.dueDate).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.feeAmount}>
                <Text style={styles.feeAmountText}>₹{fee.amount.toLocaleString()}</Text>
                <View
                  style={[
                    styles.feeStatus,
                    { backgroundColor: getStatusColor(fee.status) },
                  ]}
                >
                  <Text style={styles.feeStatusText}>{fee.status.toUpperCase()}</Text>
                </View>
              </View>
            </View>
          ))}
          <TouchableOpacity style={styles.payButton}>
            <Text style={styles.payButtonText}>Pay Pending Fees</Text>
          </TouchableOpacity>
        </View>

        {/* Bus Tracking */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bus Tracking</Text>
          <View style={styles.busCard}>
            <View style={styles.busHeader}>
              <Text style={styles.busNumber}>{busData.busNumber}</Text>
              <View
                style={[
                  styles.busStatus,
                  { backgroundColor: busData.status === 'active' ? theme.colors.primary : '#F59E0B' },
                ]}
              >
                <Text style={styles.busStatusText}>{busData.status.toUpperCase()}</Text>
              </View>
            </View>
            <View style={styles.busDetails}>
              <Text style={styles.busStop}>Current: {busData.currentStop}</Text>
              <Text style={styles.busETA}>ETA: {busData.estimatedArrival}</Text>
              <Text style={styles.busStudents}>{busData.studentsOnBoard} students on board</Text>
            </View>
            <View style={styles.busActions}>
              <TouchableOpacity style={styles.busActionButton}>
                <Text style={styles.busActionText}>📍 View Route</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.busActionButton}>
                <Text style={styles.busActionText}>📞 Call Driver</Text>
              </TouchableOpacity>
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
  childSelector: {
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
  childButtons: {
    flexDirection: 'row',
    gap: theme.spacing[3],
  },
  childButton: {
    flex: 1,
    padding: theme.spacing[4],
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    alignItems: 'center',
  },
  childButtonActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.secondary,
  },
  childButtonText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.foreground,
  },
  childButtonTextActive: {
    color: theme.colors.primary,
  },
  childButtonClass: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.mutedForeground,
    marginTop: theme.spacing[1],
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing[4],
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing[3],
  },
  statIconText: {
    fontSize: theme.fontSize.xl,
  },
  statLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedForeground,
  },
  statValue: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.foreground,
  },
  section: {
    padding: theme.spacing[6],
    backgroundColor: theme.colors.card,
    marginTop: theme.spacing[2],
  },
  attendanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing[4],
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing[2],
  },
  attendanceInfo: {
    flex: 1,
  },
  attendanceDate: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.foreground,
  },
  attendanceSubject: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.mutedForeground,
    marginTop: theme.spacing[1],
  },
  attendanceReason: {
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
  feeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing[4],
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing[2],
  },
  feeInfo: {
    flex: 1,
  },
  feeItemName: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.foreground,
  },
  feeDueDate: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.mutedForeground,
    marginTop: theme.spacing[1],
  },
  feeAmount: {
    alignItems: 'flex-end',
  },
  feeAmountText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.foreground,
  },
  feeStatus: {
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.borderRadius.sm,
    marginTop: theme.spacing[1],
  },
  feeStatusText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.card,
  },
  payButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing[4],
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginTop: theme.spacing[4],
  },
  payButtonText: {
    color: theme.colors['primary-foreground'],
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
  },
  busCard: {
    padding: theme.spacing[4],
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  busHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[3],
  },
  busNumber: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.foreground,
  },
  busStatus: {
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.borderRadius.sm,
  },
  busStatusText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.card,
  },
  busDetails: {
    marginBottom: theme.spacing[4],
  },
  busStop: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.foreground,
    marginBottom: theme.spacing[1],
  },
  busETA: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.foreground,
    marginBottom: theme.spacing[1],
  },
  busStudents: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedForeground,
  },
  busActions: {
    flexDirection: 'row',
    gap: theme.spacing[3],
  },
  busActionButton: {
    flex: 1,
    padding: theme.spacing[3],
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  busActionText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.foreground,
  },
});

export default ParentDashboard;
