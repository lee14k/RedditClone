'use client'
import { useEffect, useState } from 'react';

interface Post {
  post_id: string; // Adjust types as needed
  title: string;
  content: string;
}

function HomePage() {
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
      {posts.map((post) => (
        <div key={post.post_id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
}

export default HomePage;
