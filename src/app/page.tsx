// pages/somePage.tsx (or wherever your page component is located)
import type { NextRequest } from 'next/server';

interface Post {
  id: number;
  title: string;
  content: string;
}

// Define the loader function
export async function loader(req: NextRequest) {
  const response = await fetch('/api/posts/');
  console.log(req)
  console.log(response)
  const posts: Post[] = await response.json();
  console.log(posts)
  return { props: { posts } }; // Ensure this matches the expected return structure
}

interface PageProps {
  posts: Post[];
}

function Page({ posts }: PageProps) {
  return (
    <div>
      {Array.isArray(posts) ? (
        posts.map((post) => (
          <div key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
          </div>
        ))
      ) : (
        <p>Loading posts...</p> // Or some other placeholder content
      )}
    </div>
  );
}

export default Page;
