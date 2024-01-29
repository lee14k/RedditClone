// pages/api/register.ts

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
export default async function POST(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        const { username, password } = req.body;

        // Input validation (ensure username and password meet your criteria)
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }
        try {
            const db = await connectToDatabase(); // Connect to your database

            // Check if the username is already in use
            const [existingUser] = await db.query('SELECT * FROM users WHERE username = ?', [username]);

            if (existingUser) {
                return res.status(400).json({ error: 'Username already exists' });
            }

            // Insert the new user into the users table
            await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);

            return res.status(201).json({ message: 'Registration successful' });
        } catch (error) {
            console.error('Error during registration:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
