/* eslint-disable */

import { showAlert } from './alerts';

export async function login(email, password) {
  try {
    const response = await fetch('/api/v1/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json(); // <- properly parse JSON

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    console.log(data); // <- see actual response

    if (data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.message); // <- simpler error handling
  }
}
