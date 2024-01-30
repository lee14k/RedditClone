import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

async function connectToDatabase() {
    return await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });
  }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (/* condition to check if user is logged in */) {
        const { title, content } = req.body;

        // Validate title and content
        if (!title || !content) {
            return res.status(400).json({ error: 'Title and content are required' });
        }

        try {
            const db = await connectToDatabase();
            await db.query('INSERT INTO posts (title, content) VALUES (?, ?)', [title, content]);

            res.status(200).json({ message: 'Post created successfully' });
        } catch (error) {
            console.error('Error creating post:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(403).json({ error: 'User not authenticated' });
    }
}
