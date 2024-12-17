import { Pool } from 'pg';

// Configure the PostgreSQL pool
const pool = new Pool({
    user: "myuser",
    host: "45.118.162.91",
    database: "myoms",
    password: "mypassword",
    port: "5432",
});

// Named export for the GET method
export async function GET() {
    try {
        // Query the PostgreSQL database for multiple tables
        const [runResult, peakResult] = await Promise.all([
            pool.query('SELECT * FROM run'),
            pool.query('SELECT * FROM peaks'),
            // pool.query('SELECT * FROM block'),
        ]);

        // Combine the results
        const responseData = {
            run: runResult.rows,
            peak: peakResult.rows
        };

        // Return the combined data as JSON
        return Response.json(responseData, { status: 200 });
    } catch (error) {
        console.error('Database error:', error);
        return Response.json({ message: 'Database error' }, { status: 500 });
    }
}
