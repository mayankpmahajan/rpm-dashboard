import pool from '../combined/route';

// Handle GET requests (Fetch all CRT devices)
export async function GET() {
  try {
    const devices = await pool.query('SELECT * FROM crt_devices');
    return Response.json(devices.rows, { status: 200 });
  } catch (error) {
    console.error('Error fetching CRT devices:', error);
    return Response.json({ message: 'Failed to fetch CRT devices' }, { status: 500 });
  }
}

// Handle POST requests (Add a new CRT device)
export async function POST(req) {
  try {
    const body = await req.json();
    const { train_number, coach_number, railway, max_temp, min_temp } = body;

    const result = await pool.query(
      'INSERT INTO crt_devices (train_number, coach_number, railway, max_temp, min_temp) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [train_number, coach_number, railway, max_temp, min_temp]
    );

    return Response.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error adding CRT device:', error);
    return Response.json({ message: 'Failed to add CRT device' }, { status: 500 });
  }
}
