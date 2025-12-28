import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { theme } from '../theme';
import apiService from '../services/apiService';

interface StudentModeModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (studentData: any) => void;
  parentId: number;
  studentId: number;
  studentName: string;
}

const StudentModeModal: React.FC<StudentModeModalProps> = ({
  visible,
  onClose,
  onSuccess,
  parentId,
  studentId,
  studentName,
}) => {
  const [passkey, setPasskey] = useState('');
  const [loading, setLoading] = useState(false);

  const handleValidatePasskey = async () => {
    if (!passkey.trim()) {
      Alert.alert('Error', 'Please enter your passkey');
      return;
    }

    if (passkey.length < 4 || passkey.length > 8) {
      Alert.alert('Error', 'Passkey must be 4-8 characters long');
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.validateStudentMode(parentId, studentId, passkey);

      if (response.success) {
        setPasskey('');
        onSuccess(response.data);
      } else {
        Alert.alert('Invalid Passkey', response.message || 'The passkey you entered is incorrect');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to validate passkey');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPasskey('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>🔐 Student Mode</Text>
            <Text style={styles.subtitle}>Enter your special code to access your dashboard</Text>
          </View>

          <View style={styles.studentInfo}>
            <Text style={styles.studentName}>👦 {studentName}</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Your Passkey</Text>
            <TextInput
              style={styles.input}
              value={passkey}
              onChangeText={setPasskey}
              placeholder="Enter 4-8 character passkey"
              placeholderTextColor={theme.colors.mutedForeground}
              secureTextEntry={false} // Show characters for easier entry
              maxLength={8}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
            <Text style={styles.hint}>
              This is your personal code set by your parent
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleClose}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.enterButton]}
              onPress={handleValidatePasskey}
              disabled={loading || !passkey.trim()}
            >
              {loading ? (
                <ActivityIndicator color={theme.colors['primary-foreground']} size="small" />
              ) : (
                <Text style={styles.enterButtonText}>Enter Student World</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              🎓 Take control of your learning journey!
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing[4],
  },
  modalContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing[6],
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing[6],
  },
  title: {
    fontSize: theme.fontSize['2xl'],
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.foreground,
    marginBottom: theme.spacing[2],
  },
  subtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedForeground,
    textAlign: 'center',
  },
  studentInfo: {
    backgroundColor: theme.colors.secondary,
    padding: theme.spacing[4],
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing[6],
    alignItems: 'center',
  },
  studentName: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.foreground,
  },
  inputContainer: {
    marginBottom: theme.spacing[6],
  },
  label: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.foreground,
    marginBottom: theme.spacing[2],
  },
  input: {
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing[4],
    fontSize: theme.fontSize.lg,
    color: theme.colors.foreground,
    backgroundColor: theme.colors.secondary,
    textAlign: 'center',
    letterSpacing: 2,
  },
  hint: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.mutedForeground,
    textAlign: 'center',
    marginTop: theme.spacing[2],
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: theme.spacing[3],
    marginBottom: theme.spacing[4],
  },
  button: {
    flex: 1,
    padding: theme.spacing[4],
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: theme.colors.secondary,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cancelButtonText: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.foreground,
  },
  enterButton: {
    backgroundColor: theme.colors.primary,
  },
  enterButtonText: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors['primary-foreground'],
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedForeground,
    fontStyle: 'italic',
  },
});

export default StudentModeModal;
