// Network debugging tool for mobile devices
// This can help test if the mobile device can reach your backend

const API_BASE_URL = 'http://192.168.0.104:5116';

console.log('🔍 Network Debugging Tool');
console.log('========================');
console.log(`Target Server: ${API_BASE_URL}`);
console.log(`Current Time: ${new Date().toISOString()}`);
console.log('');

async function testConnectivity() {
  console.log('1️⃣ Testing Basic Connectivity...');
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      timeout: 10000,
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Health Check Success:', data);
      return true;
    } else {
      console.log('❌ Health Check Failed - HTTP Status:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Health Check Failed - Network Error:', error.message);
    return false;
  }
}

async function testLogin() {
  console.log('2️⃣ Testing Login Endpoint...');
  try {
    const loginData = {
      Username: 'admin',
      Password: 'admin123'
    };

    console.log('Login request payload:', loginData);

    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(loginData),
      timeout: 10000,
    });

    console.log('Login response status:', response.status);
    console.log('Login response headers:', Object.fromEntries(response.headers.entries()));

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Login Success:', data);
      return true;
    } else {
      const errorText = await response.text();
      console.log('❌ Login Failed - Response:', errorText);
      return false;
    }
  } catch (error) {
    console.log('❌ Login Failed - Network Error:', error.message);
    console.log('❌ Error details:', error);
    return false;
  }
}

async function runDiagnostics() {
  console.log('🚀 Starting Network Diagnostics...\n');

  const connectivityResult = await testConnectivity();
  console.log('');
  
  if (connectivityResult) {
    const loginResult = await testLogin();
    console.log('');
    
    if (connectivityResult && loginResult) {
      console.log('🎉 All tests passed! Your network connection is working.');
      console.log('');
      console.log('📱 If you\'re still having login issues in the mobile app:');
      console.log('1. Clear the app cache/data');
      console.log('2. Uninstall and reinstall the APK');
      console.log('3. Check React Native logs for more details');
      console.log('4. Ensure your device is on the same WiFi network');
    } else {
      console.log('❌ Login test failed. Check backend configuration.');
    }
  } else {
    console.log('❌ Basic connectivity failed.');
    console.log('');
    console.log('🛠 Troubleshooting Steps:');
    console.log('1. Verify backend server is running');
    console.log('2. Check if device is on same WiFi network (192.168.0.x)');
    console.log('3. Test from device browser: ' + API_BASE_URL + '/api/health');
    console.log('4. Check Windows Firewall settings');
    console.log('5. Try connecting to: http://192.168.0.104:5116/api/health');
  }
}

// Run diagnostics
runDiagnostics().catch(console.error);

// Export for use in React Native app
if (typeof module !== 'undefined') {
  module.exports = {
    testConnectivity,
    testLogin,
    runDiagnostics,
    API_BASE_URL
  };
}
