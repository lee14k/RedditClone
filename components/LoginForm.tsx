import { useState } from 'react';
import { useRouter } from 'next/navigation';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter(); // Next.js router hook

  const handleLogin = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      // Assuming the server returns the username or user data on successful login
      const userResponse = await response.json();
      localStorage.setItem('user', JSON.stringify(userResponse));
      

      router.push('/'); // Redirect to homepage using Next.js router
    } else {
      // Handle errors
    }
  };

    return (
        <form onSubmit={handleLogin}>
            <label>
                Username:
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </label>
            <label>
                Password:
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            <button type="submit">Login</button>
        </form>
    );
}

export default LoginForm;
