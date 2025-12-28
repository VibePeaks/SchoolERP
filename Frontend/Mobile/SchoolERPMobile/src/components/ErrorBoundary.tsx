import React, { Component, ErrorInfo, ReactNode } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { theme } from '../theme';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });

    // TODO: Log error to analytics service
    // logError(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <SafeAreaView style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.errorContainer}>
              <Text style={styles.errorIcon}>⚠️</Text>
              <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
              <Text style={styles.errorMessage}>
                We're sorry, but something unexpected happened. Please try again.
              </Text>

              {(global as any).__DEV__ && this.state.error && (
                <View style={styles.devErrorContainer}>
                  <Text style={styles.devErrorTitle}>Development Error Details:</Text>
                  <Text style={styles.devErrorText}>
                    {this.state.error.toString()}
                  </Text>
                  {this.state.errorInfo && (
                    <Text style={styles.devErrorStack}>
                      {this.state.errorInfo.componentStack}
                    </Text>
                  )}
                </View>
              )}

              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.retryButton} onPress={this.handleReset}>
                  <Text style={styles.retryButtonText}>Try Again</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.reportButton} onPress={() => {
                  // TODO: Implement error reporting
                  console.log('Report error:', this.state.error);
                }}>
                  <Text style={styles.reportButtonText}>Report Issue</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.spacing[6],
  },
  errorContainer: {
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[6],
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: theme.spacing[4],
  },
  errorTitle: {
    fontSize: theme.fontSize['2xl'],
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.foreground,
    marginBottom: theme.spacing[3],
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: theme.fontSize.base,
    color: theme.colors.mutedForeground,
    textAlign: 'center',
    marginBottom: theme.spacing[6],
    lineHeight: 20,
  },
  devErrorContainer: {
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing[4],
    marginBottom: theme.spacing[4],
    width: '100%',
  },
  devErrorTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.foreground,
    marginBottom: theme.spacing[2],
  },
  devErrorText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.destructive,
    fontFamily: 'monospace',
    marginBottom: theme.spacing[2],
  },
  devErrorStack: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.mutedForeground,
    fontFamily: 'monospace',
    lineHeight: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: theme.spacing[3],
    width: '100%',
  },
  retryButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing[4],
    alignItems: 'center',
  },
  retryButtonText: {
    color: theme.colors['primary-foreground'],
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
  },
  reportButton: {
    flex: 1,
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing[4],
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  reportButtonText: {
    color: theme.colors.foreground,
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.medium,
  },
});

export default ErrorBoundary;
