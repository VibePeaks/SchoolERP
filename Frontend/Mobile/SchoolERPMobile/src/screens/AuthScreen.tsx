import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { theme } from '../theme';

type UserRole = 'parent' | 'teacher' | 'driver' | 'admin';

interface LoginForm {
  email: string;
  password: string;
  tenantCode: string;
  selectedRole: UserRole;
}

const AuthScreen = ({ navigation }: any) => {
  const [form, setForm] = useState<LoginForm>({
    email: '',
    password: '',
    tenantCode: 'default',
    selectedRole: 'parent',
  });
  const [loading, setLoading] = useState(false);

  const roles: { key: UserRole; label: string; emoji: string }[] = [
    { key: 'parent', label: 'Parent', emoji: '👨‍👩‍👧‍👦' },
    { key: 'teacher', label: 'Teacher', emoji: '👨‍🏫' },
    { key: 'driver', label: 'Driver', emoji: '🚐' },
    { key: 'admin', label: 'Admin', emoji: '🏫' },
  ];

  const handleLogin = async () => {
    if (!form.email || !form.password || !form.tenantCode) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      // TODO: Replace with actual API call
      // const response = await authService.login(form);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock successful login
      navigation.replace('Main', {
        userRole: form.selectedRole,
        userData: {
          id: 1,
          name: 'Demo User',
          email: form.email,
          role: form.selectedRole,
        },
      });
    } catch (error) {
      Alert.alert('Login Failed', 'Please check your credentials and try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>SchoolERP</Text>
            <Text style={styles.subtitle}>Mobile</Text>
            <Text style={styles.welcomeText}>Welcome back! Please sign in to continue.</Text>
          </View>

          {/* Role Selection */}
          <View style={styles.roleSection}>
            <Text style={styles.sectionTitle}>Select Your Role</Text>
            <View style={styles.roleGrid}>
              {roles.map((role) => (
                <TouchableOpacity
                  key={role.key}
                  style={[
                    styles.roleButton,
                    form.selectedRole === role.key && styles.roleButtonActive,
                  ]}
                  onPress={() => setForm({ ...form, selectedRole: role.key })}
                >
                  <Text style={styles.roleEmoji}>{role.emoji}</Text>
                  <Text
                    style={[
                      styles.roleLabel,
                      form.selectedRole === role.key && styles.roleLabelActive,
                    ]}
                  >
                    {role.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Login Form */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tenant Code</Text>
              <TextInput
                style={styles.input}
                value={form.tenantCode}
                onChangeText={(tenantCode: string) => setForm({ ...form, tenantCode })}
                placeholder="Enter school code"
                placeholderTextColor={theme.colors.mutedForeground}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                value={form.email}
                onChangeText={(email: string) => setForm({ ...form, email })}
                placeholder="Enter your email"
                placeholderTextColor={theme.colors.mutedForeground}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={styles.input}
                value={form.password}
                onChangeText={(password: string) => setForm({ ...form, password })}
                placeholder="Enter your password"
                placeholderTextColor={theme.colors.mutedForeground}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={[styles.loginButtonText, loading && styles.loginButtonTextDisabled]}>
                {loading ? 'Signing In...' : 'Sign In'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Don't have an account? Contact your school administrator.
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing[6],
    paddingTop: theme.spacing[8],
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing[8],
  },
  title: {
    fontSize: theme.fontSize['4xl'],
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing[1],
  },
  subtitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.foreground,
    marginBottom: theme.spacing[3],
  },
  welcomeText: {
    fontSize: theme.fontSize.base,
    color: theme.colors.mutedForeground,
    textAlign: 'center',
    lineHeight: 20,
  },
  roleSection: {
    marginBottom: theme.spacing[6],
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.foreground,
    marginBottom: theme.spacing[3],
  },
  roleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[3],
  },
  roleButton: {
    flex: 1,
    minWidth: '45%',
    padding: theme.spacing[4],
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: 'center',
    backgroundColor: theme.colors.card,
  },
  roleButtonActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.secondary,
  },
  roleEmoji: {
    fontSize: theme.fontSize['3xl'],
    marginBottom: theme.spacing[2],
  },
  roleLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.foreground,
  },
  roleLabelActive: {
    color: theme.colors.primary,
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: theme.spacing[4],
  },
  inputLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.foreground,
    marginBottom: theme.spacing[2],
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing[4],
    fontSize: theme.fontSize.base,
    color: theme.colors.foreground,
    backgroundColor: theme.colors.card,
  },
  loginButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing[4],
    alignItems: 'center',
    marginTop: theme.spacing[4],
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: theme.colors['primary-foreground'],
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
  },
  loginButtonTextDisabled: {
    opacity: 0.8,
  },
  footer: {
    paddingBottom: theme.spacing[8],
    alignItems: 'center',
  },
  footerText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedForeground,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default AuthScreen;
