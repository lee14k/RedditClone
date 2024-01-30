'use client'
import { useEffect, useState } from 'react';
import Link from 'next/link';
interface Post {
  post_id: string; // Adjust types as needed
  title: string;
  content: string;
}

interface User {
  username: string;
}

function HomePage() {
  const [user, setUser] = useState<User | null>(null); // Add type annotation to user state

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const userObj = JSON.parse(userData);
      setUser(userObj);
    }
  }, []);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch('/api/posts') // Fetch data from your API route
      .then((response) => response.json())
      .then((data: Post[]) => {
        setPosts(data);
      })
      .catch((error) => {
        console.error('Error fetching posts:', error);
      });
  }, []);

  return (
    <div>
{user ? <h1>Welcome, {user.username}!</h1> : <h1>Welcome!</h1>}
      {posts.map((post) => (
        <div key={post.post_id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </div>
      ))}

      <div className="flex flex-col gap-12">
        <Link href="/register">
          <button>
            make a new account
          </button>
        </Link>
        <Link href="/login">
          <button>
            Login 
          </button>
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
