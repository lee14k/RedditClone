import { NextApiRequest, NextApiResponse } from 'next';
import mysql, { RowDataPacket } from 'mysql2/promise';
import { serialize } from 'cookie';
import { randomBytes } from 'crypto';


async function connectToDatabase() {
    return await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
    });
}

export async function POST(req: NextApiRequest, res: NextApiResponse) {
    try {
        const rawData = await req.body.getReader().read();
        const jsonString = new TextDecoder().decode(rawData.value);
        const body = JSON.parse(jsonString);

        const { username, password } = body;

        const db = await connectToDatabase();

        const [result] = await db.query<RowDataPacket[]>('SELECT * FROM users WHERE username = ?', [username]);
        const users = result as RowDataPacket[];

        if (users.length === 0) {
            return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const user = users[0];

        if (user.password !== password) {
            return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Set the authentication cookie
        const authToken = generateToken(); // Replace with actual token generation logic

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict' as 'strict' | 'lax' | 'none', // Correctly typed
            maxAge: 3600, // Set the expiration time for the cookie in seconds
            path: '/',
        };
        const cookie = serialize('authToken', authToken, cookieOptions);
        res.setHeader('Set-Cookie', cookie);

        res.status(200).json({ message: 'Login successful', username: user.username });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

function generateToken() {
    return randomBytes(48).toString('hex');
  }
}
