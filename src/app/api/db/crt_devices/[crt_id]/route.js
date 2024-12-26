import pool from '../../combined/route';

// Handle PUT requests (Update CRT device)
export async function PUT(req, { params }) {
  try {
    const { crt_id } = params;
    const body = await req.json();
    const { train_number, coach_number, station, max_temp, min_temp } = body;

    const result = await pool.query(
      'UPDATE crt_devices SET train_number=$1, coach_number=$2, railway=$3, max_temp=$4, min_temp=$5 WHERE crt_id=$6 RETURNING *',
      [train_number, coach_number, station, max_temp, min_temp, crt_id]
    );

    return Response.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error('Error updating CRT device:', error);
    return Response.json({ message: 'Failed to update CRT device' }, { status: 500 });
  }
}

// Handle DELETE requests (Delete CRT device)
export async function DELETE(req, { params }) {
  try {
    const { crt_id } = params;

    const result = await pool.query('DELETE FROM crt_devices WHERE crt_id=$1 RETURNING *', [crt_id]);

    return Response.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error('Error deleting CRT device:', error);
    return Response.json({ message: 'Failed to delete CRT device' }, { status: 500 });
  }
}
