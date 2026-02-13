import React, { useState, useEffect, forwardRef, ReactNode } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ActivityIndicator,
  StyleProp,
  TextStyle,
  ViewStyle,
  TouchableOpacityProps,
  AccessibilityProps,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from './theme';

// Create a type for Ionicons icon names
// This type helps validate that the icon name exists in Ionicons
type IconName = React.ComponentProps<typeof Ionicons>['name'];

// Define the Button variants
export type ButtonVariant = 
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'success'
  | 'warning'
  | 'link';

// Define the Button sizes
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

// Define the Button props interface
export interface ButtonProps extends TouchableOpacityProps, AccessibilityProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: IconName;
  rightIcon?: IconName;
  iconSize?: number;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  uppercase?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  testID?: string;
  onError?: (error: Error) => void;
}

/**
 * A versatile Button component with variants, icons, loading state, and accessibility features.
 */
export const Button = forwardRef<TouchableOpacity, ButtonProps>(
  (
    {
      title,
      variant = 'primary',
      size = 'md',
      leftIcon,
      rightIcon,
      iconSize,
      loading = false,
      disabled = false,
      fullWidth = false,
      uppercase = false,
      style,
      textStyle,
      accessibilityLabel,
      accessibilityHint,
      accessibilityRole = 'button',
      accessibilityState,
      testID,
      onPress,
      onError,
      ...rest
    },
    ref
  ) => {
    // State to track if there was an error with the icon
    const [iconError, setIconError] = useState<string | null>(null);

    // Validate icon names at runtime
    useEffect(() => {
      try {
        // Validate left icon
        if (leftIcon && typeof leftIcon === 'string') {
          // Just for runtime check - we'd need a full list of Ionicons names for complete validation
          // This is a simplified check for demonstration
          if (leftIcon.length < 2) {
            throw new Error(`Invalid left icon name: ${leftIcon}`);
          }
        }
        
        // Validate right icon
        if (rightIcon && typeof rightIcon === 'string') {
          if (rightIcon.length < 2) {
            throw new Error(`Invalid right icon name: ${rightIcon}`);
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          setIconError(error.message);
          if (onError) onError(error);
        }
      }
    }, [leftIcon, rightIcon, onError]);

    // Determine styles based on variant and size
    const getContainerStyle = () => {
      const baseStyle: ViewStyle = {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: theme.borderRadius.md,
        ...getSizeStyle(),
      };

      // Add styles based on variant
      switch (variant) {
        case 'primary':
          return {
            ...baseStyle,
            backgroundColor: disabled ? theme.colors.lightGrey : theme.colors.primary,
          };
        case 'secondary':
          return {
            ...baseStyle,
            backgroundColor: disabled ? theme.colors.lightGrey : theme.colors.secondary,
          };
        case 'outline':
          return {
            ...baseStyle,
            backgroundColor: theme.colors.transparent,
            borderWidth: 1.5,
            borderColor: disabled ? theme.colors.lightGrey : theme.colors.primary,
          };
        case 'ghost':
          return {
            ...baseStyle,
            backgroundColor: disabled ? theme.colors.veryLightGrey : theme.colors.transparent,
          };
        case 'danger':
          return {
            ...baseStyle,
            backgroundColor: disabled ? theme.colors.lightGrey : theme.colors.danger,
          };
        case 'success':
          return {
            ...baseStyle,
            backgroundColor: disabled ? theme.colors.lightGrey : theme.colors.success,
          };
        case 'warning':
          return {
            ...baseStyle,
            backgroundColor: disabled ? theme.colors.lightGrey : theme.colors.warning,
          };
        case 'link':
          return {
            ...baseStyle,
            backgroundColor: theme.colors.transparent,
            paddingVertical: 0,
            paddingHorizontal: 0,
          };
        default:
          return baseStyle;
      }
    };

    // Determine size-based styling
    const getSizeStyle = (): ViewStyle => {
      switch (size) {
        case 'xs':
          return {
            paddingVertical: theme.spacing.xxs,
            paddingHorizontal: theme.spacing.xs,
            minHeight: 24,
          };
        case 'sm':
          return {
            paddingVertical: theme.spacing.xs,
            paddingHorizontal: theme.spacing.sm,
            minHeight: 32,
          };
        case 'md':
          return {
            paddingVertical: theme.spacing.sm,
            paddingHorizontal: theme.spacing.md,
            minHeight: 40,
          };
        case 'lg':
          return {
            paddingVertical: theme.spacing.md,
            paddingHorizontal: theme.spacing.lg,
            minHeight: 48,
          };
        default:
          return {
            paddingVertical: theme.spacing.sm,
            paddingHorizontal: theme.spacing.md,
            minHeight: 40,
          };
      }
    };

    // Get text style based on variant and size
    const getTextStyle = (): TextStyle => {
      const baseStyle: TextStyle = {
        fontSize: getFontSize(),
        fontWeight: 'bold',
        textAlign: 'center',
      };

      // Text color based on variant
      switch (variant) {
        case 'outline':
        case 'ghost':
          return {
            ...baseStyle,
            color: disabled ? theme.colors.lightGrey : theme.colors.primary,
          };
        case 'link':
          return {
            ...baseStyle,
            color: disabled ? theme.colors.lightGrey : theme.colors.primary,
            textDecorationLine: 'underline',
          };
        default:
          // For colored background variants
          const needsDarkText = variant === 'warning'; // Yellow buttons need dark text
          return {
            ...baseStyle,
            color: needsDarkText ? theme.colors.darkGrey : theme.colors.white,
          };
      }
    };

    // Get font size based on button size
    const getFontSize = (): number => {
      switch (size) {
        case 'xs':
          return theme.typography.fontSize.xs;
        case 'sm':
          return theme.typography.fontSize.sm;
        case 'md':
          return theme.typography.fontSize.md;
        case 'lg':
          return theme.typography.fontSize.lg;
        default:
          return theme.typography.fontSize.md;
      }
    };

    // Get icon size based on button size
    const getIconSize = (): number => {
      if (iconSize) return iconSize;
      
      switch (size) {
        case 'xs':
          return 14;
        case 'sm':
          return 16;
        case 'md':
          return 20;
        case 'lg':
          return 24;
        default:
          return 20;
      }
    };

    // Get icon color based on variant
    const getIconColor = (): string => {
      switch (variant) {
        case 'outline':
        case 'ghost':
        case 'link':
          return disabled ? theme.colors.lightGrey : theme.colors.primary;
        case 'warning':
          return theme.colors.darkGrey; // Dark text on yellow
        default:
          return theme.colors.white; // White text on colored backgrounds
      }
    };

    // Safe press handler with error boundary
    const handlePress = (e: any) => {
      try {
        if (!disabled && !loading && onPress) {
          onPress(e);
        }
      } catch (error) {
        if (error instanceof Error && onError) {
          onError(error);
        }
        console.error('Button press error:', error);
      }
    };

    // Prepare accessibility props
    const accessibilityProps: AccessibilityProps = {
      accessible: true,
      accessibilityRole,
      accessibilityLabel: accessibilityLabel || title,
      accessibilityHint,
      accessibilityState: {
        disabled,
        busy: loading,
        ...accessibilityState,
      },
    };

    // On Android, add content descriptions
    if (Platform.OS === 'android') {
      accessibilityProps.accessibilityValue = { text: title };
    }

    // Display any icon errors
    if (iconError) {
      console.warn(`Button icon error: ${iconError}`);
      // We could render the error visibly or use a fallback icon
      // For this implementation we'll just log a warning
    }

    return (
      <TouchableOpacity
        ref={ref}
        style={[
          styles.container,
          getContainerStyle(),
          fullWidth && styles.fullWidth,
          style,
        ]}
        onPress={handlePress}
        disabled={disabled || loading}
        testID={testID}
        {...accessibilityProps}
        {...rest}
      >
        {/* Left Icon */}
        {leftIcon && !loading && (
          <Ionicons
            name={leftIcon}
            size={getIconSize()}
            color={getIconColor()}
            style={styles.leftIcon}
          />
        )}

        {/* Loading Indicator */}
        {loading && (
          <ActivityIndicator
            size={size === 'lg' ? 'large' : 'small'}
            color={variant === 'outline' || variant === 'ghost' || variant === 'link' 
              ? theme.colors.primary 
              : theme.colors.white}
            style={styles.loadingIndicator}
          />
        )}

        {/* Button Text */}
        <Text
          style={[
            getTextStyle(),
            uppercase && styles.uppercase,
            loading && styles.loadingText,
            textStyle,
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {title}
        </Text>

        {/* Right Icon */}
        {rightIcon && !loading && (
          <Ionicons
            name={rightIcon}
            size={getIconSize()}
            color={getIconColor()}
            style={styles.rightIcon}
          />
        )}
      </TouchableOpacity>
    );
  }
);

// Default props
Button.displayName = 'Button';

// Component styles
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  fullWidth: {
    width: '100%',
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
  loadingIndicator: {
    marginRight: 8,
  },
  loadingText: {
    opacity: 0.7,
  },
  uppercase: {
    textTransform: 'uppercase',
  },
});

/**
 * Error boundary for Button component to catch rendering errors
 */
export class ButtonErrorBoundary extends React.Component<{
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, info: React.ErrorInfo) => void;
}> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    if (this.props.onError) {
      this.props.onError(error, info);
    }
    console.error('Button Error Boundary caught an error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Default fallback
      return (
        <TouchableOpacity
          style={[styles.container, { backgroundColor: theme.colors.lightGrey, padding: 10 }]}
          disabled
        >
          <Text style={{ color: theme.colors.darkGrey }}>Button Error</Text>
        </TouchableOpacity>
      );
    }

    return this.props.children;
  }
}

export default Button;

