# Performance Testing – Petstore API (k6)

##  Overview

This project demonstrates performance testing using **k6** to simulate real user behavior and evaluate system stability under Load and Stress conditions.

Main user flow tested:

Login → Find Pet by ID → Place Order

---

## Objective

The purpose of this project is to:

- Practice writing performance test scripts using k6
- Simulate realistic user behavior
- Design Load and Stress test scenarios
- Analyze performance metrics such as:
  - Response time
  - P95 latency
  - Error rate
  - Throughput

---

## System Under Test

- **Base URL:** https://petstore.swagger.io/v2
- **API Documentation:** https://petstore.swagger.io/
- **Environment:** Public Swagger Petstore API
- **Protocol:** REST (HTTPS)

---

## Tool Used

- k6 (JavaScript-based performance testing tool)
- k6 HTML Reporter

Workload Model: Closed Model (VU-based)

---

##  Test Scenarios

### Load Test

Simulates expected production traffic.

| Stage | Virtual Users | Duration |
|--------|---------------|----------|
| Ramp-up | 0 → 80 | 2 minutes |
| Peak | 80 → 120 | 3 minutes |
| Ramp-down | 120 → 0 | 2 minutes |

Goal:
- Validate system stability under peak load
- Maintain error rate < 1%
- Keep P95 < 2 seconds

---

### Stress Test

Pushes the system beyond peak load.

| Stage | Virtual Users | Duration |
|--------|---------------|----------|
| Ramp-up | 0 → 120 | 2 minutes |
| Overload | 120 → 200 | 3 minutes |
| Ramp-down | 200 → 0 | 2 minutes |

Goal:
- Observe system behavior under high load
- Identify breaking point
- Monitor error rate and latency increase

---

## Script Features

The test script includes:

- `group()` to simulate real user flow
- `check()` to validate response status
- Step-based `tags` for detailed metrics
- Thresholds for:
  - Overall system
  - Each step (Login, Find Pet, Place Order)
- Think time using `sleep(1)`
- Random order ID generation

---

##  Test Results Summary

| Metric | Result |
|--------|--------|
| Total Requests | 62,103 |
| Max Virtual Users | 320 |
| Avg Response Time | 258 ms |
| P95 Response Time | 284 ms |
| Error Rate | 0% |
| Requests/sec | 146.94 req/s |
| Iterations | 20,701 |

### Observations

- No threshold breaches occurred.
- No failed requests.
- Stable response time distribution.
- System handled load beyond peak (120 users) successfully.

---

## Key Metrics Explanation

- **Iteration** = 1 complete user flow (Login → Find Pet → Place Order)
- **Throughput (RPS)** = Total HTTP requests per second
- Since each iteration contains 3 requests:

  Iterations × 3 ≈ Total Requests

---

##  How to Run the Test

Install k6:
choco install k6

Run the test:
k6 run script.js
