const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv').config();


//routes link
const userRoutes = require('./API/routes/users');
const cardRoutes = require('./API/routes/cards');
const configRoutes = require('./API/routes/config');


mongoose.connect(process.env.MONGO_URI);
mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const corsOptions = {
    origin: '*', // Allow this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

// Use Middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});


// routes
app.use('/users', userRoutes);
app.use('/cards', cardRoutes);
app.use('/config', configRoutes);


app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
})

module.exports = app;