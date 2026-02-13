// Simple Node.js test to verify API connectivity from frontend
const fetch = require('node-fetch');

const API_BASE_URL = 'http://192.168.0.104:5116/api';

async function testHealthCheck() {
  console.log('Testing health check endpoint...');
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();
    console.log('✅ Health Check Success:', data);
    return true;
  } catch (error) {
    console.error('❌ Health Check Failed:', error.message);
    return false;
  }
}

async function testLogin() {
  console.log('Testing login endpoint...');
  try {
    const loginData = {
      Username: 'admin',
      Password: 'admin123'
    };

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    const data = await response.json();
    console.log('✅ Login Test Success:', data);
    return true;
  } catch (error) {
    console.error('❌ Login Test Failed:', error.message);
    return false;
  }
}

async function testDatabase() {
  console.log('Testing database connection...');
  try {
    const response = await fetch(`${API_BASE_URL}/test/connection`);
    const data = await response.json();
    console.log('✅ Database Test Success:', data);
    return true;
  } catch (error) {
    console.error('❌ Database Test Failed:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Starting API Connectivity Tests...\n');

  const results = {
    health: await testHealthCheck(),
    database: await testDatabase(),
    login: await testLogin(),
  };

  console.log('\n📊 Test Results Summary:');
  console.log('========================');
  console.log(`Health Check: ${results.health ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Database:     ${results.database ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Login:        ${results.login ? '✅ PASS' : '❌ FAIL'}`);

  const allPassed = Object.values(results).every(Boolean);
  console.log(`\n🎯 Overall: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);

  if (allPassed) {
    console.log('\n🎉 Your backend is ready for frontend integration!');
    console.log('📱 Frontend API Base URL: http://192.168.0.104:5116/api');
    console.log('🔐 Test Login: admin / admin123');
  }
}

// Run the tests
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { testHealthCheck, testLogin, testDatabase };
