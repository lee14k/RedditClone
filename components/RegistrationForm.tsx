// components/RegistrationForm.js

import { useState } from 'react';

function RegistrationForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegistration = async (e: { preventDefault: () => void; }) => {
    console.log('Form submission triggered');
    e.preventDefault();
  
    // Ensure both username and password are provided
    if (!username || !password) {
      console.error('Username and password are required');
      // Optionally, display an error message to the user
      return;
    }
  
    try {

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
        console.log('Registration successful');
      } else {
        // Registration failed, handle errors
        const errorData = await response.json();
        console.error('Registration failed:', errorData);
        // Optionally, display an error message to the user
      }
    } catch (error) {
      console.error('Error sending registration request:', error);
      // Optionally, display an error message to the user
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
