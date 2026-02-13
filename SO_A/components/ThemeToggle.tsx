import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../app/context/ThemeContext';
import { createTheme } from '../app/theme/theme';

interface ThemeToggleProps {
  style?: any;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  style, 
  showLabel = false 
}) => {
  const { isDark, toggleTheme } = useTheme();
  const theme = createTheme(isDark);

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: theme.colors.surface }, style]}
      onPress={toggleTheme}
      activeOpacity={0.7}
    >
      <Ionicons
        name={isDark ? 'sunny' : 'moon'}
        size={20}
        color={theme.colors.primary}
      />
      {showLabel && (
        <Text style={[styles.label, { color: theme.colors.text }]}>
          {isDark ? 'Light' : 'Dark'}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
});