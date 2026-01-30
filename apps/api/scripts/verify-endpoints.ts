import axios, { AxiosError } from 'axios';
import { Agent } from 'https';

// --- Configuration ---
const BASE_URL = 'http://localhost:5001';
const API_URL = `${BASE_URL}/api/v1`;
const ADMIN_EMAIL = 'superadmin@aydigital.com';
const ADMIN_PASSWORD = 'admin123';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

// --- Test State ---
let accessToken: string | null = null;
let refreshToken: string | null = null;
let userId: string | null = null;

// --- Helper Functions ---
const log = (msg: string) => console.log(msg);
const logSuccess = (msg: string) => console.log(`${colors.green}✓ ${msg}${colors.reset}`);
const logFail = (msg: string) => console.log(`${colors.red}✗ ${msg}${colors.reset}`);
const logInfo = (msg: string) => console.log(`${colors.blue}ℹ ${msg}${colors.reset}`);
const logDetail = (label: string, data: any) => {
  console.log(`${colors.gray}${label}:${colors.reset}`);
  console.log(JSON.stringify(data, null, 2));
};

const client = axios.create({
  baseURL: BASE_URL, // Use root base URL to support /health and /metrics
  validateStatus: () => true, // Don't throw on error status
  httpsAgent: new Agent({ rejectUnauthorized: false }),
});

// Helper to extract cookies
const getCookie = (res: any, name: string): string | null => {
  const setCookie = res.headers['set-cookie'];
  if (!setCookie) return null;
  
  for (const cookie of setCookie) {
    if (cookie.startsWith(`${name}=`)) {
      return cookie.split(';')[0].split('=')[1];
    }
  }
  return null;
};

// --- Test Runner ---
interface TestStep {
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  endpoint: string; // Full path relative to BASE_URL (e.g. '/api/v1/auth/me' or '/health')
  data?: any;
  headers?: Record<string, string>;
  expectedStatus: number | number[];
  auth?: boolean; // If true, attaches Cookies
  check?: (response: any) => boolean | string;
}

const tests: TestStep[] = [
  // 1. Health & Metrics (Public - Excluded from Global Prefix)
  {
    name: 'Health Check',
    method: 'GET',
    endpoint: '/health',
    expectedStatus: 200,
    check: (res) => res.data.status === 'up' ? true : 'Status should be up',
  },
  {
    name: 'Metrics',
    method: 'GET',
    endpoint: '/metrics',
    expectedStatus: 200,
  },
  // 2. Authentication
  {
    name: 'Login (Success)',
    method: 'POST',
    endpoint: '/api/v1/auth/login',
    data: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
    expectedStatus: 201, 
    check: (res) => {
      // Extract cookies
      accessToken = getCookie(res, 'accessToken');
      refreshToken = getCookie(res, 'refreshToken');
      userId = res.data.user?.id;

      if (!accessToken) return 'Missing accessToken cookie';
      if (!refreshToken) return 'Missing refreshToken cookie';
      if (!userId) return 'Missing user ID in body';
      return true;
    },
  },
  {
    name: 'Login (Fail - Wrong Password)',
    method: 'POST',
    endpoint: '/api/v1/auth/login',
    data: { email: ADMIN_EMAIL, password: 'wrongpassword' },
    expectedStatus: 401,
  },
  {
    name: 'Get Current User (Me)',
    method: 'GET',
    endpoint: '/api/v1/auth/me',
    auth: true,
    expectedStatus: 200,
    check: (res) => res.data.user?.email === ADMIN_EMAIL ? true : 'Email mismatch',
  },
  // 3. Admin Routes
  {
    name: 'List Users (Admin)',
    method: 'GET',
    endpoint: '/api/v1/admin/users',
    auth: true,
    expectedStatus: 200,
    check: (res) => Array.isArray(res.data.data) ? true : 'Data should be an array',
  },
  {
    name: 'Update User (Admin)',
    method: 'PATCH',
    endpoint: '/api/v1/admin/users/:id', // Will replace :id with userId
    auth: true,
    data: { isActive: true },
    expectedStatus: 200,
  },
  // 4. Token Refresh
  {
    name: 'Refresh Token',
    method: 'POST',
    endpoint: '/api/v1/auth/refresh',
    auth: true, // Send cookies (refresh token is in cookie)
    data: {}, 
    expectedStatus: 201,
    check: (res) => {
      // Should set new cookies
      const newAccess = getCookie(res, 'accessToken');
      if (newAccess) accessToken = newAccess; // Update for next tests
      return !!newAccess ? true : 'Did not receive new access token cookie';
    }
  },
  // 5. Logout
  {
    name: 'Logout',
    method: 'POST',
    endpoint: '/api/v1/auth/logout',
    auth: true,
    expectedStatus: 201,
  }
];

async function runTests() {
  log(`\n${colors.cyan}=== Starting API Connectivity Verification ===${colors.reset}\n`);
  log(`Base URL: ${BASE_URL}`);
  log(`Time: ${new Date().toISOString()}\n`);

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    // Prepare endpoint
    let url = test.endpoint;
    if (url.includes(':id') && userId) {
      url = url.replace(':id', userId);
    }

    // Prepare headers
    const headers: Record<string, string> = { ...test.headers };
    
    // Attach Cookies
    const cookies: string[] = [];
    if (test.auth) {
        if (accessToken) cookies.push(`accessToken=${accessToken}`);
        if (refreshToken) cookies.push(`refreshToken=${refreshToken}`);
    }
    
    if (cookies.length > 0) {
        headers['Cookie'] = cookies.join('; ');
    }

    // Prepare data
    const data = { ...test.data };

    const startTime = Date.now();
    try {
      const res = await client.request({
        method: test.method,
        url,
        data,
        headers,
      });
      const duration = Date.now() - startTime;

      // Status Check
      const statusOk = Array.isArray(test.expectedStatus)
        ? test.expectedStatus.includes(res.status)
        : res.status === test.expectedStatus;

      // Custom Check
      let customCheckOk: boolean | string = true;
      if (test.check && statusOk) {
        customCheckOk = test.check(res);
      }

      if (statusOk && customCheckOk === true) {
        logSuccess(`${test.name} - ${test.method} ${url} (${duration}ms) [${res.status}]`);
        passed++;
      } else {
        logFail(`${test.name} - ${test.method} ${url} (${duration}ms) [${res.status}]`);
        if (!statusOk) {
          console.log(`  Expected Status: ${test.expectedStatus}`);
          console.log(`  Actual Status:   ${res.status}`);
        }
        if (customCheckOk !== true) {
          console.log(`  Check Failed:    ${customCheckOk}`);
        }
        // logDetail('Request Headers', headers); // Sensitive info
        // logDetail('Request Data', data);
        logDetail('Response Data', res.data);
        failed++;
      }

    } catch (err: any) {
      const duration = Date.now() - startTime;
      logFail(`${test.name} - ${test.method} ${url} (${duration}ms) - ERROR`);
      console.log(`  Error: ${err.message}`);
      if (err.response) {
        logDetail('Response Data', err.response.data);
      }
      failed++;
    }
  }

  log(`\n${colors.cyan}=== Verification Complete ===${colors.reset}`);
  log(`Total: ${tests.length}`);
  log(`Passed: ${colors.green}${passed}${colors.reset}`);
  log(`Failed: ${colors.red}${failed}${colors.reset}`);
  
  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error(err);
  process.exit(1);
});
