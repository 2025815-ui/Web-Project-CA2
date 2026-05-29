// ══════════════════════════════════════
// IMPORT REQUIRED PACKAGES
// ══════════════════════════════════════

// Import Express framework
const express = require('express');

// Import CORS middleware
const cors = require('cors');

// Import database connection pool
const pool = require('./database');

// Create Express app instance
const app = express();

// Enable Cross-Origin Resource Sharing
app.use(cors());

// Allow server to read JSON data from requests
app.use(express.json());

// Serve static files from "public" folder
// Example: HTML, CSS, JavaScript, images
app.use(express.static('public'));

// Save database pool inside app
// Makes database accessible in routes using req.app.get('db')
app.set('db', pool);

// Import products routes
const homeRoute = require('./routes/products');

// Import basket routes
const cartRoute = require('./routes/basket');

// Product routes
// Example: /api/products
app.use('/api', homeRoute);

// Basket routes
// Example: /api/basket/add
app.use('/api/basket', cartRoute);

// Start server on port 3000
app.listen(3000, () => {

    // Message displayed in terminal when server starts
    console.log("We are listening on port number 3000");
});