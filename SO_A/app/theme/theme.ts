import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Light theme colors
const lightPalette = {
  // Primary colors
  primary: '#4CAF50',
  primaryDark: '#388E3C',
  primaryLight: '#C8E6C9',
  
  // Secondary colors
  secondary: '#2196F3',
  secondaryDark: '#1976D2',
  secondaryLight: '#BBDEFB',
  
  // Accent colors
  accent: '#eacb4e',
  accentDark: '#d4a017',
  
  // UI colors
  background: '#f8f8e8',
  card: '#f9f6e0',
  surface: '#FFFFFF',
  error: '#F44336',
  warning: '#FFC107',
  success: '#4CAF50',
  info: '#2196F3',
  
  // Text colors
  text: '#000000',
  textLight: '#666666',
  textMuted: '#999999',
  
  // Border colors
  border: '#DDDDDD',
  divider: '#EEEEEE',
  
  // Status colors
  active: '#4CAF50',
  inactive: '#F44336',
  
  // Specific component colors
  tableHeader: '#fcf5a4',
  tableCell: '#f3d1c9',
};

// Dark theme colors
const darkPalette = {
  // Primary colors
  primary: '#66BB6A',
  primaryDark: '#4CAF50',
  primaryLight: '#A5D6A7',
  
  // Secondary colors
  secondary: '#42A5F5',
  secondaryDark: '#2196F3',
  secondaryLight: '#90CAF9',
  
  // Accent colors
  accent: '#FFD54F',
  accentDark: '#FFC107',
  
  // UI colors
  background: '#121212',
  card: '#1E1E1E',
  surface: '#2D2D2D',
  error: '#EF5350',
  warning: '#FFB74D',
  success: '#66BB6A',
  info: '#42A5F5',
  
  // Text colors
  text: '#FFFFFF',
  textLight: '#B0B0B0',
  textMuted: '#757575',
  
  // Border colors
  border: '#404040',
  divider: '#303030',
  
  // Status colors
  active: '#66BB6A',
  inactive: '#EF5350',
  
  // Specific component colors
  tableHeader: '#3A3A3A',
  tableCell: '#2A2A2A',
};

// Typography
const typography = {
  fontSizes: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 24,
  },
  fontWeights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeights: {
    xs: 14,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28,
    xxl: 32,
  }
};

// Spacing
const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

// Border radius
const borderRadius = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  round: 9999,
};

// Shadows
const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
};

// Screen dimensions for responsive design
const dimensions = {
  fullWidth: width,
  fullHeight: height,
};

// Create theme function
export const createTheme = (isDark: boolean = false) => ({
  colors: isDark ? darkPalette : lightPalette,
  typography,
  spacing,
  borderRadius,
  shadows,
  dimensions,
  isDark,
});

// Default light theme
const theme = createTheme(false);

export type Theme = ReturnType<typeof createTheme>;
export { lightPalette, darkPalette };
export default theme;

