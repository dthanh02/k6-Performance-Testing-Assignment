# Performance Testing with k6 – Petstore API

## Overview
This project demonstrates performance testing using **k6** on Swagger Petstore API by simulating a complete user flow: **Login → Find Pet by ID → Place Order**. Two test types were implemented: **Load Test** and **Stress Test**.

## Objective
The purpose of this project is to practice writing performance test scripts using k6, simulate realistic user behavior, design load and stress scenarios, and analyze key performance metrics such as response time, throughput, iterations, error rate, and P95 latency.

## System Under Test
- Base URL: https://petstore.swagger.io/v2  
- API Documentation: https://petstore.swagger.io/  
- Environment: Public demo API  

> Note: Swagger Petstore is a public demo environment, so results may not fully reflect production backend behavior.

## Tools Used
- k6  
- JavaScript  
- k6 HTML Reporter  

## Project Structure
k6/
├── flow.js  
├── load_test.js  
├── stress_test.js  
├── README.md  

## Test Flow
The reusable business flow is defined in `flow.js`, including:
- Login  
- Find Pet by ID  
- Place Order  

The script uses:
- `group()` to organize user flow  
- `check()` to validate responses  
- `tags` for step-based metrics  
- `sleep()` to simulate think time  

## Load Test Scenario
Designed based on expected traffic:
- Ramp-up: 0 → 80 VUs (2 min)  
- Peak: 80 → 120 VUs (3 min)  
- Ramp-down: 120 → 0 VUs (2 min)  

### Load Test Result
- Total Requests: 23,595  
- Iterations: 7,865  
- Max VUs: 120  
- Requests/sec: 55.95  
- Avg Response Time: 271.64 ms  
- P95 Response Time: 290.70 ms  
- Error Rate: 0%  

## Stress Test Scenario
Designed to exceed peak load:
- Ramp-up: 0 → 120 VUs (2 min)  
- Overload: 120 → 200 VUs (3 min)  
- Ramp-down: 200 → 0 VUs (2 min)  

### Stress Test Result
- Total Requests: 37,791  
- Iterations: 12,597  
- Max VUs: 200  
- Requests/sec: 89.44  
- Avg Response Time: 272.46 ms  
- P95 Response Time: 291.09 ms  
- Error Rate: 0%  

## Key Findings
- No failed requests  
- No threshold breaches  
- Stable response time under both scenarios  
- Throughput increased under stress load  
- No visible performance degradation  

## Thresholds
Thresholds were defined for:
- Overall system:
  - Error rate < 1%  
  - P95 < 2s  

- Step-based APIs:
  - Login  
  - Find Pet  
  - Place Order  

## Run Tests

### Load Test
k6 run load_test.js
