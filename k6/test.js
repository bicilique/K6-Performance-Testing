import http from 'k6/http';
import { sleep, check, group } from 'k6';
import { Trend, Counter, Rate } from 'k6/metrics';

// Define custom metrics
const responseTime = new Trend('response_time');
const failureRate = new Rate('failed_requests');
const requestCount = new Counter('request_count');

export const options = {
  scenarios: {
    website_test: {
      executor: 'constant-vus',
      vus: 50,
      duration: '5m',
      gracefulStop: '0s',
      tags: { test_type: 'website' },
      exec: 'webtest',
    },
    api_test_fixed_rate: {
      executor: 'constant-arrival-rate',
      rate: 90,
      timeUnit: '1m',
      duration: '5m',
      preAllocatedVUs: 20,
      tags: { test_type: 'api' },
      exec: 'apitest',
    },
    api_test_ramping: {
      executor: 'ramping-arrival-rate',
      startTime: '30s',
      startRate: 50,
      timeUnit: '1s',
      stages: [
        { target: 200, duration: '30s' },
        { target: 300, duration: '2m' },
        { target: 150, duration: '1m' },
        { target: 0, duration: '30s' },
      ],
      preAllocatedVUs: 50,
      maxVUs: 150,
      tags: { test_type: 'api' },
      exec: 'apitest',
    },
  },
  discardResponseBodies: true,
  thresholds: {
    'http_req_duration{test_type:api}': ['p(95)<250', 'p(99)<350'],
    'http_req_duration{test_type:website}': ['p(99)<500'],
    'http_req_duration{scenario:api_test_ramping}': ['p(99)<300'],
    failed_requests: ['rate<0.1'], // Less than 10% failure rate
  },
};

// Generate random user agents
const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
  'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36',
];

// Base URLs (use environment variables or default values)
const BASE_URL = __ENV.BASE_URL || 'https://test.k6.io';
const API_URL = __ENV.API_URL || 'https://quickpizza.grafana.com/api/json';

export function webtest() {
  group('Website Test', function () {
    const headers = {
      'User-Agent': userAgents[Math.floor(Math.random() * userAgents.length)],
    };

    const res = http.get(`${BASE_URL}/contacts.php`, { headers });

    // Track metrics
    responseTime.add(res.timings.duration);
    failureRate.add(res.status !== 200);
    requestCount.add(1);

    // Validate response
    check(res, {
      'is status 200': (r) => r.status === 200,
    });

    sleep(Math.random() * 2);
  });
}

export function apitest() {
  group('API Test', function () {
    const headers = {
      'User-Agent': userAgents[Math.floor(Math.random() * userAgents.length)],
      'Content-Type': 'application/json',
    };

    // GET Request
    const getRes = http.get(API_URL, { headers });

    responseTime.add(getRes.timings.duration);
    failureRate.add(getRes.status !== 200);
    requestCount.add(1);

    check(getRes, {
      'GET status is 200': (r) => r.status === 200,
    });

    // POST Request with random payload
    const payload = JSON.stringify({
      userId: Math.floor(Math.random() * 1000),
      action: 'test',
    });

    const postRes = http.post(`${API_URL}/submit`, payload, { headers });

    responseTime.add(postRes.timings.duration);
    failureRate.add(postRes.status !== 201);
    requestCount.add(1);

    check(postRes, {
      'POST status is 201': (r) => r.status === 201,
    });

    sleep(Math.random() * 2);
  });
}