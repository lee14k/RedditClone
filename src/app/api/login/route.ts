import { NextApiRequest } from 'next';
import mysql, { RowDataPacket } from 'mysql2/promise';

async function connectToDatabase() {
    return await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
    });
}

export async function POST(req: NextApiRequest) {
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

        return new Response(JSON.stringify({ message: 'Login successful', username: user.username }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Error during login:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
