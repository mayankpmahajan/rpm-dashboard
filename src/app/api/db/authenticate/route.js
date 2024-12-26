import jwt from 'jsonwebtoken';
import  pool from '../combined/route';

const JWT_SECRET = process.env.JWT_SECRET_KEY; // Replace with an environment variable in production

export async function POST(req) {
  try {
    const body = await req.json();
    const { user_name, password } = body;

    if (!user_name || !password) {
      return Response.json({ error: 'Username and password are required' }, { status: 400 });
    }

    const result = await pool.query(
      'SELECT * FROM users WHERE user_name = $1 AND password = $2',
      [user_name, password]
    );

    if (result.rows.length === 0) {
      return Response.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    const token = jwt.sign({ user_name }, JWT_SECRET, { expiresIn: '1h' });

    return Response.json({ token }, { status: 200 });
  } catch (error) {
    console.error('Error during authentication:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}