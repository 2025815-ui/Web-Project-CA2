const sql = require('mysql2'); //import mysql
require('dotenv').config(); //use dotenv

const pool = sql.createPool({ //create pool for credentials
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

//check database status using query
pool.query('SELECT * FROM products WHERE id=1;', (err, results) => { 
    if (err) {
        console.error('Database connection failed. ' + err);
        return;
    }else{
        console.log(results);
    }
    
});


module.exports = pool;// send to server