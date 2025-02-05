const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const colors = require('colors');
const connectDb = require("./config/connectDb");
const path = require('path');

//config dotenc file
dotenv.config();

// connecting database connection
connectDb();

//rest object
const app = express();

// middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

// routes

// transactions routes - should be defined before user routes
app.use('/api/v1/transactions', require('./routes/transactionRoute'));

//user routes
app.use('/api/v1/users', require('./routes/userRoute'));

//static files
app.use(express.static(path.join(__dirname,'./client/build')));

app.get('*', function(req, res){
    res.sendFile(path.join(__dirname,'./client/build/index.html'));
});

//port
const PORT = 8080 || process.env.PORT;

// listen 
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
})

