const sql = require('mysql2'); // Import mysql2 library for database connection
require('dotenv').config(); // Load environment variables from .env file

// Create a connection pool for MySQL
const pool = sql.createPool({
    host: process.env.DB_HOST,         // Database host
    user: process.env.DB_USER,         // Database username
    password: process.env.DB_PASSWORD, // Database password
    database: process.env.DB_NAME,     // Name of the database to connect to
});

// Test the database connection by running a simple query
pool.query('SELECT * FROM products WHERE id=1;', (err, results) => {
    if (err) {
        // Log error if query fails 
        console.error('Database connection failed. ' + err);
        return;
    } else {
        // If successful, print query results to console
        console.log(results);
    }
});

// Export the pool so it can be reused in other parts of the application
module.exports = pool;