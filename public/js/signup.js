import { showAlert } from './alerts';

export async function signup(name, email, password, passwordConfirm) {
  try {
    const response = await fetch('/api/v1/users/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password, passwordConfirm }),
    });

    const data = await response.json(); // <- properly parse JSON

    if (!response.ok) {
      throw new Error(data.message || 'Signup failed');
    }

    if (data.status === 'success') {
      showAlert('success', 'Signed up successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.message); // <- simpler error handling
  }
}
