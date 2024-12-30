import pool from '../combined/route';

// Handle GET requests (Fetch all CRT devices)
export async function GET() {
  try {
    // Query the `run` table for distinct combinations of `run_no` and `railway`, sorted by `run_no`
    const result = await pool.query(
      'SELECT DISTINCT run_no, railway FROM run ORDER BY run_no ASC'
    );

    // Return the sorted distinct combinations
    return Response.json(result.rows, { status: 200 });
  } catch (error) {
    console.error('Error fetching distinct and sorted run_no and railway combinations:', error);
    return Response.json(
      { message: 'Failed to fetch distinct and sorted run_no and railway combinations' },
      { status: 500 }
    );
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
