import { SITE_URL, API_BASE_URL } from './api';

// Network utilities for mobile app development
export const NetworkUtils = {
  // Get the current machine's IP address for development
  // This is useful when developing on different networks
  getCurrentDeviceIP: (): string => {
    // Extracted from the centralized configuration
    const match = SITE_URL.match(/\/\/([^:]+)/);
    return match ? match[1] : '127.0.0.1';
  },

  // Build API URL based on environment
  buildApiUrl: (isDevelopment: boolean = true): string => {
    return API_BASE_URL;
  },

  // Test if API is reachable
  testConnectivity: async (baseUrl: string): Promise<boolean> => {
    try {
      const response = await fetch(`${baseUrl}/health`, {
        method: 'GET',
        timeout: 5000,
      });
      return response.ok;
    } catch (error) {
      console.error('Connectivity test failed:', error);
      return false;
    }
  },

  // Get common network troubleshooting info
  getTroubleshootingInfo: () => {
    return {
      currentApiUrl: NetworkUtils.buildApiUrl(true),
      instructions: [
        '1. Make sure your backend is running on port 5116',
        '2. Ensure your device/simulator is on the same WiFi network',
        '3. Check if Windows Firewall is blocking port 5116',
        '4. Verify CORS is enabled on the backend',
        '5. Try accessing the API URL in a browser first'
      ],
      commonIssues: [
        'Network request failed: Check if backend is running',
        'Connection refused: Backend might not be accessible',
        'Timeout: Network connectivity issues'
      ]
    };
  }
};

export default NetworkUtils;
