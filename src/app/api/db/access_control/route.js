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
    // Check if the corresponding run_no exists in the `run` table
    const runCheck = await pool.query('SELECT 1 FROM run WHERE run_no = $1', [crt_id]);
    
    if (runCheck.rowCount === 0) {
      // If no matching run_no exists, respond with an error
      return new Response(
        JSON.stringify({ message: `Run_no ${crt_id} does not exist` }),
        { status: 400 }
      );
    }

    // Insert the record into `users_crt_access` if the run_no exists
    const result = await pool.query(
      'INSERT INTO users_crt_access (user_name, crt_id) VALUES ($1, $2) RETURNING *',
      [user_name, crt_id]
    );

    // Return the inserted record
    return new Response(JSON.stringify(result.rows[0]), { status: 201 });
  } catch (error) {
    console.error('Error adding access control record:', error);
    return new Response(
      JSON.stringify({ message: 'Failed to add access control record' }),
      { status: 500 }
    );
  }
}



