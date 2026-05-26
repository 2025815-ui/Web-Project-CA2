const express = require('express');
const router = express.Router();

router.get('/products', (req, res) => {

    const db = req.app.get('db');          //getting db from server
    const sql = 'SELECT * FROM products';

    db.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error.')             // send JSON
        }else{
            res.json(results);
        }
    });
});

module.exports = router;
