// src/app/apis/db/access_control/index.js
import pool from '../combined/route';


// Named export for GET method
export async function GET(req) {
  try {
    const access = await pool.query('SELECT * FROM users_crt_access');
    return new Response(JSON.stringify(access.rows), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Failed to fetch access control records' }), { status: 500 });
  }
}

// Named export for POST method
export async function POST(req) {
  const { user_name, crt_id } = await req.json();
  try {
    const result = await pool.query(
      'INSERT INTO users_crt_access (user_name, crt_id) VALUES ($1, $2) RETURNING *',
      [user_name, crt_id]
    );
    return new Response(JSON.stringify(result.rows[0]), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Failed to add access control record' }), { status: 500 });
  }
}

// Handling unsupported methods
export async function handler(req) {
  return new Response(JSON.stringify({ message: 'Method Not Allowed' }), { status: 405 });
}
