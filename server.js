const express = require('express'); //import express
const cors = require('cors'); //import cors
const pool = require('./database'); // import database
require('dotenv').config(); //use dotenv


const app = express();  //use express as app

app.use(express.json());
app.use(cors());
app.use(express.static('public')); // use the public folder 

app.set('db',pool); //save database to app

const homeRoute = require('./routes/index');
app.use('/',homeRoute);

app.listen('3000' , (req,res) => {
    console.log("We are listening on port number 3000");
    
})