// components/RegistrationForm.js

import { useState } from 'react';

function RegistrationForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegistration = async (e) => {
    e.preventDefault();
    // Send a POST request to your registration API endpoint
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      // Registration was successful
      // Redirect or show a success message
    } else {
      // Registration failed, handle errors
    }
  };

  return (
    <form onSubmit={handleRegistration}>
      <label>
        Username:
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <button type="submit">Register</button>
    </form>
  );
}

export default RegistrationForm;
