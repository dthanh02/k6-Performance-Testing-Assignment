import http from 'k6/http';
import { check, group, sleep } from 'k6';

const BASE_URL = 'https://petstore.swagger.io/v2';

export function userFlow() {
  group('Main User Flow', function () {

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

      sleep(1);
    });

    group('Find Pet by ID', function () {
      const res = http.get(
        `${BASE_URL}/pet/2`,
        {
          tags: { step: 'find_pet' },
        }
      );

      check(res, {
        'find pet status is 200': (r) => r.status === 200,
      });

      sleep(1);
    });

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