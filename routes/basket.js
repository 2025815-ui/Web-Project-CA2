// Import Express framework
const express = require('express');

// Create Express router
const router = express.Router();

// ══════════════════════════════════════
// GET ITEMS FROM BASKET
// ══════════════════════════════════════
router.get('/:sessionId', (req, res) => {

    // Get database connection from server
    const db = req.app.get('db');

    // Get session ID from URL parameter
    const sessionId = req.params.sessionId;

    // SQL query to fetch basket items with product details
    db.query(
        `SELECT 
          b.id, 
          b.quantity, 
          p.name, 
          p.image, 
          p.category,
          p.isNewRelease,
          ROUND(p.price, 2) AS price
        FROM basket b
        JOIN products p ON b.product_id = p.id
        WHERE b.session_id = ?`,
        [sessionId],

        // Callback function after query runs
        (err, results) => {

            // Handle database errors
            if (err) {

                console.error("Database Error (GET):", err);

                return res.status(500).json({ error: err.message });
            }

            // Send basket items back to frontend
            res.json(results);
        }
    );
});

// ══════════════════════════════════════
// ADD ITEMS INTO BASKET
// ══════════════════════════════════════
router.post('/add', (req, res) => {

    // Get database connection
    const db = req.app.get('db');

    // Extract data from request body
    const { session_id, product_id, quantity } = req.body;

    // Display incoming request data in terminal
    console.log("Incoming Request Body:", req.body);

    // Check if product already exists in basket
    db.query(
        'SELECT * FROM basket WHERE session_id = ? AND product_id = ?',
        [session_id, product_id],

        // Callback after SELECT query
        (err, existing) => {

            // Handle database errors
            if (err) {

                console.error("Database Error (SELECT):", err);

                return res.status(500).json({ error: err.message });
            }

            // If product already exists in basket
            if (existing && existing.length > 0) {

                // Increase product quantity
                db.query(
                    'UPDATE basket SET quantity = quantity + ? WHERE session_id = ? AND product_id = ?',
                    [quantity, session_id, product_id],

                    // Callback after UPDATE query
                    (err) => {

                        // Handle database errors
                        if (err) {

                            console.error("Database Error (UPDATE):", err);

                            return res.status(500).json({ error: err.message });
                        }

                        // Send success response
                        res.json({
                            success: true,
                            message: 'Quantity updated'
                        });
                    }
                );

            } else {

                // Insert new product into basket
                db.query(
                    'INSERT INTO basket (session_id, product_id, quantity) VALUES (?, ?, ?)',
                    [session_id, product_id, quantity],

                    // Callback after INSERT query
                    (err) => {

                        // Handle database errors
                        if (err) {

                            console.error("Database Error (INSERT):", err);

                            return res.status(500).json({ error: err.message });
                        }

                        // Send success response
                        res.json({
                            success: true,
                            message: 'Item added to basket'
                        });
                    }
                );
            }
        }
    );
});

// ══════════════════════════════════════
// REMOVE SINGLE ITEM FROM BASKET
// ══════════════════════════════════════
router.delete('/remove/:id', (req, res) => {

    // Get database connection
    const db = req.app.get('db');

    // Get basket item ID from URL
    const id = req.params.id;

    // Delete item from basket
    db.query(
        'DELETE FROM basket WHERE id = ?',
        [id],

        // Callback after DELETE query
        (err) => {

            // Handle database errors
            if (err) {

                console.error("Database Error (DELETE): " + err);

                return res.status(500).json({ error: err.message });
            }

            // Send success response
            res.json({
                success: true,
                message: 'Item removed'
            });
        }
    );
});

// ══════════════════════════════════════
// CLEAR ENTIRE BASKET
// ══════════════════════════════════════
router.delete('/clear/:sessionId', (req, res) => {

    // Get database connection
    const db = req.app.get('db');

    // Get session ID from URL
    const sessionId = req.params.sessionId;

    // Delete all basket items for current session
    db.query(
        'DELETE FROM basket WHERE session_id = ?',
        [sessionId],

        // Callback after DELETE query
        (err) => {

            // Handle database errors
            if (err) {

                console.error("Database Error (CLEAR):", err);

                return res.status(500).json({ error: err.message });
            }

            // Send success response
            res.json({
                success: true,
                message: 'Basket cleared'
            });
        }
    );
});

// Export router so it can be used in server.js
module.exports = router;