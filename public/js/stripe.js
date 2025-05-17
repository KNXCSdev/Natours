/* eslint-disable */

import { showAlert } from './alerts';
const stripe = Stripe(
  'pk_test_51RPm02Rlq4uD4uxtTl0WtAOUNJ5tve0cLK5AsqchxvvHZ6eoFd5VaX6QGXAoDjUNc8N4D1GC4Okq4iIVC2C246bP00pLCwBmdi',
);

export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API
    const res = await fetch(`/api/v1/bookings/checkout-session/${tourId}`);
    if (!res.ok) throw new Error('Failed to get checkout session');

    const session = await res.json();

    console.log(session);

    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.session.id, // assuming API response is { session: { id: '...' } }
    });
  } catch (err) {
    console.error(err);
    showAlert('error', err.message || 'Something went wrong!');
  }
};
