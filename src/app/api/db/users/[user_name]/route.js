import pool from '../../combined/route';

// Handle PUT requests (Update user)
export async function PUT(req, { params }) {
  try {
    const { user_name } = params;
    const body = await req.json();
    const { password, phone_number, email_id, created_by } = body;

    const result = await pool.query(
      'UPDATE users SET password=$1, phone_number=$2, email_id=$3, created_by=$4 WHERE user_name=$5 RETURNING *',
      [password, phone_number, email_id, created_by, user_name]
    );

    return Response.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error('Error updating user:', error);
    return Response.json({ message: 'Database error' }, { status: 500 });
  }
}

// Handle DELETE requests (Delete user)
export async function DELETE(req, { params }) {
  try {
    const { user_name } = params;

    const result = await pool.query('DELETE FROM users WHERE user_name=$1 RETURNING *', [user_name]);

    return Response.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error('Error deleting user:', error);
    return Response.json({ message: 'Database error' }, { status: 500 });
  }
}
