import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { apiService } from '../services/apiService';
import { ENV } from '../config/env';

interface ConnectionStatus {
  health: boolean | null;
  database: boolean | null;
  login: boolean | null;
  lastChecked: Date | null;
}

export const DebugApiConnection: React.FC = () => {
  const [status, setStatus] = useState<ConnectionStatus>({
    health: null,
    database: null,
    login: null,
    lastChecked: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const testConnection = async () => {
    setIsLoading(true);
    console.log('🔧 Testing API connectivity...');
    console.log('📡 API Base URL:', ENV.API_BASE_URL);

    const newStatus: ConnectionStatus = {
      health: null,
      database: null,
      login: null,
      lastChecked: new Date(),
    };

    try {
      // Test health endpoint
      console.log('Testing health...');
      const healthResult = await apiService.healthCheck();
      newStatus.health = healthResult.success;
      console.log('Health result:', healthResult);

      // Test database connection
      console.log('Testing database...');
      const dbResult = await apiService.testConnection();
      newStatus.database = dbResult.success;
      console.log('Database result:', dbResult);

      // Test login
      console.log('Testing login...');
      const loginResult = await apiService.login({
        Username: 'admin',
        Password: 'admin123'
      });
      newStatus.login = loginResult.success;
      console.log('Login result:', loginResult);

    } catch (error) {
      console.error('Connection test error:', error);
    }

    setStatus(newStatus);
    setIsLoading(false);

    // Show results
    const allWorking = newStatus.health && newStatus.database && newStatus.login;
    Alert.alert(
      'Connection Test Results',
      `Health: ${newStatus.health ? '✅' : '❌'}\nDatabase: ${newStatus.database ? '✅' : '❌'}\nLogin: ${newStatus.login ? '✅' : '❌'}\n\n${allWorking ? 'All systems working!' : 'Some issues detected'}`,
      [{ text: 'OK' }]
    );
  };

  const getStatusIcon = (result: boolean | null) => {
    if (result === null) return '⚪';
    return result ? '✅' : '❌';
  };

  const showTroubleshootingInfo = () => {
    Alert.alert(
      'API Debug Info',
      `Base URL: ${ENV.API_BASE_URL}\n\nTroubleshooting:\n• Make sure backend is running\n• Check if you're on the same WiFi\n• Try the URL in a browser\n• Check Windows Firewall settings`,
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>API Debug Panel</Text>
      <Text style={styles.url}>URL: {ENV.API_BASE_URL}</Text>
      
      <View style={styles.statusRow}>
        <Text>Health: {getStatusIcon(status.health)}</Text>
        <Text>Database: {getStatusIcon(status.database)}</Text>
        <Text>Login: {getStatusIcon(status.login)}</Text>
      </View>
      
      {status.lastChecked && (
        <Text style={styles.timestamp}>
          Last checked: {status.lastChecked.toLocaleTimeString()}
        </Text>
      )}
      
      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={testConnection}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Testing...' : 'Test Connection'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.button, styles.infoButton]}
        onPress={showTroubleshootingInfo}
      >
        <Text style={styles.buttonText}>Troubleshooting Info</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    margin: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  url: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  timestamp: {
    fontSize: 10,
    color: '#999',
    textAlign: 'center',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  infoButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default DebugApiConnection;
