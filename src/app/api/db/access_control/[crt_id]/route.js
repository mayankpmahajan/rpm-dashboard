// src/app/apis/db/access_control/[access_id].js
import  pool  from '../../combined/route';


// Named export for PUT method
export async function PUT(req, {params}) {
  const { crt_id } = params;
  const { user_name } = await req.json();

  try {
    const result = await pool.query(
      'UPDATE users_crt_access SET user_name=$1 WHERE crt_id=$2 RETURNING *',
      [user_name, crt_id]
    );
    return Response.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Failed to update', error: error.message }, { status: 500 });
  }
}

// Named export for DELETE method
export async function DELETE(req, {params}) {
  const { crt_id } = params;

  try {
    const result = await pool.query('DELETE FROM users_crt_access WHERE crt_id=$1 RETURNING *', [crt_id]);
    return Response.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Failed to delete ', error: error.message }, { status: 500 });

  }
}

// Handling unsupported methods
export async function handler(req, res) {
  res.status(405).json({ message: 'Method Not Allowed' });
}
