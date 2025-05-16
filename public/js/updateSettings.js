import { showAlert } from './alerts';

// type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? '/api/v1/users/updatePassword'
        : '/api/v1/users/updateMe';

    const isFormData = data instanceof FormData;
    // Check if data is an instance of FormData
    // If it is, we don't want to set the Content-Type header
    // because the browser will automatically set it to multipart/form-data

    const res = await fetch(url, {
      method: 'PATCH',
      headers: !isFormData
        ? {
            'Content-Type': 'application/json',
          }
        : undefined,

      body: isFormData ? data : JSON.stringify(data),
    });

    const responseData = await res.json();

    if (responseData.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
    }
  } catch (err) {
    showAlert('error', err.message || 'An error occurred');
  }
};
