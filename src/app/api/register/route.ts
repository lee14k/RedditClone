import { NextApiRequest } from 'next';
import mysql from 'mysql2/promise';

async function connectToDatabase() {
  return await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });
}

export async function POST(req: NextApiRequest) {
    console.log('Received request body:', req.body);

  try {
    const rawData = await req.body.getReader().read();
    const jsonString = new TextDecoder().decode(rawData.value);
    const body = JSON.parse(jsonString);

    const { username, password } = body;
    if (!username || !password) {
      return new Response(JSON.stringify({ error: 'Username and password are required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const db = await connectToDatabase();

    // Using a different variable name to avoid redeclaration
    const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]) as any;

    if (users.length > 0) {
      return new Response(JSON.stringify({ error: 'Username already exists' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password /* Replace with hashedPassword */]);

    return new Response(JSON.stringify({ message: 'Registration successful' }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('Error during registration:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
