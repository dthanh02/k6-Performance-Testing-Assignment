import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/latest/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';



import { userFlow } from './flow.js';

export const options = {
  scenarios: {
    load_test: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 80 },
        { duration: '3m', target: 120 },
        { duration: '2m', target: 0 },
      ],
    },
  },
};

export default function () {
  userFlow();
}


export function handleSummary(data) {
  return {
    "LOAD_TEST_summary.html": htmlReport(data),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}