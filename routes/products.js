// Import Express framework
const express = require('express');

// Create router object
const router = express.Router();

// ══════════════════════════════════════
// GET PRODUCTS ROUTE
// ══════════════════════════════════════

// GET request for fetching products
router.get('/products', (req, res) => {

    // Get database connection from server
    const db = req.app.get('db');

    // Get category from query string
    // Example: /products?category=Action
    const { category } = req.query;

    // Base SQL query
    let sql = 'SELECT * FROM products';

    // Array for query parameters
    let param = [];

    // If category exists, filter products
    if (category) {

        // Add WHERE condition to SQL query
        sql += ' WHERE category = ?';

        // Add category value into parameter array
        param.push(category);
    }

    // Execute database query
    db.query(sql, param, (err, results) => {

        // Handle database errors
        if (err) {

            // Print error in terminal
            console.log(err);

            // Send error response
            res.status(500).send('Internal Server Error.');

        } else {

            // Send products as JSON response
            res.json(results);
        }
    });
});

// Export router so it can be used in server.js
module.exports = router;