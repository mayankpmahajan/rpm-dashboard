import { Pool } from 'pg';
import jwt from 'jsonwebtoken';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: "mypassword",
  port: process.env.DB_PORT,
});

export async function GET(req) {
  try {
    // Extract the token from headers
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ message: 'Missing Authorization header' }), { status: 401 });
    }

    const token = authHeader.split(' ')[1]; // Assuming the format is "Bearer <token>"
    if (!token) {
      return new Response(JSON.stringify({ message: 'Invalid Authorization header' }), { status: 401 });
    }

    // Decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userName = decoded.user_name;
    if (!userName) {
      return new Response(JSON.stringify({ message: 'Invalid token' }), { status: 401 });
    }

    // Query users_crt_access for crt_id (as integers)
    const userAccessResult = await pool.query(
      'SELECT crt_id FROM users_crt_access WHERE user_name = $1',
      [userName]
    );
    const crtIds = userAccessResult.rows.map(row => row.crt_id);

    if (crtIds.length === 0) {
      return new Response(JSON.stringify({ message: 'No access for this user' }), { status: 403 });
    }

    // Query crt_devices for train_number and railway (using crt_id as integers)
    const crtDevicesResult = await pool.query(
      'SELECT train_number, railway FROM crt_devices WHERE crt_id = ANY($1::int[])',
      [crtIds]
    );
    const crtDevices = crtDevicesResult.rows;

    if (crtDevices.length === 0) {
      return new Response(JSON.stringify({ message: 'No devices found for this user' }), { status: 404 });
    }

    // Build conditions for the main query
    const conditions = crtDevices.map(
      device => `(train_number = $${crtDevices.indexOf(device) * 2 + 1} AND railway = $${crtDevices.indexOf(device) * 2 + 2})`
    ).join(' OR ');

    // Flatten train_number and railway parameters for query placeholders
    const queryParams = crtDevices.flatMap(device => [device.train_number, device.railway]);

    // Query runs for matching train_number and railway
    const runsQuery = `SELECT * FROM run WHERE ${conditions}`;
    const runsResult = await pool.query(runsQuery, queryParams);
    const runIds = runsResult.rows.map(row => row._id);

    if (runIds.length === 0) {
      return new Response(JSON.stringify({ message: 'No runs found' }), { status: 404 });
    }

    // Convert runIds (numbers) to strings for comparison with "section" (text)
    const runIdsAsStrings = runIds.map(String);

    // Query peaks for matching section (run IDs as text)
    const peaksResult = await pool.query(
      'SELECT * FROM peaks WHERE section = ANY($1::text[])',
      [runIdsAsStrings]
    );

    // Combine the results
    const responseData = {
      runs: runsResult.rows,
      peaks: peaksResult.rows,
    };

    return new Response(JSON.stringify(responseData), { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ message: 'Internal server error', error: error.message }), { status: 500 });
  }
}

export default pool;
