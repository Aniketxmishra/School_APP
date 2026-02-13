import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet, 
  Alert, 
  Image, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import Button from './components/Button/Button';
import theme from './theme/theme';
import { apiService } from '../services/apiService';
import { ENV } from '../config/env';
import { useUser, USER_ROLES } from './context/UserContext';

// Move constants outside component
const MAX_LOGIN_ATTEMPTS = 3;
const LOCKOUT_DURATION = 300000; // 5 minutes in milliseconds

export default function AuthScreen() {
  const [formData, setFormData] = useState({
    userId: '',
    password: ''
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(null);
  
  const router = useRouter();
  const passwordInputRef = useRef(null);
  const lockoutTimerRef = useRef(null);
  const { login } = useUser();

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (lockoutTimerRef.current) {
        clearTimeout(lockoutTimerRef.current);
      }
    };
  }, []);

  // Memoized input change handler
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  }, [error]);

  // Memoized password visibility toggle
  const togglePasswordVisibility = useCallback(() => {
    setIsPasswordVisible(prev => !prev);
  }, []);

  // Enhanced form validation
  const validateForm = useCallback(() => {
    const { userId, password } = formData;
    
    if (!userId.trim()) {
      setError('User ID is required');
      return false;
    }
    
    if (!password.trim()) {
      setError('Password is required');
      return false;
    }
    
    // User ID validation - typically alphanumeric, 4-20 characters
    if (userId.length < 3) {
      setError('User ID must be at least 3 characters');
      return false;
    }
    
    if (userId.length > 20) {
      setError('User ID must be less than 20 characters');
      return false;
    }
    
    // Check for valid characters (alphanumeric, underscore, hyphen)
    if (!/^[a-zA-Z0-9_-]+$/.test(userId)) {
      setError('User ID can only contain letters, numbers, underscore, and hyphen');
      return false;
    }
    
    if (password.length < 4) {
      setError('Password must be at least 4 characters');
      return false;
    }
    
    return true;
  }, [formData]);

  // ✅ FIXED: Real API authentication with correct response parsing
  const authenticateUser = useCallback(async (credentials) => {
    try {
      const { userId, password } = credentials;
      
      console.log('🔍 AUTH: Attempting login with:', { username: userId });
      console.log('🔍 AUTH: API Base URL:', ENV?.API_BASE_URL);
      
      // Call backend login API
      const response = await apiService.login({
        Username: userId,
        Password: password
      });
      
      console.log('🔍 AUTH: Full API response:', JSON.stringify(response, null, 2));
      
      if (response.success && response.data) {
        console.log('✅ AUTH: Database login successful');
        
        // ✅ FIXED: Read from correct nested structure
        const userData = response.data.user || {};
        const userPermissions = userData.permissions || {
          username: userId,
          userType: 'student',
          groupName: 'Student',
          modules: []
        };
        
        console.log('✅ User Info:', {
          username: userData.username,
          userType: userData.userType,
          groupName: userData.groupName,
          moduleCount: userPermissions.modules?.length
        });
        
        return {
          success: true,
          token: response.data.token || 'jwt-token',
          user: {
            id: userData.username || userId,
            username: userData.username || userId,
            name: userData.username || userId,
            role: userData.userType || USER_ROLES.STUDENT, // ✅ Now correctly reads "admin"
            groupName: userData.groupName || 'Student' // ✅ Added groupName
          },
          permissions: userPermissions // ✅ Full permissions with all 19 modules for admin
        };
      }
      
      // Login failed
      console.log('❌ AUTH: API login failed');
      return {
        success: false,
        message: response.message || response.error || 'Invalid User ID or Password'
      };
      
    } catch (error) {
      console.error('❌ AUTH ERROR:', error);
      return {
        success: false,
        message: `Network error: ${error.message}. Please check your connection and try again.`
      };
    }
  }, []);

  // Handle lockout timer
  const handleLockout = useCallback(() => {
    setIsLocked(true);
    setLockoutTime(Date.now() + LOCKOUT_DURATION);
    
    lockoutTimerRef.current = setTimeout(() => {
      setIsLocked(false);
      setLoginAttempts(0);
      setLockoutTime(null);
      setError('');
    }, LOCKOUT_DURATION);
  }, []);

  // Enhanced login handler
  const handleLogin = useCallback(async () => {
    if (isLocked) {
      const remainingTime = Math.ceil((lockoutTime - Date.now()) / 60000);
      setError(`Account locked. Try again in ${remainingTime} minutes.`);
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await authenticateUser(formData);
      
      if (result.success) {
        // Reset attempts on successful login
        setLoginAttempts(0);
        setError('');
        
        console.log('✅ Storing user in context:', result.user);
        console.log('✅ Storing permissions in context:', {
          moduleCount: result.permissions?.modules?.length,
          userType: result.permissions?.userType
        });
        
        // ✅ Store user data and permissions in context
        login(result.user, result.permissions);
        
        // Route to dynamic home screen for all users
        router.push('/home-dynamic');
      } else {
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        
        if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
          handleLockout();
          setError(`Too many failed attempts. Account locked for 5 minutes.`);
        } else {
          const remainingAttempts = MAX_LOGIN_ATTEMPTS - newAttempts;
          setError(`${result.message}. ${remainingAttempts} attempts remaining.`);
        }
      }
    } catch (error) {
      setError('Network error. Please check your connection and try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [formData, isLocked, lockoutTime, loginAttempts, validateForm, authenticateUser, handleLockout, login, router]);

  // Handle forgot password
  const handleForgotPassword = useCallback(() => {
    Alert.alert(
      'Forgot Password',
      'Please contact your school administrator to reset your password.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Contact Admin', onPress: () => {
          Alert.alert('Contact Information', 'Email: admin@school.edu\nPhone: +1-234-567-8900');
        }}
      ]
    );
  }, []);

  // Handle registration
  const handleRegister = useCallback(() => {
    Alert.alert(
      'New Account',
      'Student and staff accounts are created by the school administration. Please contact the office for account setup.',
      [{ text: 'OK', style: 'default' }]
    );
  }, []);

  // Focus next input
  const focusPasswordInput = useCallback(() => {
    passwordInputRef.current?.focus();
  }, []);

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Image
          source={require('../assets/images/school.png')}
          style={styles.logo}
          accessible 
          accessibilityLabel="School Logo"
        />
        
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>
        <Text style={styles.version}>Version: 1.0.0</Text>

        {/* User ID Input */}
        <View style={[
          styles.inputContainer,
          error && error.includes('User ID') && styles.inputError
        ]}>
          <Icon name="user" size={20} color={theme.colors.textMuted} style={styles.icon} />
          <TextInput
            placeholder="User ID"
            style={styles.input}
            value={formData.userId}
            placeholderTextColor={theme.colors.textMuted}
            onChangeText={(value) => handleInputChange('userId', value)}
            keyboardType="default"
            selectionColor={theme.colors.primary}
            color={theme.colors.text}
            maxLength={20}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
            onSubmitEditing={focusPasswordInput}
            editable={!isLoading && !isLocked}
            accessible 
            accessibilityLabel="User ID Input"
            accessibilityHint="Enter your assigned User ID"
          />
        </View>

        {/* Password Input */}
        <View style={[
          styles.inputContainer,
          error && error.includes('Password') && styles.inputError
        ]}>
          <Icon name="lock" size={20} color={theme.colors.textMuted} style={styles.icon} />
          <TextInput
            ref={passwordInputRef}
            placeholder="Password"
            style={styles.input}
            value={formData.password}
            placeholderTextColor={theme.colors.textMuted}
            secureTextEntry={!isPasswordVisible}
            onChangeText={(value) => handleInputChange('password', value)}
            selectionColor={theme.colors.primary}
            color={theme.colors.text}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={handleLogin}
            textContentType="password"
            editable={!isLoading && !isLocked}
            accessible 
            accessibilityLabel="Password Input"
            accessibilityHint="Enter your password"
          />
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.eyeIcon}
            disabled={isLoading || isLocked}
            accessible 
            accessibilityLabel={isPasswordVisible ? 'Hide password' : 'Show password'}
            accessibilityRole="button"
          >
            <Icon 
              name={isPasswordVisible ? 'eye' : 'eye-slash'} 
              size={20} 
              color={theme.colors.textMuted} 
            />
          </TouchableOpacity>
        </View>

        {/* Error Message */}
        {error ? (
          <View style={styles.errorContainer}>
            <Icon name="exclamation-triangle" size={16} color={theme.colors.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* Login Button */}
        <Button
          title={isLoading ? 'Signing In...' : 'Sign In'}
          onPress={handleLogin}
          variant="primary"
          size="large"
          style={styles.loginButton}
          disabled={isLoading || isLocked}
        />

        {/* Loading Indicator */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Authenticating...</Text>
          </View>
        )}

        {/* Forgot Password */}
        <TouchableOpacity 
          onPress={handleForgotPassword}
          disabled={isLoading}
          style={styles.forgotButton}
        >
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Registration Link */}
        <Text style={styles.signupText}>
          Need an account?{' '}
          <Text 
            style={styles.signupLink} 
            onPress={handleRegister}
            accessible
            accessibilityRole="button"
          >
            Contact Administration
          </Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
  },
  logo: {
    width: 200,
    height: 100,
    alignSelf: 'center',
    marginBottom: theme.spacing.lg,
    resizeMode: 'contain',
  },
  title: {
    fontSize: theme.typography.fontSizes.xxl,
    fontWeight: theme.typography.fontWeights.bold,
    textAlign: 'center',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.fontSizes.md,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
    color: theme.colors.textLight,
  },
  version: {
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    color: theme.colors.textMuted,
    fontSize: theme.typography.fontSizes.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.sm,
  },
  inputError: {
    borderColor: theme.colors.error,
    borderWidth: 2,
  },
  icon: {
    marginRight: theme.spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text,
    paddingVertical: theme.spacing.xs,
  },
  eyeIcon: {
    marginLeft: theme.spacing.sm,
    padding: theme.spacing.xs,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.typography.fontSizes.sm,
    marginLeft: theme.spacing.xs,
    textAlign: 'center',
    flex: 1,
  },
  loginButton: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  loadingText: {
    marginLeft: theme.spacing.sm,
    color: theme.colors.textMuted,
    fontSize: theme.typography.fontSizes.sm,
  },
  forgotButton: {
    alignSelf: 'center',
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  forgotText: {
    textAlign: 'center',
    color: theme.colors.secondary,
    fontWeight: theme.typography.fontWeights.medium,
    fontSize: theme.typography.fontSizes.md,
  },
  signupText: {
    textAlign: 'center',
    color: theme.colors.text,
    fontSize: theme.typography.fontSizes.sm,
  },
  signupLink: {
    color: theme.colors.secondary,
    fontWeight: theme.typography.fontWeights.semibold,
  },
});
