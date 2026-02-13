import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator
} from 'react-native';
import { ENV } from '../config/env';

export default function NetworkDebugScreen() {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { timestamp, message, type }]);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const testConnectivity = async () => {
    setIsLoading(true);
    addLog('🔍 Starting Network Diagnostics...', 'header');
    addLog(`Target Server: ${ENV.API_BASE_URL}`, 'info');
    
    try {
      addLog('1️⃣ Testing Basic Connectivity...', 'test');
      
      const response = await fetch(`${ENV.API_BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: 10000,
      });

      if (response.ok) {
        const data = await response.json();
        addLog(`✅ Health Check Success: ${JSON.stringify(data)}`, 'success');
        
        // Test login if health check passes
        await testLogin();
      } else {
        addLog(`❌ Health Check Failed - HTTP Status: ${response.status}`, 'error');
      }
    } catch (error) {
      addLog(`❌ Health Check Failed - Network Error: ${error.message}`, 'error');
      addLog(`Error details: ${JSON.stringify({
        name: error.name,
        message: error.message,
        stack: error.stack?.substring(0, 200)
      })}`, 'error');
    }
    
    setIsLoading(false);
  };

  const testLogin = async () => {
    try {
      addLog('2️⃣ Testing Login Endpoint...', 'test');
      
      const loginData = {
        Username: 'admin',
        Password: 'admin123'
      };

      addLog(`Login request payload: ${JSON.stringify(loginData)}`, 'info');

      const response = await fetch(`${ENV.API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(loginData),
        timeout: 10000,
      });

      addLog(`Login response status: ${response.status}`, 'info');

      if (response.ok) {
        const data = await response.json();
        addLog(`✅ Login Success: ${JSON.stringify(data)}`, 'success');
        addLog('🎉 All tests passed! Backend connection is working.', 'success');
      } else {
        const errorText = await response.text();
        addLog(`❌ Login Failed - Response: ${errorText}`, 'error');
      }
    } catch (error) {
      addLog(`❌ Login Failed - Network Error: ${error.message}`, 'error');
    }
  };

  const testDirectIP = async () => {
    setIsLoading(true);
    addLog('🌐 Testing Direct IP Connection...', 'header');
    
    const testUrls = [
      'http://192.168.0.104:5116/api/health',
      'http://192.168.0.102:5116/api/health',
      'http://192.168.1.100:5116/api/health'
    ];

    for (const url of testUrls) {
      try {
        addLog(`Testing: ${url}`, 'test');
        const response = await fetch(url, {
          method: 'GET',
          timeout: 5000,
        });
        
        if (response.ok) {
          const data = await response.json();
          addLog(`✅ Success with ${url}: ${JSON.stringify(data)}`, 'success');
          break;
        } else {
          addLog(`❌ Failed ${url} - Status: ${response.status}`, 'error');
        }
      } catch (error) {
        addLog(`❌ Failed ${url} - Error: ${error.message}`, 'error');
      }
    }
    
    setIsLoading(false);
  };

  const getLogStyle = (type) => {
    switch (type) {
      case 'header': return { ...styles.logText, color: '#2196F3', fontWeight: 'bold' };
      case 'success': return { ...styles.logText, color: '#4CAF50' };
      case 'error': return { ...styles.logText, color: '#F44336' };
      case 'test': return { ...styles.logText, color: '#FF9800', fontWeight: 'bold' };
      default: return styles.logText;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Network Debug Tool</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.primaryButton]} 
          onPress={testConnectivity}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Test Backend Connection</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.secondaryButton]} 
          onPress={testDirectIP}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Test Multiple IPs</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.clearButton]} 
          onPress={clearLogs}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Clear Logs</Text>
        </TouchableOpacity>
      </View>

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#2196F3" />
          <Text style={styles.loadingText}>Testing connection...</Text>
        </View>
      )}

      <ScrollView style={styles.logContainer}>
        {logs.map((log, index) => (
          <View key={index} style={styles.logItem}>
            <Text style={styles.timestamp}>[{log.timestamp}]</Text>
            <Text style={getLogStyle(log.type)}>{log.message}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    minWidth: '48%',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#2196F3',
  },
  secondaryButton: {
    backgroundColor: '#FF9800',
  },
  clearButton: {
    backgroundColor: '#9E9E9E',
    minWidth: '100%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  loadingText: {
    marginLeft: 8,
    color: '#666',
  },
  logContainer: {
    flex: 1,
    backgroundColor: '#000',
    borderRadius: 8,
    padding: 8,
  },
  logItem: {
    marginBottom: 4,
  },
  timestamp: {
    color: '#888',
    fontSize: 12,
  },
  logText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'monospace',
    marginLeft: 8,
  },
});
