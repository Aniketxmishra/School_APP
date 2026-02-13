import { Dimensions } from 'react-native';

// Screen dimensions
const { width, height } = Dimensions.get('window');

// Define color palette
const colors = {
  // Primary colors
  primary: '#2E86C1', // Blue
  primaryLight: '#5DADE2',
  primaryDark: '#1A5276',
  
  // Secondary colors
  secondary: '#F39C12', // Orange
  secondaryLight: '#F8C471',
  secondaryDark: '#B9770E',
  
  // Accent colors
  accent: '#16A085', // Teal
  accentLight: '#48C9B0',
  accentDark: '#0E6655',
  
  // Semantic colors
  success: '#27AE60', // Green
  successLight: '#58D68D',
  successDark: '#196F3D',
  
  danger: '#E74C3C', // Red
  dangerLight: '#F1948A',
  dangerDark: '#922B21',
  
  warning: '#F1C40F', // Yellow
  warningLight: '#F7DC6F',
  warningDark: '#B7950B',
  
  info: '#3498DB', // Light Blue
  infoLight: '#85C1E9',
  infoDark: '#21618C',
  
  // Neutrals
  black: '#000000',
  darkGrey: '#333333',
  grey: '#7F8C8D',
  lightGrey: '#BDC3C7',
  veryLightGrey: '#EAEDED',
  white: '#FFFFFF',
  
  // Background colors
  background: '#F8FAFC',
  cardBackground: '#FFFFFF',
  
  // Text colors
  textPrimary: '#333333',
  textSecondary: '#7F8C8D',
  textLight: '#BDC3C7',
  textInverted: '#FFFFFF',
  
  // Transparent colors
  transparent: 'transparent',
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.2)',
};

// Typography
const typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 30,
  },
  lineHeight: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    xxl: 36,
    xxxl: 42,
  },
  fontWeight: {
    regular: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
  },
};

// Spacing
const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 64,
};

// Border radius
const borderRadius = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  round: 9999,
};

// Shadows
const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1,
    elevation: 1,
  },
  md: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  lg: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 5,
    elevation: 6,
  },
  xl: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.26,
    shadowRadius: 8,
    elevation: 9,
  },
};

// Screen breakpoints
const breakpoints = {
  phone: 0,
  tablet: 768,
  desktop: 1024,
};

// Screen dimensions utility
const screenSize = {
  width,
  height,
  isSmallDevice: width < 375,
};

// Animations
const animation = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    linear: 'linear',
  },
};

// Z-Index
const zIndex = {
  base: 0,
  elevated: 1,
  navigation: 10,
  modal: 100,
  notification: 1000,
};

// Export theme object
export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  breakpoints,
  screenSize,
  animation,
  zIndex,
};

// Optional: Dark mode colors (for future use)
const darkColors = {
  ...colors,
  background: '#1A1A1A',
  cardBackground: '#2D2D2D',
  textPrimary: '#FFFFFF',
  textSecondary: '#CCCCCC',
  // ... other dark mode overrides
};

// Theme mode utility
const createTheme = (isDark = false) => ({
  colors: isDark ? darkColors : colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  breakpoints,
  screenSize,
  animation,
  zIndex,
});


// Type definitions for theme
export type ThemeColors = typeof colors;
export type ThemeTypography = typeof typography;
export type ThemeSpacing = typeof spacing;
export type ThemeBorderRadius = typeof borderRadius;
export type ThemeShadows = typeof shadows;
export type ThemeBreakpoints = typeof breakpoints;
export type ThemeScreenSize = typeof screenSize;
export type ThemeAnimation = typeof animation;
export type ThemeZIndex = typeof zIndex;
export type Theme = typeof theme;
export default theme;

