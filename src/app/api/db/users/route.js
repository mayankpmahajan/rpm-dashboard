import pool from '../combined/route';

// Handle GET requests
export async function GET() {
  try {
    console.log("GET request received");
    const users = await pool.query('SELECT * FROM users');
    return Response.json(users.rows, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return Response.json({ message: 'Database error' }, { status: 500 });
  }
}

// Handle POST requests
export async function POST(req) {
  try {
    const body = await req.json();
    const { user_name, password, train_number, coach_number, phone_number, email_id, created_by } = body;

    const result = await pool.query(
      'INSERT INTO users (user_name, password, phone_number, email_id, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [user_name, password, phone_number, email_id, created_by]
    );

    return Response.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error inserting user:', error);
    return Response.json({ message: 'Database error' }, { status: 500 });
  }
}
