import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Alert } from 'react-native';
import {
  TextInput,
  Button,
  Card,
  Title,
  Text,
  Provider as PaperProvider,
} from 'react-native-paper';

// Your theme file, which you would import.
// For this self-contained example, I'm defining it here.
// Ensure you have react-native-paper and react-native-vector-icons installed.
const theme = {
  // This should be your full react-native-paper theme object
  colors: {
    primary: '#4CAF50',
    primaryDark: '#388E3C',
    background: '#f8f8e8',
    card: '#f9f6e0',
    surface: '#FFFFFF',
    text: '#000000',
    textLight: '#666666',
    onSurfaceVariant: '#666666', // For subtitles
    placeholder: '#999999',
    border: '#DDDDDD',
  },
  typography: {
    fontSizes: {
      md: 16,
      xxl: 28,
    },
    fontWeights: {
      bold: '700',
    },
  },
  spacing: {
    sm: 8,
    md: 16,
    lg: 24,
  },
  borderRadius: {
    md: 16,
  },
  roundness: 16, // react-native-paper uses 'roundness'
};

const SchoolDetailsForm = () => {
  // In a real app, the theme would come from the PaperProvider context.
  // const theme = useTheme(); 
  const styles = createStyles(theme);

  const [formData, setFormData] = useState({
    schoolName: '',
    address: '',
    city: '',
    county: '',
    pinCode: '',
    startedOn: '',
  });

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    console.log('Form Data Submitted:', formData);
    Alert.alert(
      'Success',
      'School details have been saved successfully!',
      [{ text: 'OK' }]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled">
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.header}>School Details</Title>
          <Text style={styles.subtitle}>Please fill in the information below</Text>

          <TextInput
            label="School Name"
            value={formData.schoolName}
            onChangeText={text => handleChange('schoolName', text)}
            style={styles.input}
            mode="outlined"
            left={<TextInput.Icon icon="school" />}
          />

          <TextInput
            label="Address"
            value={formData.address}
            onChangeText={text => handleChange('address', text)}
            style={styles.input}
            mode="outlined"
            left={<TextInput.Icon icon="map-marker-outline" />}
          />

          <TextInput
            label="City"
            value={formData.city}
            onChangeText={text => handleChange('city', text)}
            style={styles.input}
            mode="outlined"
            left={<TextInput.Icon icon="city-variant-outline" />}
          />

          <TextInput
            label="County"
            value={formData.county}
            onChangeText={text => handleChange('county', text)}
            style={styles.input}
            mode="outlined"
            left={<TextInput.Icon icon="map" />}
          />

          <TextInput
            label="Pin Code"
            value={formData.pinCode}
            onChangeText={text => handleChange('pinCode', text)}
            style={styles.input}
            mode="outlined"
            keyboardType="number-pad"
            maxLength={6}
            left={<TextInput.Icon icon="pound" />}
          />

          <TextInput
            label="Date Established"
            value={formData.startedOn}
            onChangeText={text => handleChange('startedOn', text)}
            style={styles.input}
            mode="outlined"
            placeholder="YYYY-MM-DD"
            left={<TextInput.Icon icon="calendar" />}
          />

          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.button}
            icon="check-circle"
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonText}>
            Save Details
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

// Main App component to provide the theme
const App = () => (
  <PaperProvider theme={theme}>
    <SchoolDetailsForm />
  </PaperProvider>
);


const createStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    contentContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      padding: theme.spacing.md,
    },
    card: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.md,
    },
    header: {
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
      color: theme.colors.primary,
      fontSize: theme.typography.fontSizes.xxl,
      fontWeight: theme.typography.fontWeights.bold,
    },
    subtitle: {
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
      color: theme.colors.textLight,
      fontSize: theme.typography.fontSizes.md,
    },
    input: {
      marginBottom: theme.spacing.md,
      backgroundColor: theme.colors.surface, // Ensure input background is distinct
    },
    button: {
      marginTop: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.primary,
    },
    buttonContent: {
      paddingVertical: theme.spacing.sm / 2,
    },
    buttonText: {
      fontSize: theme.typography.fontSizes.md,
      fontWeight: 'bold',
    },
  });

export default App;
