const express = require('express');
const router = express.Router();

router.get('/products', (req, res) => {

    const db = req.app.get('db'); //getting db from server
    const {category} = req.query;
    let sql = 'SELECT * FROM products';
    let param = [];

    if(category) {
        sql += ' WHERE category = ?';
        param.push(category);
    }

    db.query(sql, param, (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error.')             // send JSON
        }else{
            res.json(results);
        }
    });
});

module.exports = router;
