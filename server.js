const express = require('express'); //import express
const cors = require('cors'); //import cors
const pool = require('./database'); // import database



const app = express(); //use express as app

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // use the public folder 

app.set('db',pool); //save database to app

const homeRoute = require('./routes/products');
app.use('/api',homeRoute);

app.listen(3000 , () => {
    console.log("We are listening on port number 3000");
    
})