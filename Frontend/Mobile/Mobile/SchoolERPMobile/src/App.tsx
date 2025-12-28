import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar, StyleSheet, View, Text } from 'react-native';
import { theme } from './theme';
import AuthScreen from './screens/AuthScreen';
import ParentDashboard from './screens/ParentDashboard';
import TeacherDashboard from './screens/TeacherDashboard';
import DriverDashboard from './screens/DriverDashboard';
import AdminDashboard from './screens/AdminDashboard';
import ErrorBoundary from './components/ErrorBoundary';

// Navigation Types
export type RootStackParamList = {
  Auth: undefined;
  Main: { userRole: string } | undefined;
};

export type MainTabParamList = {
  Dashboard: { userRole: string } | undefined;
  Students: undefined;
  Classes: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const DashboardScreen = ({ route }: any) => {
  const { userRole } = route.params || {};

  // Render role-specific dashboard
  if (userRole === 'parent') {
    return <ParentDashboard />;
  }

  if (userRole === 'teacher') {
    return <TeacherDashboard />;
  }

  if (userRole === 'driver') {
    return <DriverDashboard />;
  }

  if (userRole === 'admin') {
    return <AdminDashboard />;
  }

  // Default dashboard for unknown roles
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.subtitle}>Welcome to SchoolERP Mobile</Text>
      <Text style={[styles.subtitle, { marginTop: theme.spacing[4] }]}>
        Role: {userRole?.toUpperCase() || 'Unknown'}
      </Text>
    </View>
  );
};

const StudentsScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Students</Text>
    <Text style={styles.subtitle}>Student management - Coming Soon</Text>
  </View>
);

const ClassesScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Classes</Text>
    <Text style={styles.subtitle}>Class management - Coming Soon</Text>
  </View>
);

const ProfileScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Profile</Text>
    <Text style={styles.subtitle}>User profile - Coming Soon</Text>
  </View>
);

// Main tab navigator
const MainNavigator = ({ route }: any) => {
  const { userRole } = route.params || {};

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.mutedForeground,
        headerStyle: styles.header,
        headerTintColor: theme.colors.foreground,
        headerTitleStyle: styles.headerTitle,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
        initialParams={{ userRole }}
      />
      <Tab.Screen
        name="Students"
        component={StudentsScreen}
        options={{ title: 'Students' }}
      />
      <Tab.Screen
        name="Classes"
        component={ClassesScreen}
        options={{ title: 'Classes' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

// Main App component
const App = () => {
  return (
    <NavigationContainer>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.colors.background}
      />
      <Stack.Navigator
        initialRouteName="Auth"
        screenOptions={{
          headerStyle: styles.header,
          headerTintColor: theme.colors.foreground,
          headerTitleStyle: styles.headerTitle,
        }}
      >
        <Stack.Screen
          name="Auth"
          component={AuthScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={MainNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing[4],
  },
  title: {
    fontSize: theme.fontSize['3xl'],
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.foreground,
    marginBottom: theme.spacing[2],
  },
  subtitle: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.mutedForeground,
    textAlign: 'center',
  },
  header: {
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.foreground,
  },
  tabBar: {
    backgroundColor: theme.colors.card,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingBottom: theme.spacing[2],
    paddingTop: theme.spacing[1],
    height: 60,
  },
});

export default () => (
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
