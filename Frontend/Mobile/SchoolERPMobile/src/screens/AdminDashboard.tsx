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
  Dimensions,
} from 'react-native';
import { theme } from '../theme';

const { width } = Dimensions.get('window');

interface SystemStats {
  totalStudents: number;
  totalTeachers: number;
  totalParents: number;
  totalDrivers: number;
  activeRoutes: number;
  totalRevenue: number;
}

interface RecentActivity {
  id: string;
  type: 'user' | 'payment' | 'system' | 'alert';
  message: string;
  time: string;
  status: 'success' | 'warning' | 'info';
}

interface PendingTask {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  assignedTo: string;
}

const AdminDashboard = () => {
  const [refreshing, setRefreshing] = useState(false);

  const systemStats: SystemStats = {
    totalStudents: 1248,
    totalTeachers: 89,
    totalParents: 1156,
    totalDrivers: 12,
    activeRoutes: 8,
    totalRevenue: 2500000,
  };

  const recentActivities: RecentActivity[] = [
    {
      id: '1',
      type: 'payment',
      message: 'Fee payment received from Alice Johnson - ₹15,000',
      time: '2 hours ago',
      status: 'success',
    },
    {
      id: '2',
      type: 'user',
      message: 'New teacher account created: Mrs. Priya Sharma',
      time: '4 hours ago',
      status: 'info',
    },
    {
      id: '3',
      type: 'alert',
      message: 'Bus route delayed: Route A experiencing traffic',
      time: '6 hours ago',
      status: 'warning',
    },
    {
      id: '4',
      type: 'system',
      message: 'Monthly backup completed successfully',
      time: '1 day ago',
      status: 'success',
    },
  ];

  const pendingTasks: PendingTask[] = [
    {
      id: '1',
      title: 'Review Teacher Applications',
      description: '5 new teacher applications pending approval',
      priority: 'high',
      dueDate: '2024-01-25',
      assignedTo: 'Principal',
    },
    {
      id: '2',
      title: 'Fee Structure Update',
      description: 'Update transportation fees for Q1 2024',
      priority: 'medium',
      dueDate: '2024-01-30',
      assignedTo: 'Admin Office',
    },
    {
      id: '3',
      title: 'Parent Meeting Schedule',
      description: 'Schedule PTM for Grade 10 students',
      priority: 'medium',
      dueDate: '2024-02-05',
      assignedTo: 'Class Teachers',
    },
  ];

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'payment': return '💰';
      case 'user': return '👤';
      case 'system': return '⚙️';
      case 'alert': return '🚨';
      default: return '📋';
    }
  };

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'success': return '#10B981';
      case 'warning': return '#F59E0B';
      case 'info': return '#3B82F6';
      default: return theme.colors.mutedForeground;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return theme.colors.mutedForeground;
    }
  };

  const quickAction = (action: string) => {
    Alert.alert(
      `${action} Action`,
      `Navigate to ${action} management?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Go', onPress: () => console.log(`Navigate to ${action}`) }
      ]
    );
  };

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
          <Text style={styles.welcomeText}>Welcome back, Administrator</Text>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
          <Text style={styles.headerSubtitle}>Oversee school operations and management</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => quickAction('User Management')}
          >
            <Text style={styles.actionIcon}>👥</Text>
            <Text style={styles.actionText}>Users</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => quickAction('Reports')}
          >
            <Text style={styles.actionIcon}>📊</Text>
            <Text style={styles.actionText}>Reports</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => quickAction('Settings')}
          >
            <Text style={styles.actionIcon}>⚙️</Text>
            <Text style={styles.actionText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => quickAction('Announcements')}
          >
            <Text style={styles.actionIcon}>📢</Text>
            <Text style={styles.actionText}>Announce</Text>
          </TouchableOpacity>
        </View>

        {/* System Statistics */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>👨‍🎓</Text>
            <Text style={styles.statValue}>{systemStats.totalStudents.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total Students</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>👨‍🏫</Text>
            <Text style={styles.statValue}>{systemStats.totalTeachers}</Text>
            <Text style={styles.statLabel}>Teachers</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>👨‍👩‍👧‍👦</Text>
            <Text style={styles.statValue}>{systemStats.totalParents.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Parents</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>🚌</Text>
            <Text style={styles.statValue}>{systemStats.totalDrivers}</Text>
            <Text style={styles.statLabel}>Drivers</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>🛣️</Text>
            <Text style={styles.statValue}>{systemStats.activeRoutes}</Text>
            <Text style={styles.statLabel}>Active Routes</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>💰</Text>
            <Text style={styles.statValue}>₹{(systemStats.totalRevenue / 100000).toFixed(1)}L</Text>
            <Text style={styles.statLabel}>Monthly Revenue</Text>
          </View>
        </View>

        {/* Pending Tasks */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pending Tasks</Text>
          {pendingTasks.map((task) => (
            <View key={task.id} style={styles.taskCard}>
              <View style={styles.taskHeader}>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <View style={[
                  styles.taskPriority,
                  { backgroundColor: getPriorityColor(task.priority) }
                ]}>
                  <Text style={styles.taskPriorityText}>{task.priority.toUpperCase()}</Text>
                </View>
              </View>
              <Text style={styles.taskDescription}>{task.description}</Text>
              <View style={styles.taskFooter}>
                <Text style={styles.taskAssignee}>Assigned: {task.assignedTo}</Text>
                <Text style={styles.taskDue}>Due: {new Date(task.dueDate).toLocaleDateString()}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {recentActivities.map((activity) => (
            <View key={activity.id} style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Text style={styles.activityIconText}>{getActivityIcon(activity.type)}</Text>
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityMessage}>{activity.message}</Text>
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
              <View style={[
                styles.activityStatus,
                { backgroundColor: getActivityColor(activity.status) }
              ]}>
                <Text style={styles.activityStatusText}>●</Text>
              </View>
            </View>
          ))}
        </View>

        {/* System Health */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System Health</Text>
          <View style={styles.healthGrid}>
            <View style={styles.healthCard}>
              <Text style={styles.healthEmoji}>🖥️</Text>
              <Text style={styles.healthValue}>99.8%</Text>
              <Text style={styles.healthLabel}>Server Uptime</Text>
            </View>
            <View style={styles.healthCard}>
              <Text style={styles.healthEmoji}>📱</Text>
              <Text style={styles.healthValue}>156</Text>
              <Text style={styles.healthLabel}>Active Sessions</Text>
            </View>
            <View style={styles.healthCard}>
              <Text style={styles.healthEmoji}>💾</Text>
              <Text style={styles.healthValue}>2.3GB</Text>
              <Text style={styles.healthLabel}>Storage Used</Text>
            </View>
            <View style={styles.healthCard}>
              <Text style={styles.healthEmoji}>🔒</Text>
              <Text style={styles.healthValue}>98.5%</Text>
              <Text style={styles.healthLabel}>Security Score</Text>
            </View>
          </View>
        </View>

        {/* Quick System Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System Actions</Text>
          <View style={styles.systemActions}>
            <TouchableOpacity style={styles.systemButton}>
              <Text style={styles.systemButtonIcon}>🔄</Text>
              <Text style={styles.systemButtonText}>Backup Data</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.systemButton}>
              <Text style={styles.systemButtonIcon}>📧</Text>
              <Text style={styles.systemButtonText}>Send Newsletter</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.systemButton}>
              <Text style={styles.systemButtonIcon}>📋</Text>
              <Text style={styles.systemButtonText}>Generate Report</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.systemButton}>
              <Text style={styles.systemButtonIcon}>🚨</Text>
              <Text style={styles.systemButtonText}>Emergency Alert</Text>
            </TouchableOpacity>
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
  taskCard: {
    padding: theme.spacing[4],
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing[3],
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[2],
  },
  taskTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.foreground,
    flex: 1,
  },
  taskPriority: {
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.borderRadius.sm,
  },
  taskPriorityText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.card,
  },
  taskDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedForeground,
    marginBottom: theme.spacing[2],
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskAssignee: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.primary,
  },
  taskDue: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.mutedForeground,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing[3],
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing[2],
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing[3],
  },
  activityIconText: {
    fontSize: theme.fontSize.lg,
  },
  activityContent: {
    flex: 1,
  },
  activityMessage: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.foreground,
    marginBottom: theme.spacing[1],
  },
  activityTime: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.mutedForeground,
  },
  activityStatus: {
    width: 12,
    height: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityStatusText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.card,
  },
  healthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[3],
  },
  healthCard: {
    flex: 1,
    minWidth: '45%',
    padding: theme.spacing[4],
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  healthEmoji: {
    fontSize: theme.fontSize['2xl'],
    marginBottom: theme.spacing[2],
  },
  healthValue: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.foreground,
  },
  healthLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedForeground,
    textAlign: 'center',
    marginTop: theme.spacing[1],
  },
  systemActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[3],
  },
  systemButton: {
    flex: 1,
    minWidth: '45%',
    padding: theme.spacing[4],
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  systemButtonIcon: {
    fontSize: theme.fontSize.lg,
    marginBottom: theme.spacing[2],
  },
  systemButtonText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.foreground,
    textAlign: 'center',
  },
});

export default AdminDashboard;
