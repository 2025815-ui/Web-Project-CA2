const express = require('express');
const router = express.Router();

// getting item from basket
router.get('/:sessionId', (req, res) => {
    const db = req.app.get('db'); // get db from server
    const sessionId = req.params.sessionId;

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
        (err, results) => {
            if (err) {
                console.error("Database Error (GET):", err);
                return res.status(500).json({ error: err.message });
            }
            res.json(results);
        }
    );
});

// add items into basket
router.post('/add', (req, res) => {
    const db = req.app.get('db'); // get db from server
    const { session_id, product_id, quantity } = req.body;

    // check data in console
    console.log("Incoming Request Body:", req.body);

    db.query(
        'SELECT * FROM basket WHERE session_id = ? AND product_id = ?',
        [session_id, product_id],
        (err, existing) => {
            if (err) {
                console.error("Database Error (SELECT):", err);
                return res.status(500).json({ error: err.message });
            }

            if (existing && existing.length > 0) {
                // if exist increase qty
                db.query(
                    'UPDATE basket SET quantity = quantity + ? WHERE session_id = ? AND product_id = ?',
                    [quantity, session_id, product_id],
                    (err) => {
                        if (err) {
                            console.error("Database Error (UPDATE):", err);
                            return res.status(500).json({ error: err.message });
                        }
                        res.json({ success: true, message: 'Quantity updated' });
                    }
                );
            } else {
                // insert if new
                db.query(
                    'INSERT INTO basket (session_id, product_id, quantity) VALUES (?, ?, ?)',
                    [session_id, product_id, quantity],
                    (err) => {
                        if (err) {
                            console.error("Database Error (INSERT):", err);
                            return res.status(500).json({ error: err.message });
                        }
                        res.json({ success: true, message: 'Item added to basket' });
                    }
                );
            }
        }
    );
});
//remove each item in basket
router.delete('/remove/:id', (req,res) => {
    const db = req.app.get('db');
    const id = req.params.id;

    db.query(
        'DELETE FROM BASKET WHERE id =?', [id],
        (err) => {
            if(err){
                console.error("Database Error (DELETE) : " + err);
                return res.status(500).json({ error: err.message });
            }
            res.json({ success: true, message: 'Item removed' });
        }

    );
    
});

// Clear every basket
router.delete('/clear/:sessionId', (req, res) => {
    const db = req.app.get('db');
    const sessionId = req.params.sessionId;

    db.query(
        'DELETE FROM basket WHERE session_id = ?',
        [sessionId],
        (err) => {
            if (err) {
                console.error("Database Error (CLEAR):", err);
                return res.status(500).json({ error: err.message });
            }
            res.json({ success: true, message: 'Basket cleared' });
        }
    );
});


module.exports = router;