import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/latest/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';


import http from 'k6/http';
import { check, group, sleep } from 'k6';


   // OPTIONS: SCENARIOS + THRESHOLDS

export const options = {
  scenarios: {
    // LOAD TEST
    load_test: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 80 },   // average load
        { duration: '3m', target: 120 },  // peak load
        { duration: '2m', target: 0 },
      ],
      tags: { test_type: 'load' },
    },

    // STRESS TEST
    stress_test: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 120 },
        { duration: '3m', target: 200 },  // overload
        { duration: '2m', target: 0 },
      ],
      tags: { test_type: 'stress' },
    },
  },

  thresholds: {
    // Overall system thresholds
    http_req_failed: ['rate < 0.01'],           // error rate < 1%
    http_req_duration: [
      'p(95) < 2000',
      'p(99) < 3000',
    ],

    // Step-based thresholds
    'http_req_duration{step:login}': [
      'p(95) < 800',
      'p(99) < 1200',
    ],

    'http_req_duration{step:find_pet}': [
      'p(95) < 700',
      'p(99) < 1000',
    ],

    'http_req_duration{step:place_order}': [
      'p(95) < 1200',
      'p(99) < 1800',
    ],
  },
};


  // CONSTANTS

const BASE_URL = 'https://petstore.swagger.io/v2';


//   MAIN USER FLOW

export default function () {

  group('Main User Flow', function () {

    // LOGIN
    group('Login', function () {
      const res = http.get(
        `${BASE_URL}/user/login?username=testuser&password=123456`,
        {
          tags: { step: 'login' },
        }
      );

      check(res, {
        'login status is 200': (r) => r.status === 200,
      });

      sleep(1); // think time
    });

   // FIND PET
    group('Find Pet by ID', function () {
      // use fixed ID to avoid 404 for beginner test
      const petId = 1;

      const res = http.get(
        `${BASE_URL}/pet/${petId}`,
        {
          tags: { step: 'find_pet' },
        }
      );

      check(res, {
        'find pet status is 200': (r) => r.status === 200,
      });

      sleep(1);
    });

    // PLACE ORDER
    group('Place Order', function () {
      const payload = JSON.stringify({
        id: Math.floor(Math.random() * 100000),
        petId: 1,
        quantity: 1,
        status: 'placed',
        complete: true,
      });

      const res = http.post(
        `${BASE_URL}/store/order`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          tags: { step: 'place_order' },
        }
      );

      check(res, {
        'order created successfully': (r) => r.status === 200,
      });

      sleep(1);
    });

  });
}



export function handleSummary(data) {
  return {
    "summary.html": htmlReport(data),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}