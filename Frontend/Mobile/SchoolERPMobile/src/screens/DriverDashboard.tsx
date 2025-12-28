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

interface Route {
  id: string;
  name: string;
  status: 'not_started' | 'in_progress' | 'completed';
  totalStops: number;
  completedStops: number;
  nextStop: string;
  estimatedArrival: string;
  studentsOnBoard: number;
  totalStudents: number;
}

interface StudentPickup {
  id: string;
  name: string;
  rollNumber: string;
  stopName: string;
  scheduledTime: string;
  status: 'pending' | 'picked_up' | 'no_show' | 'completed';
  contactNumber: string;
}

interface BusStatus {
  busNumber: string;
  currentLocation: string;
  speed: number;
  fuelLevel: number;
  nextService: string;
  status: 'active' | 'maintenance' | 'offline';
}

const DriverDashboard = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState('Morning Route A');

  const routes: Route[] = [
    {
      id: '1',
      name: 'Morning Route A',
      status: 'in_progress',
      totalStops: 12,
      completedStops: 8,
      nextStop: 'Oak Street Stop',
      estimatedArrival: '08:45 AM',
      studentsOnBoard: 24,
      totalStudents: 28,
    },
    {
      id: '2',
      name: 'Evening Route A',
      status: 'not_started',
      totalStops: 12,
      completedStops: 0,
      nextStop: 'School Gate',
      estimatedArrival: '03:30 PM',
      studentsOnBoard: 0,
      totalStudents: 28,
    },
  ];

  const currentPickups: StudentPickup[] = [
    { id: '1', name: 'Arjun Sharma', rollNumber: '1', stopName: 'Oak Street', scheduledTime: '08:45 AM', status: 'pending', contactNumber: '+91 98765 43210' },
    { id: '2', name: 'Priya Patel', rollNumber: '2', stopName: 'Oak Street', scheduledTime: '08:45 AM', status: 'pending', contactNumber: '+91 98765 43211' },
    { id: '3', name: 'Rohan Kumar', rollNumber: '3', stopName: 'Maple Avenue', scheduledTime: '08:50 AM', status: 'picked_up', contactNumber: '+91 98765 43212' },
  ];

  const busStatus: BusStatus = {
    busNumber: 'BUS-001',
    currentLocation: 'En Route to Oak Street',
    speed: 25,
    fuelLevel: 75,
    nextService: '2024-02-15',
    status: 'active',
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getRouteStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress': return '#3B82F6';
      case 'completed': return '#10B981';
      case 'not_started': return '#6B7280';
      default: return theme.colors.mutedForeground;
    }
  };

  const getPickupStatusColor = (status: string) => {
    switch (status) {
      case 'picked_up': return '#10B981';
      case 'pending': return '#F59E0B';
      case 'no_show': return theme.colors.destructive;
      case 'completed': return '#3B82F6';
      default: return theme.colors.mutedForeground;
    }
  };

  const markPickup = (studentId: string, action: 'pickup' | 'dropoff') => {
    Alert.alert(
      `${action === 'pickup' ? 'Pickup' : 'Dropoff'} Confirmation`,
      `Confirm ${action} for student?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: () => console.log(`${action} confirmed for ${studentId}`) }
      ]
    );
  };

  const startRoute = () => {
    Alert.alert(
      'Start Route',
      'Begin the selected route?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Start Route', onPress: () => console.log('Route started') }
      ]
    );
  };

  const emergencyAlert = () => {
    Alert.alert(
      'Emergency Alert',
      'Send emergency notification to school?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Send Alert', style: 'destructive', onPress: () => console.log('Emergency alert sent') }
      ]
    );
  };

  const progressPercentage = selectedRoute === 'Morning Route A'
    ? Math.round((routes[0].completedStops / routes[0].totalStops) * 100)
    : 0;

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
          <Text style={styles.headerTitle}>Driver Dashboard</Text>
          <Text style={styles.headerSubtitle}>Manage routes and student transportation</Text>
        </View>

        {/* Bus Status Card */}
        <View style={styles.busStatusCard}>
          <View style={styles.busHeader}>
            <Text style={styles.busNumber}>{busStatus.busNumber}</Text>
            <View style={[
              styles.busStatusBadge,
              { backgroundColor: busStatus.status === 'active' ? '#10B981' : '#F59E0B' }
            ]}>
              <Text style={styles.busStatusText}>{busStatus.status.toUpperCase()}</Text>
            </View>
          </View>
          <View style={styles.busDetails}>
            <Text style={styles.busLocation}>📍 {busStatus.currentLocation}</Text>
            <View style={styles.busMetrics}>
              <Text style={styles.busMetric}>🚗 {busStatus.speed} km/h</Text>
              <Text style={styles.busMetric}>⛽ {busStatus.fuelLevel}%</Text>
              <Text style={styles.busMetric}>🔧 Next: {busStatus.nextService}</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton} onPress={startRoute}>
            <Text style={styles.actionIcon}>🚀</Text>
            <Text style={styles.actionText}>Start Route</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>📍</Text>
            <Text style={styles.actionText}>GPS Tracking</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={emergencyAlert}>
            <Text style={styles.actionIcon}>🚨</Text>
            <Text style={styles.actionText}>Emergency</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>📞</Text>
            <Text style={styles.actionText}>Contact School</Text>
          </TouchableOpacity>
        </View>

        {/* Route Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Route</Text>
          {routes.map((route) => (
            <TouchableOpacity
              key={route.id}
              style={[
                styles.routeCard,
                selectedRoute === route.name && styles.routeCardActive,
              ]}
              onPress={() => setSelectedRoute(route.name)}
            >
              <View style={styles.routeHeader}>
                <Text style={styles.routeName}>{route.name}</Text>
                <View style={[
                  styles.routeStatus,
                  { backgroundColor: getRouteStatusColor(route.status) }
                ]}>
                  <Text style={styles.routeStatusText}>
                    {route.status === 'in_progress' ? 'IN PROGRESS' :
                     route.status === 'completed' ? 'COMPLETED' : 'NOT STARTED'}
                  </Text>
                </View>
              </View>
              <View style={styles.routeDetails}>
                <Text style={styles.routeProgress}>
                  {route.completedStops}/{route.totalStops} stops completed
                </Text>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${(route.completedStops / route.totalStops) * 100}%` }
                    ]}
                  />
                </View>
                <View style={styles.routeStats}>
                  <Text style={styles.routeStat}>👥 {route.studentsOnBoard}/{route.totalStudents} students</Text>
                  <Text style={styles.routeStat}>📍 Next: {route.nextStop}</Text>
                  <Text style={styles.routeStat}>⏰ ETA: {route.estimatedArrival}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Current Route Progress */}
        {selectedRoute === 'Morning Route A' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Route Progress</Text>
            <View style={styles.progressCard}>
              <Text style={styles.progressTitle}>Morning Route A Progress</Text>
              <Text style={styles.progressText}>{progressPercentage}% Complete</Text>
              <View style={styles.progressBar}>
                <View
                  style={[styles.progressFill, { width: `${progressPercentage}%` }]}
                />
              </View>
              <View style={styles.progressStats}>
                <Text style={styles.progressStat}>✅ {routes[0].completedStops} stops completed</Text>
                <Text style={styles.progressStat}>🎯 {routes[0].totalStops - routes[0].completedStops} stops remaining</Text>
                <Text style={styles.progressStat}>👥 {routes[0].studentsOnBoard} students on board</Text>
              </View>
            </View>
          </View>
        )}

        {/* Student Pickups */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Stop - Oak Street</Text>
          {currentPickups.map((student) => (
            <View key={student.id} style={styles.studentCard}>
              <View style={styles.studentInfo}>
                <Text style={styles.studentName}>{student.name}</Text>
                <Text style={styles.studentDetails}>Roll: {student.rollNumber} • {student.stopName}</Text>
                <Text style={styles.studentTime}>Scheduled: {student.scheduledTime}</Text>
              </View>
              <View style={styles.studentActions}>
                <View style={[
                  styles.studentStatus,
                  { backgroundColor: getPickupStatusColor(student.status) }
                ]}>
                  <Text style={styles.studentStatusText}>
                    {student.status === 'picked_up' ? 'PICKED UP' :
                     student.status === 'pending' ? 'WAITING' :
                     student.status === 'no_show' ? 'NO SHOW' : 'COMPLETED'}
                  </Text>
                </View>
                {student.status === 'pending' && (
                  <TouchableOpacity
                    style={styles.pickupButton}
                    onPress={() => markPickup(student.id, 'pickup')}
                  >
                    <Text style={styles.pickupButtonText}>✓ Pickup</Text>
                  </TouchableOpacity>
                )}
                {student.status === 'picked_up' && (
                  <TouchableOpacity
                    style={styles.contactButton}
                    onPress={() => console.log(`Call ${student.contactNumber}`)}
                  >
                    <Text style={styles.contactButtonText}>📞 Call</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Route Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Summary</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryEmoji}>🚌</Text>
              <Text style={styles.summaryValue}>2</Text>
              <Text style={styles.summaryLabel}>Routes Today</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryEmoji}>👥</Text>
              <Text style={styles.summaryValue}>56</Text>
              <Text style={styles.summaryLabel}>Students Transported</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryEmoji}>📍</Text>
              <Text style={styles.summaryValue}>24</Text>
              <Text style={styles.summaryLabel}>Stops Completed</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryEmoji}>⏱️</Text>
              <Text style={styles.summaryValue}>4.2</Text>
              <Text style={styles.summaryLabel}>Avg. On-Time %</Text>
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
  busStatusCard: {
    margin: theme.spacing[6],
    padding: theme.spacing[4],
    backgroundColor: theme.colors.card,
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
  busStatusBadge: {
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
    marginBottom: theme.spacing[2],
  },
  busLocation: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.foreground,
    marginBottom: theme.spacing[2],
  },
  busMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  busMetric: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.mutedForeground,
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
  routeCard: {
    padding: theme.spacing[4],
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing[2],
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  routeCardActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.card,
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[2],
  },
  routeName: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.foreground,
  },
  routeStatus: {
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.borderRadius.sm,
  },
  routeStatusText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.card,
  },
  routeDetails: {
    marginTop: theme.spacing[2],
  },
  routeProgress: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedForeground,
    marginBottom: theme.spacing[2],
  },
  progressBar: {
    height: 4,
    backgroundColor: theme.colors.muted,
    borderRadius: 2,
    marginBottom: theme.spacing[2],
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
  },
  routeStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  routeStat: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.foreground,
    marginBottom: theme.spacing[1],
    minWidth: '48%',
  },
  progressCard: {
    padding: theme.spacing[4],
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.md,
  },
  progressTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.foreground,
    marginBottom: theme.spacing[2],
  },
  progressText: {
    fontSize: theme.fontSize['2xl'],
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing[2],
  },
  progressStats: {
    marginTop: theme.spacing[3],
  },
  progressStat: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.foreground,
    marginBottom: theme.spacing[1],
  },
  studentCard: {
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
  studentDetails: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.mutedForeground,
    marginTop: theme.spacing[1],
  },
  studentTime: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.primary,
    marginTop: theme.spacing[1],
  },
  studentActions: {
    alignItems: 'flex-end',
  },
  studentStatus: {
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing[2],
  },
  studentStatusText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.card,
  },
  pickupButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
    borderRadius: theme.borderRadius.sm,
  },
  pickupButtonText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors['primary-foreground'],
  },
  contactButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
    borderRadius: theme.borderRadius.sm,
  },
  contactButtonText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.card,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[3],
  },
  summaryCard: {
    flex: 1,
    minWidth: '45%',
    padding: theme.spacing[4],
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  summaryEmoji: {
    fontSize: theme.fontSize['2xl'],
    marginBottom: theme.spacing[2],
  },
  summaryValue: {
    fontSize: theme.fontSize['2xl'],
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.foreground,
  },
  summaryLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedForeground,
    textAlign: 'center',
    marginTop: theme.spacing[1],
  },
});

export default DriverDashboard;
