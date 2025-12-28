import { ApiError } from '@/types/api';

// Custom API Error Class
export class ApiRequestError extends Error {
  public statusCode: number;
  public errors?: string[];
  public timestamp: string;
  public path?: string;

  constructor(error: ApiError) {
    super(error.message);
    this.name = 'ApiRequestError';
    this.statusCode = error.statusCode;
    this.errors = error.errors;
    this.timestamp = error.timestamp;
    this.path = error.path;
  }

  // Helper methods to check common error types
  isValidationError(): boolean {
    return this.statusCode === 400;
  }

  isUnauthorized(): boolean {
    return this.statusCode === 401;
  }

  isForbidden(): boolean {
    return this.statusCode === 403;
  }

  isNotFound(): boolean {
    return this.statusCode === 404;
  }

  isConflict(): boolean {
    return this.statusCode === 409;
  }

  isServerError(): boolean {
    return this.statusCode >= 500;
  }

  isNetworkError(): boolean {
    return this.statusCode === 0;
  }
}

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  UNAUTHORIZED: 'You are not authorized to access this resource.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  DEFAULT: 'An unexpected error occurred. Please try again.',
  TIMEOUT: 'Request timed out. Please try again.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  SUBSCRIPTION_REQUIRED: 'This feature requires a higher subscription plan.',
  TENANT_NOT_FOUND: 'School/tenant not found.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  ACCOUNT_LOCKED: 'Your account has been locked. Please contact administrator.',
  EMAIL_NOT_VERIFIED: 'Please verify your email address before continuing.',
  MAINTENANCE_MODE: 'System is under maintenance. Please try again later.',
  RATE_LIMIT_EXCEEDED: 'Too many requests. Please try again later.',
};

// Error Handler Function
export const handleApiError = (error: any): ApiRequestError => {
  // Network error (no response)
  if (!error.response) {
    return new ApiRequestError({
      message: ERROR_MESSAGES.NETWORK_ERROR,
      statusCode: 0,
      timestamp: new Date().toISOString(),
    });
  }

  // API error with response
  const { status, data } = error.response;
  
  // Handle specific HTTP status codes
  switch (status) {
    case 400:
      return new ApiRequestError({
        message: data?.message || ERROR_MESSAGES.VALIDATION_ERROR,
        statusCode: status,
        errors: data?.errors,
        timestamp: new Date().toISOString(),
      });
    
    case 401:
      return new ApiRequestError({
        message: data?.message || ERROR_MESSAGES.UNAUTHORIZED,
        statusCode: status,
        timestamp: new Date().toISOString(),
      });
    
    case 403:
      return new ApiRequestError({
        message: data?.message || ERROR_MESSAGES.FORBIDDEN,
        statusCode: status,
        timestamp: new Date().toISOString(),
      });
    
    case 404:
      return new ApiRequestError({
        message: data?.message || ERROR_MESSAGES.NOT_FOUND,
        statusCode: status,
        timestamp: new Date().toISOString(),
      });
    
    case 409:
      return new ApiRequestError({
        message: data?.message || ERROR_MESSAGES.VALIDATION_ERROR,
        statusCode: status,
        errors: data?.errors,
        timestamp: new Date().toISOString(),
      });
    
    case 429:
      return new ApiRequestError({
        message: ERROR_MESSAGES.RATE_LIMIT_EXCEEDED,
        statusCode: status,
        timestamp: new Date().toISOString(),
      });
    
    case 500:
    case 502:
    case 503:
    case 504:
      return new ApiRequestError({
        message: data?.message || ERROR_MESSAGES.SERVER_ERROR,
        statusCode: status,
        timestamp: new Date().toISOString(),
      });
    
    default:
      return new ApiRequestError({
        message: data?.message || ERROR_MESSAGES.DEFAULT,
        statusCode: status,
        errors: data?.errors,
        timestamp: new Date().toISOString(),
      });
  }
};

// Get user-friendly error message
export const getErrorMessage = (error: ApiRequestError): string => {
  // Return the original message if it's already user-friendly
  if (Object.values(ERROR_MESSAGES).includes(error.message)) {
    return error.message;
  }

  // Return specific error messages based on error type
  if (error.isUnauthorized()) {
    return ERROR_MESSAGES.UNAUTHORIZED;
  }
  
  if (error.isForbidden()) {
    return ERROR_MESSAGES.FORBIDDEN;
  }
  
  if (error.isNotFound()) {
    return ERROR_MESSAGES.NOT_FOUND;
  }
  
  if (error.isValidationError()) {
    return error.errors?.[0] || ERROR_MESSAGES.VALIDATION_ERROR;
  }
  
  if (error.isServerError()) {
    return ERROR_MESSAGES.SERVER_ERROR;
  }
  
  if (error.isNetworkError()) {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }

  return error.message || ERROR_MESSAGES.DEFAULT;
};

// Retry logic for failed requests
export const shouldRetryRequest = (error: ApiRequestError, retryCount: number): boolean => {
  const maxRetries = 3;
  
  // Don't retry if we've reached max attempts
  if (retryCount >= maxRetries) {
    return false;
  }
  
  // Retry on network errors or server errors
  return error.isNetworkError() || error.isServerError();
};

// Exponential backoff for retries
export const getRetryDelay = (retryCount: number): number => {
  const baseDelay = 1000; // 1 second
  const maxDelay = 10000; // 10 seconds
  const delay = baseDelay * Math.pow(2, retryCount);
  return Math.min(delay, maxDelay);
};
